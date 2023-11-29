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
import { GradientButton } from "../../components/GradientButton";
import { useDispatch } from "react-redux";
import { logout, register } from "../../redux/actions/authenticationActions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { validatePassword, validateEmail, validateName } from "../../utils/validation";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';


export default function Register() {
    const [email, setEmail] = React.useState("")
    const [firstName, setFirstName] = React.useState("")
    const [lastName, setLastName] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [passwordRepeat, setPasswordRepeat] = React.useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };



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
        if (!validateEmail(email)) {
            toast.info('Wrong email');
        } else if (!validateName(firstName)) {
            toast.info('Wrong first name');
        } else if (!validateName(lastName)) {
            toast.info('Wrong last name');
        } else if (!validatePassword(password)) {
            toast.info('Password must contains eight characters or more, including at least one capital ' +
                'letter, special character and a number.');
        } else if (passwordRepeat !== password) {
            toast.info('Passwords must be the same');
        } else {
            dispatch(register(email, firstName, lastName, password))
                .then(response => {
                    console.log(response);
                    if (response.status === 200) {
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
        <Container maxWidth="sm">
            <Box sx={{
                display: 'flex',
                justifyContent: 'center', // Center horizontally
                alignItems: 'center',     // Center vertically
                height: '100vh',
                width: '300',
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
                                    <FormControl fullWidth variant="outlined" margin="normal">
                                        <InputLabel htmlFor="email">E-mail</InputLabel>
                                        <OutlinedInput
                                            label="E-mail"
                                            id="email"
                                            variant="outlined"
                                            required={true}
                                            onChange={handleEmail}
                                            value={email}
                                        />
                                    </FormControl>

                                    <FormControl fullWidth variant="outlined" margin="normal">
                                        <InputLabel htmlFor="first-name">First name</InputLabel>
                                        <OutlinedInput
                                            label="First name"
                                            id="first-name"
                                            variant="outlined"
                                            required={true}
                                            onChange={handleFirstName}
                                            value={firstName}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth variant="outlined" margin="normal">
                                        <InputLabel htmlFor="last-name">Last name</InputLabel>
                                        <OutlinedInput
                                            label="last-name"
                                            id="first-name"
                                            variant="outlined"
                                            required={true}
                                            onChange={handleLastName}
                                            value={lastName}
                                        />
                                    </FormControl>

                                    <FormControl fullWidth variant="outlined" margin="normal">
                                        <InputLabel htmlFor="password">Password</InputLabel>
                                        <OutlinedInput
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
                                    <FormControl fullWidth variant="outlined" margin="normal">
                                        <InputLabel htmlFor="password-repeat">Repeat password</InputLabel>
                                        <OutlinedInput
                                            label="Repeat password"
                                            id="password-repeat"
                                            type={showPassword ? 'text' : 'password'}
                                            required={true}
                                            onChange={handlePasswordRepeat}
                                            value={passwordRepeat}
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
                                    <GradientButton type="submit" variant="contained" fullWidth sx={{ mt: 1 }} >
                                        Register
                                    </GradientButton>
                                    <Button fullWidth sx={{ mt: 1 }} onClick={() => handleLoginRedirection()}>
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