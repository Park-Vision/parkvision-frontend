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
import { useNavigate, useParams } from 'react-router-dom';
import { validateEmail, validatePassword } from "../../utils/validation";


export default function PasswordReset() {
    const [password, setPassword] = React.useState("")
    const [passwordRepeat, setPasswordRepeat] = React.useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const token = useParams();

    const handlePassword = (event) => {
        setPassword(event.target.value);
    };

    const handlePasswordRepeat = (event) => {
        setPasswordRepeat(event.target.value);
    };

    const handlePasswordReset = (event) => {
        event.preventDefault()

        if (!validatePassword(password)) {
            toast.info('Password must contains eight characters, including at least one capital letter and number');
        } else if (passwordRepeat !== password) {
            toast.info('Passwords must be the same');
        } else {
            const resetPasswordBody = {
                token: token.token,
                password: password
            }
            dispatch(setPasswordFromReset(resetPasswordBody))
        }
    }


    return (
        <Container maxWidth="lg">
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
                                PasswordReset
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <form onSubmit={handlePasswordReset} >
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
                                        PasswordReset
                                    </Button>
                                </form>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Box>
            <Dialog >
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
                    />
                </DialogContent>
                <DialogActions>
                    <Button >Cancel</Button>
                    <Button >Send</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}