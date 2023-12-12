import React, { useState } from 'react';

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

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import { useDispatch } from "react-redux";
import { login } from "../../redux/actions/authenticationActions";
import { resetPassword } from '../../redux/actions/userActions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from "../../utils/validation";
import decodeToken from "../../utils/decodeToken";
import { FormControl, OutlinedInput } from '@mui/material';
import { GradientButton } from '../../components/GradientButton';


export default function Login() {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

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
                        if (decodedUser.role === "ADMIN") {
                            navigate('/admin');
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

    const handleSendPasswordReset = () => {
        dispatch(resetPassword(emailReset));
        setResetPasswordDialog(false);
        toast.success('Password reset email sent. Check your inbox.');
    }

    return (
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            <Container maxWidth="sm" sx={{
                flexGrow: 1, p: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Box >
                    <Grid item  >
                        <Card elevation={3} square={false}>
                            <CardMedia
                                component="img"
                                height="300"
                                image={pvlogo}
                                alt="random"
                            />
                            <CardContent>
                                <Typography data-cy={'login-title'} gutterBottom variant="h5" component="div">
                                    Login
                                </Typography>
                                <form onSubmit={handleLogin}>
                                    <FormControl fullWidth variant="outlined" margin="normal">
                                        <InputLabel htmlFor="email">E-mail</InputLabel>
                                        <OutlinedInput
                                            data-cy={'email-input'}
                                            label="E-mail"
                                            id="email"
                                            variant="outlined"
                                            required={true}
                                            onChange={handleEmail}
                                            value={email}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth variant="outlined" margin="normal">
                                        <InputLabel htmlFor="password">Password</InputLabel>
                                        <OutlinedInput
                                            data-cy={'password-input'}
                                            label="Password"
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required={true}
                                            onChange={handlePassword}
                                            value={password}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                    <GradientButton data-cy={'login-button'} type="submit" variant="contained" fullWidth sx={{ mt: 1 }}
                                    >
                                        Login
                                    </GradientButton>
                                    <Button data-cy={'password-reset-button'} fullWidth sx={{ mt: 1 }} onClick={handleOpenResetPassword}>
                                        Password reset
                                    </Button>
                                    <GradientButton
                                        data-cy={'register-button'}
                                        variant="contained"
                                        fullWidth
                                        sx={{ mt: 1 }}
                                        onClick={() => handleRegister()}>
                                        Register
                                    </GradientButton>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                </Box>
                <Dialog open={openResetPasswordDialog}>
                    <DialogTitle data-cy={'password-reset-title'}>Password reset</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Please enter your email address.<br></br> We will send you a link to reset your password.
                        </Typography>
                        <TextField
                            data-cy={'password-reset-email-input'}
                            autoFocus
                            margin="normal"
                            id="email"
                            label="Email Address"
                            type="email"
                            fullWidth
                            onChange={handleEmailReset}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseResetPassword}>Cancel</Button>
                        <Button data-cy={'send-password-reset-button'} onClick={handleSendPasswordReset} disabled={!validateEmail(emailReset)}>Send</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}