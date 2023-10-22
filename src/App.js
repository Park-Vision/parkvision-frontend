import "./App.css";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppBar from "./components/AppBar";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Reservations from "./pages/Reservations/Reservations";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import CarPage from "./pages/Car/CarPage";
import ParkingDetails from "./pages/Home/ParkingDetails";
import Toolbar from "@mui/material/Toolbar";
import Register from "./pages/Login/Register";
import ReservationDetails from "./pages/Reservations/ReservationDetails";
import ManagerProfile from "./pages/ParkingManagement/ManagerProfile";

function App() {
    const theme = createTheme({
        palette: {
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
    });

    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                    <AppBar/>
                    <Toolbar/>
                    <div className="home">
                        <Routes>
                            <Route exact path={'/'} element={<Home/>}/>
                            <Route path={'/login'} element={<Login/>}/>
                            <Route path={'/register'} element={<Register/>}/>
                            <Route path={'/reservations'} element={<Reservations/>}/>
                            <Route path={'/about'} element={<About/>}/>
                            <Route path={'/contact'} element={<Contact/>}/>
                            <Route path={'/cars'} element={<CarPage/>}/>
                            <Route path={'/parking/:parkingId'} element={<ParkingDetails/>}/>
                            <Route path={"/reservation-details"} element={<ReservationDetails />}/>
                            <Route path={"/management"} element={<ManagerProfile />}/>
                        </Routes>
                    </div>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
