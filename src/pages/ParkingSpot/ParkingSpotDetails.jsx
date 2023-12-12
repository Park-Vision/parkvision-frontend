import { useNavigate, useParams } from 'react-router-dom';
import { Container, Box, Typography, Paper, CardContent, TextField, Button, CircularProgress, RadioGroup, Grid, Switch } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, FeatureGroup, Polygon, Popup } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import { addReservation } from '../../redux/actions/reservationActions';
import { toast } from "react-toastify";
import { useState, useRef, useEffect } from 'react';
import L from "leaflet";
import { getParkingSpot, updateParkingSpot, deleteParkingSpotSoft } from '../../redux/actions/parkingSpotActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import decodeToken from '../../utils/decodeToken';
import { getUser } from '../../redux/actions/userActions';
import { GradientButton } from '../../components/GradientButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
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

    const userjson = JSON.parse(localStorage.getItem("user"));
    const user = decodeToken(userjson?.token);

    useEffect(() => {
        const checkAuthorization = async () => {
            if (user && user.role === "PARKING_MANAGER") {
                const userResponse = await dispatch(getUser(user.userId));
                const parkingSpotResponse = await dispatch(getParkingSpot(params.parkingSpotId));
                if (userResponse.parkingDTO.id !== parkingSpotResponse.parkingDTO.id) {
                    toast.error("You are not authorized to view this page!");
                    navigate('/');
                }
            } else {
                toast.error("You are not authorized to view this page!");
                navigate('/');
            }
        }
        checkAuthorization();
    }, [])


    const mapPonitsToParkingSpot = (points) => {
        const mappedPoints = points[0].map((coord) => {
            console.log(coord);
            return { latitude: coord[1], longitude: coord[0], id: coord[2] };
        });

        mappedPoints.pop();
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
        //TODO what if notjing changed?
        const editedParkingSpot = {
            id: parkingSpotReducer.parkingSpot.id,
            spotNumber: parkingSpotReducer.parkingSpot.spotNumber,
            occupied: parkingSpotReducer.parkingSpot.occupied,
            active: parkingSpotReducer.parkingSpot.active,
            parkingDTO: parkingSpotReducer.parkingSpot.parkingDTO,
            pointsDTO: parkingSpotReducer.parkingSpot.pointsDTO
        }

        dispatch(updateParkingSpot(editedParkingSpot)).then(() => {
            dispatch({
                type: 'GET_PARKING_SPOT',
                value: editedParkingSpot
            })
            toast.success("Parking spot updated successfully!");
            navigate('/parking/' + parkingSpotReducer.parkingSpot.parkingDTO.id + '/editor')
        });
    };

    const handleDelete = () => {
        dispatch(deleteParkingSpotSoft(parkingSpotReducer.parkingSpot.id))
            .then(() => {
                toast.success("Parking spot deleted successfully!");
                navigate('/parking/' + parkingSpotReducer.parkingSpot.parkingDTO.id + '/editor');
            })
            .catch((error) => {
                toast.error("Parking spot cannot be deleted because there are reservations on it!");
                dispatch(getParkingSpot(params.parkingSpotId));
            });
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
                            <IconButton onClick={handleExitClick}>
                                <ArrowBackIcon />
                            </IconButton>
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
                                                    edit: false, // for now its disabled
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
                                                    color={parkingSpotReducer.parkingSpot.active ? "blue" : "#474747"}
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
                                    <FormControlLabel control={
                                        <Switch
                                            checked={parkingSpotReducer.parkingSpot.active}
                                            onChange={(event) => {
                                                const newValue = event.target.checked;
                                                setActive(newValue);
                                            }}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                    }
                                        label="Active" />
                                </FormControl>
                                <GradientButton sx={{ m: 1 }} variant='contained' onClick={handleEditInfo} fullWidth>
                                    Confirm
                                </GradientButton>
                                <Button sx={{ m: 1 }}
                                    variant="contained"
                                    onClick={handleDelete}
                                    fullWidth disabled={parkingSpotReducer.parkingSpot.active}
                                    color='error'
                                >
                                    Delete
                                </Button>
                            </Grid>

                        </CardContent>
                    </Paper>
                )}
            </Box>
        </Container>
    )
}