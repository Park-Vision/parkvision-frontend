import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Home from "../Home/Home";
import decodeToken from "../../utils/decodeToken";

export default function UserProfile() {
    const authenticationReducer = useSelector((state) => state.authenticationReducer);
    const navigate = useNavigate()

    const userjson = JSON.parse(localStorage.getItem("user"));
    const user = decodeToken(userjson?.token);

    if (!user) {
        navigate('/');
        return;
    }

    return (
        <h1> USER PROFILE </h1>
    )

}