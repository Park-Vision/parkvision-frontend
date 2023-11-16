import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {getDroneMissions} from "../../actions/droneMissionActions";
import {Box, Button, Container} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import convertDate from "../../utils/convertDate";
import Home from "../Home/Home";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { toast } from "react-toastify";
export default function ManagerReservations(props) {
    const { parkingId } = useParams();
    const authenticationReducer = useSelector((state) => state.authenticationReducer);

    const missions = useSelector((state) => state.droneMissionReducer.droneMissions);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (authenticationReducer.decodedUser && authenticationReducer.decodedUser.role === "PARKING_MANAGER") {
            dispatch(getDroneMissions());
        }
    }, []);

    if (!authenticationReducer.decodedUser && authenticationReducer.decodedUser.role === "PARKING_MANAGER") {
        navigate('/');
        return <Home />;
    }

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.3, align: 'right', },
        { field: 'startDate', headerName: 'Start Date', flex: 0.8,
            valueGetter: ({row}) => convertDate(row.missionStartDate)},
        { field: 'endDate', headerName: 'End Date', flex: 0.8,
            valueGetter: ({row}) => convertDate(row.missionEndDate) },
        { field: 'status', headerName: 'Status', flex: 1 },
        { field: 'parking', headerName: 'Parking', flex: 0.6 },
        { field: 'drone', headerName: 'Drone', flex: 1 },
        { field: 'actions', headerName: 'Actions', flex: 0.5 },
    ];

    return (
        <Container maxWidth="xl" style={{ height: "100%" }}>
            <Box style={{ height: "100%" }}>
                <div style={{ height: "100%" }}>
                    <DataGrid
                        rows={missions}
                        columns={columns}
                        pageSize={5}
                    />
                </div>
            </Box>
        </Container>
    )
}