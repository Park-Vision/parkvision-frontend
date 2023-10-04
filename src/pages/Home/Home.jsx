// generate a home page thah will be under header component in app.js. Set a search field with button and list of movies
import React, { useState } from 'react';

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

const parkingList = [
  {
    id: 1,
    name: 'Parking Lot A',
    description: 'Covered parking with security',
    address: '123 Main St, City, Country',
    costRate: 5.0,
    openHours: '9:00 AM - 8:00 PM'
  },
  {
    id: 2,
    name: 'Parking Lot B',
    description: 'Outdoor parking near the mall',
    address: '456 Elm St, City, Country',
    costRate: 3.5,
    openHours: '24/7'
  },
  {
    id: 3,
    name: 'Parking Garage C',
    description: 'Multi-level parking structure',
    address: '789 Oak St, City, Country',
    costRate: 7.5,
    openHours: '7:00 AM - 10:00 PM'
  }
];

export default function Home() {
    const [search, setSearch] = useState('');
    const [parkings, setParkings] = useState(parkingList);
    
    const handleChange = (event) => {
        setSearch(event.target.value);
    };
    
    const handleSubmit = (event) => {
        console.log('search', event);
        // event.preventDefault();
        // fetch(`http://www.omdbapi.com/?s=${search}&apikey=1c9c3b8c`)
        // .then((response) => response.json())
        // .then((data) => setParkings(data.Search));
    };
    
    return (
        <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
            Wyszukaj parking
            </Typography>
            <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                <SearchIcon />
                </Grid>
                <Grid item>
                <TextField
                    id="input-with-icon-grid"
                    label="Zacznij pisać nazwę parkingu"
                    variant="standard"
                    value={search}
                    onChange={handleChange}
                />
                </Grid>
                <Grid item>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={!search}
                >
                    Szukaj
                </Button>
                </Grid>
            </Grid>
            </form>
            <Grid container spacing={4} sx={{ mt: 4 }}>
            {parkings.map((parking) => (
                <Grid item key={parking.id} xs={12} sm={6} md={4}>
                <Card
                    sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    }}
                >
                    <CardMedia
                    component="img"
                    // image={parking.img}
                    alt={parking.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                        {parking.address}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="h2">
                        {parking.costRate}
                    </Typography>
                    <Typography>{parking.openHours}</Typography>
                    </CardContent>
                </Card>
                </Grid>
            ))}
            </Grid>
        </Box>
        </Container>
    );
    }