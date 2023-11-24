// generate PasswordReset page with PasswordReset, password and submit button
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
import { resetPassword, setPasswordFromReset } from '../../actions/userActions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { validateEmail, validatePassword } from "../../utils/validation";


export default function PasswordReset() {
    const [password, setPassword] = React.useState("")
    const [passwordRepeat, setPasswordRepeat] = React.useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const timestamp = queryParams.get('timestamp');
    const hourRule = process.env.REACT_APP_RESET_PASSWORD_HOUR_RULE;

    useEffect(() => {
        if (token === null || timestamp === null) {
            navigate("/", { replace: true });
            toast.error('Invalid link');
            return;
        }
        const hourRuleInSeconds = 60 * 60 * 1000 * parseInt(hourRule);
        const linkTimestamp = parseInt(timestamp);
        const currentTimestamp = Date.now();
        const timeDifference = currentTimestamp - linkTimestamp;

        if (timeDifference > hourRuleInSeconds) {
            navigate("/", { replace: true });
            toast.error('Link expired');
            return;
        }
    }, [token, timestamp])

    const handlePassword = (event) => {
        setPassword(event.target.value);
    };

    const handlePasswordRepeat = (event) => {
        setPasswordRepeat(event.target.value);
    };

    const handlePasswordReset = (event) => {
        event.preventDefault()

        if (!validatePassword(password)) {
            toast.info('Password must contains eight characters or more, including at least one capital ' +
                'letter, special character and a number.');
        } else if (passwordRepeat !== password) {
            toast.info('Passwords must be the same');
        } else {
            const resetPasswordBody = {
                token: token,
                password: password,
                timestamp: timestamp
            }
            dispatch(setPasswordFromReset(resetPasswordBody)).then(response => {
                toast.success('Submited successfully');
                navigate("/login");
            }
            );
        }
    }

    const handleGoToLogin = () => {
        navigate("/login");
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
                                Set new password
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <form onSubmit={handlePasswordReset} >
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
                                    <TextField
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
                                        Password reset
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