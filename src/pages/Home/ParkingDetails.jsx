import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getParking, getParkingSpotsNumber, getParkingFreeSpotsNumber } from "../../redux/actions/parkingActions";
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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DigitalClock } from "@mui/x-date-pickers/DigitalClock";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { MapContainer, Polygon, Popup, TileLayer, FeatureGroup } from "react-leaflet";
import { getFreeParkingSpotsByParkingId, getOccupiedParkingSpotsMapByParkingId, getParkingSpotsByParkingId } from "../../redux/actions/parkingSpotActions";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { getUser } from "../../redux/actions/userActions";
import { getUserCars } from "../../redux/actions/carActions";
import { validateRegistraionNumber } from "../../utils/validation";
import {
    GET_RESERVATION,
    GET_PARKING_SPOT,
    GET_FREE_PARKING_SPOTS_BY_PARKING_ID,
} from "../../redux/actions/types";
import { toast } from "react-toastify";
import convertTime from "../../utils/convertTime";
import { convertDateToLocaleString } from "../../utils/convertDate";
import getLocalISOTime from "../../utils/getLocalISOTime";
import AdminProfile from "../Admin/AdminProfile";
import { GradientButton } from "../../components/GradientButton";
import 'dayjs/locale/en-gb';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});



export default function ParkingDetails(props) {
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
    const parkingSpots = useSelector((state) => state.parkingSpotReducer);
    const freeParkingSpots = useSelector((state) => state.parkingSpotReducer.freeParkingSpots);
    const parkingSpot = useSelector((state) => state.parkingSpotReducer.parkingSpot);
    const cars = useSelector((state) => state.carReducer);
    const [registrationNumber, setRegistrationNumber] = React.useState();
    const [selectedCar, setSelectedCar] = React.useState("none");
    const authenticationReducer = useSelector((state) => state.authenticationReducer);
    const occupiedParkingSpotsMap = useSelector(state => state.parkingSpotReducer.occupiedParkingSpots);
    const numOfSpotsList = useSelector(state => state.parkingReducer.numOfSpotsInParkings);
    const numOfFreeSpotsList = useSelector(state => state.parkingReducer.numOfFreeSpotsInParkings);
    const [parkingTime, setParkingTime] = React.useState(new Date());
    const mapRef = useRef(null);

    useEffect(() => {
        const startDayUTC = dayjs(new Date(startDay));
        const startTimeUTC = dayjs(new Date(startTime));
        const endTimeUTC = dayjs(new Date(endTime));
        dispatch(getParking(parkingId)).then((res) => {
            dispatch(getParkingFreeSpotsNumber(parkingId, startDayUTC.toISOString()))
            dispatch(getParkingSpotsNumber(parkingId))
            firstSearch(startTimeUTC, endTimeUTC, res);
        });
        dispatch(getParkingSpotsByParkingId(parkingId));
        unsetParkingSpot();
        tryGetUser();
        tryGetUserCars();
    }, []);

    if (authenticationReducer.decodedUser !== null && authenticationReducer.decodedUser.role === "ADMIN") {
        navigate('/admin');
        return <AdminProfile />;
    }

    const unsetParkingSpot = () => {
        dispatch({
            type: GET_PARKING_SPOT,
            value: {},
        });
    };

    const tryGetUserCars = () => {
        if (authenticationReducer.decodedUser && authenticationReducer.decodedUser.role === "USER") {
            dispatch(getUserCars()).catch((error) => {

            });
        }
    };

    const tryGetUser = () => {
        if (authenticationReducer.decodedUser) {
            dispatch(getUser(authenticationReducer.decodedUser.userId)).catch((error) => {

            });
        }
    };


    const parseTime = (timeString) => {
        const [hours, minutes, seconds] = timeString.split(':');
        let date = new Date();
        date.setHours(Number(hours));
        date.setMinutes(Number(minutes));
        if (seconds)
            date.setSeconds(Number(seconds));
        else
            date.setSeconds(0);
        return date;
    }

    const shouldDisableTime = (value, view, time) => {

        let now = dayjs(time);
        now = now.set("minute", now.minute() - (now.minute() % 15)).set("second", 0).set("millisecond", 0);

        if (value.date() === now.date()
            && (value.hour() < now.hour()
                || (value.hour() === now.hour()
                    && value.minute() < now.minute()))) {
            return true;
        }

        if (isParking24h(parking)) {
            return false;
        }

        let hour = value.hour();
        let minute = value.minute();

        if (view === "hours") {
            const parkingStart = parseTime(convertTime(parking.startTime, parking.timeZone))
            const parkingEnd = parseTime(convertTime(parking.endTime, parking.timeZone))
            if (time === parkingTime) {
                return hour < parkingStart.getHours()
                    || hour > parkingEnd.getHours()
                    || (hour === parkingEnd.getHours() && minute >= parkingEnd.getMinutes())
                    || (hour === parkingStart.getHours() && minute < parkingStart.getMinutes());
            } else {
                return hour < parkingStart.getHours()
                    || hour > parkingEnd.getHours()
                    || (hour === parkingEnd.getHours() && minute > parkingEnd.getMinutes())
                    || (hour === parkingStart.getHours() && minute < parkingStart.getMinutes());
            }

        }

        return false;
    };

    const changeCarSelection = (e) => {
        setSelectedCar(e.target.value);
        const registrationNumber = e.target.value.registrationNumber;
        setRegistrationNumber(registrationNumber);
    };

    const isParking24h = (parking) => {
        if (!parking) {
            return false;
        }
        return convertTime(parking.startTime, parking.timeZone) === "00:00" && convertTime(parking.endTime, parking.timeZone) === "00:00";
    };


    const handleAnyChangeOfTime = (startDay, startTime, endDay, endTime) => {

        if (!isParking24h(parking)) {
            if (startDay.toDate().getDate() !== dayjs(parkingTime).toDate().getDate()) {
                endDay = startDay;
            }
        }


        if (startDay.toDate().getDate() !== startTime.toDate().getDate()) {
            startTime = dayjs(startDay.toDate()).startOf('day').add(startTime.hour(), 'hour').add(startTime.minute(), 'minute').add(startTime.second(), 'second');
            if (dayjs(parkingTime).toDate().getHours() > dayjs(startTime).toDate().getHours()) {
                startTime = dayjs(parkingTime).set("minute", dayjs(parkingTime).minute() - (dayjs(parkingTime).minute() % 15)).set("second", 0).set("millisecond", 0);

                setStartTime(startTime);
            }
        }

        if (endDay.toDate().getDate() !== endTime.toDate().getDate()) {
            endTime = dayjs(endDay.toDate()).startOf('day').add(endTime.hour(), 'hour').add(endTime.minute(), 'minute').add(endTime.second(), 'second');
        }

        setStartDay(startDay);
        setStartTime(startTime);


        if (startTime.toDate().getTime() >= endTime.toDate().getTime()) {
            endTime = startTime.add(15, "minute");
            endDay = endTime;
        }
        setEndTime(endTime);

        if (startDay.toDate().getTime() > endDay.toDate().getTime()) {
            endDay = startDay;
        }
        setEndDay(endDay);
        handleSearch(startDay, startTime, endDay, endTime, parking);
    }


    const firstSearch = (startTime, endTime, parking) => {
        if (parkingSpot) {
            handleClickOnSelectedSpot(parkingSpot);
        }
        if (!parking.timeZone) {
            return;
        }

        const utcDate = new Date();

        let timeZoneOffset = parseInt(parking.timeZone) * 60;
        if (isNaN(timeZoneOffset)) {
            timeZoneOffset = 0;
        }

        const localDate = new Date(utcDate.getTime() + timeZoneOffset * 60 * 1000);

        const options = { timeZone: 'UTC', hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric', year: 'numeric', month: 'numeric', day: 'numeric' };
        const formatter = new Intl.DateTimeFormat('en-US', options);

        const localTimeString = formatter.format(localDate);
        const localTime = new Date(localTimeString);

        setParkingTime(localTime)

        const localTimeDayjs = dayjs(localTime);
        setStartDay(localTimeDayjs);
        setStartTime(localTimeDayjs.set("minute", localTimeDayjs.minute() - (localTimeDayjs.minute() % 15)).set("second", 0).set("millisecond", 0));
        setEndTime(localTimeDayjs.set("minute", localTimeDayjs.minute() - (localTimeDayjs.minute() % 15)).set("second", 0).set("millisecond", 0).add(15, "minute"));
        setEndDay(localTimeDayjs);
        setStart(localTimeDayjs.set("minute", localTimeDayjs.minute() - (localTimeDayjs.minute() % 15)).set("second", 0).set("millisecond", 0));
        setEnd(localTimeDayjs.set("minute", localTimeDayjs.minute() - (localTimeDayjs.minute() % 15)).set("second", 0).set("millisecond", 0).add(15, "minute"));

        const start = startTime.toDate().toISOString()
        const end = endTime.toDate().toISOString()


        dispatch(getFreeParkingSpotsByParkingId(parkingId, start, end));
        dispatch(getOccupiedParkingSpotsMapByParkingId(parkingId, start));
    }


    const handleSearch = (startDay, startTime, endDay, endTime, parking) => {
        if (parkingSpot) {
            handleClickOnSelectedSpot(parkingSpot);
        }
        if (!parking.timeZone) {
            return;
        }

        setStart(startTime);
        const start = getLocalISOTime(startTime, parking.timeZone);

        setEnd(endTime);
        const end = getLocalISOTime(endTime, parking.timeZone);

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
        } else {
            toast.info("Click on the selected parking spot to deselect it");
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
        if (!validateRegistraionNumber(registrationNumber)) {
            toast.info('Please enter valid registration number');
        }
        setRegistrationNumber(registrationNumber);
        setSelectedCar("none");
    }

    const handleCreateReservation = () => {
        if (!authenticationReducer.decodedUser) {
            toast.error("You must be logged in to make a reservation");
            navigate("/login");
            return;
        }

        if (!start || !end || !parkingSpot.id || !registrationNumber) {
            if (!start) {
                toast.warning("Start date must be selected");
            }
            if (!end) {
                toast.warning("End date must be selected");
            }
            if (!parkingSpot.id) {
                toast.warning("Parking spot must be selected");
            }
            if (!registrationNumber) {
                toast.warning("Registration number must be filled");
            }
            return
        }

        if (!validateRegistraionNumber(registrationNumber)) {
            toast.warning('Registration number has no whitespaces');
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

        navigate("/reservation-details");
    };

    return (
        <>
            <Container
                maxWidth='xl'
                component="main" sx={{
                    p: 3,
                }}
            >
                <Box >
                    <Grid
                        container
                        spacing={2}
                    >
                        <Grid
                            item
                            xs={12}
                            lg={7}
                        >
                            <div className='map-container'>
                                {parking.latitude && parking.longitude ? (
                                    <MapContainer
                                        style={{ width: "100%", height: "100%" }}
                                        center={[parking.latitude, parking.longitude]}
                                        zoom={19}
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
                                                    polygon: false,
                                                }}
                                                edit={{
                                                    edit: false,
                                                    remove: false,
                                                    featureGroup: mapRef.current?.leafletElement,
                                                }}
                                            />
                                            {parkingSpots.parkingSpots && parkingSpots.parkingSpots
                                                .filter(
                                                    (spot) => !freeParkingSpots.map((spot) => spot.id).includes(spot.id)
                                                )
                                                .map((parkingSpot) => (
                                                    <Polygon
                                                        key={parkingSpot.id}
                                                        positions={parkingSpot.pointsDTO.map((point) => [
                                                            point.latitude,
                                                            point.longitude,
                                                        ])}
                                                        color={parkingSpot.active ? "red" : "#474747"}
                                                        interactive>
                                                        {occupiedParkingSpotsMap && occupiedParkingSpotsMap[parkingSpot.id] && (
                                                            <Popup>
                                                                Available from: <br />
                                                                {`${convertDateToLocaleString(occupiedParkingSpotsMap[parkingSpot.id].earliestStart)}`}
                                                                {occupiedParkingSpotsMap[parkingSpot.id].earliestEnd && (
                                                                    <div>
                                                                        Available to: <br />
                                                                        {convertDateToLocaleString(occupiedParkingSpotsMap[parkingSpot.id].earliestEnd)}
                                                                    </div>
                                                                )}
                                                            </Popup>
                                                        )}
                                                        {occupiedParkingSpotsMap && occupiedParkingSpotsMap[parkingSpot.id] == null && (
                                                            <Popup>
                                                                {`Will not be available for the rest of the day.`}
                                                            </Popup>
                                                        )}
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
                                                        color="green"
                                                        eventHandlers={{
                                                            click: () => {
                                                                handleClickOnFreeParkingSpot(spot);
                                                            },
                                                        }}
                                                    />
                                                )
                                            ))}

                                        </FeatureGroup>

                                        <TileLayer
                                            maxNativeZoom={23}
                                            maxZoom={23}
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
                                                    click: () => {
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
                                                <Popup>{`Selected spot number: ${parkingSpot.spotNumber}`} <br></br> Click to deselect</Popup>
                                            </Polygon>
                                        )}
                                    </MapContainer>
                                ) : (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignContent: "center",
                                            justifyContent: "center",
                                            flexDirection: "row",
                                            flexWrap: "wrap",
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
                            lg={5}
                        >
                            <Paper className='reserve' >
                                <CardContent>
                                    <Typography variant='h4' fontWeight='bold'>{parking.name}</Typography>
                                    {numOfFreeSpotsList && numOfSpotsList && parking.id && (
                                        <Typography variant='h5'>Available: {numOfFreeSpotsList[parking.id.toString()]}/{numOfSpotsList[parking.id.toString()]}</Typography>
                                    )}
                                    <Typography variant="h6">
                                        Address: {parking.street}, {parking.zipCode} {parking.city}
                                    </Typography>
                                    {isParking24h(parking) ? (
                                        <Typography variant="h6">Open hours: 24/7</Typography>
                                    ) : (
                                        <Typography variant="h6">Open hours: {convertTime(parking.startTime, parking.timeZone)} -  {convertTime(parking.endTime, parking.timeZone)} </Typography>
                                    )
                                    }
                                    <Typography variant='h6'>{parking.currency}/h: {parking.costRate}</Typography>
                                    <Typography variant='string'>{parking.description}</Typography>
                                    <Typography>
                                        Dates and times are based on parking time zone {parkingTime.toLocaleString()} ({parking.timeZone}) compared to UTC.
                                    </Typography>
                                </CardContent>
                                {parkingTime && parking.timeZone && (
                                    <CardContent spacing={2}>
                                        <Typography variant='h6'>Select start date and time:</Typography>

                                        <Grid
                                            container
                                            spacing={3}
                                        >
                                            <LocalizationProvider dateAdapter={AdapterDayjs}
                                                adapterLocale="en-gb">
                                                <Grid
                                                    item xs={12} sm={8} lg={9}
                                                >
                                                    <DateCalendar
                                                        data-cy={'start-date'}
                                                        value={startDay}
                                                        onChange={(newStartDay) => handleAnyChangeOfTime(newStartDay, startTime, endDay, endTime)}
                                                        minDate={dayjs(parkingTime)}
                                                        showDaysOutsideCurrentMonth={true}

                                                    />
                                                </Grid>
                                                <Grid
                                                    item xs={12} sm={4} lg={3}
                                                >
                                                    <DigitalClock
                                                        data-cy={'start-time'}
                                                        ampm={false}
                                                        timeStep={15}
                                                        skipDisabled
                                                        shouldDisableTime={(val, view) => shouldDisableTime(val, view, parkingTime)}
                                                        value={startTime}
                                                        onChange={(newStartTime) => { handleAnyChangeOfTime(startDay, newStartTime, endDay, endTime); }}
                                                        minutesStep={15}
                                                    />
                                                </Grid>
                                            </LocalizationProvider>
                                        </Grid>
                                        <Typography variant='h6'>Select end date and time:</Typography>
                                        <Grid
                                            container
                                            spacing={3}
                                        >
                                            <LocalizationProvider dateAdapter={AdapterDayjs}
                                                adapterLocale="en-gb">
                                                <Grid
                                                    item xs={12} sm={8} lg={9}
                                                >
                                                    <DateCalendar
                                                        data-cy={'end-date'}
                                                        value={endDay}
                                                        onChange={(newValue) => { handleAnyChangeOfTime(startDay, startTime, newValue, endTime); }}
                                                        minDate={startDay}
                                                        disabled={!isParking24h(parking)}
                                                        showDaysOutsideCurrentMonth={true}

                                                    />
                                                </Grid>
                                                <Grid
                                                    item xs={12} sm={4} lg={3}
                                                >
                                                    <DigitalClock
                                                        data-cy={'end-time'}
                                                        ampm={false}
                                                        timeStep={15}
                                                        skipDisabled
                                                        shouldDisableTime={(val, view) => shouldDisableTime(val, view, startTime.add(15, "minute"))}
                                                        value={endTime}
                                                        onChange={(newValue) => { handleAnyChangeOfTime(startDay, startTime, endDay, newValue); }}
                                                    />
                                                </Grid>
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid container>
                                            <TextField
                                                data-cy={'parking-spot'}
                                                sx={{ m: 1 }}
                                                fullWidth
                                                value={parkingSpot?.spotNumber || ""}
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
                                            <GradientButton
                                                sx={{ m: 1 }}
                                                variant='contained'
                                                onClick={handleCreateReservation}
                                                fullWidth
                                            >
                                                Reserve
                                            </GradientButton>
                                        </Grid>
                                    </CardContent>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Container >
        </>
    );
}


