import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getReservationsByParking } from '../../actions/reservationActions';
import Home from '../Home/Home';
import { getParking, getParkingFreeSpotsNumber, getParkingSpotsNumber } from '../../actions/parkingActions';
import { Bar, Line} from 'react-chartjs-2';
import { Chart, ArcElement, CategoryScale, registerables } from 'chart.js'
import { Card, CardContent, Container, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts";
Chart.register(ArcElement);
Chart.register(CategoryScale);
Chart.register(...registerables);

export default function ManagerDashboard(props) {
    const { parkingId } = useParams();
    const authenticationReducer = useSelector((state) => state.authenticationReducer);
    const reservations = useSelector((state) => state.reservationReducer.reservations);
    const numOfSpots = useSelector((state) => state.parkingReducer.numOfSpotsInParkings[parkingId]);
    const numOfFreeSpots = useSelector((state) => state.parkingReducer.numOfFreeSpotsInParkings[parkingId]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (authenticationReducer.decodedUser && authenticationReducer.decodedUser.role === 'PARKING_MANAGER') {
            dispatch(getReservationsByParking(parkingId));
            dispatch(getParking(parkingId)).then((response) => {
                dispatch(getParkingFreeSpotsNumber(parkingId, new Date().toISOString()));
                dispatch(getParkingSpotsNumber(parkingId));
            });
        }
    }, [dispatch, parkingId, authenticationReducer.decodedUser]);

    if (!authenticationReducer.decodedUser || authenticationReducer.decodedUser.role !== 'PARKING_MANAGER') {
        navigate('/');
        return <Home />;
    }

    const dataSpots = [
        { label: 'Free', value: numOfFreeSpots },
        { label: 'Occupied', value: numOfSpots - numOfFreeSpots },
    ];

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekdaysDataAmount = Array(7).fill(0);
    const weekdaysCountAmount = Array(7).fill(0);
    const weekdaysDataTime = Array(7).fill(0);
    const weekdaysCountTime = Array(7).fill(0);

    reservations.forEach((reservation) => {
        const startDate = new Date(reservation.startDate);
        const weekday = startDate.getDay();
        weekdaysDataAmount[weekday] += reservation.amount;
        weekdaysCountAmount[weekday]++;
    });

    const averageAmounts = weekdaysDataAmount.map((total, index) => {
        const count = weekdaysCountAmount[index];
        const average = count === 0 ? 0 : total / count;
        return average.toFixed(2);
    });

    const dataReservationAverage = {
        labels: weekdays,
        datasets: [
            {
                label: 'Average Amount',
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(75,192,192,0.6)',
                hoverBorderColor: 'rgba(75,192,192,1)',
                data: averageAmounts,
            },
        ],
    };

    const optionsReservationAverage = {
        scales: {
            x: { title: { display: true, text: 'Weekdays' } },
            y: { title: { display: true, text: 'Average Amount' } },
        },
        legend: {
            display: false,
        },
    };

    reservations.forEach((reservation) => {
        const startDate = new Date(reservation.startDate);
        const endDate = new Date(reservation.endDate);
        const weekday = startDate.getDay();
        const duration = (endDate - startDate) / (1000 * 60); // Duration in minutes
        weekdaysDataTime[weekday] += duration;
        weekdaysCountTime[weekday]++;
    });

    const averageDurations = weekdaysDataTime.map((total, index) => {
        const count = weekdaysCountTime[index];
        return count === 0 ? 0 : total / count;
    });

    const dataReservationTime = {
        labels: weekdays,
        datasets: [
            {
                label: 'Average Duration (minutes)',
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(75,192,192,0.6)',
                hoverBorderColor: 'rgba(75,192,192,1)',
                data: averageDurations,
            },
        ],
    };

    const optionsReservationTime = {
        scales: {
            x: { title: { display: true, text: 'Weekdays' } },
            y: { title: { display: true, text: 'Average Duration (minutes)' } },
        },
        legend: {
            display: false,
        },
    };

    const monthlyCounts = reservations.length > 0
        ? reservations.reduce((acc, reservation) => {
            const startDate = new Date(reservation.startDate);
            const month = startDate.getMonth();
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {})
        : {};

    const monthlyData = Array.from({ length: 12 }, (_, month) => monthlyCounts[month] || 0);

    const dataMonthly = {
        labels: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ],
        datasets: [
            {
                label: 'Number of Reservations',
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(75,192,192,0.6)',
                hoverBorderColor: 'rgba(75,192,192,1)',
                data: monthlyData,
            },
        ],
        options: {
            legend: {
                display: false,
            },
        },
    };


    return (
        <Container maxWidth="l">
            <Card >
                <CardContent>
                    <Typography variant="h6" component="div">
                        Parking Spots Overview
                    </Typography>
                    <Typography variant="h6" component="div">
                        Number of all spots: {numOfSpots}
                    </Typography>
                    <PieChart
                        series={[
                            {
                                data: dataSpots,
                                innerRadius: 40,
                                outerRadius: 80,
                            },
                        ]}
                        height={300}
                        slotProps={{
                            legend: { hidden: false },
                        }}
                    />
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography variant="h6" component="div">
                        Average Reservation Amount
                    </Typography>
                    <div style={{ width: '100%' }}>
                        <Bar data={dataReservationAverage} options={optionsReservationAverage} />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography variant="h6" component="div">
                        Average Reservation Duration
                    </Typography>
                    <div style={{ width: '100%' }}>
                        <Bar data={dataReservationTime} options={optionsReservationTime} />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography variant="h6" component="div">
                        Number of Reservations
                    </Typography>
                    <div style={{ width: '100%' }}>
                        <Line data={dataMonthly} />
                    </div>
                </CardContent>
            </Card>
        </Container>
    );
}