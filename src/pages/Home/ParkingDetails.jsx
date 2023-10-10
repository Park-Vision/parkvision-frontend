import React, {useDebugValue, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getCars} from "../../actions/carActions";
import {getParking} from "../../actions/parkingActions";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {useParams} from "react-router-dom";

function ParkingDetails(props) {
    const {parkingId} = useParams()
    console.log(parkingId)
    const dispatch = useDispatch()

    const parking = useSelector(state => state.parkingReducer.parking)

    useEffect(() => {
        dispatch(getParking(parkingId))
    }, []);

    console.log(parking)
    console.log(typeof parking)

    return (
        <div>
            <h2>Parking details</h2>
            {
                typeof parking != 'undefined' && parking != null &&
                <Card
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <CardMedia
                        component="img"
                        image={parking.img}
                        alt={parking.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">
                            {parking.name}
                        </Typography>
                        <Typography>Adress: {parking.address}</Typography>
                        <Typography>$/h: {parking.costRate}</Typography>
                        <Typography>Open hours: {parking.openHours}</Typography>
                    </CardContent>
                </Card>
            }

        </div>
    );
}

export default ParkingDetails;

