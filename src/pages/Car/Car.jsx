import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from "react-redux";
import {addCar, getCars, getCar, deleteCar, updateCar} from "../../actions/carsActions"

function Car() {
    const [carsList, setCarsList] = useState([]);
    const cars = useSelector(state => state.cars)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getCars())
    }, []);

    console.log(cars)

    return (
        <div>
            <h2>Car List</h2>
            {/*<ul>*/}
            {/*    {cars.map((car) => (*/}
            {/*        <li key={car.id}>*/}
            {/*            {car.brand} - <button>Delete</button> - <button>Edit</button>*/}
            {/*        </li>*/}
            {/*    ))}*/}
            {/*</ul>*/}
        </div>
    );
}

export default Car;