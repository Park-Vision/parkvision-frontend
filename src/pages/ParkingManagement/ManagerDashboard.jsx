import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getReservationsByParking } from '../../actions/reservationActions';
import Home from '../Home/Home';
import { getParking, getParkingFreeSpotsNumber, getParkingSpotsNumber } from '../../actions/parkingActions';

export default function ManagerDashboard(props) {
    const { parkingId } = useParams();
    const authenticationReducer = useSelector((state) => state.authenticationReducer);
    const reservations = useSelector((state) => state.reservationReducer.reservations);
    const parking = useSelector((state) => state.parkingReducer.parking);
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

    console.log(reservations);
    console.log(parking);
    console.log(numOfSpots);
    console.log(numOfFreeSpots);

    return (
        <div>

        </div>
    );
}