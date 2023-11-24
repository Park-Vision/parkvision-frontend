import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDroneMissions } from "../../actions/droneMissionActions";
import { Box, Container } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import convertDate from "../../utils/convertDate";
import Home from "../Home/Home";

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
        { field: 'id', headerName: 'ID', flex: 0.3, align: 'right', minWidth: 50 },
        {
            field: 'startDate', headerName: 'Start Date', flex: 0.8, minWidth: 200,
            valueGetter: ({ row }) => convertDate(row.missionStartDate)
        },
        {
            field: 'endDate', headerName: 'End Date', flex: 0.8, minWidth: 200,
            valueGetter: ({ row }) => convertDate(row.missionEndDate)
        },
        { field: 'status', headerName: 'Status', flex: 1, minWidth: 100 },
        {
            field: 'occupiedSpotsCount', headerName: 'Occupied', flex: 0.4, align: 'right', minWidth: 80,
            valueGetter: (params) => {
                return params.row.missionSpotResultList.filter(spot => spot.occupied).length;
            },
        },
        {
            field: 'visitedSpotsCount', headerName: 'Visited', flex: 0.4, align: 'right', minWidth: 80,
            valueGetter: (params) => {
                return params.row.missionSpotResultList.length;
            },
        },
        {
            field: 'parking', headerName: 'Parking', flex: 0.6, minWidth: 100,
            valueGetter: ({ row }) => row.parkingDTO.name
        },
        {
            field: 'drone', headerName: 'Drone', flex: 1, minWidth: 100,
            valueGetter: ({ row }) => row.droneDTO.name
        },
        {
            field: 'droneModel', headerName: 'Drone Model', flex: 1, minWidth: 100,
            valueGetter: ({ row }) => row.droneDTO.model
        },
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