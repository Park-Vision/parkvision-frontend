// generate login page with login, password and submit button
import React from 'react';

// use @mui/material
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import pvlogo from "../../assets/pv_transparent.png";


import {useDispatch} from "react-redux";
import {login} from "../../actions/authenticationActions";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


export default function Login(props) {

    const [email, setEmail] = React.useState()
    const [password, setPassword] = React.useState()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleEmail = (event) => {
        const emailValue = event.target.value;
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        if (emailRegex.test(emailValue)) {
            setEmail(emailValue);
        }
    };

    const handlePassword = (event) => {
        const passwordValue = event.target.value;
        if (passwordValue.size > 0){
            setPassword(passwordValue);
        }
    };

    const handleRegister = () => {
        navigate("/register");
    }


    const handleLogin = (e) => {
        e.preventDefault()
        console.log('Email:', email);
        console.log('Password:', password);
        if (email !== undefined && password !== undefined){
            dispatch(login(email, password))
                .then(response => {
                    if (response.status === 200) {
                        console.log('Success');
                        setEmail("")
                        setPassword("")
                        navigate("/")
                    } else {
                        console.log('Login failed');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } else {
            toast.error('Please enter valid email and password');
        }

    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'center', // Center horizontally
                    alignItems: 'center',     // Center vertically
                    height: '100vh',          // Set a minimum height for centering
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
                    Login
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <form onSubmit={handleLogin}>
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
                                label="Password"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="password"
                                required={true}
                                onChange={handlePassword}
                            />
                            <Button type="submit" variant="contained" fullWidth margin="normal" >
                                Login
                            </Button>
                            <Button fullWidth margin="normal">
                                Password reset
                            </Button>
                            <Button variant="contained" fullWidth margin="normal" onClick={() => handleRegister()}>
                                Register
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