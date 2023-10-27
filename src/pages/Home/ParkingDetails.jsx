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
import { getFreeParkingSpotsByParkingId, getOccupiedParkingSpotsMapByParkingId, getParkingSpotsByParkingId } from "../../actions/parkingSpotActions";
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
import { set } from "react-hook-form";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});



function ParkingDetails(props) {
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
    const parkingSpot = useSelector((state) => state.parkingSpotReducer.parkingSpot);
    const cars = useSelector((state) => state.carReducer);
    const [registrationNumber, setRegistrationNumber] = React.useState();
    const [selectedCar, setSelectedCar] = React.useState("none");
    const authenticationReducer = useSelector((state) => state.authenticationReducer);
    const [disableEndDateTime, setDisableDateTime] = React.useState(true);
    const occupiedParkingSpotsMap = useSelector(state => state.parkingSpotReducer.occupiedParkingSpots);

    useEffect(() => {
        dispatch(getParking(parkingId));
        dispatch(getParkingSpotsByParkingId(parkingId));
        handleSearch(startDay, startTime, endDay, endTime);
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

    const parseTime = (timeString) => {
        const [hours, minutes, seconds] = timeString.split(':');
        const date = new Date();
        date.setHours(Number(hours));
        date.setMinutes(Number(minutes));
        date.setSeconds(Number(seconds));
        return date;
    }


    const shouldDisableTime = (value, view) => {
        if (parking.startTime === undefined) {
            return true;
        }
    const hour = value.hour();

    if (view === "hours") {
        const parkingStart = parseTime(parking.startTime)
        const parkingEnd = parseTime(parking.endTime)

        return hour < parkingStart.getHours() || hour > parkingEnd.getHours() || (hour === parkingEnd.getHours() && value.minute() > 0);
    }

    return false;
    };

    const changeCarSelection = (e) => {
        setSelectedCar(e.target.value);
        const registrationNumber = e.target.value.registrationNumber;
        setRegistrationNumber(registrationNumber);
    };


    const handleAnyChangeOfTime = (startDay, startTime, endDay, endTime) => {
        setStartDay(startDay);
        setStartTime(startTime);
        setEndDay(endDay);
        setEndTime(endTime);
        handleSearch(startDay, startTime, endDay, endTime);
    }




    const handleSearch = (startDay, startTime, endDay, endTime) => {
        const start =
            startDay.toDate().toISOString().split("T")[0] + "T" + startTime.toDate().toISOString().split("T")[1];
        setStart(start);
        const end =
            endDay.toDate().toISOString().split("T")[0] + "T" + endTime.toDate().toISOString().split("T")[1];
        setEnd(end);

        //create startTime as Date from start string 
        const startTimeDate = new Date(start);
        //create endTime as Date from end string
        const endTimeDate = new Date(end);
        // check if startTime is before endTime
        if (startTimeDate.getTime() > endTimeDate.getTime()) {
            toast.warning("Start time must be before end time");
            return;
        }
        dispatch(getFreeParkingSpotsByParkingId(parkingId, start, end));
        dispatch(getOccupiedParkingSpotsMapByParkingId(parkingId, start));
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

    const handleRegistrationTextFieldChange = (event) => {
        const registrationNumber = event.target.value;
        setRegistrationNumber(registrationNumber);
        setSelectedCar("none");
    }
    const handleCreateReservation = (event) => {
        if (!authenticationReducer.decodedUser) {
            toast.error("You must be logged in to make a reservation");
            return;
        }

        const newReservation = {
            startDate: start,
            endDate: end,
            registrationNumber: registrationNumber,
            userDTO: {
                id: authenticationReducer.decodedUser.userId,
            },
            parkingSpotDTO: {
                id: parkingSpot.id,
            },
        };
        dispatch({
            type: GET_RESERVATION,
            value: newReservation,
        });

        // route to resevation detail page and pass reservation object

        navigate("/reservation-details");

        // dispatch(addReservation(newReservation))
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
                                    whenCreated={(map) => (mapRef.current = map)}
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
                                                    interactive>
                                                    <Popup>
                                                        {`This spot will be availbe from: ${new Date(occupiedParkingSpotsMap[parkingSpot.id]?.earliestStart).toLocaleString()}`} <br></br>
                                                        {`This spot will be availbe to: ${new Date(occupiedParkingSpotsMap[parkingSpot.id]?.earliestEnd).toLocaleString()}`}
                                                    </Popup>
                                                    </Polygon>                                                
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
                                            <Popup>{`Selected spot number: ${parkingSpot.id}`} <br></br> Click to deselect</Popup>
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
                            <CardContent spacing={2}>
                                    <Typography variant='h6'>Select start date and time:</Typography>

                                <Grid
                                    container
                                    spacing={3}
                                >
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Grid  
                                            item xs={12} sm={8} lg={9}
                                        >
                                            <DateCalendar
                                                value={startDay}
                                                onChange={(newStartDay) => handleAnyChangeOfTime(newStartDay, startTime, endDay, endTime)}
                                            />
                                        </Grid>
                                        <Grid
                                           item xs={12} sm={4} lg={3}
                                        >
                                            <DigitalClock
                                                ampm={false}
                                                timeStep={15}
                                                skipDisabled
                                                shouldDisableTime={shouldDisableTime}
                                                value={startTime}
                                                onChange={(newStartTime) => { handleAnyChangeOfTime(startDay, newStartTime, endDay, endTime); setDisableDateTime(false); }}
                                            />
                                        </Grid>
                                    </LocalizationProvider>
                                </Grid>
                                    <Typography variant='h6'>Select end date and time:</Typography>
                                <Grid
                                    container
                                    spacing={3}
                                >
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Grid
                                            item xs={12} sm={8} lg={9}
                                        >
                                            <DateCalendar
                                                value={endDay}
                                                onChange={(newValue) => { handleAnyChangeOfTime(startDay, startTime, newValue, endTime);} }
                                                disabled={disableEndDateTime}
                                            />
                                        </Grid>
                                        <Grid
                                            item xs={12} sm={4} lg={3}
                                        >
                                            <DigitalClock
                                                ampm={false}
                                                timeStep={15}
                                                skipDisabled
                                                shouldDisableTime={shouldDisableTime}
                                                value={endTime}
                                                onChange={(newValue) => { handleAnyChangeOfTime(startDay, startTime, endDay, newValue);}}
                                                disabled={disableEndDateTime}
                                            />
                                        </Grid>
                                    </LocalizationProvider>
                                </Grid>
                                {/* <Grid container>
                                    <Button
                                        sx={{ m: 1 }}
                                        variant='outlined'
                                        onClick={handleSearch}
                                        fullWidth
                                    >
                                        Search
                                    </Button>
                                </Grid> */}
                                <Grid container>
                                    <TextField
                                        sx={{ m: 1 }}
                                        fullWidth
                                        value={parkingSpot.id || ""}
                                        id='outlined-basic'
                                        label='Parking spot'
                                        variant='outlined'
                                        placeholder="Click on a free parking spot on a map"
                                        required={true}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid container>
                                    <TextField
                                        sx={{ m: 1 }}
                                        fullWidth
                                        label="Registration number"
                                        variant="outlined"
                                        type="text"
                                        required={true}
                                        value={registrationNumber ?? ''}
                                        onChange={handleRegistrationTextFieldChange}
                                    />
                                </Grid>
                                {authenticationReducer.decodedUser && cars.cars.length > 0 ? (
                                    <Grid container>
                                        <FormControl
                                            sx={{ m: 1 }}
                                            fullWidth
                                        >
                                            <InputLabel id='demo-multiple-name-label'>Select your car</InputLabel>
                                            <Select
                                                labelId='demo-multiple-name-label'
                                                id='demo-multiple-name'
                                                value={selectedCar}
                                                onChange={changeCarSelection}
                                                label='Select your car'
                                            >
                                                {cars.cars.map((car, index) => (
                                                    <MenuItem
                                                        key={index}
                                                        value={car}
                                                    >
                                                        {car.brand},{car.registrationNumber}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                ) : (
                                    <div></div>
                                )}
                                <Grid container>
                                    <Button
                                        sx={{ m: 1 }}
                                        variant='contained'
                                        onClick={handleCreateReservation}
                                        fullWidth
                                    >
                                        Reserve
                                    </Button>
                                </Grid>
                            </CardContent>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default ParkingDetails;

