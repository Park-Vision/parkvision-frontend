import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Home from "../Home/Home";

export default function ManagerProfile() {
    const authenticationReducer = useSelector((state) => state.authenticationReducer);
    const navigate = useNavigate()

    if (!authenticationReducer.decodedUser ||
        authenticationReducer.decodedUser.role !== "PARKING_MANAGER") {
        navigate('/');
        return <Home />;
    }



    return (
        <h1> MANAGER PROFILE </h1>
    )

}