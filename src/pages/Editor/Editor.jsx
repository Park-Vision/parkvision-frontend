import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getParking } from "../../redux/actions/parkingActions";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";
import "./Editor.css";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { MapContainer, Polygon, Popup, TileLayer, FeatureGroup } from "react-leaflet";
import { getParkingSpotsByParkingId, addParkingSpot, updateParkingSpot, getParkingSpot } from "../../redux/actions/parkingSpotActions";
import CircularProgress from "@mui/material/CircularProgress";
import { GET_PARKING_SPOT } from "../../redux/actions/types";
import decodeToken from "../../utils/decodeToken";
import { getUser } from "../../redux/actions/userActions";
import { toast } from "react-toastify";
import 'leaflet-path-drag'
import { areParkingSpotsColliding, getArea, isSpotAreaTooBig, isSpotAreaTooSmall } from "../../utils/parkingUtils";
import { GradientButton } from "../../components/GradientButton";
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

export default function ParkingEditor(props) {
    const { parkingId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const parking = useSelector((state) => state.parkingReducer.parking);
    const parkingSpots = useSelector((state) => state.parkingSpotReducer.parkingSpots);
    const stagedParkingSpots = useSelector((state) => state.parkingSpotReducer.stagedParkingSpots);
    const [drag, setDrag] = React.useState(false);
    const maximalDragDistance = process.env.REACT_APP_MAXIMAL_DRAG
    const minimalArea = process.env.REACT_APP_MINIMAL_AREA
    const maximalArea = process.env.REACT_APP_MAXIMAL_AREA

    const userjson = JSON.parse(localStorage.getItem("user"));
    const user = decodeToken(userjson?.token);

    const mapRef = useRef();
    const polygonRef = useRef();

    var editableLayers = new L.FeatureGroup();

    useEffect(() => {
        const fetchData = async () => {
            if (user && user.role === "PARKING_MANAGER") {
                await dispatch(getParkingSpotsByParkingId(parseInt(parkingId)));
                let parking = await dispatch(getParking(parseInt(parkingId)));
                let manager = await dispatch(getUser(user.userId));
                if (parking.id !== manager.parkingDTO.id) {
                    toast.error('You are not authorized to edit this parking!');
                    navigate('/');
                }
            } else {
                toast.error('You are not authorized to edit this parking!');
                navigate('/');
            }
        }
        fetchData();
    }, []);


    const toggleDrag = (value) => {
        setDrag(value);
    };

    const clearLayerWithNoIds = () => {
        const map = mapRef.current;
        map.eachLayer((layer) => {
            if (layer instanceof L.FeatureGroup) {
                layer.eachLayer((polyObject) => {
                    if (polyObject.options.id === undefined) {
                        polyObject.remove();
                    }
                });
            }
        });
    };

    const handleExitClick = () => {
        navigate(`/parking/${parking.id}`);
    };


    const populateValidSpot = (spot, pointsDTO) => ({
        id: spot.id,
        spotNumber: spot.spotNumber,
        active: spot.active,
        parkingDTO: { id: parking.id },
        pointsDTO,
    });


    const _onEdited = (e) => {
        const editedLayers = e.layers.getLayers();
        const allSpots = [...parkingSpots, ...stagedParkingSpots];
        const map = mapRef.current;
        const list = [];

        map.eachLayer((layer) => {
            if (layer instanceof L.FeatureGroup) {
                layer.eachLayer((polyObject) => {
                    if (polyObject.options.id !== undefined) {
                        list.push(polyObject);
                    }
                });
            }
        });

        let isPointsValid = true;

        const transformedSpotsLayer = list.reduce((spots, layer) => {
            const spotId = layer.options.id;
            const spot = allSpots.find(spot => spot.id === spotId);

            if (!spot) {
                const pointsDTO = extractPointsDTO(layer);

                if (validatePointsDTO(pointsDTO)) {
                    const newParkingSpot = populateValidSpot(spotId, pointsDTO);
                    spots.push(newParkingSpot);
                } else {
                    toast.error("You must draw 4 points with ids!");
                    isPointsValid = false;
                    return spots;
                }
            }

            return spots;
        }, []);

        if (!isPointsValid) {
            dispatch(getParkingSpotsByParkingId(parkingId));
            return;
        }

        allSpots.push(...transformedSpotsLayer);
        const transformedSpots = editedLayers.map((layer) => {
            const pointsDTO = extractPointsDTO(layer);
            if (validatePointsDTO(pointsDTO)) {
                const spotId = layer.options.id;
                const spot = allSpots.find(spot => spot.id === spotId);
                return populateValidSpot(spot, pointsDTO);
            } else {
                toast.error("You must draw 4 points with ids!");
                dispatch(getParkingSpotsByParkingId(parkingId));
                return null;
            }
        }).filter(Boolean);

        const allUpdatedSpots = [...transformedSpots, ...allSpots];
        const uniqueSpots = allUpdatedSpots.filter((spot, index, self) =>
            index === self.findIndex(s => s.id === spot.id)
        );

        let isColliding = false;
        let inValidArea = false;

        transformedSpots.forEach((editedSpot) => {
            if (isSpotAreaTooBig(editedSpot)) {
                inValidArea = true;
                let area = getArea(editedSpot);
                toast.error(`Parking spot area is too big! Area:
                 ${area.toFixed(2)} m2. Maximal area: ${maximalArea} m2`);
            }

            if (isSpotAreaTooSmall(editedSpot)) {
                inValidArea = true;
                let area = getArea(editedSpot);
                toast.error(`Parking spot area is too small! Area: 
                ${area.toFixed(2)} m2. Minimal area: ${minimalArea} m2`);
            }

            uniqueSpots.forEach((otherspot) => {
                if (editedSpot.id !== otherspot.id) {
                    const coliding = areParkingSpotsColliding(otherspot, editedSpot);
                    if (coliding) {
                        isColliding = true;
                        toast.error("Parking spots are colliding!");
                    }
                }
            });

            if (!isColliding && !inValidArea) {
                dispatch(updateParkingSpot(editedSpot)).then(() => {
                    dispatch(getParkingSpotsByParkingId(parkingId));
                });
            } else {
                dispatch(getParkingSpotsByParkingId(parkingId));
            }
        });
    };

    const extractPointsDTO = (layer) => {
        const layerPoints = layer.toGeoJSON().geometry.coordinates[0].map(point => ({
            id: point[2],
            latitude: point[1],
            longitude: point[0],
        }));
        layerPoints.pop();
        return layerPoints;
    };

    const validatePointsDTO = (pointsDTO) => {
        const allIdsDefined = pointsDTO.every(point => point.id !== undefined);
        return pointsDTO.length === 4 && allIdsDefined;
    };

    const createParkingSpot = (spotId, pointsDTO) => ({
        id: spotId,
        spotNumber: parking.name + " " + (parkingSpots.length + 1),
        active: false,
        parkingDTO: { id: parking.id },
        pointsDTO,
    });

    const handleInvalidArea = (area, errorMessage) => {
        toast.error(`${errorMessage} Area: ${area.toFixed(2)} m2. 
        ${errorMessage === "Parking spot area is too big" ? "Maximal area: " + maximalArea + " m2" : "Minimal area: " + minimalArea + " m2"}`);
        clearLayerWithNoIds();
    };

    const _onCreated = (e) => {
        const map = mapRef.current;
        const editedLayer = e.layer;
        const allSpots = [...parkingSpots, ...stagedParkingSpots];
        const list = [];

        map.eachLayer((layer) => {
            if (layer instanceof L.FeatureGroup) {
                layer.eachLayer((polyObject) => {
                    if (polyObject.options.id !== undefined) {
                        list.push(polyObject);
                    }
                });
            }
        });

        const transformedSpots = list.reduce((spots, layer) => {
            const spotId = layer.options.id;
            const spot = allSpots.find(spot => spot.id === spotId);

            if (!spot) {
                const pointsDTO = extractPointsDTO(layer);

                if (validatePointsDTO(pointsDTO)) {
                    const newParkingSpot = createParkingSpot(spotId, pointsDTO);
                    spots.push(newParkingSpot);
                } else {
                    toast.error("You must draw 4 points with ids!");
                }
            }

            return spots;
        }, []);

        allSpots.push(...transformedSpots);

        const layerPointsMapped = extractPointsDTO(editedLayer);

        if (layerPointsMapped.length !== 4) {
            toast.error("You must draw 4 points!");
            clearLayerWithNoIds();
            return;
        }

        const newParkingSpot = createParkingSpot(undefined, layerPointsMapped);

        if (isSpotAreaTooBig(newParkingSpot)) {
            handleInvalidArea(getArea(newParkingSpot), "Parking spot area is too big");
            return;
        }

        if (isSpotAreaTooSmall(newParkingSpot)) {
            handleInvalidArea(getArea(newParkingSpot), "Parking spot area is too small");
            return;
        }

        const isColliding = allSpots.some(otherspot => {
            const coliding = areParkingSpotsColliding(otherspot, newParkingSpot);
            if (coliding) {
                toast.error("Parking spots are colliding!");
                clearLayerWithNoIds();
            }
            return coliding;
        });

        if (!isColliding) {
            dispatch(addParkingSpot(newParkingSpot)).then((data) => {
                dispatch(getParkingSpotsByParkingId(parseInt(parkingId)));
            });
            clearLayerWithNoIds();
        }
    };



    const mapPonitsToParkingSpot = (e, points, editedSpot) => {
        let toMuchDrag = false;
        if (e.distance > maximalDragDistance) {
            toMuchDrag = true;
            toast.error("You can't drag parking spot that much! drag distance: " +
                e.distance.toFixed(2) + " cm. " +
                "Max distance: " + maximalDragDistance + " cm");
        }

        const mappedPoints = points[0].map((coord) => {
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
        });

        const editedParkingSpot = parkingSpots.find((spot) => spot.id === editedSpot.id);
        editedParkingSpot.pointsDTO = pointsDTO;

        let isColliding = false;

        parkingSpots.forEach((otherspot) => {
            if (editedParkingSpot.id !== otherspot.id) {
                const coliding = areParkingSpotsColliding(otherspot, editedParkingSpot);
                if (coliding) {
                    isColliding = true;
                    toast.error("Parking spots are colliding!");
                }
            }
        });

        if (!isColliding && !toMuchDrag) {
            dispatch(updateParkingSpot(editedParkingSpot)).then(() => {
                dispatch(getParkingSpot(editedParkingSpot.id));
            });
        } else {
            dispatch(getParkingSpotsByParkingId(parseInt(parkingId)));
        }
    };

    const handleEditClick = (event) => {
        if (event.id !== undefined) {
            dispatch({
                type: GET_PARKING_SPOT,
                value: event,
            });
            navigate(`/parkingspot/${event.id}`);
        }
    };


    return (
        <Container
            maxWidth='xl'
            style={{ height: '80vh' }}
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
                        lg={12}
                    >
                        <div style={{ height: '80vh' }} className='map-container'>
                            {parking.latitude && parking.longitude ? (
                                <MapContainer
                                    style={{ width: "100%", height: "100%" }}
                                    center={[parking.latitude, parking.longitude]}
                                    zoom={20}
                                    scrollWheelZoom={true}
                                    ref={mapRef}
                                >
                                    <GradientButton
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        onClick={toggleDrag.bind(this, !drag)}
                                        style={{
                                            position: "absolute",
                                            top: "10px",
                                            right: "50px",
                                            zIndex: "801"
                                        }}>{drag ? "Disable Drag" : "Enable Drag"}
                                    </GradientButton>

                                    <FeatureGroup>
                                        <EditControl
                                            position='topright'
                                            draw={{
                                                rectangle: false,
                                                circle: false,
                                                circlemarker: false,
                                                marker: false,
                                                polyline: false,
                                                polygon: {
                                                    allowIntersection: false,
                                                    drawError: {
                                                        color: "#e1e100",
                                                        message: "<strong>Oh snap!<strong> you can't draw that!",
                                                    },
                                                    shapeOptions: {
                                                        color: "#97009c",
                                                        borderColor: "#97009c",
                                                    },

                                                },
                                            }}
                                            edit={{
                                                edit: true,
                                                remove: false,
                                                featureGroup: editableLayers
                                            }}
                                            onCreated={_onCreated}
                                            onEdited={_onEdited}

                                        />
                                        {parkingSpots
                                            .map((spot) => (
                                                <Polygon
                                                    id={spot.id}
                                                    key={Math.random()}
                                                    positions={spot.pointsDTO.map((point) => [
                                                        point.latitude,
                                                        point.longitude,
                                                        point.id
                                                    ])}
                                                    color={spot.active ? "blue" : "#474747"}
                                                    ref={polygonRef}
                                                    draggable={drag}
                                                    interactive
                                                    eventHandlers={{
                                                        dragend: (e) => {
                                                            const eventJson = (e.target.toGeoJSON())
                                                            let list = eventJson.geometry.coordinates[0]
                                                            let index = 0;
                                                            for (let i = 0; index < eventJson.geometry.coordinates[0].length - 1; i = (i + 1) % 4) {
                                                                list[index].push(spot.pointsDTO[i].id);
                                                                index = index + 1;
                                                            }
                                                            mapPonitsToParkingSpot(e, eventJson.geometry.coordinates, spot);
                                                        },

                                                    }}
                                                >
                                                    <Popup>
                                                        <div style={{ minWidth: '200px', maxWidth: '250px', padding: '10px', textAlign: 'left' }}>
                                                            <div style={{
                                                                marginBottom: '5px', textAlign: 'center',
                                                                fontSize: `${Math.min(20, 450 / parking.name.length)}px`, fontWeight: 'bold',
                                                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                                            }}>
                                                                Spot: {spot.spotNumber}
                                                            </div>
                                                            <div style={{ marginBottom: '5px' }}>
                                                                <span style={{ fontWeight: 'bold' }}>Spot ID:</span> {spot.id}
                                                            </div>
                                                            <GradientButton
                                                                variant="contained"
                                                                color="primary"
                                                                onClick={() => handleEditClick(spot)}
                                                                style={{ width: '100%' }}
                                                            >
                                                                EDIT
                                                            </GradientButton>
                                                        </div>
                                                    </Popup>
                                                </Polygon>
                                            ))}
                                    </FeatureGroup>

                                    <TileLayer
                                        maxNativeZoom={22}
                                        maxZoom={22}
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url='http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'

                                    />
                                    {stagedParkingSpots
                                        .map((spot) => (
                                            <Polygon
                                                id={spot.id}
                                                key={spot.id}
                                                positions={spot.pointsDTO.map((point) => [
                                                    point.latitude,
                                                    point.longitude,
                                                    point.id
                                                ])}
                                                color={"#474747"}
                                                interactive
                                            >
                                                <Popup>
                                                    <div style={{ minWidth: '200px', maxWidth: '250px', padding: '10px', textAlign: 'left' }}>
                                                        <div style={{
                                                            marginBottom: '5px', textAlign: 'center',
                                                            fontSize: `${Math.min(20, 450 / parking.name.length)}px`, fontWeight: 'bold',
                                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                                        }}>
                                                            Spot: {spot.spotNumber}
                                                        </div>
                                                        <div style={{ marginBottom: '5px' }}>
                                                            Save parking staged spots to edit them.
                                                        </div>
                                                    </div>
                                                </Popup>
                                            </Polygon>
                                        ))}

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
                </Grid>
            </Box>
        </Container>
    );
}
