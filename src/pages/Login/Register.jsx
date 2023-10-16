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
import {required} from "./Login";



export default function Register(){
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
                                        label="First name"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        id="outlined-basic"
                                        label="Last name"
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