import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {getReservations} from "../../actions/reservationActions";
import {Box} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import convertDate from "../../utils/convertDate";

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
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'startDate', headerName: 'Start Date', width: 200,
            valueGetter: ({row}) => convertDate(row.startDate)},
        { field: 'endDate', headerName: 'End Date', width: 200, valueGetter: ({row}) => convertDate(row.endDate) },
        { field: 'registrationNumber', headerName: 'Reg. Number', width: 100 },
        { field: 'userName', headerName: 'Name', width: 300,
            valueGetter: ({row}) => row.userDTO.firstName + " " + row.userDTO.lastName},

        { field: 'spotNumber', headerName: 'Spot Number', width: 50,
            valueGetter: ({row}) => row.parkingSpotDTO.spotNumber},
        { field: 'parkingName', headerName: 'Parking Name', width: 100,
            valueGetter: ({row}) => row.parkingSpotDTO.parkingDTO.name },
    ];


    return (
        <Box>
            <div>
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