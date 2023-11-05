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
    GET_PARKING_SPOT,
} from "../../actions/types";

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

    useEffect(() => {
        dispatch(getParking(parkingId));
        dispatch(getParkingSpotsByParkingId(parkingId));
        unsetParkingSpot();
    }, []);


    const unsetParkingSpot = () => {
        dispatch({
            type: GET_PARKING_SPOT,
            value: {},
        });
    };

    const mapRef = useRef(null);


    const handleSaveToDB = (event) => {
        dispatch(addParkingSpot(parking.id, stagedParkingSpots))
    };

    const handleExitClick = () => {
        navigate(`/parking/${parking.id}`);
    };

    const mapPonitsToParkingSpot = (points) => {

        const mappedPoints = points[0].map((coord) => {
            console.log(coord);
            return { latitude: coord[1], longitude: coord[0] };
        });

        mappedPoints.pop();

        const pointsDTO = mappedPoints.map((point) => {
            return {
                latitude: point.latitude,
                longitude: point.longitude,
                parkingSpotDTO: {
                    id: parking.id
                }
            }
        }
        );

        const newParkingSpot = {
            spotNumber: "newly created spot",
            occupied: false,
            active: true,
            parkingDTO: {
                id: parking.id
            },
            pointsDTO: pointsDTO
        }

        console.log(newParkingSpot);

        dispatch(addStagedParkingSpot(newParkingSpot));
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
                                >
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
                                                    },
                                                },
                                            }}
                                            edit={{
                                                edit: false,
                                                remove: false, //TODO zmiana na disabled?
                                                featureGroup: mapRef.current?.leafletElement,
                                            }}
                                            onCreated={e => {
                                                const eventJson = (e.layer.toGeoJSON())
                                                console.log(eventJson.geometry.coordinates)
                                                mapPonitsToParkingSpot(eventJson.geometry.coordinates);

                                            }}
                                        />
                                        {parkingSpots.parkingSpots
                                            .map((spot, index) => (
                                                <Polygon
                                                    positions={spot.pointsDTO.map((point) => [
                                                        point.latitude,
                                                        point.longitude,
                                                    ])}
                                                    color='blue'>
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
                                <Typography>
                                    Address:{parking.street},{parking.zipCode} {parking.city}
                                </Typography>
                                <Typography>$/h: {parking.costRate}</Typography>
                                <Typography>Open hours: {parking.openHours}</Typography>
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