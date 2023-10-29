import React, {useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getParking } from "../../actions/parkingActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { FormControl, InputLabel, Paper, Select } from "@mui/material";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";
import "./ParkingDetails.css"; // Create a CSS file for styling
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DigitalClock } from "@mui/x-date-pickers/DigitalClock";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import { MapContainer, Marker, Polygon, Popup, TileLayer, FeatureGroup, MapControl } from "react-leaflet";
import { getFreeParkingSpotsByParkingId, getParkingSpotsByParkingId, addStagedParkingSpot } from "../../actions/parkingSpotActions";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { getCar, getUserCars } from "../../actions/carActions";
import {
    ADD_RESERVATION,
    DELETE_RESERVATION,
    GET_RESERVATION,
    UPDATE_RESERVATION,
    GET_RESERVATIONS,
    GET_PARKING_SPOT,
    GET_FREE_PARKING_SPOTS_BY_PARKING_ID,
} from "../../actions/types";
import { toast } from "react-toastify";
import parkingSpotReducer from "../../reducers/parkingSpotReducer";

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

    const [startDay, setStartDay] = React.useState(dayjs());
    const [endDay, setEndDay] = React.useState(dayjs());
    const [startTime, setStartTime] = React.useState(dayjs().set("minute", dayjs().minute() - (dayjs().minute() % 15)).set("second", 0).set("millisecond", 0));
    const [endTime, setEndTime] = React.useState(startTime.add(15, "minute"));
    const [start, setStart] = React.useState(null);
    const [end, setEnd] = React.useState(null);

    const parking = useSelector((state) => state.parkingReducer.parking);
    const reservationReducer = useSelector((state) => state.reservationReducer);
    const parkingSpots = useSelector((state) => state.parkingSpotReducer);
    const freeParkingSpots = useSelector((state) => state.parkingSpotReducer.freeParkingSpots);
    const stagedParkingSpots = useSelector((state) => state.parkingSpotReducer.stagedParkingSpots);
    const parkingSpot = useSelector((state) => state.parkingSpotReducer.parkingSpot);
    const cars = useSelector((state) => state.carReducer);
    const [registrationNumber, setRegistrationNumber] = React.useState();
    const [selectedCar, setSelectedCar] = React.useState("none");
    const authenticationReducer = useSelector((state) => state.authenticationReducer);
    const [disableEndDateTime, setDisableDateTime] = React.useState(true);

    useEffect(() => {
        dispatch(getParking(parkingId));
        dispatch(getParkingSpotsByParkingId(parkingId));
        handleSearch(endTime);
        unsetParkingSpot();
        tryGetUserCars();
    }, []);


    const unsetParkingSpot = () => {
        dispatch({
            type: GET_PARKING_SPOT,
            value: {},
        });
    };

    const tryGetUserCars = () => {
        if (authenticationReducer.decodedUser) {
            dispatch(getUserCars());
        }
    };

    const mapRef = useRef(null);

    const startOpenHour = 6;
    const endOpenHour = 22;
    const shouldDisableTime = (value, view) => {
        const hour = value.hour();
        if (view === "hours") {
            return hour < startOpenHour || hour > endOpenHour;
        }
        return false;
    };

    const changeCarSelection = (e) => {
        setSelectedCar(e.target.value);
        const registrationNumber = e.target.value.registrationNumber;
        setRegistrationNumber(registrationNumber);
    };

    const _created = (e) => {
        console.log(e.layer.toGeoJSON());
    };

    const handleSetEndTime = (newValue) => {
        setEndTime(newValue);
        handleSearch(newValue); 
    }

    const handleSearch = (event) => {
        const start =
            startDay.toDate().toISOString().split("T")[0] + "T" + startTime.toDate().toISOString().split("T")[1];
        setStart(start);
        const end = endDay.toDate().toISOString().split("T")[0] + "T" + event.toDate().toISOString().split("T")[1];
        setEnd(end);

        dispatch(getFreeParkingSpotsByParkingId(parkingId, start, end));
    };

    const handleClickOnFreeParkingSpot = (event) => {
        if (parkingSpot.id === undefined) {
            dispatch({
                type: GET_PARKING_SPOT,
                value: event,
            });
            dispatch({
                type: GET_FREE_PARKING_SPOTS_BY_PARKING_ID,
                value: freeParkingSpots.filter((spot) => spot.id !== event.id),
            });
        }
    };

    const handleClickOnSelectedSpot = (event) => {
        dispatch({
            type: GET_PARKING_SPOT,
            value: {},
        });
        dispatch({
            type: GET_FREE_PARKING_SPOTS_BY_PARKING_ID,
            value: freeParkingSpots.concat(event),
        });
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
                    {/* Map Section */}
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
                                                edit: true,
                                                featureGroup: mapRef.current?.leafletElement,
                                            }}
                                            onCreated={e => {
                                                const eventJson = (e.layer.toGeoJSON())
                                                //addStagedParkingSpot(e.layer.toGeoJSON())
                                                console.log(eventJson.geometry.coordinates)
                                                addStagedParkingSpot(eventJson.geometry.coordinates)
                                            }}
                                            onEdited={e => {
                                                // console.log(e)
                                                e.layers.eachLayer(a => {
                                                    console.log(a.toGeoJSON())
                                                });
                                            }}
                                        />
                                        {parkingSpots.parkingSpots
                                            .filter(
                                                (spot) => !freeParkingSpots.map((spot) => spot.id).includes(spot.id)
                                            )
                                            .map((parkingSpot, index) => (
                                                <Polygon
                                                    positions={parkingSpot.pointsDTO.map((point) => [
                                                        point.latitude,
                                                        point.longitude,
                                                    ])}
                                                    color='red'
                                                />
                                            ))}
                                                {freeParkingSpots.map((spot, index) => (
                                                spot.id !== parkingSpots.parkingSpot.id && (
                                                    <Polygon
                                                    key={index}
                                                    positions={spot.pointsDTO.map((point) => [
                                                        point.latitude,
                                                        point.longitude,
                                                    ])}
                                                    color="green" // Set the color to green for excluded polygons
                                                    eventHandlers={{
                                                        click: (event) => {
                                                        handleClickOnFreeParkingSpot(spot);
                                                        },
                                                    }}
                                                    />
                                                )
                                                ))}
                                        

                                    </FeatureGroup>

                                    <TileLayer
                                        maxNativeZoom={22}
                                        maxZoom={22}
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url='http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                                    />
                                    {parkingSpot && parkingSpot.id && (
                                            <Polygon
                                                positions={parkingSpot.pointsDTO.map((point) => [
                                                    point.latitude,
                                                    point.longitude,
                                                ])}
                                                color='orange'
                                                eventHandlers={{
                                                    click: (event) => {
                                                        handleClickOnSelectedSpot(parkingSpot);
                                                    },
                                                    mouseover: (e) => {
                                                    e.target.openPopup();
                                                    },
                                                    mouseout: (e) => {
                                                    e.target.closePopup();
                                                    },
                                            }}
                                            interactive
                                            >
                                            <Popup>{`Selected Parking Spot ID: ${parkingSpot.id}`} <br></br> Click to deselect</Popup>
                                            </Polygon>
                                        )}
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
                            <Button
                                        sx={{ m: 1 }}
                                        variant='contained'
                                        //onClick={}
                                        fullWidth
                                    >
                                        Save parking
                                    </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default ParkingEditor;