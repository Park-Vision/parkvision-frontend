import React, {useEffect, useState} from 'react';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PlaceIcon from '@mui/icons-material/Place';
import ListIcon from '@mui/icons-material/List';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import L from 'leaflet';
import SearchIcon from '@mui/icons-material/Search';
import {useDispatch, useSelector} from "react-redux";
import {getCars} from "../../actions/carActions";
import {getParkingFreeSpotsNumber, getParkingSpotsNumber, getParkings} from "../../actions/parkingActions";

import { useNavigate } from "react-router-dom";
import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet';
import {renderToString} from "react-dom/server";

export default function Home() {
    const parkings = useSelector(state => state.parkingReducer.parkings)
    useSelector(state => state.parkingReducer.parking = {})
    const dispatch = useDispatch()
    const authenticationReducer = useSelector((state) => state.authenticationReducer);
    const numOfSpotsList = useSelector(state => state.parkingReducer.numOfSpotsInParkings);
    const numOfFreeSpotsList = useSelector(state => state.parkingReducer.numOfFreeSpotsInParkings);
    const [showMap, setShowMap] = useState(false);
    const [filter, setFilter] = useState("");
    const [listOfParkings, setListOfParkings] = useState([]);
    let navigate = useNavigate();


    useEffect(() => {
        dispatch(getParkings()).then((response) => {
                response.map((parking, index) => {
                    dispatch(getParkingFreeSpotsNumber(parking.id, new Date().toISOString()))
                    dispatch(getParkingSpotsNumber(parking.id))
                })
            }
        ).catch((error) => {
            console.log(error);
        });
    }, []);

    useEffect(() => {
        if (parkings.length === 0) {
            dispatch(getParkings()).catch((error) => {
                console.log(error);
            });
        } else {
            setListOfParkings(parkings);
        }
    }, [dispatch, parkings])

    const handleChange = (event) => {
    };

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

    const handleChangeFilter = (event) => {
        setFilter(event.target.value);
        if (event.target.value === ""){
            setListOfParkings(parkings);
        }
    };

    const handleSubmitFilter = (event) => {
        event.preventDefault();
        const filterElements = filter.toLowerCase().split(" ");
        const filteredResults = parkings.filter(parking => {
            const parkingAddress = `${parking.name} ${parking.city} ${parking.street}`.toLowerCase();
            return filterElements.every(term => parkingAddress.includes(term));
        });
        console.log(filteredResults);
        setListOfParkings(filteredResults);
    }

    const parkingIcon = new L.DivIcon({
        html: renderToString(<LocalParkingIcon style={{ color: 'green', background: 'white', borderRadius: '4px',
            border: '2px solid black', fontSize: '27px' }} />),
        iconSize: [32, 32],
        className: 'custom-icon-class',
    });

    function ChangeView({ center, zoom }) {
        const map = useMap();
        map.setView(center, zoom);
        return null;
    }
    
    return (
        <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
            <div style={{ marginBottom: '20px' }}>
                <Grid container spacing={2} justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleShowList}
                        style={{ marginRight: '10px' }}
                        disabled={!showMap}
                    >
                        <ListIcon />
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleShowMap}
                        disabled={showMap}
                    >
                        <PlaceIcon />
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
                                            icon={parkingIcon}
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
                    <form onSubmit={handleSubmitFilter}>
                        <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
                            <Grid item>
                                <TextField
                                    id="input-with-icon-grid"
                                    label="Search for parking"
                                    variant="outlined"
                                    value={filter}
                                    onChange={handleChangeFilter}
                                    style={{ width: '300px' }}
                                />
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    disabled={!filter}
                                    style={{ height: '40px' }}
                                >
                                    Search
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                    <Grid container spacing={4} sx={{ mt: 4 }}>
                        {listOfParkings.map((parking, index) => (
                            <Grid item key={index} xs={12} sm={12} md={12}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'row', // Ensure the content and map are displayed side by side
                                    }}
                                    onClick={() => handleClick(parking.id)}
                                >
                                    <Grid item xs={6} sm={6} md={6} style={{ padding: '20px', paddingRight: 0 }}>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                {parking.name}
                                            </Typography>
                                             <Typography variant='h5'>Free: {numOfFreeSpotsList[parking.id]}</Typography>
                                             <Typography variant='h5'>All: {numOfSpotsList[parking.id]}</Typography>
                                            <Typography>Address: {parking.street}, {parking.zipCode} {parking.city}</Typography>
                                            <Typography>Open hours: {parking.openHours}</Typography>
                                            <Typography>$/h: {parking.costRate}</Typography>
                                            {/*<Typography>{[parking.latitude, parking.longitude]}</Typography>*/}
                                        </CardContent>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={6} style={{ margin: 10, padding: 10}}>
                                        <div style={{ height: '300px', margin: 0, padding: 0 }}>
                                            {parking.latitude && parking.longitude && (
                                                <MapContainer
                                                    style={{ width: '100%', height: '100%', borderRadius: '4px', margin: 0, padding: 0 }}
                                                    center={[parking.latitude, parking.longitude]}
                                                    zoom={18}
                                                    scrollWheelZoom={false}
                                                    zoomControl={false}
                                                    dragging={false}
                                                >
                                                    <ChangeView  center={[parking.latitude, parking.longitude]}
                                                                 zoom={18} ></ChangeView>
                                                    <TileLayer
                                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                        url="http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                                                    />
                                                </MapContainer>
                                            )}
                                        </div>
                                    </Grid>
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
