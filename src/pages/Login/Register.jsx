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
import {logout, register} from "../../actions/authenticationActions";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {validatePassword, validateEmail, validateName} from "./validation";


export default function Register(){
    const [email, setEmail] = React.useState()
    const [firstName, setFirstName] = React.useState()
    const [lastName, setLastName] = React.useState()
    const [password, setPassword] = React.useState()
    const [passwordRepeat, setPasswordRepeat] = React.useState()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleEmail = (event) => {
        setEmail(event.target.value);
    };

    const handleFirstName = (event) => {
        setFirstName(event.target.value);
    };

    const handleLastName = (event) => {
        setLastName(event.target.value);
    };

    const handlePassword = (event) => {
        setPassword(event.target.value);
    };

    const handlePasswordRepeat = (event) => {
        setPasswordRepeat(event.target.value);
    };

    const handleLoginRedirection = () => {
        navigate("/login");
    }

    const handleRegister = (event) => {
        event.preventDefault()
        console.log('Email:', email);
        console.log('First:', firstName);
        console.log('Last:', lastName);
        console.log('Password:', password);
        if (!validateEmail(email)){
            toast.info('Wrong email');
        } else if (!validateName(firstName)){
            toast.info('Wrong first name');
        } else if(!validateName(lastName)){
            toast.info('Wrong last name');
        } else if (!validatePassword(password)){
            toast.info('Password must contains eight characters, including at least one capital letter and number');
        } else if(passwordRepeat !== password) {
            toast.info('Passwords must be the same');
        } else {
            dispatch(register(email, firstName, lastName, password))
                .then(response => {
                    console.log(response);
                    if (response.status === 200){
                        setEmail("")
                        setFirstName("")
                        setLastName("")
                        setPassword("")
                        setPasswordRepeat("")
                        toast.success('Registration successful');
                        dispatch(logout());
                        handleLoginRedirection();
                    } else {
                        console.log('Registration failed');
                        toast.error('Something went wrong. Try again.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    toast.error('Something went wrong. Try again.');
                });
        }

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
                                        value={email}
                                    />
                                    <TextField
                                        id="outlined-basic"
                                        label="First name"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        required={true}
                                        onChange={handleFirstName}
                                        value={firstName}
                                    />
                                    <TextField
                                        id="outlined-basic"
                                        label="Last name"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        required={true}
                                        onChange={handleLastName}
                                        value={lastName}
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
                                        value={password}
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
                                        value={passwordRepeat}
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