import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Home from "../Home/Home";
import { getUser } from "../../redux/actions/userActions";
import decodeToken from "../../utils/decodeToken";
import { useEffect } from "react";

export default function ManagerProfile() {

    const userjson = JSON.parse(localStorage.getItem("user"));
    const user = decodeToken(userjson?.token);

    const dispatch = useDispatch();
    const navigate = useNavigate()

    useEffect(() => {
        if (!user ||
            user.role !== "PARKING_MANAGER") {
            navigate('/');
            return <Home />;
        } else {
            dispatch(getUser(user.userId))
                .then((response) => {
                    if (response.parkingDTO) {
                        navigate(`/parking/${response.parkingDTO.id}`);
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