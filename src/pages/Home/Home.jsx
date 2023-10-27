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
import {getParkings} from "../../actions/parkingActions";
import { useNavigate } from "react-router-dom";
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import {renderToString} from "react-dom/server";

export default function Home() {
    const parkings = useSelector(state => state.parkingReducer.parkings)
    useSelector(state => state.parkingReducer.parking = {})
    const dispatch = useDispatch()
    const authenticationReducer = useSelector((state) => state.authenticationReducer);
    const [showMap, setShowMap] = useState(false);
    const [filter, setFilter] = useState("");
    const [listOfParkings, setListOfParkings] = useState([]);


    useEffect(() => {
        dispatch(getParkings());
        setListOfParkings(parkings);
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

    const handleChangeFilter = (event) => {
        setFilter(event.target.value);
        if (event.target.value === ""){
            setListOfParkings(parkings);
        }
    };

    const handleSubmitFilter = (event) => {
        event.preventDefault();
        const result = [];
        const filterElements = filter.toLowerCase().split(" ");
        const filteredResults = parkings.filter(parking => {
            const parkingAddress = (parking.name + " " + parking.city + " " + parking.street).toLowerCase();
            let termCount = 0;
            for (let term of filterElements) {
                if (parkingAddress.includes(term)) {
                    termCount++;
                }
            }
            result.push(
                {
                    parking: parking,
                    termCount: termCount
                }
            )
        });
        console.log(result);
        const maxTermCount = result
            .reduce((max, current) => Math.max(max, current.termCount), 0);
        const parkingsWithMaxTermCount = result
            .filter(item => item.termCount === maxTermCount)
            .map(item => item.parking);
        console.log(parkingsWithMaxTermCount);
        setListOfParkings(parkingsWithMaxTermCount);
    }

    const parkingIcon = new L.DivIcon({
        html: renderToString(<LocalParkingIcon style={{ color: 'green', background: 'white', borderRadius: '4px',
            border: '2px solid black', fontSize: '27px' }} />),
        iconSize: [32, 32],
        className: 'custom-icon-class',
    });
    
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
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <SearchIcon />
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="input-with-icon-grid"
                                    label="Zacznij pisać nazwę parkingu"
                                    variant="standard"
                                    value={filter}
                                    onChange={handleChangeFilter}
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" type="submit" disabled={!filter}>
                                    Szukaj
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
                                            <Typography>Address: {parking.street}, {parking.zipCode} {parking.city}</Typography>
                                            <Typography>Open hours: {parking.openHours}</Typography>
                                            <Typography>$/h: {parking.costRate}</Typography>
                                        </CardContent>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={6} style={{ margin: 10, padding: 10}}>
                                        <div style={{ height: '300px', margin: 0, padding: 0 }}>
                                            {parking.id && (
                                                <MapContainer
                                                    style={{ width: '100%', height: '100%', borderRadius: '4px', margin: 0, padding: 0 }}
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
