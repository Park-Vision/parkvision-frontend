import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import pvlogo from "../../assets/pv_transparent.png";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useDispatch} from "react-redux";
import {register} from "../../actions/authenticationActions";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";



export default function Register(){
    const [email, setEmail] = React.useState()
    const [firstName, setFirstName] = React.useState()
    const [lastName, setLastName] = React.useState()
    const [password, setPassword] = React.useState()
    const [passwordRepeat, setPasswordRepeat] = React.useState()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i

    const handleEmail = (event) => {
        const emailValue = event.target.value
        if (emailRegex.test(emailValue)) {
            setEmail(emailValue)
        }
    };
    const handleFirstName = (event) => {
        const firstNameValue = event.target.value
        if (firstNameValue.length > 0){
            setFirstName(firstNameValue)
        }
    }

    const handleLastName = (event) => {
        const lastNameValue = event.target.value
        if (lastNameValue.length > 0){
            setLastName(lastNameValue)
        }
    }

    const handlePassword = (event) => {
        const passwordValue = event.target.value
        if (passwordRegex.test(passwordValue)) {
            setPassword(passwordValue);
        }
    }

    const handlePasswordRepeat = (event) => {
        const passwordValue = event.target.value
        if (passwordRegex.test(passwordValue) && passwordValue === password) {
            setPasswordRepeat(passwordValue);
        }
    }

    const handleRegister = (event) => {
        event.preventDefault()
        console.log('Email:', email);
        console.log('First:', firstName);
        console.log('Last:', lastName);
        console.log('Password:', password);
        if (email !== undefined && firstName !== undefined && lastName !== undefined
            && password !== undefined && passwordRepeat !== undefined){
            dispatch(register(email, firstName, lastName, password))
            setEmail(undefined)
            setFirstName(undefined)
            setLastName(undefined)
            setPassword(undefined)
            setPasswordRepeat(undefined)
        } else {
            toast.error('Please enter valid data');

        }

    }
    const handleLoginRedirection = () => {
        navigate("/login");
    }



    return (
        <Container maxWidth="lg">
            <Box sx={{
                display: 'flex',
                justifyContent: 'center', // Center horizontally
                alignItems: 'center',     // Center vertically
                height: '100vh',
                width: '300',
                // Set a minimum height for centering
            }}>
                <Grid item  >
                    <Card>
                        <CardMedia
                            component="img"
                            height="300"
                            image={pvlogo}
                            alt="random"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Register
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <form onSubmit={handleRegister}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Email address"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        required={true}
                                        onChange={handleEmail}
                                    />
                                    <TextField
                                        id="outlined-basic"
                                        label="First name"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        required={true}
                                        onChange={handleFirstName}
                                    />
                                    <TextField
                                        id="outlined-basic"
                                        label="Last name"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        required={true}
                                        onChange={handleLastName}
                                    />
                                    <TextField
                                        id="outlined-basic"
                                        label="Password"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        type="password"
                                        required={true}
                                        onChange={handlePassword}
                                    />
                                    <TextField
                                        id="outlined-basic"
                                        label="Repeat password"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        type="password"
                                        required={true}
                                        onChange={handlePasswordRepeat}
                                    />
                                    <Button type="submit" variant="contained" fullWidth margin="normal" >
                                        Register
                                    </Button>
                                    <Button fullWidth margin="normal" onClick={() => handleLoginRedirection()}>
                                        Login
                                    </Button>
                                </form>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Box>
        </Container>
    );

}