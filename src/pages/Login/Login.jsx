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

// use @mui/icons-material

export default function Login() {

    console.log(process.env.REACT_APP_BACKEND_URL + "/cars")

    fetch(process.env.REACT_APP_BACKEND_URL + "/cars")
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));

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
                    Logowanie
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    <form>
                        <TextField
                        id="outlined-basic"
                        label="Login"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        />
                        <TextField
                        id="outlined-basic"
                        label="Hasło"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type='password'
                        />
                                    <Button variant="contained" fullWidth
                                    margin="normal"
                                    >
                        Zaloguj się
                        </Button>
                                    <Button fullWidth
                                    margin="normal"
                                    >
                            Reset hasła
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