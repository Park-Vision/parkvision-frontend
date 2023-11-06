import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Home from "../Home/Home";
import {getUser} from "../../actions/userActions";

export default function ManagerProfile() {
    const authenticationReducer = useSelector((state) => state.authenticationReducer);
    const userReducer = useSelector((state) => state.userReducer);
    
    const dispatch = useDispatch();
    const navigate = useNavigate()

    if (!authenticationReducer.decodedUser ||
        authenticationReducer.decodedUser.role !== "PARKING_MANAGER") {
        navigate('/');
        return <Home />;
    } else {
        dispatch(getUser(authenticationReducer.decodedUser.userId))
            .then((response) => {
                navigate(`/parking/${userReducer.user.parkingDTO.id}/editor`);
            })
            .catch((error) => {
                console.log(error);
            });
    }





    return (
        <h1> MANAGER PROFILE </h1>
    )

}