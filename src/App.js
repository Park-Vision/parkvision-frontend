import "./App.css";
import Header from "./components/AppBar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppBar from "./components/AppBar";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Reservations from "./pages/Reservations/Reservations";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";

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
                light: "#ffcf33",
                main: "#2e7d32",
                dark: "#ff8f00",
                contrastText: "#fff",
            },
        },
    });

    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <div className='App'>
                    <AppBar />
                        <Routes>
                            <Route exact path={'/'} element={<Home/>}/>
                            <Route exact path={'/login'} element={<Login/>}/>
                            <Route exact path={'/reservations'} element={<Reservations/>}/>
                            <Route exact path={'/about'} element={<About/>}/>
                            <Route exact path={'/contact'} element={<Contact/>}/>
                        </Routes>
                </div>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
