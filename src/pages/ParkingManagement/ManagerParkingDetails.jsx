
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    Box,
    Typography,
    Paper,
    CardContent,
    TextField,
    Button,
    Grid,
    MenuItem
} from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { renderToString } from "react-dom/server";
import { getParking, updateParking } from '../../actions/parkingActions';
import { getUser } from '../../actions/userActions';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import { toast } from 'react-toastify';
import decodeToken from '../../utils/decodeToken';

const currencies = [
    {
        value: 'USD',
        label: 'USD',
    },
    {
        value: 'EUR',
        label: 'EUR',
    },
    {
        value: 'BTC',
        label: 'BTC',
    },
    {
        value: 'JPY',
        label: 'JPY',
    },
    {
        value: 'PLN',
        label: 'PLN',
    },
];

const timeZones = [
    {
        value: '-12:00',
        label: 'UTC-12:00',
    },
    {
        value: '-11:00',
        label: 'UTC-11:00',
    },
    {
        value: '-10:00',
        label: 'UTC-10:00',
    },
    {
        value: '-09:00',
        label: 'UTC-09:00',
    },
    {
        value: '-08:00',
        label: 'UTC-08:00',
    },
    {
        value: '-07:00',
        label: 'UTC-07:00',
    },
    {
        value: '-06:00',
        label: 'UTC-06:00',
    },
    {
        value: '-05:00',
        label: 'UTC-05:00',
    },
    {
        value: '-04:00',
        label: 'UTC-04:00',
    },
    {
        value: '-03:00',
        label: 'UTC-03:00',
    },
    {
        value: '-02:00',
        label: 'UTC-02:00',
    },
    {
        value: '-01:00',
        label: 'UTC-01:00',
    },
    {
        value: 'Z',
        label: 'UTC',
    },
    {
        value: '+01:00',
        label: 'UTC+01:00',
    },
    {
        value: '+02:00',
        label: 'UTC+02:00',
    },
    {
        value: '+03:00',
        label: 'UTC+03:00',
    },
    {
        value: '+04:00',
        label: 'UTC+04:00',
    },
    {
        value: '+05:00',
        label: 'UTC+05:00',
    },
    {
        value: '+06:00',
        label: 'UTC+06:00',
    },
    {
        value: '+07:00',
        label: 'UTC+07:00',
    },
    {
        value: '+08:00',
        label: 'UTC+08:00',
    },
    {
        value: '+09:00',
        label: 'UTC+09:00',
    },
    {
        value: '+10:00',
        label: 'UTC+10:00',
    },
    {
        value: '+11:00',
        label: 'UTC+11:00',
    },
    {
        value: '+12:00',
        label: 'UTC+12:00',
    }
];

const parkingIcon = new L.DivIcon({
    html: renderToString(<LocalParkingIcon style={{
        color: 'green', background: 'white', borderRadius: '4px',
        border: '2px solid black', fontSize: '27px'
    }} />),
    iconSize: [32, 32],
    className: 'custom-icon-class',
});


function ManagerParkingDetails() {
    const { parkingId } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [costRate, setCostRate] = useState();
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [timeZone, setTimeZone] = useState('');
    const [currency, setCurrency] = useState('');

    const userjson = JSON.parse(localStorage.getItem("user"));
    const user = decodeToken(userjson?.token);

    const dispatch = useDispatch();

    const handleCancelEdit = () => {
        navigate(`/parking/${parkingId}`)
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const newParking = {
            id: parkingId,
            name: name,
            description: description,
            city: city,
            street: street,
            zipCode: zipCode,
            costRate: parseFloat(costRate),
            startTime: new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + timeZone,
            endTime: new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + timeZone,
            latitude: latitude,
            longitude: longitude,
            timeZone: timeZone,
            currency: currency,
        };



        dispatch(updateParking(newParking)).then((response) => {
            toast.success("Parking updated successfully");
            navigate(`/parking/${parkingId}`)
        }).catch((error) => {
            toast.error("Error updating parking");
        });

    };

    useEffect(() => {
        if (!user || user.role !== 'PARKING_MANAGER') {
            navigate('/');
            toast.error('You are not authorized to access this page');
        }
        else {
            dispatch(getUser(user.userId)).then((response) => {
                if (response.parkingDTO.id !== parseInt(parkingId)) {
                    navigate('/');
                    toast.error('You are not authorized to access this page');
                }
            }).catch((error) => {
                toast.error('Error getting user');
                console.log(error);
            });
            dispatch(getParking(parkingId)).then((response) => {
                const parking = response;

                if (parking.timeZone !== 'Z') {
                    parking.startTime = parking.startTime.slice(0, -6);
                    parking.endTime = parking.endTime.slice(0, -6);
                }
                else {
                    parking.startTime = parking.startTime.slice(0, -1);
                    parking.endTime = parking.endTime.slice(0, -1);
                }
                let startHour = parking.startTime.split(':')[0];
                let endHour = parking.endTime.split(':')[0];

                let startMinute = parking.startTime.split(':')[1];
                let endMinute = parking.endTime.split(':')[1];

                parking.startTime = dayjs().hour(startHour).minute(startMinute).second(0);
                parking.endTime = dayjs().hour(endHour).minute(endMinute).second(0);

                parking.costRate = parking.costRate.toFixed(2);
                setName(parking.name);
                setDescription(parking.description);
                setCity(parking.city);
                setStreet(parking.street);
                setZipCode(parking.zipCode);
                setCostRate(parking.costRate);
                setStartTime(dayjs(parking.startTime));
                setEndTime(dayjs(parking.endTime));
                setLatitude(parking.latitude);
                setLongitude(parking.longitude);
                setTimeZone(parking.timeZone);
                setCurrency(parking.currency);
            });
        }



    }, [parkingId]);


    return (
        <Container maxWidth="xl">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    New Parking Creation
                </Typography>
                <Paper>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="name"
                                        label="Name"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="description"
                                        label="Description"
                                        multiline
                                        maxRows={4}
                                        value={description}
                                        onChange={(event) => setDescription(event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="city"
                                        label="City"
                                        value={city}
                                        onChange={(event) => setCity(event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="street"
                                        label="Street"
                                        value={street}
                                        onChange={(event) => setStreet(event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>

                                    <TextField
                                        required
                                        fullWidth
                                        id="zipCode"
                                        label="Zip Code"
                                        value={zipCode}
                                        onChange={(event) => setZipCode(event.target.value)}
                                    />

                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="costRate"
                                        type="number"
                                        label="Cost Rate / Hour"
                                        value={costRate}
                                        onChange={(event) => {
                                            setCostRate(event.target.value)
                                        }
                                        }
                                        inputProps={{ min: 0, step: 0.01, max: 1000 }}
                                        InputLabelProps={
                                            { shrink: true }
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                                        <MobileTimePicker
                                            required
                                            id="startTime"
                                            slotProps={{ textField: { fullWidth: true } }}
                                            label="Start Time"
                                            value={startTime}
                                            onChange={(newValue) => {
                                                setStartTime(newValue);
                                            }}
                                            views={['hours', 'minutes']}
                                            inputFormat="HH:mm"
                                            ampm={false}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <MobileTimePicker
                                            required
                                            slotProps={{ textField: { fullWidth: true } }}
                                            id="endTime"
                                            label="End Time"
                                            value={endTime}
                                            onChange={(newValue) => {
                                                setEndTime(newValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} />}
                                            views={['hours', 'minutes']}
                                            inputFormat="HH:mm"
                                            ampm={false}
                                            minTime={startTime}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12}>
                                    <div style={{ height: '500px' }}>
                                        <MapContainer
                                            center={[0, 0]}
                                            zoom={2}
                                            scrollWheelZoom={true}
                                            style={{ width: '100%', height: '500px' }}
                                        >
                                            <TileLayer
                                                maxNativeZoom={22}
                                                maxZoom={22}
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <Marker
                                                position={[latitude, longitude]}
                                                icon={parkingIcon}
                                                draggable
                                                eventHandlers={{
                                                    dragend: (event) => {
                                                        setLatitude(event.target._latlng.lat);
                                                        setLongitude(event.target._latlng.lng);
                                                    },
                                                }}
                                            >
                                                <Popup>
                                                    Latitude: {latitude}, Longitude: {longitude}
                                                </Popup>
                                            </Marker>
                                        </MapContainer>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="latitude"
                                        label="latitude"
                                        value={latitude}
                                        onChange={(event) => setLatitude(event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="longitude"
                                        label="Longitude"
                                        value={longitude}
                                        onChange={(event) => setLongitude(event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        select
                                        helperText="Please select your time zone"
                                        id="timeZone"
                                        label="Time Zone"
                                        value={timeZone}
                                        onChange={(event) => setTimeZone(event.target.value)}
                                    >
                                        {timeZones.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        select
                                        helperText="Please select your currency"
                                        id="currency"
                                        label="Currency"
                                        value={currency}
                                        onChange={(event) => setCurrency(event.target.value)}
                                    >
                                        {currencies.map((option) => (
                                            <MenuItem key={option.label} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" color="primary" fullWidth>
                                        Edit
                                    </Button>
                                    <Button variant="outlined" color="secondary" fullWidth onClick={handleCancelEdit}>
                                        cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Paper>
            </Box>
        </Container >
    );
}

export default ManagerParkingDetails;
