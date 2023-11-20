import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getParking } from "../../actions/parkingActions";
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
import { getParkingSpotsByParkingId } from "../../actions/parkingSpotActions";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import {
    GET_PARKING_SPOT,
} from "../../actions/types";
import decodeToken from "../../utils/decodeToken";
import { getUser } from "../../actions/userActions";
import { toast } from "react-toastify";
import DroneMarker from "../../components/DroneMarker"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DroneTimeline from "../../components/DroneTimeline";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

function ParkingEditor(props) {
    const { parkingId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const parking = useSelector((state) => state.parkingReducer.parking);
    const parkingSpots = useSelector((state) => state.parkingSpotReducer);

    const userjson = JSON.parse(localStorage.getItem("user"));
    const user = decodeToken(userjson?.token);

    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);

    // mock list of drones for this parking, TODO add handling /api/drones/parking/{id} endpoint
    const mockDronesForParking = [3, 4]

    const [selectedDroneId, setSelectedDroneId] = useState(mockDronesForParking[0])
    const [dronePosition, setDronePosition] = useState([parking.latitude, parking.longitude])
    const [droneStage, setDroneStage] = useState(0)

    const processIncomingMessage = (recievedMessage) => {
        setMessages((messages) => [...messages, recievedMessage]);

        if (Object.hasOwn(recievedMessage, "lat")) {
            setDronePosition([recievedMessage.lat, recievedMessage.lon])
        }

        if (Object.hasOwn(recievedMessage, "type")) {
            switch (recievedMessage.type) {
                case 'stage':
                    setDroneStage(recievedMessage.stage)
            }
        }
    }

    const initStomp = () => {
        const socket = new SockJS(process.env.REACT_APP_WEBSOCKET_URL);
        const client = Stomp.over(socket);

        client.connect({ Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdHJpbmciLCJ1c2VySWQiOiIzIiwicm9sZSI6IlBBUktJTkdfTUFOQUdFUiIsImlhdCI6MTcwMDMyNDExMCwiZXhwIjoxNzAwMzI3NzEwfQ.yWDd7kILuEqLwGyuIfkEI0w562n4x6z3r2w4HT3xmLw" }, () => {
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
        return () => disposeSocket()
    }, []);


    const sendMessage = (message) => {
        const messageObject = {
            message: message,
        };
        stompClient.send('/app/messages', {}, JSON.stringify(messageObject));
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

        newStomp.connect({ Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdHJpbmciLCJ1c2VySWQiOiIzIiwicm9sZSI6IlBBUktJTkdfTUFOQUdFUiIsImlhdCI6MTcwMDMyNDExMCwiZXhwIjoxNzAwMzI3NzEwfQ.yWDd7kILuEqLwGyuIfkEI0w562n4x6z3r2w4HT3xmLw" }, () => {
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
        setDronePosition([0, 0])

        subscribeToDifferentSocket(event.target.value)
    };


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
                                <Typography variant='h4'>{parking.name}</Typography>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Drone</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={selectedDroneId}
                                        label="Drone"
                                        onChange={handleSelectDrone}
                                    >
                                        {mockDronesForParking.map(drone => <MenuItem value={drone}>{drone}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <DroneTimeline stageId={droneStage}/>
                            </CardContent>
                            <Grid container>
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
        </Container>
    );
}

export default ParkingEditor;