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
import L, { point } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";
import "../Editor.css"; // Create a CSS file for styling
import { useNavigate } from "react-router-dom";

import { MapContainer, Polygon, Popup, TileLayer, FeatureGroup } from "react-leaflet";
import { getParkingSpotsByParkingId, addParkingSpot, addParkingSpots, updateParkingSpot, getParkingSpot, getParkingSpots } from "../../actions/parkingSpotActions";
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
import { areParkingSpotsColliding, getArea, isSpotAreaTooBig, isSpotAreaTooSmall } from "../../utils/parkingUtils";
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
    const parkingSpots = useSelector((state) => state.parkingSpotReducer.parkingSpots);
    const stagedParkingSpots = useSelector((state) => state.parkingSpotReducer.stagedParkingSpots);
    const parkingSpot = useSelector((state) => state.parkingSpotReducer.parkingSpot);
    const [drag, setDrag] = React.useState(false);
    const [spotsCopy, setSpotsCopy] = React.useState([]);

    const userjson = JSON.parse(localStorage.getItem("user"));
    const user = decodeToken(userjson?.token);

    const mapRef = useRef();
    const polygonRef = useRef();

    var editableLayers = new L.FeatureGroup();

    useEffect(() => {
        const fetchData = async () => {
            if (user && user.role === "PARKING_MANAGER") {
                await dispatch(getParkingSpotsByParkingId(parseInt(parkingId)));
                let parking = await dispatch(getParking(parseInt(parkingId)));
                let manager = await dispatch(getUser(user.userId));
                if (parking.id !== manager.parkingDTO.id) {
                    toast.error('You are not authorized to edit this parking!');
                    navigate('/');
                }
            } else {
                toast.error('You are not authorized to edit this parking!');
                navigate('/');
            }
        }
        fetchData();
    }, []);


    const toggleDrag = (value) => {
        setDrag(value);
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


    const clearLayerWithId = (id) => {
        const map = mapRef.current;
        map.eachLayer((layer) => {
            if (layer instanceof L.FeatureGroup) {
                layer.eachLayer((polyObject) => {
                    if (polyObject.options.id === id) {
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

    const handleExitClick = () => {
        navigate(`/parking/${parking.id}`);
    };

    const _onEdited = (e) => {
        const layers = e.layers;
        const editedLayers = layers.getLayers();
        const allSpots = [...parkingSpots, ...stagedParkingSpots];
        const map = mapRef.current;
        const list = [];
        map.eachLayer((layer) => {
            if (layer instanceof L.FeatureGroup) {
                layer.eachLayer((polyObject) => {
                    if (polyObject.options.id !== undefined) {
                        list.push(polyObject);
                    }
                });
            }
        });

        const transformedSpotsLayer = [];
        list.forEach((layer) => {
            const spotId = layer.options.id;
            const spot = allSpots.find((spot) => spot.id === spotId);
            if (spot === undefined) {
                const layerPoints = layer.toGeoJSON().geometry.coordinates[0];
                const layerPointsMapped = layerPoints.map((point) => {
                    return { latitude: point[1], longitude: point[0], id: point[2] };
                });
                layerPointsMapped.pop();
                const pointsDTO = layerPointsMapped.map((point) => {
                    return {
                        id: point.id,
                        latitude: point.latitude,
                        longitude: point.longitude,
                        parkingSpotDTO: {
                            id: parkingId
                        }
                    }
                });
                const allIdsDefined = pointsDTO.every(point => point.id !== undefined);

                if (pointsDTO.length !== 4 || !allIdsDefined) {
                    toast.error("You must draw a 4 points with ids!");
                } else {
                    const newParkingSpot = {
                        id: spotId,
                        spotNumber: "newly created spot",
                        active: false,
                        parkingDTO: {
                            id: parking.id
                        },
                        pointsDTO: pointsDTO
                    }
                    transformedSpotsLayer.push(newParkingSpot);
                }

            }
        });
        allSpots.push(...transformedSpotsLayer);

        const transformedSpots = [];
        editedLayers.forEach((layer) => {
            const spotId = layer.options.id;
            let spot = allSpots.find((spot) => spot.id === spotId);

            const layerPoints = layer.toGeoJSON().geometry.coordinates[0];


            const layerPointsMapped = layerPoints.map((point) => {
                return { latitude: point[1], longitude: point[0], id: point[2] };
            });
            layerPointsMapped.pop();
            const pointsDTO = layerPointsMapped.map((point) => {
                return {
                    id: point.id,
                    latitude: point.latitude,
                    longitude: point.longitude,
                    parkingSpotDTO: {
                        id: parkingId
                    }
                }
            });

            const allIdsDefined = pointsDTO.every(point => point.id !== undefined);

            if (pointsDTO.length !== 4 || !allIdsDefined) {
                toast.error("You must draw a 4 points with ids!");
            } else {
                if (spot !== undefined) {
                    spot.pointsDTO = pointsDTO;
                } else {
                    spot = {
                        id: spotId,
                        spotNumber: "newly created spot",
                        active: false,
                        parkingDTO: {
                            id: parkingId
                        },
                        pointsDTO: pointsDTO
                    }
                }
            }

            transformedSpots.push(spot);
        });

        const allUpdatedSpots = [...transformedSpots, ...allSpots];
        const uniqueSpots = allUpdatedSpots.filter((spot, index, self) =>
            index === self.findIndex((s) => (
                s.id === spot.id
            ))
        );

        let isColliding = false;
        let inValidArea = false;
        transformedSpots.forEach((editedSpot) => {
            if (isSpotAreaTooBig(editedSpot)) {
                inValidArea = true;
                let area = getArea(editedSpot);
                toast.error("Parking spot area is too big!"
                    + " Area: " + area.toFixed(2) + " m2. "
                    + "Maximal area: 12.5 m2"
                );
            }
            if (isSpotAreaTooSmall(editedSpot)) {
                inValidArea = true;
                let area = getArea(editedSpot);
                toast.error("Parking spot area is too small!"
                    + " Area: " + area.toFixed(2) + " m2. "
                    + "Minimal area: 8 m2 "
                );
            }
            uniqueSpots.forEach((otherspot) => {
                if (editedSpot.id !== otherspot.id) {
                    const coliding = areParkingSpotsColliding(otherspot, editedSpot);
                    if (coliding) {
                        isColliding = true;
                        toast.error("Parking spots are colliding!");
                    }
                }
            });

            if (!isColliding && !inValidArea) {
                dispatch(updateParkingSpot(editedSpot)).then(() => {
                    dispatch(getParkingSpotsByParkingId(parkingId));
                });
            } else {
                dispatch(getParkingSpotsByParkingId(parkingId));
            }
        });
    };




    const _onCreated = (e) => {

        //get map and its layers that are polygons
        const map = mapRef.current;
        const list = [];
        const editedLayer = e.layer;
        const allSpots = [...parkingSpots, ...stagedParkingSpots];

        map.eachLayer((layer) => {
            if (layer instanceof L.FeatureGroup) {
                layer.eachLayer((polyObject) => {
                    if (polyObject.options.id !== undefined) {
                        list.push(polyObject);
                    }
                });
            }
        });

        const transformedSpots = [];
        list.forEach((layer) => {
            const spotId = layer.options.id;
            const spot = allSpots.find((spot) => spot.id === spotId);
            if (spot === undefined) {
                const layerPoints = layer.toGeoJSON().geometry.coordinates[0];
                const layerPointsMapped = layerPoints.map((point) => {
                    return { latitude: point[1], longitude: point[0], id: point[2] };
                });
                layerPointsMapped.pop();
                const pointsDTO = layerPointsMapped.map((point) => {
                    return {
                        id: point.id,
                        latitude: point.latitude,
                        longitude: point.longitude,
                        parkingSpotDTO: {
                            id: parkingId
                        }
                    }
                });
                const allIdsDefined = pointsDTO.every(point => point.id !== undefined);

                if (pointsDTO.length !== 4 || !allIdsDefined) {
                    toast.error("You must draw a 4 points with ids!");
                } else {
                    const newParkingSpot = {
                        id: spotId,
                        spotNumber: "newly created spot",
                        active: false,
                        parkingDTO: {
                            id: parking.id
                        },
                        pointsDTO: pointsDTO
                    }
                    transformedSpots.push(newParkingSpot);
                }

            }
        });
        allSpots.push(...transformedSpots);
        // get parking spot by id
        // make a value copy of the spot

        const layerPoints = editedLayer.toGeoJSON().geometry.coordinates[0];

        // check if there are 4 points
        if (layerPoints.length !== 5) {
            toast.error("You must draw a 4 points!");
            clearLayerWithNoIds();
            return;
        }

        const layerPointsMapped = layerPoints.map((point) => {
            return { latitude: point[1], longitude: point[0], id: point[2] };
        });
        layerPointsMapped.pop();
        const pointsDTO = layerPointsMapped.map((point) => {
            return {
                id: point.id,
                latitude: point.latitude,
                longitude: point.longitude
            }
        });


        const newParkingSpot = {
            spotNumber: "newly created spot",
            active: false,
            parkingDTO: {
                id: parking.id
            },
            pointsDTO: pointsDTO
        }

        if (isSpotAreaTooBig(newParkingSpot)) {
            let area = getArea(newParkingSpot);
            toast.error("Parking spot area is too big!"
                + " Area: " + area.toFixed(2) + " m2. "
                + "Maximal area: 12.5 m2"
            );
            clearLayerWithNoIds();
            return;
        }

        if (isSpotAreaTooSmall(newParkingSpot)) {
            let area = getArea(newParkingSpot);
            toast.error("Parking spot area is too small!"
                + " Area: " + area.toFixed(2) + " m2. "
                + "Minimal area: 8 m2 "
            );
            clearLayerWithNoIds();
            return;
        }

        let isColliding = false;

        allSpots.forEach((otherspot) => {
            if (newParkingSpot.id !== otherspot.id) {
                const coliding = areParkingSpotsColliding(otherspot, newParkingSpot);
                if (coliding) {
                    isColliding = true;
                    // get original spot from parkingSpots
                    toast.error("Parking spots are colliding!");
                    clearLayerWithNoIds();

                }
            }
        });

        if (!isColliding) {
            dispatch(addParkingSpot(newParkingSpot)).then(() => {
                dispatch(getParkingSpotsByParkingId(parseInt(parkingId)));
            });
            clearLayerWithNoIds();
        }
    };

    const mapPonitsToParkingSpot = (e, points, editedSpot) => {
        let toMuchDrag = false;
        if (e.distance > 300.0) {
            toMuchDrag = true;
            toast.error("You can't drag parking spot that much! drag distance: " +
                e.distance.toFixed(2) + " cm. " +
                "Max distance: 300 cm");
        }

        const mappedPoints = points[0].map((coord) => {
            return { latitude: coord[1], longitude: coord[0], id: coord[2] };
        });

        mappedPoints.pop();


        const pointsDTO = mappedPoints.map((point) => {
            return {
                id: point.id,
                latitude: point.latitude,
                longitude: point.longitude,
                parkingSpotDTO: {
                    id: parking.id
                }
            }
        });

        const editedParkingSpot = parkingSpots.find((spot) => spot.id === editedSpot.id);
        editedParkingSpot.pointsDTO = pointsDTO;

        let isColliding = false;

        parkingSpots.forEach((otherspot) => {
            if (editedParkingSpot.id !== otherspot.id) {
                const coliding = areParkingSpotsColliding(otherspot, editedParkingSpot);
                if (coliding) {
                    isColliding = true;
                    toast.error("Parking spots are colliding!");
                }
            }
        });

        if (!isColliding && !toMuchDrag) {
            dispatch(updateParkingSpot(editedParkingSpot)).then(() => {
                dispatch(getParkingSpot(editedParkingSpot.id));
            });
        } else {
            dispatch(getParkingSpotsByParkingId(parseInt(parkingId)));
        }
    };

    const handleEditClick = (event) => {
        if (event.id !== undefined) {
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
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        onClick={toggleDrag.bind(this, !drag)}
                                        style={{
                                            position: "absolute",
                                            top: "10px",
                                            right: "50px",
                                            zIndex: "801"
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
                                                featureGroup: editableLayers
                                            }}
                                            onCreated={_onCreated}
                                            onEdited={_onEdited}

                                        />
                                        {parkingSpots
                                            .map((spot) => (
                                                <Polygon
                                                    id={spot.id}
                                                    key={Math.random()}
                                                    positions={spot.pointsDTO.map((point) => [
                                                        point.latitude,
                                                        point.longitude,
                                                        point.id
                                                    ])}
                                                    color={spot.active ? "blue" : "#474747"}
                                                    ref={polygonRef}
                                                    draggable={drag}
                                                    interactive
                                                    eventHandlers={{
                                                        dragend: (e) => {
                                                            const eventJson = (e.target.toGeoJSON())
                                                            let list = eventJson.geometry.coordinates[0]
                                                            let index = 0;
                                                            for (let i = 0; index < eventJson.geometry.coordinates[0].length - 1; i = (i + 1) % 4) {
                                                                list[index].push(spot.pointsDTO[i].id);
                                                                index = index + 1;
                                                            }
                                                            mapPonitsToParkingSpot(e, eventJson.geometry.coordinates, spot);
                                                        },

                                                    }}
                                                >
                                                    <Popup>
                                                        <div style={{ minWidth: '200px', maxWidth: '250px', padding: '10px', textAlign: 'left' }}>
                                                            <div style={{
                                                                marginBottom: '5px', textAlign: 'center',
                                                                fontSize: `${Math.min(20, 450 / parking.name.length)}px`, fontWeight: 'bold',
                                                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                                            }}>
                                                                Spot: {spot.spotNumber}
                                                            </div>
                                                            <div style={{ marginBottom: '5px' }}>
                                                                <span style={{ fontWeight: 'bold' }}>Spot ID:</span> {spot.id}
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
                                                interactive
                                            >
                                                <Popup>
                                                    <div style={{ minWidth: '200px', maxWidth: '250px', padding: '10px', textAlign: 'left' }}>
                                                        <div style={{
                                                            marginBottom: '5px', textAlign: 'center',
                                                            fontSize: `${Math.min(20, 450 / parking.name.length)}px`, fontWeight: 'bold',
                                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                                        }}>
                                                            Spot: {spot.spotNumber}
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