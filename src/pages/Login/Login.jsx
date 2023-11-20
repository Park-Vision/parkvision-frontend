import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
// generate login page with login, password and submit button
import React, { useEffect, useState } from 'react';

// use @mui/material
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import pvlogo from "../../assets/pv_transparent.png";
import {
    Box,
    Container,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField
} from '@mui/material';

import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/authenticationActions";
import { resetPassword } from '../../actions/userActions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from "../../utils/validation";
import decodeToken from "../../utils/decodeToken";


export default function Login() {

    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [emailReset, setEmailReset] = React.useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [openResetPasswordDialog, setResetPasswordDialog] = useState(false);

    const handleEmail = (event) => {
        setEmail(event.target.value);
    };


    const handleEmailReset = (event) => {
        setEmailReset(event.target.value);
    };


    const handlePassword = (event) => {
        setPassword(event.target.value);
    };

    const handleRegister = () => {
        navigate("/register");
    }

    const handleLogin = (e) => {
        e.preventDefault()
        if (!validateEmail(email) || !validatePassword(password)) {
            toast.info('Please enter valid email and password');
        } else {
            dispatch(login(email, password))
                .then(response => {
                    if (response.status === 200) {
                        setEmail("");
                        setPassword("");
                        toast.success('Login successful');
                        const decodedUser = decodeToken(response.data.token);
                        if (decodedUser.role === "PARKING_MANAGER") {
                            navigate('/management');
                        }
                        if (decodedUser.role === "USER") {
                            navigate('/');
                        }
                    } else {
                        console.log('Login failed');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    toast.error('Please enter valid email and password');
                });
        }

    };

    const handleCloseResetPassword = () => {
        setResetPasswordDialog(false);
    };

    const handleOpenResetPassword = () => {
        setResetPasswordDialog(true);
        setEmailReset("");
    }

    const navigateToHome = () => {
        navigate('/')
    }

    const handleSendPasswordReset = () => {
        dispatch(resetPassword(emailReset));
        setResetPasswordDialog(false);
        toast.success('Password reset email sent. Check your inbox.');
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
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
                                        label="Email address"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        required={true}
                                        onChange={handleEmail}
                                        value={email}
                                    />
                                    <TextField
                                        label="Password"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        type="password"
                                        required={true}
                                        onChange={handlePassword}
                                        value={password}
                                    />
                                    <Button type="submit" variant="contained" fullWidth margin="normal" >
                                        Login
                                    </Button>
                                    <Button fullWidth margin="normal" onClick={handleOpenResetPassword}>
                                        Password reset
                                    </Button>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        margin="normal"
                                        onClick={() => handleRegister()}>
                                        Register
                                    </Button>
                                </form>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Box>
            <Dialog open={openResetPasswordDialog}>
                <DialogTitle>Password reset</DialogTitle>
                <DialogContent>
                    <Typography>
                        Please enter your email address.<br></br> We will send you a link to reset your password.
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        onChange={handleEmailReset}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseResetPassword}>Cancel</Button>
                    <Button onClick={handleSendPasswordReset}>Send</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}