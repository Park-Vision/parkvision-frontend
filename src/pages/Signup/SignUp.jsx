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

// use @mui/icons-material
import SearchIcon from '@mui/icons-material/Search';

export default function Login() {
    return (
        <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
            <Grid item xs={12} md={6}>
                <Card>
                <CardMedia
                    component="img"
                    height="300"
                    image="https://source.unsplash.com/random"
                    alt="random"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                    Rejestracja
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
                        />
                        <TextField
                        id="outlined-basic"
                        label="Powtórz hasło"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        />
                        <Button variant="contained" fullWidth>
                        Zarejestruj się
                        </Button>
                    </form>
                    </Typography>
                </CardContent>
                </Card>
            </Grid>
            </Grid>
        </Box>
        </Container>
    );
}