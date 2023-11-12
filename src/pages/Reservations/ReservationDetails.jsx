import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Paper,
    CardContent,
    Card,
    Grid,
    TextField,
    Button,
    CircularProgress, FormControl, FormLabel, Input, Divider,
} from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, FeatureGroup, Polygon, Popup } from 'react-leaflet';
import { addReservation } from '../../actions/reservationActions';
import { toast } from "react-toastify";
import { useState } from 'react';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { addPayment } from "../../actions/paymentActions";
import { addStripeCharge } from "../../actions/stripeChargeActions";

export default function ReservationDetails(props) {
    const navigate = useNavigate();
    const authenticationReducer = useSelector(state => state.authenticationReducer);
    const reservation = useSelector(state => state.reservationReducer.reservation);
    const parking = useSelector(state => state.parkingReducer.parking);
    const parkingSpotReducer = useSelector(state => state.parkingSpotReducer);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()
    const [cardNumber, setCardNumber] = useState("");
    const [expMonth, setExpMonth] = useState("");
    const [expYear, setExpYear] = useState("");
    const [cvc, setCvc] = useState("");
    const cardRegex = /^\d+$/;
    const cvcRegex = /^\d{3}$/;

    const handleCardNumber = (event) => {
        setCardNumber(event.target.value);
    }

    const handleExpMonth = (event) => {
        setExpMonth(event.target.value);
    }

    const handleExpYear = (event) => {
        setExpYear(event.target.value);
    }

    const handleCvc = (event) => {
        setCvc(event.target.value);
    }

    const handleReservation = (event) => {
        if (authenticationReducer.isLoggedIn &&
            authenticationReducer.decodedUser.role === "PARKING_MANAGER") {
            dispatch(addReservation(reservation)).then((reservationResponse) => {
                    setLoading(false);
                    toast.success('Reservation created');
                    navigate('/parking/' + parking.id);
                    dispatch({
                        type: 'GET_PARKING_SPOT',
                        value: {},
                    });
                }

            ).catch((error) => {
                console.error('Error in adding reservation:', error);
                setLoading(false);
                toast.error('Error during reservation process. Please try again.');
                navigate('/parking/' + parking.id);
            });
            return;
        }
        const currentYear = new Date().getFullYear().toString().slice(-2);
        const currentMonth = new Date().getMonth() + 1;
        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth) || expMonth < 1 || expMonth > 12) {
            toast.error('Invalid expiration date');
        } else if (!cardRegex.test(cardNumber)) {
            toast.error('Card number should contain only digits');
        } else if (!cvcRegex.test(cvc)) {
            toast.error('CVC should be 3 digits');
        } else {
            try {
                setLoading(true);
                dispatch(addReservation(reservation))
                    .then((reservationResponse) => {
                        const userId = authenticationReducer.decodedUser.userId;
                        const newPayment = {
                            user: {
                                id: userId,
                            },
                            cardNumber: cardNumber,
                            expMonth: expMonth,
                            expYear: expYear,
                            cvc: cvc,
                        };
                        dispatch(addPayment(newPayment))
                            .then((paymentResponse) => {
                                const newCharge = {
                                    amount: "123",
                                    currency: "PLN",
                                    payment: {
                                        id: paymentResponse.id,
                                    },
                                    reservation: {
                                        id: reservationResponse.id,
                                    },
                                };
                                dispatch(addStripeCharge(newCharge))
                                    .then((chargeResponse) => {
                                        setLoading(false);
                                        toast.success('Reservation created');
                                        navigate('/');
                                        dispatch({
                                            type: 'GET_PARKING_SPOT',
                                            value: {},
                                        });
                                    })
                                    .catch((error) => {
                                        console.error('Error in adding stripe charge:', error);
                                        setLoading(false);
                                        toast.error('Error during payment process. Please try again.');
                                        navigate('/');
                                    });
                            })
                            .catch((error) => {
                                console.error('Error in adding payment:', error);
                                setLoading(false);
                                toast.error('Error accesing payment provider. Please try again.');
                                navigate('/');
                            });
                    })
                    .catch((error) => {
                        console.error('Error in adding reservation:', error);
                        setLoading(false);
                        toast.error('Error during reservation process. Please try again.');
                        navigate('/');
                    });
            } catch (e) {
                console.error('General error:', e);
                setLoading(false);
                toast.error('Something went wrong. Please try again.');
                navigate('/');
            }
        }
    };

    const handleBackClick = (event) => {
        navigate('/parking/' + parking.id);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Rerservation Details
                </Typography>
                {loading && <Box
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
                </Box>}
                <Paper>
                    <CardContent>
                        <div style={{ height: '500px' }}>
                            {parkingSpotReducer.parkingSpot.id && (
                                <MapContainer
                                    style={{ width: '100%', height: '100%' }}
                                    center={[parkingSpotReducer.parkingSpot.pointsDTO[0].latitude, parkingSpotReducer.parkingSpot.pointsDTO[0].longitude]}
                                    zoom={21}
                                    scrollWheelZoom={true}
                                >
                                    <FeatureGroup>
                                    </FeatureGroup>

                                    <TileLayer
                                        maxNativeZoom={22}
                                        maxZoom={22}
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                                    />
                                    {parkingSpotReducer.parkingSpot && parkingSpotReducer.parkingSpot.id && (
                                        <Polygon
                                            positions={parkingSpotReducer.parkingSpot.pointsDTO.map((point) => [
                                                point.latitude,
                                                point.longitude,
                                            ])}
                                            color='orange'
                                            interactive
                                        >
                                            <Popup>{`Selected Parking Spot ID: ${parkingSpotReducer.parkingSpot.id}`} <br></br> Click to deselect</Popup>
                                        </Polygon>
                                    )}


                                </MapContainer>
                            )}
                        </div>
                        <Card
                            sx={{ m: 1 }}
                        >

                            <Typography style={{ marginBottom: 10 }} fullWidth>
                                Dates and times are based on parking time zone ({parking.timeZone}) compared to UTC.
                            </Typography>
                            <TextField style={{ marginBottom: 10 }} fullWidth
                                       value={`${new Date(reservation.startDate).toLocaleString()}`}
                                       id="outlined-basic"
                                       label="Start date"
                                       variant="outlined"
                                       InputProps={{
                                           readOnly: true,
                                       }}
                            />
                            <TextField style={{ marginBottom: 10 }} fullWidth
                                       value={`${new Date(reservation.endDate).toLocaleString()}`}
                                       id="outlined-basic"
                                       label="End date"
                                       variant="outlined"
                                       InputProps={{
                                           readOnly: true,
                                       }}
                            />
                            <TextField style={{ marginBottom: 10 }} fullWidth
                                       value={reservation.registrationNumber}
                                       id="outlined-basic"
                                       label="Registration number"
                                       variant="outlined"
                                       InputProps={{
                                           readOnly: true,
                                       }}
                            />
                            <TextField style={{ marginBottom: 10 }} fullWidth
                                       value={`${parking.name}, ${parking.street}, ${parking.city}`}
                                       id="outlined-basic"
                                       label="Parking name"
                                       variant="outlined"
                                       InputProps={{
                                           readOnly: true,
                                       }}
                            />
                            <TextField style={{ marginBottom: 10 }} fullWidth
                                       value={1}
                                       id="outlined-basic"
                                       label="Parking spot"
                                       variant="outlined"
                                       InputProps={{
                                           readOnly: true,
                                       }}
                            />
                        </Card>
                        {authenticationReducer.isLoggedIn &&
                            authenticationReducer.decodedUser.role !== "PARKING_MANAGER" && (
                                <Card
                                    sx={{ m: 1 }} fullWidth
                                    variant="outlined"
                                >

                                    <Divider inset="none" />
                                    <CardContent
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
                                            gap: 1.5,
                                        }}
                                    >
                                        <FormControl sx={{ gridColumn: '1/-1' }}>
                                            <FormLabel>Card number</FormLabel>
                                            <Input
                                                name="cardNumber"
                                                required={true}
                                                value={cardNumber}
                                                onChange={handleCardNumber}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Expiration date</FormLabel>
                                            <div style={{ display: 'flex' }}>
                                                <Input
                                                    name="expMonth"
                                                    required={true}
                                                    value={expMonth}
                                                    onChange={handleExpMonth}
                                                    inputProps={{
                                                        maxLength: 2,
                                                    }}
                                                    placeholder={'month'}
                                                />
                                                <Typography variant="h6" style={{ margin: '0 10px' }}>/</Typography>
                                                <Input
                                                    name="expYear"
                                                    required={true}
                                                    value={expYear}
                                                    onChange={handleExpYear}
                                                    inputProps={{
                                                        maxLength: 2,
                                                    }}
                                                    placeholder={'year'}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>CVC/CVV</FormLabel>
                                            <div style={{ display: 'flex', maxWidth: '100%' }}>
                                                <Input
                                                    name="cvc"
                                                    required={true}
                                                    value={cvc}
                                                    onChange={handleCvc}
                                                    inputProps={{
                                                        maxLength: 3,
                                                    }}
                                                />
                                            </div>
                                        </FormControl>
                                    </CardContent>
                                </Card>
                            )}
                        <Button
                            onClick={handleReservation}
                            variant='contained'
                            fullWidth>
                            RESERVE
                        </Button>
                        <Button
                            onClick={handleBackClick}
                            fullWidth>
                            EDIT
                        </Button>
                    </CardContent >
                </Paper >
            </Box >
        </Container >
    )
}