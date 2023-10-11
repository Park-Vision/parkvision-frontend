import React, {useDebugValue, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getCars} from "../../actions/carActions";
import {getParking} from "../../actions/parkingActions";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {useParams} from "react-router-dom";
import {Paper} from "@mui/material";
import Grid from "@mui/material/Grid";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import "leaflet/dist/leaflet.css";
import L from "leaflet";


import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet'


function ParkingDetails(props) {
    const {parkingId} = useParams()
    console.log(parkingId)
    const dispatch = useDispatch()

    //TODO cleanup and get parkings spots and reservations

    const parking = useSelector(state => state.parkingReducer.parking)

    useEffect(() => {
        dispatch(getParking(parkingId))
    }, []);

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
        <Grid container spacing={2}>
            {/* Title Section */}
            <Grid item xs={12}>
                <Typography variant="h4">{parking.name}</Typography>
            </Grid>

            {/* Map Section */}
            <Grid item xs={12} md={8}>
                <div style={{ height: '80vh'}}>
                    <MapContainer style={{ width: "100%", height: "100%" }}
                        center={[51.11844650799615, 16.990214186484888]} zoom={21} scrollWheelZoom={false}>
                        <TileLayer
                            maxNativeZoom={19}
                            maxZoom={21}
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                        />
                        {/*<Marker position={[51.505, -0.09]}>*/}
                        {/*    <Popup>*/}
                        {/*        A pretty CSS3 popup. <br /> Easily customizable.*/}
                        {/*    </Popup>*/}
                        {/*</Marker>*/}
                    </MapContainer>
                </div>

            </Grid>
            <Grid item xs={12} md={4}>
                <Paper>
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant='h4'>{parking.description}</Typography>
                        <Typography variant='h5'>Adress: {parking.address}</Typography>
                        <Typography>$/h: {parking.costRate}</Typography>
                        <Typography>Open hours: {parking.openHours}</Typography>
                    </CardContent>
                </Paper>
            </Grid>
        </Grid>
            </Box>
        </Container>
    );
}

export default ParkingDetails;

