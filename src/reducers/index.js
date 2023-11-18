import { combineReducers } from "redux";
import carReducer from "./carReducer";
import droneReducer from "./droneReducer"
import parkingReducer from "./parkingReducer"
import parkingSpotReducer from "./parkingSpotReducer"
import pointReducer from "./pointReducer"
import reservationReducer from "./reservationReducer"
import userReducer from "./userReducer"
import authenticationReducer from "./authenticationReducer.js"
import paymentReducer from "./paymentReducer";
import droneMissionReducer from "./droneMissionReducer";


export default combineReducers({
    carReducer,
    droneReducer,
    parkingReducer,
    parkingSpotReducer,
    pointReducer,
    reservationReducer,
    userReducer,
    authenticationReducer,
    paymentReducer,
    droneMissionReducer
});