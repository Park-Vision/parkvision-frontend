import "./App.css";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppBar from "./components/AppBar";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Reservations from "./pages/Reservations/Reservations";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Cars from "./pages/Car/Cars";
import ParkingDetails from "./pages/Home/ParkingDetails";
import Toolbar from "@mui/material/Toolbar";
import Register from "./pages/Login/Register";
import ReservationDetails from "./pages/Reservations/ReservationDetails";
import ReservationEdit from "./pages/Reservations/ReservationEdit";
import ManagerProfile from "./pages/ParkingManagement/ManagerProfile";
import UserProfile from "./pages/User/UserProfile";
import * as React from "react";
import UserReservations from "./pages/User/UserReservations";
import ParkingSpotDetails from "./pages/ParkingSpot/ParkingSpotDetails";
import ParkingEditor from "./pages/Editor/Editor"
import axios from "axios";
import useErrorHandler from "./utils/ErrorHandler";
import ManagerReservations from "./pages/ParkingManagement/ManagerReservations";
import ManagerParkingCreate from "./pages/ParkingManagement/ManagerParkingCreate";
import ManagerParkingDetails from "./pages/ParkingManagement/ManagerParkingDetails";
import PasswordReset from "./pages/Login/PasswordReset";
const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;

axios.interceptors.response.use(
    (response) => response,
    (error) => useErrorHandler(error)
);

axios.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.token) {
            config.headers["Authorization"] = "Bearer " + user.token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


function App() {
    const [mode, setMode] = React.useState("light");
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
            },
        }),
        []
    );

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    secondary: {
                        light: "#80cbc4",
                        main: "#00838f",
                        dark: "#004d40",
                        contrastText: "#fff",
                    },
                    primary: {
                        light: "#5ede3f",
                        main: "#3d8c62",
                        dark: "#225024",
                        contrastText: "#fff",
                    },
                },
            }),
        [mode]
    );

    return (
        <BrowserRouter>
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme}>
                    <AppBar />
                    <Toolbar />
                    <div className='home'>
                        <Routes>
                            <Route
                                exact
                                path={"/"}
                                element={<Home />}
                            />
                            <Route
                                path={"/login"}
                                element={<Login />}
                            />
                            <Route
                                path={"/register"}
                                element={<Register />}
                            />
                            <Route
                                path={"/reservations"}
                                element={<Reservations />}
                            />
                            <Route
                                path={"/about"}
                                element={<About />}
                            />
                            <Route
                                path={"/contact"}
                                element={<Contact />}
                            />
                            <Route
                                path={"/cars"}
                                element={<Cars />}
                            />
                            <Route
                                path={"/parking/:parkingId"}
                                element={<ParkingDetails />}
                            />
                            <Route
                                path={"/reservation-details"}
                                element={<ReservationDetails />}
                            />
                            <Route
                                path={"/management"}
                                element={<ManagerProfile />}
                            />
                            <Route
                                path={"/profile"}
                                element={<UserProfile />}
                            />
                            <Route
                                path={"/profile/reservations"}
                                element={<UserReservations />}
                            />
                            <Route 
                                path={'/parking/:parkingId/editor'} 
                                element={<ParkingEditor/>}
                            />
                            <Route
                                path={"/parking/:parkingId/details"}
                                element={<ManagerParkingDetails />}
                            />
                            <Route 
                                path={"/parkingspot/:parkingSpotId"} 
                                element={<ParkingSpotDetails />}
                            />
                            <Route 
                                path={"/reservation-details"}
                                element={<ReservationDetails />}
                            />
                            <Route
                                path={"/parking/:parkingId/reservations"}
                                element={<ManagerReservations />}
                            />
                            <Route
                                path={"/parking/create"}
                                element={<ManagerParkingCreate />}
                            />
                            <Route
                                path={"/reservation-edit/:reservationId"}
                                element={<ReservationEdit />}
                            />
                            <Route
                                path={"reset-password/:token"}
                                element={<PasswordReset />}
                            />
                        </Routes>
                    </div>
                </ThemeProvider>
            </ColorModeContext.Provider>
        </BrowserRouter>
    );
}

export default App;
