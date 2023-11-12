import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from "react-redux";
import {addCar, getCar, deleteCar, updateCar, getUserCars} from "../../actions/carActions"

export default function Cars() {
    const cars = useSelector(state => state.carReducer.cars)
    const authenticationReducer = useSelector((state) => state.authenticationReducer);
    const dispatch = useDispatch()

    useEffect(() => {
        if (authenticationReducer.decodedUser && authenticationReducer.decodedUser.role === "USER") {
            dispatch(getUserCars())
        }
    }, []);

    return (
        <div>
            <h2>Car List</h2>
            <ul>
                {cars.map((car) => (
                    <li key={car.id}>
                        {car.brand} - <button>Delete</button> - <button>Edit</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
