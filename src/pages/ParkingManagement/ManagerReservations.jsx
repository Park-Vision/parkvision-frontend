import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteReservation, getReservationsByParking } from "../../actions/reservationActions";
import { Box, Container } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import convertDate from "../../utils/convertDate";
import Home from "../Home/Home";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { toast } from "react-toastify";
import ManagerNavigation from "../../components/ManagerNavigation";
export default function ManagerReservations(props) {
    const { parkingId } = useParams();
    const authenticationReducer = useSelector((state) => state.authenticationReducer);

    const reservations = useSelector((state) => state.reservationReducer.reservations);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (authenticationReducer.decodedUser && authenticationReducer.decodedUser.role === "PARKING_MANAGER") {
            dispatch(getReservationsByParking(parkingId));
        }
    }, );

    if (!authenticationReducer.decodedUser && authenticationReducer.decodedUser.role !== "PARKING_MANAGER") {
        navigate('/');
        return <Home />;
    }

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.3, align: 'right', minWidth: 50 },
        {
            field: 'startDate', headerName: 'Start Date', flex: 0.8, minWidth: 200,
            valueGetter: ({ row }) => convertDate(row.startDate)
        },
        {
            field: 'endDate', headerName: 'End Date', flex: 0.8, minWidth: 200,
            valueGetter: ({ row }) => convertDate(row.endDate)
        },
        { field: 'registrationNumber', headerName: 'Reg. Number', flex: 1, minWidth: 150 },
        {
            field: 'amount', headerName: 'Amount', flex: 0.6, align: 'right', minWidth: 150,
            valueGetter: ({ row }) => row.amount + " " + row.parkingSpotDTO.parkingDTO.currency
        },
        {
            field: 'userName', headerName: 'Name', flex: 1, minWidth: 150,
            valueGetter: ({ row }) => row.userDTO.firstName + " " + row.userDTO.lastName
        },
        {
            field: 'spotNumber', headerName: 'Spot Number', flex: 1, align: 'right', minWidth: 150,
            valueGetter: ({ row }) => row.parkingSpotDTO.spotNumber
        },
        {
            field: 'parkingName', headerName: 'Parking Name', flex: 1, minWidth: 150,
            valueGetter: ({ row }) => row.parkingSpotDTO.parkingDTO.name
        },
        {
            field: 'actions', headerName: 'Actions', flex: 0.5, minWidth: 100, align: 'center', sortable: false, filterable: false,
            renderCell: (params) => (
                new Date(params.row.startDate) > new Date() && (
                    <>
                        <IconButton style={{ fontSize: 30 }} color="primary" aria-label="edit" onClick={() => handleEdit(params.row.id)}>
                            <ModeEditIcon />
                        </IconButton>
                        <IconButton style={{ fontSize: 30 }} color="primary" aria-label="cancel" onClick={() => handleDelete(params.row.id)}>
                            <DeleteIcon style={{ fontSize: 30 }} />
                        </IconButton>
                    </>

                )
            ),
        },
    ];

    const handleDelete = (reservationId) => {
        dispatch(deleteReservation(reservationId)).then(() => {
            toast.success('Reservation deleted successfully.');
        }).catch((error) => {
            toast.error('Error deleting reservation:' + error.message);
        });
    };

    const handleEdit = (reservationId) => {
        navigate('/reservation-edit/' + reservationId);
    }

    return (
        <>
            <ManagerNavigation/>
            <Container maxWidth="xl" style={{ height: "100%" }}>
                <Box style={{ height: "100%" }}>
                    <div style={{ height: "100%" }}>
                        <DataGrid
                            rows={reservations}
                            columns={columns}
                            pageSize={5}
                            sx={{ overflowX: 'scroll' }}
                        />
                    </div>
                </Box>
            </Container>
        </>
    )
}