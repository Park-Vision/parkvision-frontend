import React, {useDebugValue, useEffect, useRef} from "react";
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
import {getParkingSpotsByParkingId} from "../../actions/parkingSpotActions";

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
    console.log(parkingId)
    const dispatch = useDispatch()

    const [value, setValue] = React.useState(dayjs('2022-04-17'));


    const parking = useSelector(state => state.parkingReducer.parking)

    const parkingSpots = useSelector(state => state.parkingSpotReducer)

    useEffect(() => {
        dispatch(getParking(parkingId))
        dispatch(getParkingSpotsByParkingId(parkingId))
    }, []);

    const mapRef = useRef(null);


    const _created = (e) => {
        console.log(e.layer.toGeoJSON());
    }

    return (
        <Container maxWidth="xl" style={{ height: "97%"}}>
            <Box sx={{ my: 4, height: '100%'}}>
            <Grid container spacing={2} style={{ height: "100%"}}>
            {/* Map Section */}
            <Grid item xs={12} md={8}>
                <div className="map-container">
                    {parking &&(
                        <MapContainer
                            style={{ width: '100%', height: '100%' }}
                            center={[51.11844650799615, 16.990214186484888]}
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
                                {parkingSpots.parkingSpots.map((parkingSpot, index) => (
                                        <Polygon
                                            positions={parkingSpot.pointsDTO.map((point) => [
                                                point.latitude,
                                                point.longitude,
                                            ])}
                                            color="blue"
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
                    )}
                </div>

            </Grid>
            <Grid item xs={12} md={4}>
                <Paper>
                    <CardContent >
                        <Typography variant="h4">{parking.name}</Typography>
                        <Typography variant='p'>{parking.description}</Typography>
                        <Typography variant='h6'>Adress: {parking.address}</Typography>
                        <Typography>$/h: {parking.costRate}</Typography>
                        <Typography>Open hours: {parking.openHours}</Typography>
                    </CardContent>
                </Paper>
                <Paper>
                    <CardContent >
                        <Typography variant="h5">Select date and time:</Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar />
                            <DateCalendar />
                            <DigitalClock />
                            <DigitalClock />
                        </LocalizationProvider>

                    </CardContent>
                </Paper>
            </Grid>
        </Grid>
            </Box>
        </Container>
    );
}

export default ParkingDetails;

