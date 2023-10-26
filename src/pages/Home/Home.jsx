// generate a home page thah will be under header component in app.js. Set a search field with button and list of movies
import React, {useEffect, useState} from 'react';

// use @mui/material
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import L from 'leaflet';


// use @mui/icons-material
import SearchIcon from '@mui/icons-material/Search';
import {useDispatch, useSelector} from "react-redux";
import {getCars} from "../../actions/carActions";
import {getParkings} from "../../actions/parkingActions";
import { useNavigate } from "react-router-dom";

import {MapContainer, Marker, Popup, TileLayer, ZoomControl} from 'react-leaflet';

export default function Home() {
    const parkings = useSelector(state => state.parkingReducer.parkings)
    useSelector(state => state.parkingReducer.parking = {})
    const dispatch = useDispatch()
    const authenticationReducer = useSelector((state) => state.authenticationReducer);
    const [showMap, setShowMap] = useState(true);

    useEffect(() => {
        dispatch(getParkings())
    }, []);

    // {
    //     "id": 2,
    //     "name": "D20 - Politechnika Wrocławska",
    //     "description": "Parking D20 to parking dla studentów i pracowników Politehcniki Wrocławskiej. Posiada 50 miejsc parkingowych, w tym 2 miejsca dla osób niepełnosprawnych. Parking jest monitorowany przez 24 godziny na dobę.",
    //     "city": "Wrocław",
    //     "street": "Janiszewskiego 8",
    //     "zipCode": "50-372",
    //     "costRate": 3,
    //     "openHours": "4:30 - 23:00",
    //     "latitude": 17.059114686292222,
    //     "longitude": 51.10975855141324
    // }
    const handleChange = (event) => {
    };

    let navigate = useNavigate();
    const handleClick = (event) => {
        navigate(`/parking/${event}`);
    }
    
    const handleSubmit = (event) => {
        console.log('search', event);
    };

    const handleShowMap = () => {
        setShowMap(true);
    };

    const handleShowList = () => {
        setShowMap(false);
    };

    const greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    
    return (
        <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
            <div style={{ marginBottom: '20px' }}>
                <Grid container spacing={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleShowMap}
                    style={{ marginRight: '10px' }}
                    disabled={showMap}

                >
                    Show Map
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleShowList}
                    disabled={!showMap}
                >
                    Show List
                </Button>
                </Grid>
            </div>

            {showMap ? (
                <div>
                    <Grid xs={12} sm={12} md={12}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <div style={{ height: '600px'}}>
                                <MapContainer
                                    style={{ width: '100%', height: '100%' }}
                                    zoom={12}
                                    center={[51.1000000, 17.0333300]}
                                    scrollWheelZoom={true}
                                    dragging={true}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    {parkings.map((parking, index) => (
                                        <Marker
                                            key={index}
                                            position={[parking.latitude, parking.longitude]}
                                            icon={greenIcon}
                                        >
                                            <Popup>
                                                <div style={{ minWidth: '200px', maxWidth: '250px', padding: '10px', textAlign: 'left' }}>
                                                    <div style={{ marginBottom: '5px', textAlign: 'center',
                                                        fontSize: `${Math.min(20, 450 / parking.name.length)}px`, fontWeight: 'bold',
                                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {parking.name}
                                                    </div>
                                                    <div style={{ marginBottom: '5px' }}>
                                                        <span style={{ fontWeight: 'bold' }}>Address:</span> {parking.street}, {parking.zipCode} {parking.city}
                                                    </div>
                                                    <div style={{ marginBottom: '5px' }}>
                                                        <span style={{ fontWeight: 'bold' }}>Open hours:</span> {parking.openHours}
                                                    </div>
                                                    <div style={{ marginBottom: '10px' }}>
                                                        <span style={{ fontWeight: 'bold' }}>$</span>/h: {parking.costRate}
                                                    </div>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleClick(parking.id)}
                                                        style={{ width: '100%' }}
                                                    >
                                                        MORE
                                                    </Button>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}

                                </MapContainer>
                            </div>

                        </Card>
                    </Grid>
                </div>
            ) : (
                <div>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Wyszukaj parking
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <SearchIcon />
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="input-with-icon-grid"
                                    label="Zacznij pisać nazwę parkingu"
                                    variant="standard"
                                    // value={}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    // disabled={}
                                >
                                    Szukaj
                                </Button>
                            </Grid>
                        </Grid>
                    </form>

                    <Grid container spacing={4} sx={{ mt: 4 }} >
                        {parkings.map((parking, index) => (
                            <Grid item key={index} xs={12} sm={12} md={12}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                    onClick={() => handleClick(parking.id)}
                                >
                                    <div style={{ height: '400px'}}>
                                        {parking.id && (
                                            <MapContainer
                                                style={{ width: '100%', height: '100%' }}
                                                center={[parking.latitude, parking.longitude]}
                                                zoom={18}
                                                scrollWheelZoom={false}
                                                zoomControl={false}
                                                dragging={false}
                                            >

                                                <TileLayer
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                    url="http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                                                />

                                            </MapContainer>
                                        )}
                                    </div>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {parking.name}
                                        </Typography>
                                        <Typography>Address:{parking.street},{parking.zipCode} {parking.city}</Typography>
                                        <Typography>Open hours: {parking.openHours}</Typography>
                                        <Typography>$/h: {parking.costRate}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            )}


        </Box>
        </Container>
    );
    }