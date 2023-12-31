import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDroneMissions } from "../../redux/actions/droneMissionActions";
import { Box, Container } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { convertDateToLocaleString } from "../../utils/convertDate";
import Home from "../Home/Home";
import Button from "@mui/material/Button";


export default function ManagerReservations() {
    const authenticationReducer = useSelector((state) => state.authenticationReducer);

    const missions = useSelector((state) => state.droneMissionReducer.droneMissions);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const parking = useSelector((state) => state.parkingReducer.parking);


    useEffect(() => {
        if (authenticationReducer.decodedUser && authenticationReducer.decodedUser.role === "PARKING_MANAGER") {
            dispatch(getDroneMissions());
        }
    }, []);

    if (!authenticationReducer.decodedUser && authenticationReducer.decodedUser.role === "PARKING_MANAGER") {
        navigate('/');
        return <Home />;
    }

    const renderDetailsButton = (params) => {
        return (
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                    navigate(`/parking/${parking.id}/missions/${params.row.id}`);
                }}
            >
                Results
            </Button>
        )
    }

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.3, align: 'right', minWidth: 100 },
        {
            field: 'startDate', headerName: 'Start Date', flex: 0.8, minWidth: 200,
            valueGetter: ({ row }) => convertDateToLocaleString(row.missionStartDate)
        },
        {
            field: 'endDate', headerName: 'End Date', flex: 0.8, minWidth: 200,
            valueGetter: ({ row }) => convertDateToLocaleString(row.missionEndDate)
        },
        { field: 'status', headerName: 'Status', flex: 1, minWidth: 150 },
        {
            field: 'occupiedSpotsCount', headerName: 'Occupied', flex: 0.4, align: 'right', minWidth: 100,
            valueGetter: (params) => {
                return params.row.missionSpotResultList.filter(spot => spot.occupied).length;
            },
        },
        {
            field: 'visitedSpotsCount', headerName: 'Visited', flex: 0.4, align: 'right', minWidth: 100,
            valueGetter: (params) => {
                return params.row.missionSpotResultList.length;
            },
        },
        {
            field: 'parking', headerName: 'Parking', flex: 0.6, minWidth: 150,
            valueGetter: ({ row }) => row.parkingDTO.name
        },
        {
            field: 'drone', headerName: 'Drone', flex: 1, minWidth: 150,
            valueGetter: ({ row }) => row.droneDTO.name
        },
        {
            field: 'droneModel', headerName: 'Drone Model', flex: 1, minWidth: 150,
            valueGetter: ({ row }) => row.droneDTO.model
        },
        {
            field: 'decision', headerName: 'See results', flex: 0.5, minWidth: 150,
            renderCell: renderDetailsButton
        },
    ];

    return (
        <>
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
        </>
    )
}