import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {deleteReservation, getReservations, getReservationsByParking} from "../../actions/reservationActions";
import {Box, Button, Container} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import convertDate from "../../utils/convertDate";
import Home from "../Home/Home";

export default function ManagerReservations(props) {
    const { parkingId } = useParams();
    console.log(parkingId)
    const authenticationReducer = useSelector((state) => state.authenticationReducer);

    const reservations = useSelector((state) => state.reservationReducer.reservations);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (authenticationReducer.decodedUser && authenticationReducer.decodedUser.role === "PARKING_MANAGER") {
            dispatch(getReservationsByParking(parkingId));
        }
    }, []);

    if (!authenticationReducer.decodedUser && authenticationReducer.decodedUser.role === "PARKING_MANAGER") {
        navigate('/');
        return <Home />;
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, align: 'right', },
        { field: 'startDate', headerName: 'Start Date', width: 200,
            valueGetter: ({row}) => convertDate(row.startDate)},
        { field: 'endDate', headerName: 'End Date', width: 200, valueGetter: ({row}) => convertDate(row.endDate) },
        { field: 'registrationNumber', headerName: 'Reg. Number', width: 100 },
        {field: 'amount', headerName: 'Amount', width: 200, align: 'right',
            valueGetter: ({row}) => row.amount + " " + row.parkingSpotDTO.parkingDTO.currency },
        { field: 'userName', headerName: 'Name', width: 300,
            valueGetter: ({row}) => row.userDTO.firstName + " " + row.userDTO.lastName},
        { field: 'spotNumber', headerName: 'Spot Number', width: 150, align: 'right',
            valueGetter: ({row}) => row.parkingSpotDTO.spotNumber},
        { field: 'parkingName', headerName: 'Parking Name', width: 300,
            valueGetter: ({row}) => row.parkingSpotDTO.parkingDTO.name },
        { field: 'actions', headerName: 'Actions', width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    onClick={() => handleDelete(params.row.id)}
                >
                    Delete
                </Button>
            ),
        },
    ];

    const handleDelete = (reservationId) => {
        dispatch(deleteReservation(reservationId));
    };


    return (
            <Box style={{ height: "100%" }}>
                <div style={{ height: "100%" }}>
                    <DataGrid
                        rows={reservations}
                        columns={columns}
                        pageSize={5}
                        checkboxSelection
                    />
                </div>
            </Box>
    )
}