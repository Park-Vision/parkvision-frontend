import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getReservationsByParking } from '../../actions/reservationActions';
import Home from '../Home/Home';
import { getParking, getParkingFreeSpotsNumber, getParkingSpotsNumber } from '../../actions/parkingActions';
import { Bar, Line } from 'react-chartjs-2';
import { ArcElement, CategoryScale, Chart, registerables } from 'chart.js'
import { Card, CardContent, Container, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import ManagerNavigation from "../../components/ManagerNavigation";
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

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const lastThreeMonths = Array.from({ length: 3 }, (_, index) => {
        const month = (currentMonth - index + 12) % 12 || 12;
        const year = currentYear - Math.floor((index + currentMonth - 1) / 12);
        return { month, year };
    }).reverse();

    const nextNineMonths = Array.from({ length: 9 }, (_, index) => {
        const nextMonth = (currentMonth + index + 1) % 12;
        const nextYear = currentYear + Math.floor((currentMonth + index + 1) / 12);
        return { month: nextMonth, year: nextYear };
    });

    const monthlyCounts = reservations.length > 0
        ? reservations.reduce((acc, reservation) => {
            const startDate = new Date(reservation.startDate);
            const month = startDate.getMonth(); // Adjust month to be 1-indexed
            const year = startDate.getFullYear();
            acc[`${year}-${month}`] = (acc[`${year}-${month}`] || 0) + 1;
            return acc;
        }, {})
        : {};

    const labelsWithYear = lastThreeMonths.concat(nextNineMonths).map(({ month, year }) => {
        return `${year}-${month + 1}`;
    });

    const aggregatedMonthlyData = labelsWithYear.map(label => {
        const [year, month] = label.split('-').map(Number);
        return monthlyCounts[`${year}-${month - 1}`] || 0;
    });

    const dataMonthly = {
        labels: labelsWithYear,
        datasets: [
            {
                label: 'Number of Reservations',
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(75,192,192,0.6)',
                hoverBorderColor: 'rgba(75,192,192,1)',
                data: aggregatedMonthlyData,
            },
        ],
        options: {
            legend: {
                display: false,
            },
        },
    };

    const generateDaysArray = (month, year) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return Array.from({ length: daysInMonth }, (_, index) => index + 1);
    };

    const dataMonthlySum = (reservations) => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const reservationsSumByDay = generateDaysArray(currentMonth, currentYear).map((day) => {
            const reservationsOnDay = reservations.filter((reservation) => {
                const startDate = new Date(reservation.startDate);
                const reservationDay = startDate.getDate();
                const reservationMonth = startDate.getMonth();
                const reservationYear = startDate.getFullYear();

                return (
                    reservationDay === day &&
                    reservationMonth === currentMonth &&
                    reservationYear === currentYear
                );
            });

            const sum = reservationsOnDay.reduce((total, reservation) => total + reservation.amount, 0);

            return sum;
        });

        return {
            labels: generateDaysArray(currentMonth, currentYear),
            datasets: [
                {
                    label: 'Reservations Sum',
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(75,192,192,0.6)',
                    hoverBorderColor: 'rgba(75,192,192,1)',
                    data: reservationsSumByDay,
                },
            ],
        };
    };

    const optionsMonthlySum = {
        scales: {
            x: { title: { display: true, text: 'Day' } },
            y: { title: { display: true, text: 'Reservations Sum' } },
        },
    };

    const getMonthName = (monthIndex) => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        return monthNames[monthIndex];
    };

    return (
        <Container maxWidth="l">
            <ManagerNavigation/>
            <Box sx={{ my: 4 }}>
                <Card >
                    <IconButton onClick={() => navigate(-1)}>
                        <ArrowBackIcon />
                    </IconButton>
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
                        <Bar data={dataReservationAverage} options={optionsReservationAverage} />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant="h6" component="div">
                            Average Reservation Duration
                        </Typography>
                        <Bar data={dataReservationTime} options={optionsReservationTime} />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant="h6" component="div">
                            Number of Reservations
                        </Typography>
                        <Line data={dataMonthly} />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography variant="h6" component="div">
                            Daily income in {getMonthName(new Date().getMonth())}
                        </Typography>
                        <Bar data={dataMonthlySum(reservations)} options={optionsMonthlySum} />
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}