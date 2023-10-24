import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Home from "../Home/Home";

export default function UserProfile() {
    const authenticationReducer = useSelector((state) => state.authenticationReducer);
    const navigate = useNavigate()

    if (!authenticationReducer.decodedUser ||
        authenticationReducer.decodedUser.role !== "USER") {
        navigate('/');
        return <Home />;
    }

    return (
        <h1> USER PROFILE </h1>
    )

}