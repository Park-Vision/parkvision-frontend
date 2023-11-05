import { useNavigate, useParams } from 'react-router-dom';
import { Container, Box, Typography, Paper, CardContent, TextField, Button, CircularProgress, RadioGroup, Grid} from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, FeatureGroup, Polygon, Popup } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import { addReservation } from '../../actions/reservationActions';
import { toast } from "react-toastify";
import { useState, useRef, useEffect } from 'react';
import L from "leaflet";
import { getParkingSpot, updateParkingSpot } from '../../actions/parkingSpotActions';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

export default function ParkingSpotDetails(props) {
    const parking = useSelector(state => state.parkingReducer.parking);
    const parkingSpotReducer = useSelector(state => state.parkingSpotReducer);
    const navigate = useNavigate();
    const mapRef = useRef(null);
    const dispatch = useDispatch()
    const params = useParams();

    useEffect(() => {
        dispatch(getParkingSpot(params.parkingSpotId));
    }, [])


    const mapPonitsToParkingSpot = (points) => {
        const mappedPoints = points[0].map((coord) => {
            console.log(coord);
            return { latitude: coord[1], longitude: coord[0], id: coord[2] };
        });

        mappedPoints.pop();
        console.log(mappedPoints);
        const pointsDTO = mappedPoints.map((point) => {
            return {
                id: point.id,
                latitude: point.latitude,
                longitude: point.longitude,
                parkingSpotDTO: {
                    id: parking.id
                }
            }
        }
        );

        const editedParkingSpot = {
            id: parkingSpotReducer.parkingSpot.id,
            spotNumber: parkingSpotReducer.parkingSpot.spotNumber,
            occupied: parkingSpotReducer.parkingSpot.occupied,
            active: parkingSpotReducer.parkingSpot.active,
            parkingDTO: {
                id: parkingSpotReducer.parkingSpot.parkingDTO.id
            },
            pointsDTO: pointsDTO
        }

        console.log(editedParkingSpot);

        dispatch(updateParkingSpot(editedParkingSpot)).then(() => {
            dispatch(getParkingSpot(params.parkingSpotId));
        }
        );
    };

    const setSpotNumber = (spotNumber) => {
        const editedParkingSpot = {
            id: parkingSpotReducer.parkingSpot.id,
            spotNumber: spotNumber,
            occupied: parkingSpotReducer.parkingSpot.occupied,
            active: parkingSpotReducer.parkingSpot.active,
            parkingDTO: parkingSpotReducer.parkingSpot.parkingDTO,
            pointsDTO: parkingSpotReducer.parkingSpot.pointsDTO
        }

        dispatch({
            type: 'GET_PARKING_SPOT',
            value: editedParkingSpot
        })
    };

    const setOccupied = (occupied) => {
        const editedParkingSpot = {
            id: parkingSpotReducer.parkingSpot.id,
            spotNumber: parkingSpotReducer.parkingSpot.spotNumber,
            occupied: occupied,
            active: parkingSpotReducer.parkingSpot.active,
            parkingDTO: parkingSpotReducer.parkingSpot.parkingDTO,
            pointsDTO: parkingSpotReducer.parkingSpot.pointsDTO
        }

        dispatch({
            type: 'GET_PARKING_SPOT',
            value: editedParkingSpot
        })
    };

    const setActive = (active) => {
        const editedParkingSpot = {
            id: parkingSpotReducer.parkingSpot.id,
            spotNumber: parkingSpotReducer.parkingSpot.spotNumber,
            occupied: parkingSpotReducer.parkingSpot.occupied,
            active: active,
            parkingDTO: parkingSpotReducer.parkingSpot.parkingDTO,
            pointsDTO: parkingSpotReducer.parkingSpot.pointsDTO
        }

        dispatch({
            type: 'GET_PARKING_SPOT',
            value: editedParkingSpot
        })
    };

    const handleExitClick = () => {
        navigate(`/parking/${parkingSpotReducer.parkingSpot.parkingDTO.id}/editor`);
    };

    const handleEditInfo = () => {

        const editedParkingSpot = {
            id: parkingSpotReducer.parkingSpot.id,
            spotNumber: parkingSpotReducer.parkingSpot.spotNumber,
            occupied: parkingSpotReducer.parkingSpot.occupied,
            active: parkingSpotReducer.parkingSpot.active,
            parkingDTO: parkingSpotReducer.parkingSpot.parkingDTO,
            pointsDTO: parkingSpotReducer.parkingSpot.pointsDTO
        }

        dispatch(updateParkingSpot(editedParkingSpot));
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Parking spot details
                </Typography>
                {parkingSpotReducer.parkingSpot.id && (
                    <Paper>
                        <CardContent>
                            <Grid container>
                                <Button sx={{ m: 1 }} variant='contained' onClick={handleExitClick} fullWidth>
                                    Go to editor
                                </Button>
                            </Grid>
                            <div style={{ height: '500px' }}>
                                {parkingSpotReducer.parkingSpot.id && (
                                    <MapContainer
                                        style={{ width: '100%', height: '100%' }}
                                        center={[parkingSpotReducer.parkingSpot.pointsDTO[0].latitude, parkingSpotReducer.parkingSpot.pointsDTO[0].longitude]}
                                        zoom={21}
                                        scrollWheelZoom={true}
                                        ref={mapRef}
                                    >
                                        <FeatureGroup
                                            ref={mapRef}
                                        >
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
                                                    edit: true,
                                                    remove: false,
                                                    featureGroup: mapRef.current?.leafletElement,
                                                }}
                                                onEdited={e => {
                                                    e.layers.eachLayer(a => {
                                                        mapPonitsToParkingSpot(a.toGeoJSON().geometry.coordinates);
                                                    });
                                                }}
                                            />
                                            {parkingSpotReducer.parkingSpot && parkingSpotReducer.parkingSpot.id && (
                                                <Polygon
                                                    key={Math.random()} // this is on purpose, to force rerendering
                                                    positions={parkingSpotReducer.parkingSpot.pointsDTO.map((point) => [
                                                        point.latitude,
                                                        point.longitude,
                                                        point.id
                                                    ])}
                                                    color='blue'
                                                >
                                                </Polygon>
                                            )}
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
                            <Grid container>
                            <TextField sx={{ m: 1 }} fullWidth
                                value={`${parkingSpotReducer.parkingSpot.parkingDTO.name}, ${parkingSpotReducer.parkingSpot.parkingDTO.street}, ${parkingSpotReducer.parkingSpot.parkingDTO.city}`}
                                id="outlined-basic"
                                label="Parking name"
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <TextField sx={{ m: 1 }} fullWidth
                                value={parkingSpotReducer.parkingSpot.id}
                                label="Parking spot id"
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <TextField sx={{ m: 1 }} fullWidth
                                value={parkingSpotReducer.parkingSpot.spotNumber}
                                InputLabelProps={{ shrink: true }}
                                onChange={(event) => setSpotNumber(event.target.value)}
                                label="Parking spot number"
                                variant="outlined"
                            />
                            <FormControl sx={{ m: 1 }} fullWidth>
                                <FormLabel id="demo-radio-buttons-group-label">Active</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    value={parkingSpotReducer.parkingSpot.active.toString()}
                                    name="radio-buttons-group"
                                    onChange={(event) => {
                                        const newValue = event.target.value === "true";
                                        setActive(newValue);
                                    }}
                                >
                                    <FormControlLabel value="true" control={<Radio />} label="Active" />
                                    <FormControlLabel value="false" control={<Radio />} label="Disabled" />
                                </RadioGroup>
                            </FormControl>
                            <FormControl sx={{ m: 1 }} fullWidth>
                                <FormLabel id="demo-radio-buttons-group-label">Occupied</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    value={parkingSpotReducer.parkingSpot.occupied.toString()}
                                    name="radio-buttons-group"
                                    onChange={(event) => {
                                        const newValue = event.target.value === "true";
                                        setOccupied(newValue);
                                    }}
                                >
                                    <FormControlLabel value="true" control={<Radio />} label="Occupied" />
                                    <FormControlLabel value="false" control={<Radio />} label="Free" />
                                </RadioGroup>
                            </FormControl>

                            <Button sx={{ m: 1 }} variant='contained' onClick={handleEditInfo} fullWidth>
                                Edit
                            </Button>
                            </Grid>

                        </CardContent>
                    </Paper>
                )}
            </Box>
        </Container>
    )
}