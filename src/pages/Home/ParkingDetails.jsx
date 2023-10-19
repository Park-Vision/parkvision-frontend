import React, {useDebugValue, useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getParking} from "../../actions/parkingActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {useParams} from "react-router-dom";
import {FormControl, InputLabel, Paper, Select} from "@mui/material";
import Grid from "@mui/material/Grid";

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css"
import { EditControl } from "react-leaflet-draw";
import './ParkingDetails.css'; // Create a CSS file for styling
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import {MapContainer, Marker, Polygon, Popup, TileLayer, FeatureGroup, MapControl} from 'react-leaflet'
import {getFreeParkingSpotsByParkingId, getParkingSpotsByParkingId} from "../../actions/parkingSpotActions";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import TextField from "@mui/material/TextField";
import {addReservation} from "../../actions/reservationActions";
import MenuItem from "@mui/material/MenuItem";
import {getCars, getUserCars} from "../../actions/carActions";

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
    const {parkingId} = useParams()
    const dispatch = useDispatch()

    const [startDay, setStartDay] = React.useState(dayjs());
    const [endDay, setEndDay] = React.useState(dayjs());
    const [startTime, setStartTime] = React.useState(dayjs());
    const [endTime, setEndTime] = React.useState(dayjs())
    const [start, setStart] = React.useState(null);
    const [end, setEnd] = React.useState(null);

    const parking = useSelector(state => state.parkingReducer.parking);
    const reservationReducer = useSelector(state => state.reservationReducer);
    const parkingSpots = useSelector(state => state.parkingSpotReducer);
    const freeParkingSpots = useSelector(state => state.parkingSpotReducer.freeParkingSpots);
    const cars = useSelector(state => state.carReducer);
    const [parkingSpot, setParkingSpot] = React.useState(null);
    const [registrationNumber, setRegistrationNumber] = React.useState("");
    const [selectedCar, setSelectedCar] = React.useState("none");

    useEffect(() => {
        dispatch(getParking(parkingId))
        dispatch(getParkingSpotsByParkingId(parkingId))
        dispatch(getCars())
    }, []);

    const mapRef = useRef(null);

    const startOpenHour = 6;
    const endOpenHour = 22;
    const shouldDisableTime = (value, view) => {
        const hour = value.hour();
        if (view === 'hours') {
            return hour < startOpenHour || hour > endOpenHour;
        }
        return false;
    };

    const changeCarSelection = (e) => {
        setSelectedCar(e.target.value);
        setRegistrationNumber(e.target.value.registrationNumber);
    }

    const _created = (e) => {
        console.log(e.layer.toGeoJSON());
    }


    const handleClick = (event) => {
        console.log(startDay.toDate().toISOString());
        console.log(startTime.toDate().toISOString());

        const start = startDay.toDate().toISOString().split('T')[0] + 'T' + startTime.toDate().toISOString().split('T')[1];
        setStart(start);

        console.log(endDay.toDate().toISOString());
        console.log(endTime.toDate().toISOString());

        const end = endDay.toDate().toISOString().split('T')[0] + 'T' + endTime.toDate().toISOString().split('T')[1];
        setEnd(end);
        console.log(start);
        console.log(end);

        dispatch(getFreeParkingSpotsByParkingId(parkingId, start, end));
    }

    const handleClickOnFreeParkingSpot = (event) => {
        console.log('click on free parking spot', event);
        setParkingSpot(event);
    }

    const handleRegistrationTextFieldChange = (event) => {
        setRegistrationNumber(event);
        setSelectedCar("none");
    }

    const handleCreateReservation = (event) => {
        console.log('create reservation', event);
        const newReservation = {
            "startDate": start,
            "endDate": end,
            "registrationNumber": registrationNumber,
            "userDTO": {
                "id": 1
            },
            "parkingSpotDTO": {
                "id": parkingSpot.id
            }
        }
        console.log(newReservation);

        dispatch(addReservation(newReservation))
    }

    return (
        <Container maxWidth="xl" style={{ height: "97%"}}>
            <Box sx={{ my: 4, height: '100%'}}>
            <Grid container spacing={2} style={{ height: "100%"}}>
            {/* Map Section */}
            <Grid item xs={12} lg={8}>
                <div className="map-container">
                    {parking.latitude && parking.longitude ? (
                        <MapContainer
                            style={{ width: '100%', height: '100%' }}
                            center={[parking.latitude, parking.longitude]}
                            zoom={20}
                            scrollWheelZoom={true}
                            whenCreated={(map) => (mapRef.current = map)}
                        >
                            <FeatureGroup>
                                <EditControl
                                    position="topright"
                                    draw={{
                                        rectangle: false,
                                        circle: false,
                                        circlemarker: false,
                                        marker: false,
                                        polyline: false,
                                        polygon: {
                                            allowIntersection: false,
                                            drawError: {
                                                color: '#e1e100',
                                                message:
                                                    "<strong>Oh snap!<strong> you can't draw that!",
                                            },
                                            shapeOptions: {
                                                color: '#97009c',
                                            },
                                        },
                                    }}
                                    edit={{
                                        edit: true,
                                        featureGroup: mapRef.current?.leafletElement
                                    }}
                                />
                                {parkingSpots.parkingSpots.filter(spot => !freeParkingSpots.map(spot => spot.id).includes(spot.id)).map((parkingSpot, index) => (
                                        <Polygon
                                            positions={parkingSpot.pointsDTO.map((point) => [
                                                point.latitude,
                                                point.longitude,
                                            ])}
                                            color="red"
                                        />
                                ))}
                                {freeParkingSpots.map((parkingSpot, index) => (
                                    <Polygon
                                        positions={parkingSpot.pointsDTO.map((point) => [
                                            point.latitude,
                                            point.longitude,
                                        ])}
                                        color="green"
                                        eventHandlers={{
                                            click: (event) => {
                                                handleClickOnFreeParkingSpot(parkingSpot)
                                            }
                                        } }
                                    />
                                ))}
                            </FeatureGroup>

                            <TileLayer
                                maxNativeZoom={22}
                                maxZoom={22}
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                            />


                        </MapContainer>
                    ) : (
                        <Box sx={{ display: 'flex', "align-content": 'center', "justify-content":'center', "flex-direction":'row', "flex-wrap":'wrap' }}
                             style={{ width: '100%', height: '100%' }}>
                            <CircularProgress />
                        </Box>
                    )}
                </div>

            </Grid>
            <Grid item xs={12} lg={4} >
                <Paper className='reserve'>
                    <CardContent >
                        <Typography variant="h4">{parking.name}</Typography>
                        <Typography variant='p'>{parking.description}</Typography>
                        <Typography>Address:{parking.street},{parking.zipCode} {parking.city}</Typography>
                        <Typography>$/h: {parking.costRate}</Typography>
                        <Typography>Open hours: {parking.openHours}</Typography>
                    </CardContent>
                    <CardContent>
                        <Typography variant="h5">Select date and time:</Typography>
                        <Grid container spacing={3}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid item xs={12} sm={8}>
                                    <DateCalendar value={startDay} onChange={(newValue) => setStartDay(newValue)}/>

                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <DigitalClock
                                        ampm={false}
                                        timeStep={15}
                                        skipDisabled
                                        shouldDisableTime={shouldDisableTime}
                                        value={startTime} onChange={(newValue) => setStartTime(newValue)}
                                    />

                                </Grid>
                            </LocalizationProvider>
                        </Grid>
                        <Grid container spacing={3} >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid xs={12} sm={8}>
                                    <DateCalendar value={endDay} onChange={(newValue) => setEndDay(newValue)} />
                                </Grid>
                                <Grid item xs={4} sm={4}>
                                    <DigitalClock
                                        ampm={false}
                                        timeStep={15}
                                        skipDisabled
                                        shouldDisableTime={shouldDisableTime}
                                        value={endTime} onChange={(newValue) => setEndTime(newValue)}

                                    />
                                </Grid>
                            </LocalizationProvider>
                        </Grid>
                        <Grid container>
                            <Button variant="outlined" onClick={handleClick} fullWidth>
                                Search
                            </Button>
                        </Grid>
                        <Grid container>
                            <Typography variant="h5">Chosen parking spot:</Typography>
                            <Typography variant="h6">{parkingSpot?.id}</Typography>
                        </Grid>
                        <Grid container>
                            <TextField sx={{ m: 1 }} fullWidth
                                value={registrationNumber}
                                onChange={(newValue) => handleRegistrationTextFieldChange(newValue.target.value)}
                                id="outlined-basic"
                                label="Type your registration number"
                                variant="outlined" />
                        </Grid>
                        { cars.cars.length > 0 ? (
                        <Grid container>
                            <FormControl sx={{ m: 1 }} fullWidth>
                                <InputLabel id="demo-multiple-name-label">Select your car</InputLabel>
                                <Select
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    value={selectedCar}
                                    onChange={changeCarSelection}
                                    label="Select your car"
                                >
                                    {cars.cars.map((car) => (
                                        <MenuItem value={car}>{car.brand},{car.registrationNumber}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        ):(<div></div>)}
                        <Grid container>
                            <Button variant="contained" onClick={handleCreateReservation} fullWidth>
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

