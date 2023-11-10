import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {getReservations} from "../../actions/reservationActions";
import {Box} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function ManagerReservations() {
    const authenticationReducer = useSelector((state) => state.authenticationReducer);

    const reservations = useSelector((state) => state.reservationReducer.reservations);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (authenticationReducer.decodedUser && authenticationReducer.decodedUser.role === "PARKING_MANAGER") {
            dispatch(getReservations());
        }
    }, []);

    console.log(reservations)

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'startDate', headerName: 'Start Date', width: 200 },
        { field: 'endDate', headerName: 'End Date', width: 200 },
        { field: 'registrationNumber', headerName: 'Reg. Number', width: 150 },
        { field: 'userDTO.firstName', headerName: 'First Name', width: 150 },
        { field: 'userDTO.lastName', headerName: 'Last Name', width: 150 },
        { field: 'userDTO.role', headerName: 'Role', width: 100 },
        { field: 'parkingSpotDTO.spotNumber', headerName: 'Spot Number', width: 150 },
        { field: 'parkingSpotDTO.occupied', headerName: 'Occupied', width: 120 },
        { field: 'parkingSpotDTO.active', headerName: 'Active', width: 100 },
        { field: 'parkingSpotDTO.parkingDTO.name', headerName: 'Parking Name', width: 200 },
        { field: 'parkingSpotDTO.parkingDTO.city', headerName: 'City', width: 150 },
    ];


    return (
        <Box sx={{ height: 400, width: "100%" }}>
            <div style={{ height: 400, width: "100%" }}>
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