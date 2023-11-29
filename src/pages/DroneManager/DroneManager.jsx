import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getParking } from "../../redux/actions/parkingActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "../Editor.css"; // Create a CSS file for styling
import { useNavigate } from "react-router-dom";
import Stomp, { setInterval } from 'stompjs';
import SockJS from 'sockjs-client';
import { MapContainer, Polygon, Popup, TileLayer, FeatureGroup, LayersControl } from "react-leaflet";
import { getParkingSpotsByParkingId } from "../../redux/actions/parkingSpotActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from "@mui/material/CircularProgress";
import {
    GET_PARKING_SPOT,
} from "../../redux/actions/types";
import decodeToken from "../../utils/decodeToken";
import { getUser } from "../../redux/actions/userActions";
import { commandDrone, getDronesByParkingId } from "../../redux/actions/droneActions";
import { toast } from "react-toastify";
import DroneMarker from "../../components/DroneMarker"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DroneTimeline from "../../components/DroneTimeline";
import CreateDronePopup from "../../components/CreateDronePopup";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

const BATTERY_CELL_COUNT = 3
const MINIMUM_CELL_VOLTAGE = 3200
const MILIVOLT_TO_PERCENT = 10
const DISPLAY_DECIMAL_DIGITS = 2

function ParkingEditor(props) {
    const { parkingId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const parking = useSelector((state) => state.parkingReducer.parking);
    const parkingSpots = useSelector((state) => state.parkingSpotReducer);

    const userjson = JSON.parse(localStorage.getItem("user"));
    const user = decodeToken(userjson?.token);

    const [stompClient, setStompClient] = useState(null);

    // Drones assigned to this parking
    const [availableDrones, setAvailableDrones] = useState([])

    const [selectedDroneId, setSelectedDroneId] = useState(0)
    const [dronePosition, setDronePosition] = useState([0, 0, 0])
    const [droneStage, setDroneStage] = useState(0)
    const [droneBatteryPercentage, setDroneBatteryPercentage] = useState(0)
    const [droneSatellites, setDroneSatellites] = useState(0)

    const [openDialog, setOpenDialog] = useState(false);

    const calculateBatteryPercentage = (voltage) => {
        return ((voltage / BATTERY_CELL_COUNT - MINIMUM_CELL_VOLTAGE) / MILIVOLT_TO_PERCENT).toFixed(DISPLAY_DECIMAL_DIGITS)
    }

    const processIncomingMessage = (recievedMessage) => {
        // Parkvision specific messages
        if (Object.hasOwn(recievedMessage, "type")) {
            switch (recievedMessage.type) {
                case 'stage':
                    setDroneStage(recievedMessage.stage)
            }
        }

        // Generic mavlink messages
        else if (Object.hasOwn(recievedMessage, "mavpackettype")) {
            switch (recievedMessage.mavpackettype) {
                case 'SYS_STATUS':
                    setDroneBatteryPercentage(calculateBatteryPercentage(recievedMessage.voltage_battery))
                    break
                case 'GPS_RAW_INT':
                    setDroneSatellites(recievedMessage.satellites_visible)
                    break
            }
        }

        // Albatros specific messages
        else if (Object.hasOwn(recievedMessage, "lat")) {
            setDronePosition([recievedMessage.lat, recievedMessage.lon, recievedMessage.alt.toFixed(DISPLAY_DECIMAL_DIGITS)])
        }
    }

    const initStomp = () => {
        const socket = new SockJS(process.env.REACT_APP_WEBSOCKET_URL);
        const client = Stomp.over(socket);

        client.connect({ Authorization: "Bearer " + JSON.parse(localStorage.getItem("user"))?.token }, () => {
            client.subscribe('/topic/drones/' + selectedDroneId, (message) => {
                processIncomingMessage(JSON.parse(message.body))
            });
        }, (error) => {
            console.log(error);
        }
        );

        setStompClient(client);

        setInterval(() => {
            if (stompClient !== null) {
                // sendMessage();
            }
        }, 1000);
    }

    useEffect(() => {
        initStomp()
        dispatch(getParking(parkingId)).then((response) => {
            setDronePosition([response.latitude, response.longitude, 0]);
        });
        refreshDrones()
        return () => disposeSocket()
    }, []);

    const refreshDrones = () => {
        dispatch(getDronesByParkingId(parkingId)).then((response) => {
            setAvailableDrones(response);
        });
    }

    const disposeSocket = () => {
        if (stompClient) {
            stompClient.disconnect();
            setStompClient(null);
        }
    };

    const subscribeToDifferentSocket = (desiredDroneId) => {
        disposeSocket();

        const newSocket = new SockJS(process.env.REACT_APP_WEBSOCKET_URL);
        const newStomp = Stomp.over(newSocket);

        newStomp.connect({ Authorization: "Bearer " + JSON.parse(localStorage.getItem("user"))?.token }, () => {
            newStomp.subscribe('/topic/drones/' + desiredDroneId, (message) => {
                processIncomingMessage(JSON.parse(message.body))
            });
            setStompClient(newStomp);

        }, (error) => {
            console.log(error);
        });

    };

    useEffect(() => {
        const checkAuthorization = async () => {
            if (user && user.role === "PARKING_MANAGER") {
                const userResponse = await dispatch(getUser(user.userId));
                let parkingResponse;
                try {
                    parkingResponse = await dispatch(getParking(parkingId));
                }
                catch (error) {
                    toast.error("You are not authorized to view this page!");
                    navigate('/');
                    return;
                }
                if (userResponse.parkingDTO.id !== parkingResponse.id) {
                    toast.error("You are not authorized to view this page!");
                    navigate('/');
                }
                dispatch(getParkingSpotsByParkingId(parkingId));
                unsetParkingSpot();
            } else {
                toast.error("You are not authorized to view this page!");
                navigate('/');
            }
        }
        checkAuthorization();
    }, []);


    const unsetParkingSpot = () => {
        dispatch({
            type: GET_PARKING_SPOT,
            value: {},
        });
    };

    const handleExitClick = () => {
        navigate(`/parking/${parking.id}`);
    };

    const handleSelectDrone = (event) => {
        setSelectedDroneId(event.target.value);
        setDronePosition([0, 0, 0])
        setDroneStage(0)

        subscribeToDifferentSocket(event.target.value)
    };

    const handleStart = (event) => {
        dispatch(commandDrone(selectedDroneId, "start"))
            .catch((error) => {
                console.log(error);
            });
    }

    const handleStop = (event) => {
        dispatch(commandDrone(selectedDroneId, "stop"))
            .catch((error) => {
                console.log(error);
            });
    }
    const handleOpenPopup = (event) => {
        setOpenDialog(true);
    }

    return (
        <Container
            maxWidth='xl'
            style={{ height: "97%" }}
        >
            <Box sx={{ my: 4, height: "100%" }}>
                <Grid
                    container
                    spacing={2}
                    style={{ height: "100%" }}
                >
                    <Grid
                        item
                        xs={12}
                        lg={8}
                    >
                        <div className='map-container'>
                            {parking.latitude && parking.longitude ? (
                                <MapContainer
                                    style={{ width: "100%", height: "100%" }}
                                    center={[parking.latitude, parking.longitude]}
                                    zoom={20}
                                    scrollWheelZoom={true}
                                >
                                    <FeatureGroup>
                                        {parkingSpots.parkingSpots
                                            .map((spot) => (
                                                <Polygon
                                                    key={spot.id}
                                                    positions={spot.pointsDTO.map((point) => [
                                                        point.latitude,
                                                        point.longitude,
                                                    ])}
                                                    color={spot.active ? "blue" : "#474747"}
                                                >
                                                    <Popup>
                                                        <div style={{ minWidth: '200px', maxWidth: '250px', padding: '10px', textAlign: 'left' }}>
                                                            <div style={{
                                                                marginBottom: '5px', textAlign: 'center',
                                                                fontSize: `${Math.min(20, 450 / parking.name.length)}px`, fontWeight: 'bold',
                                                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                                            }}>
                                                                Spot: {spot.id}
                                                            </div>
                                                            <div style={{ marginBottom: '5px' }}>
                                                                <span style={{ fontWeight: 'bold' }}>Spot number:</span> {spot.spotNumber}
                                                            </div>
                                                        </div>
                                                    </Popup>
                                                </Polygon>
                                            ))}
                                    </FeatureGroup>
                                    <LayersControl position="topright">
                                        <LayersControl.BaseLayer checked name="OpenStreetMap">
                                            <TileLayer
                                                maxNativeZoom={22}
                                                maxZoom={22}
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                url='http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                                            />
                                        </LayersControl.BaseLayer>
                                        <DroneMarker position={[dronePosition[0] / 10e6, dronePosition[1] / 10e6]} />
                                    </LayersControl>


                                </MapContainer>
                            ) : (
                                <Box
                                    sx={{
                                        display: "flex",
                                        "align-content": "center",
                                        "justify-content": "center",
                                        "flex-direction": "row",
                                        "flex-wrap": "wrap",
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
                        lg={4}
                    >
                        <Paper className='reserve'>
                            <CardContent>
                                <Typography variant='h4' fontWeight='bold'>{parking.name}</Typography>
                                <Grid container spacing={2}>
                                    <Grid item
                                        xs={10}>
                                        <FormControl fullWidth sx={{ mt: 1 }}>
                                            <InputLabel id="drone-select-label">Drone</InputLabel>
                                            <Select
                                                labelId="drone-select-label"
                                                id="drone-select"
                                                value={selectedDroneId}
                                                label="Drone"
                                                onChange={handleSelectDrone}
                                            >
                                                {availableDrones.map(drone => <MenuItem value={drone.id}>{drone.id} - {drone.name}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2} fullWidth>
                                        <Box display="flex" justifyContent="center" alignItems="center" height="100%"> {/* Center the IconButton */}
                                            <IconButton
                                                size="large"
                                                variant="outlined"
                                                color="secondary"
                                                onClick={handleOpenPopup}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <DroneTimeline stageId={droneStage} />
                                <TableContainer component={Paper}>
                                    <Table size="small" aria-label="a dense table">
                                        <TableBody>
                                            <TableRow
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">{"Altitude"}</TableCell>
                                                <TableCell align="right">{dronePosition[2]} m</TableCell>
                                            </TableRow>
                                            <TableRow
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">{"Gps satellites visible"}</TableCell>
                                                <TableCell align="right">{droneSatellites}</TableCell>
                                            </TableRow>
                                            <TableRow
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">{"Battery percentage"}</TableCell>
                                                <TableCell align="right">{droneBatteryPercentage} %</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                            <Grid container>
                                <Button
                                    sx={{ m: "5%", width: "40%" }}
                                    variant='contained'
                                    color="secondary"
                                    onClick={handleStart}
                                >
                                    Start Mission
                                </Button>
                                <Button
                                    sx={{ m: "5%", width: "40%" }}
                                    variant='contained'
                                    color="error"
                                    onClick={handleStop}
                                >
                                    Emergency stop
                                </Button>
                                <Button
                                    sx={{ m: 1 }}
                                    variant='contained'
                                    onClick={handleExitClick}
                                    fullWidth
                                >
                                    Exit drone manager
                                </Button>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
            <CreateDronePopup open={openDialog}
                setOpen={setOpenDialog}
                refreshDrones={refreshDrones}
                parkingId={parkingId} />
        </Container>
    );
}

export default ParkingEditor;