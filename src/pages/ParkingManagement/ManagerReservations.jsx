import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getReservations, getUserReservations} from "../../actions/reservationActions";
import {Box} from "@mui/material";
import * as PropTypes from "prop-types";

function DataGrid(props) {
    return null;
}

DataGrid.propTypes = {
    initialState: PropTypes.shape({pagination: PropTypes.shape({paginationModel: PropTypes.shape({pageSize: PropTypes.number})})}),
    pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
    columns: PropTypes.any,
    checkboxSelection: PropTypes.bool,
    disableRowSelectionOnClick: PropTypes.bool
};
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
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'firstName',
            headerName: 'First name',
            width: 150,
            editable: true,
        },
        {
            field: 'lastName',
            headerName: 'Last name',
            width: 150,
            editable: true,
        },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 110,
            editable: true,
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            valueGetter: (params) =>
                `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
    ];


    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={reservations}

                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    )
}