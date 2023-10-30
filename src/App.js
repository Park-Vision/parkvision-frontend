import "./App.css";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppBar from "./components/AppBar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Reservations from "./pages/Reservations/Reservations";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import CarPage from "./pages/Car/CarPage";
import ParkingDetails from "./pages/Home/ParkingDetails";
import Toolbar from "@mui/material/Toolbar";
import Register from "./pages/Login/Register";
import ReservationDetails from "./pages/Reservations/ReservationDetails";
import ManagerProfile from "./pages/ParkingManagement/ManagerProfile";
import UserProfile from "./pages/User/UserProfile";
import * as React from "react";
const ColorModeContext = React.createContext({ toggleColorMode: () => {} });
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
                                element={<CarPage />}
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
                        </Routes>
                    </div>
                </ThemeProvider>
            </ColorModeContext.Provider>
        </BrowserRouter>
    );
}

export default App;
