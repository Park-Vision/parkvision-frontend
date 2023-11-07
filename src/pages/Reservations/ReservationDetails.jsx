import { useNavigate} from 'react-router-dom';
import {
    Container,
    Grid,
    Box,
    Typography,
    Paper,
    CardContent,
    Card,
    TextField,
    Button,
    CircularProgress, FormControl, FormLabel, Input, Divider, Checkbox,
} from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, FeatureGroup, Polygon, Popup } from 'react-leaflet';
import { addReservation } from '../../actions/reservationActions';
import { toast } from "react-toastify";
import { useState } from 'react';
import {InfoOutlined} from "@material-ui/icons";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import authenticationReducer from "../../reducers/authenticationReducer";
import {addPayment} from "../../actions/paymentActions";
import {addStripeCharge} from "../../actions/stripeChargeActions";

export default function ReservationDetails(props) {
    const navigate = useNavigate();
    const authenticationReducer = useSelector(state => state.authenticationReducer);
    const reservation = useSelector(state => state.reservationReducer.reservation);
    const parking = useSelector(state => state.parkingReducer.parking);
    const parkingSpotReducer = useSelector(state => state.parkingSpotReducer);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()

    const [newPayment, setNewPayment] = useState({
        cardNumber: "",
        expMonth: "",
        expYear: "",
        cvc: "",
    });



    const handleSubmit = (event) => {
        event.preventDefault();
        // Do something with the form data, for example, submit it to a server
        console.log('Form submitted with data:');
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewPayment({ ...newPayment, [name]: value });
    };


    const handleResevation = (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            dispatch(addReservation(reservation))
                .then((reservationResponse) => {
                    const userId = authenticationReducer.decodedUser.userId;
                    const updatedNewPayment = {
                        user: {
                            id: userId,
                        },
                        ...newPayment,
                    };
                    console.log(updatedNewPayment);
                    dispatch(addPayment(updatedNewPayment)).then((paymentResponse) => {
                        console.log(paymentResponse);
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
                        dispatch(addStripeCharge(newCharge)).then((chargeResponse) => {
                            setLoading(false);
                            toast.success('reservation created');
                            navigate('/');
                            dispatch({
                                type: 'GET_PARKING_SPOT',
                                value: {},
                            });
                        });
                    });
                });
        } catch (e) {
            console.log(e);
            setLoading(false);
            toast.error('conflict!');
        }
    };

    const handleEditClick = (event) => {
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
                        <div style={{ height: '500px'}}>
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
                        <TextField sx={{ m: 1 }} fullWidth
                                value={new Date(reservation.startDate).toLocaleString()}
                                id="outlined-basic"
                                label="Start date"
                                variant="outlined" 
                                InputProps={{
                                    readOnly: true,
                                }}
                        />
                        <TextField sx={{ m: 1 }} fullWidth
                                value={new Date(reservation.endDate).toLocaleString()}
                                id="outlined-basic"
                                label="End date"
                                variant="outlined" 
                                InputProps={{
                                    readOnly: true,
                                }}
                        />
                            <TextField sx={{ m: 1 }} fullWidth
                                value={reservation.registrationNumber}
                                id="outlined-basic"
                                label="Registration number"
                                variant="outlined" 
                                InputProps={{
                                    readOnly: true,
                                }}
                        />
                        <TextField sx={{ m: 1 }} fullWidth
                            value={`${parking.name}, ${parking.street}, ${parking.city}`}
                                id="outlined-basic"
                                label="Parking name"
                                variant="outlined" 
                                InputProps={{
                                    readOnly: true,
                                }}
                        />
                            <TextField sx={{ m: 1 }} fullWidth
                                value={1}
                                id="outlined-basic"
                                label="Parking spot"
                                variant="outlined" 
                                InputProps={{
                                    readOnly: true,
                                }}
                        />
                        <div>
                        <form onSubmit={handleResevation}>
                            <Card
                                variant="outlined"
                                sx={{
                                    maxHeight: 'max-content',
                                    maxWidth: '100%',
                                    mx: 'auto',
                                }}
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
                                            value={newPayment.cardNumber}
                                            onChange={handleInputChange}
                                            endDecorator={<CreditCardIcon />}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Expiration date</FormLabel>
                                        <div style={{ display: 'flex' }}>
                                            <Input
                                                name="expMonth"
                                                required={true}
                                                value={newPayment.expMonth}
                                                onChange={handleInputChange}
                                                inputProps={{
                                                    maxLength: 2,
                                                }}
                                                endDecorator={<InfoOutlined />}
                                            />
                                            <Typography variant="h6" style={{ margin: '0 10px' }}>/</Typography>
                                            <Input
                                                name="expYear"
                                                required={true}
                                                value={newPayment.expYear}
                                                onChange={handleInputChange}
                                                inputProps={{
                                                    maxLength: 2,
                                                }}
                                                endDecorator={<InfoOutlined />}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>CVC/CVV</FormLabel>
                                        <div  style={{ display: 'flex', maxWidth: '100%'}}>
                                            <Input
                                            name="cvc"
                                            required={true}
                                            value={newPayment.cvc}
                                            onChange={handleInputChange}
                                            endDecorator={<InfoOutlined />}
                                            />
                                        </div>
                                    </FormControl>
                                </CardContent>
                                    <Button
                                        type="submit"
                                        variant='contained'
                                        fullWidth>
                                        RESERVE
                                    </Button>
                            </Card>
                        </form>
                        </div>
                    </CardContent>
                </Paper>
            </Box>
        </Container>
    )
}