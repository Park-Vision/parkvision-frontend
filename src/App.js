import "./App.css";
import Header from "./components/AppBar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
        <ThemeProvider theme={theme}>
            <div className='App'>
                {/* <Header /> */}
                {/* <Home /> */}
                <Login />
            </div>
        </ThemeProvider>
    );
}

export default App;
