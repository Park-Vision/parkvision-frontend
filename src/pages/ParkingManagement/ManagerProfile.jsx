import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Home from "../Home/Home";
import {getUser} from "../../actions/userActions";

import { useEffect } from "react";

export default function ManagerProfile() {
    const authenticationReducer = useSelector((state) => state.authenticationReducer);
    const user = useSelector((state) => state.userReducer.user);
    
    const dispatch = useDispatch();
    const navigate = useNavigate()

    useEffect(() => {
        if (!authenticationReducer.decodedUser ||
            authenticationReducer.decodedUser.role !== "PARKING_MANAGER") {
            navigate('/');
            return <Home />;
        } else {
            dispatch(getUser(authenticationReducer.decodedUser.userId))
                .then((response) => {
                    // if user's parkingDTO is null, navigate to create parking page
                    debugger
                    if (user.parkingDTO) {
                        navigate(`/parking/${user.parkingDTO.id}`);
                    } else {
                        navigate('/parking/create');
                    }

                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [])

    return (
        <h1>  </h1>
    )

}