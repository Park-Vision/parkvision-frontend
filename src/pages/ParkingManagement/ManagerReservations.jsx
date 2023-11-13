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
        { field: 'id', headerName: 'ID', flex: 0.3, align: 'right', },
        { field: 'startDate', headerName: 'Start Date', flex: 0.8,
            valueGetter: ({row}) => convertDate(row.startDate)},
        { field: 'endDate', headerName: 'End Date', flex: 0.8, valueGetter: ({row}) => convertDate(row.endDate) },
        { field: 'registrationNumber', headerName: 'Reg. Number', flex: 1 },
        {field: 'amount', headerName: 'Amount', flex: 0.6, align: 'right',
            valueGetter: ({row}) => row.amount + " " + row.parkingSpotDTO.parkingDTO.currency },
        { field: 'userName', headerName: 'Name', flex: 1,
            valueGetter: ({row}) => row.userDTO.firstName + " " + row.userDTO.lastName},
        { field: 'spotNumber', headerName: 'Spot Number', flex: 1, align: 'right',
            valueGetter: ({row}) => row.parkingSpotDTO.spotNumber},
        { field: 'parkingName', headerName: 'Parking Name', flex: 1,
            valueGetter: ({row}) => row.parkingSpotDTO.parkingDTO.name },
        { field: 'actions', headerName: 'Actions', flex: 0.5,
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
        <Container maxWidth="xl">
            <Box >
                <div style={{ height: "100%" }}>
                    <DataGrid
                        rows={reservations}
                        columns={columns}
                        pageSize={5}
                        checkboxSelection
                    />
                </div>
            </Box>
        </Container>
    )
}