import React, {useDebugValue, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getCars} from "../../actions/carActions";
import {getParking} from "../../actions/parkingActions";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function ParkingDetails(Id) {
    const parkingId = 1;
    const parking = useSelector(state => state.parkingReducer)
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(getParking(parkingId))
    }, [parkingId]);

    return (
        <div>
            <h2>Parking detail</h2>
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
        </div>
    );
}

