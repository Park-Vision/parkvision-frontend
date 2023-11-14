import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getParking } from "../../actions/parkingActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";
import "./Editor.css"; // Create a CSS file for styling
import { useNavigate } from "react-router-dom";

import { MapContainer, Polygon, Popup, TileLayer, FeatureGroup } from "react-leaflet";
import { getParkingSpotsByParkingId, addStagedParkingSpot, addParkingSpot } from "../../actions/parkingSpotActions";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import {
    GET_PARKING_SPOT, UPDATE_PARKING_SPOT,
} from "../../actions/types";
import convertTime from "../../utils/convertTime";
import decodeToken from "../../utils/decodeToken";
import { getUser } from "../../actions/userActions";
import { toast } from "react-toastify";
import 'leaflet-path-drag'
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

function ParkingEditor(props) {
    const { parkingId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const parking = useSelector((state) => state.parkingReducer.parking);
    const parkingSpots = useSelector((state) => state.parkingSpotReducer);
    const stagedParkingSpots = useSelector((state) => state.parkingSpotReducer.stagedParkingSpots);
    const parkingSpot = useSelector((state) => state.parkingSpotReducer.parkingSpot);
    const [drag, setDrag] = React.useState(true);

    const userjson = JSON.parse(localStorage.getItem("user"));
    const user = decodeToken(userjson?.token);

    const mapRef = useRef();
    const polygonRef = useRef();

    useEffect(() => {
        const checkAuthorization = async () => {
            if (user && user.role === "PARKING_MANAGER") {
                const userResponse = await dispatch(getUser(user.userId));
                let parkingResponse;
                try {
                    parkingResponse = await dispatch(getParking(parkingId));
                }
                catch (error) {
                    toast.error("You are not authorized to view this page!");
                    navigate('/');
                    return;
                }
                if (userResponse.parkingDTO.id !== parkingResponse.id) {
                    toast.error("You are not authorized to view this page!");
                    navigate('/');
                }
                dispatch(getParkingSpotsByParkingId(parkingId));
                unsetParkingSpot();
            } else {
                toast.error("You are not authorized to view this page!");
                navigate('/');
            }
        }

        checkAuthorization();
    }, []);


    const toggleDrag = () => {
        debugger
        const newDrag = !drag;
        setDrag(newDrag); // Toggle the drag state
        console.log(drag);
        debugger;
        const polygon = polygonRef.current;
        if (polygon) {
            if (newDrag) {
                polygon.dragging.enable();
                console.log('enable drag')
            }
            else {
                polygon.dragging.disable();
                console.log('disable drag')
            }
        }
    };

    const clearLayerWithNoIds = () => {
        const map = mapRef.current;
        map.eachLayer((layer) => {
            if (layer instanceof L.FeatureGroup) {
                layer.eachLayer((polyObject) => {
                    if (polyObject.options.id === undefined) {
                        polyObject.remove();
                    }
                });
            }
        });
    };

    const unsetParkingSpot = () => {
        dispatch({
            type: GET_PARKING_SPOT,
            value: {},
        });
    };

    const handleEditStart = () => {
        const polygon = polygonRef.current;
        polygon.dragging.enable();
        console.log('stop')

    };

    const handleEditStop = () => {
        const polygon = polygonRef.current;
        polygon.dragging.disable();
        console.log('stop')

    };


    const handleSaveToDB = (event) => {
        dispatch(addParkingSpot(parking.id, stagedParkingSpots))
    };

    const handleExitClick = () => {
        navigate(`/parking/${parking.id}`);
    };

    const mapPonitsToParkingSpot = (points,editedSpot=null) => {
        if (points[0].length !== 5) {
            toast.error("You must draw a 4 points!");
            clearLayerWithNoIds();
            return;
        }
        const mappedPoints = points[0].map((coord) => {
            console.log(coord);
            return { latitude: coord[1], longitude: coord[0], id: coord[2]  };
        });

        mappedPoints.pop();
        console.log(mappedPoints);

        const pointsDTO = mappedPoints.map((point) => {
            return {
                latitude: point.latitude,
                longitude: point.longitude,
                parkingSpotDTO: {
                    id: parking.id
                }
            }
        });
         
        if (editedSpot !== null) {
            const editedParkingSpot = parkingSpots.parkingSpots.find((spot) => spot.id === editedSpot.id);
            editedParkingSpot.pointsDTO = mappedPoints;
            dispatch({
                type: UPDATE_PARKING_SPOT,
                value: editedParkingSpot,
            })
            clearLayerWithNoIds();
            return;
        }


        const newParkingSpot = {
            spotNumber: "newly created spot",
            active: false,
            parkingDTO: {
                id: parking.id
            },
            pointsDTO: pointsDTO
        }

        dispatch(addStagedParkingSpot(newParkingSpot));
        clearLayerWithNoIds();
    };

    const handleEditClick = (event) => {
        console.log(event)
        if (parkingSpot.id === undefined) {
            dispatch({
                type: GET_PARKING_SPOT,
                value: event,
            });
            navigate(`/parkingspot/${event.id}`);
        }

    };


    return (
        <Container
            maxWidth='xl'
            style={{ height: "97%" }}
        >
            <Box sx={{ my: 4, height: "100%" }}>
                <Grid
                    container
                    spacing={2}
                    style={{ height: "100%" }}
                >
                    <Grid
                        item
                        xs={12}
                        lg={8}
                    >
                        <div className='map-container'>
                            {parking.latitude && parking.longitude ? (
                                <MapContainer
                                    style={{ width: "100%", height: "100%" }}
                                    center={[parking.latitude, parking.longitude]}
                                    zoom={20}
                                    scrollWheelZoom={true}
                                    ref={mapRef}
                                >
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={toggleDrag}
                                        style={{
                                            position: "absolute",
                                            top: "10px",
                                            right: "50px",
                                            zIndex: "9999"
                                        }}>{drag ? "Disable Drag" : "Enable Drag"}</Button>

                                    <FeatureGroup>
                                        <EditControl
                                            position='topright'
                                            draw={{
                                                rectangle: false,
                                                circle: false,
                                                circlemarker: false,
                                                marker: false,
                                                polyline: false,
                                                polygon: {
                                                    allowIntersection: false,
                                                    drawError: {
                                                        color: "#e1e100",
                                                        message: "<strong>Oh snap!<strong> you can't draw that!",
                                                    },
                                                    shapeOptions: {
                                                        color: "#97009c",
                                                        borderColor: "#97009c",
                                                    },
                                                    
                                                },
                                            }}
                                            edit={{
                                                edit: true,
                                                remove: false,
                                                featureGroup: mapRef.current?.leafletElement,
                                            }}
                                            onCreated={e => {
                                                const eventJson = (e.layer.toGeoJSON())
                                                console.log(eventJson.geometry.coordinates)
                                                mapPonitsToParkingSpot(eventJson.geometry.coordinates);
                                            }}
                                        />
                                        {parkingSpots.parkingSpots
                                            .map((spot) => (
                                                <Polygon
                                                    id={spot.id}
                                                    key={spot.id}
                                                    positions={spot.pointsDTO.map((point) => [
                                                        point.latitude,
                                                        point.longitude,
                                                        point.id
                                                    ])}
                                                    color={spot.active ? "blue" : "#474747"}
                                                    ref={polygonRef}
                                                    draggable={true}
                                                    eventHandlers={{
                                                        dragend: (e) => {
                                                            const eventJson = (e.target.toGeoJSON())
                                                            let list = eventJson.geometry.coordinates[0]
                                                            let index = 0;
                                                            for (let i = 0; index < eventJson.geometry.coordinates[0].length - 1 ; i = (i + 1)% 4) {
                                                                list[index].push(spot.pointsDTO[i].id);
                                                                index = index + 1;
                                                            }
                                                            mapPonitsToParkingSpot(eventJson.geometry.coordinates, spot);
                                                        },
                                                    }}
                                                >
                                                    <Popup>
                                                        <div style={{ minWidth: '200px', maxWidth: '250px', padding: '10px', textAlign: 'left' }}>
                                                            <div style={{ marginBottom: '5px', textAlign: 'center',
                                                                fontSize: `${Math.min(20, 450 / parking.name.length)}px`, fontWeight: 'bold',
                                                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                Spot: {spot.id}
                                                            </div>
                                                            <div style={{ marginBottom: '5px' }}>
                                                                <span style={{ fontWeight: 'bold' }}>Spot number:</span> {spot.spotNumber}
                                                            </div>
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                onClick={() => handleEditClick(spot)}
                                                                style={{ width: '100%' }}
                                                            >
                                                                EDIT
                                                            </Button>
                                                        </div>
                                                    </Popup>
                                                </Polygon>
                                            ))}
                                    </FeatureGroup>

                                    <TileLayer
                                        maxNativeZoom={22}
                                        maxZoom={22}
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url='http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                                    />
                                    {stagedParkingSpots
                                            .map((spot) => (
                                                <Polygon
                                                    id={spot.id}
                                                    key={spot.id}
                                                    positions={spot.pointsDTO.map((point) => [
                                                        point.latitude,
                                                        point.longitude,
                                                        point.id
                                                    ])}
                                                    color={"#474747"}
                                                    ref={polygonRef}
                                                    draggable={true}
                                                    eventHandlers={{
                                                        dragend: (e) => {
                                                            const polygonKey = e.target.options.id;
                                                            console.log(polygonKey) 
                                                            const eventJson = (e.target.toGeoJSON())
                                                            console.log(eventJson.geometry.coordinates)
                                                            mapPonitsToParkingSpot(eventJson.geometry.coordinates, polygonKey);
                                                        },
                                                    }}
                                                >
                                                    <Popup>
                                                        <div style={{ minWidth: '200px', maxWidth: '250px', padding: '10px', textAlign: 'left' }}>
                                                            <div style={{ marginBottom: '5px', textAlign: 'center',
                                                                fontSize: `${Math.min(20, 450 / parking.name.length)}px`, fontWeight: 'bold',
                                                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                Spot: {spot.id}
                                                            </div>
                                                            <div style={{ marginBottom: '5px' }}>
                                                                Save parking staged spots to edit them.
                                                            </div>
                                                        </div>
                                                    </Popup>
                                                </Polygon>
                                            ))}

                                </MapContainer>
                            ) : (
                                <Box
                                    sx={{
                                        display: "flex",
                                        "align-content": "center",
                                        "justify-content": "center",
                                        "flex-direction": "row",
                                        "flex-wrap": "wrap",
                                    }}
                                    style={{ width: "100%", height: "100%" }}
                                >
                                    <CircularProgress />
                                </Box>
                            )}
                        </div>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        lg={4}
                    >
                        <Paper className='reserve'>
                            <CardContent>
                                <Typography variant='h4'>{parking.name}</Typography>
                                <Typography variant='p'>{parking.description}</Typography>
                                <Typography variant="h6">
                                    Address: {parking.street},{parking.zipCode} {parking.city}
                                </Typography>
                                <Typography variant="h6">Open hours: {convertTime(parking.startTime, parking.timeZone)} -  {convertTime(parking.endTime, parking.timeZone)} </Typography>
                                <Typography>
                                     Dates and times are based on parking time zone ({parking.timeZone}) compared to UTC.
                                </Typography>
                                <Typography>$/h: {parking.costRate}</Typography>
                            </CardContent>
                            <Grid container>
                            <Button
                                sx={{ m: 1 }}
                                variant='contained'
                                onClick={handleSaveToDB}
                                fullWidth
                                disabled={stagedParkingSpots.length === 0}
                            >
                                Save parking
                            </Button>
                            <Button
                                sx={{ m: 1 }}
                                variant='contained'
                                onClick={handleExitClick}
                                fullWidth
                            >
                                Exit editor
                                </Button>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default ParkingEditor;