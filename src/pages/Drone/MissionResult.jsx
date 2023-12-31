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
import "../Editor/Editor.css"; // Create a CSS file for styling
import { useNavigate } from "react-router-dom";
import { MapContainer, Polygon, Popup, TileLayer, FeatureGroup, LayersControl } from "react-leaflet";
import { getParkingSpotsByParkingId, getFreeParkingSpotsByParkingId } from "../../redux/actions/parkingSpotActions";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import decodeToken from "../../utils/decodeToken";
import { getUser } from "../../redux/actions/userActions";
import { toast } from "react-toastify";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from "@mui/material/TableHead";
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { getDroneMission } from "../../redux/actions/droneMissionActions";
import { convertDate, convertDateToLocaleString } from "../../utils/convertDate";
import {
    GET_PARKING_SPOT,
    GET_FREE_PARKING_SPOTS_BY_PARKING_ID,
} from "../../redux/actions/types";

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});


function MissionResultComparison(props) {
    const { parkingId, missionId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const parking = useSelector((state) => state.parkingReducer.parking);
    const parkingSpots = useSelector((state) => state.parkingSpotReducer);
    const freeParkingSpots = useSelector((state) => state.parkingSpotReducer.freeParkingSpots);
    const occupiedParkingSpotsMap = useSelector(state => state.parkingSpotReducer.occupiedParkingSpots);
    const parkingSpot = useSelector((state) => state.parkingSpotReducer.parkingSpot);

    const userjson = JSON.parse(localStorage.getItem("user"));
    const user = decodeToken(userjson?.token);

    const [mission, setMission] = useState(0)

    const [openDialog, setOpenDialog] = useState(false);



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
                dispatch(getDroneMission(missionId)).then((response) => {
                    setMission(response);
                    dispatch(getFreeParkingSpotsByParkingId(parkingId, response.missionStartDate, response.missionEndDate));
                });
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

    const handleClickOnSelectedSpot = (event) => {
        dispatch({
            type: GET_PARKING_SPOT,
            value: {},
        });
        dispatch({
            type: GET_FREE_PARKING_SPOTS_BY_PARKING_ID,
            value: freeParkingSpots.concat(event),
        });
    };

    const handleOpenPopup = (event) => {
        setOpenDialog(true);
    }

    return (
        <Container
            maxWidth='xl'
            component="main" sx={{
                p: 3,
            }}
        >
            <Box >
                <Grid
                    container
                    spacing={2}
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
                                        {parkingSpots.parkingSpots && mission.missionSpotResultList && parkingSpots.parkingSpots
                                            .filter(
                                                (spot) => !freeParkingSpots.map((spot) => spot.id).includes(spot.id)
                                            )
                                            .map((parkingSpot) => (
                                                <Polygon
                                                    key={parkingSpot.id}
                                                    positions={parkingSpot.pointsDTO.map((point) => [
                                                        point.latitude,
                                                        point.longitude,
                                                    ])}
                                                    color={(mission.missionSpotResultList.find(x => x.parkingSpotDTO.id === parkingSpot.id)) ? (mission.missionSpotResultList.find(x => x.parkingSpotDTO.id === parkingSpot.id).occupied ? "red" : "orange") : "gray"}
                                                    interactive>
                                                    <Popup>
                                                        {(() => {
                                                            const spotResult = mission.missionSpotResultList.find(x => x.parkingSpotDTO.id === parkingSpot.id);
                                                            if (spotResult) {
                                                                const droneDetectedOccupied = spotResult.occupied;
                                                                if (!droneDetectedOccupied) {
                                                                    return `Spot ${parkingSpot.id} was supposed to be occupied, but drone detected it as free.`;
                                                                } else {
                                                                    return `Spot ${parkingSpot.id} was occupied according to reservation history.`;
                                                                }
                                                            }
                                                            else {
                                                                return `Spot was not visited.`;
                                                            }
                                                        })()}
                                                    </Popup>
                                                </Polygon>
                                            ))}
                                        //wolne miejsca
                                        {mission.missionSpotResultList && freeParkingSpots.map((spot, index) => (
                                            spot.id !== parkingSpots.parkingSpot.id && (
                                                <Polygon
                                                    key={index}
                                                    positions={spot.pointsDTO.map((point) => [
                                                        point.latitude,
                                                        point.longitude,
                                                    ])}
                                                    color={(mission.missionSpotResultList.find(x => x.parkingSpotDTO.id === spot.id)) ? (mission.missionSpotResultList.find(x => x.parkingSpotDTO.id === spot.id).occupied ? "yellow" : "green") : "gray"}
                                                >
                                                    <Popup>
                                                        {(() => {
                                                            const spotResult = mission.missionSpotResultList.find(x => x.parkingSpotDTO.id === spot.id);
                                                            if (spotResult) {
                                                                const droneDetectedOccupied = spotResult.occupied;
                                                                if (droneDetectedOccupied) {
                                                                    return `Spot ${spot.id} was supposed to be free, but drone detected it as occupied.`;
                                                                } else {
                                                                    return `Spot ${spot.id} was free according to reservation history.`;
                                                                }
                                                            }
                                                            else {
                                                                return `Spot was not visited.`;
                                                            }

                                                        })()}
                                                    </Popup>
                                                </Polygon>
                                            )
                                        ))}
                                    </FeatureGroup>
                                    <TileLayer
                                        maxNativeZoom={22}
                                        maxZoom={22}
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url='http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                                    />
                                    {parkingSpot && parkingSpot.id && (
                                        <Polygon
                                            positions={parkingSpot.pointsDTO.map((point) => [
                                                point.latitude,
                                                point.longitude,
                                            ])}
                                            color='orange'
                                            eventHandlers={{
                                                click: () => {
                                                    handleClickOnSelectedSpot(parkingSpot);
                                                },
                                                mouseover: (e) => {
                                                    e.target.openPopup();
                                                },
                                                mouseout: (e) => {
                                                    e.target.closePopup();
                                                },
                                            }}
                                            interactive
                                        >
                                        </Polygon>
                                    )}
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
                                <Typography variant='h4' fontWeight='bold'>Browsing mission #{mission.id}</Typography>
                                <Typography>Status - {mission.status}</Typography>
                                <Typography>Started - {convertDateToLocaleString(mission.missionStartDate)}</Typography>
                                <Typography>Finished - {convertDateToLocaleString(mission.missionEndDate)}</Typography>
                            </CardContent>
                            <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table">
                                    <TableHead
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">Spot id</TableCell>
                                        <TableCell component="th" scope="row">Spot name</TableCell>
                                        <TableCell align="right">Reservation</TableCell>
                                        <TableCell align="right">Mission result</TableCell>
                                    </TableHead>
                                    <TableBody>
                                        {parkingSpots.parkingSpots.map(spot =>
                                            <TableRow
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">{spot.id}</TableCell>
                                                <TableCell component="th" scope="row">{spot.spotNumber}</TableCell>
                                                <TableCell align="right">
                                                    {(freeParkingSpots && freeParkingSpots.some(freeSpot => freeSpot.id === spot.id)) ? "Free" : "Occupied"}
                                                </TableCell>
                                                <TableCell align="right">{mission ? ((mission.missionSpotResultList.find(x => x.parkingSpotDTO.id === spot.id) ? (mission.missionSpotResultList.find(x => x.parkingSpotDTO.id === spot.id).occupied ? "Occupied" : "Free") : "Not visited")) : "Unknown"}</TableCell>
                                            </TableRow>)}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default MissionResultComparison;