import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCar, deleteCar, updateCar, getUserCars } from '../../redux/actions/carActions';
import {
    Box,
    Container,
    List,
    Paper,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField
} from '@mui/material';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import { useNavigate } from 'react-router-dom';
import { validateRegistraionNumber } from "../../utils/validation";
import { toast } from "react-toastify";
import Home from "../Home/Home";
import { GradientButton } from '../../components/GradientButton';


export default function Cars() {
    const cars = useSelector((state) => state.carReducer.cars);
    const authenticationReducer = useSelector((state) => state.authenticationReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [registrationNumber, setRegistrationNumber] = useState("");
    const [color, setColor] = useState("");
    const [brand, setBrand] = useState("");

    const [editCar, setEditCar] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);

    useEffect(() => {
        if (authenticationReducer.decodedUser && authenticationReducer.decodedUser.role === "USER") {
            dispatch(getUserCars())
        }
    }, []);

    if (!authenticationReducer.decodedUser || authenticationReducer.decodedUser.role !== "USER") {
        navigate('/');
        return <Home />;
    }
    const handleEdit = (car) => {
        setEditCar(car);
        setOpenEditDialog(true);
    };

    const handleEditDialogClose = () => {
        setOpenEditDialog(false);
    };

    const handleEditSubmit = () => {
        if (!validateRegistraionNumber(editCar.registrationNumber)) {
            toast.info('Invalid registration number');
            return;
        }
        if ((editCar.brand.length <= 0 || editCar.color.length <= 0)) {
            toast.info('Invalid car details');
            return;
        }
        dispatch(updateCar(editCar)).then(() => {
            toast.success('Car successfully edited!');
            setOpenAddDialog(false);
        })
            .catch((error) => {
                console.error('Error during adding car:', error);
                toast.error('Error during adding car. Please try again.');
                setOpenAddDialog(false);
            })
        setOpenEditDialog(false);
    };

    const handleAdd = () => {
        setOpenAddDialog(true);
    };

    const handleAddDialogClose = () => {
        setOpenAddDialog(false);
        setRegistrationNumber("");
        setColor("");
        setBrand("");
    };

    const handleAddSubmit = () => {
        if (!validateRegistraionNumber(registrationNumber)) {
            toast.info('Invalid registration number');
            return;
        }
        if ((brand.length <= 0 || color.length <= 0)) {
            toast.info('Invalid car details');
            return;
        }
        try {
            const userId = authenticationReducer.decodedUser.userId;
            const newCar = {
                registrationNumber: registrationNumber,
                color: color,
                brand: brand,
                clientDTO: {
                    id: userId,
                },
            };
            dispatch(addCar(newCar))
                .then(() => {
                    toast.success('Car successfully added!');
                    setOpenAddDialog(false);
                })
                .catch((error) => {
                    console.error('Error during adding car:', error);
                    toast.error('Error during adding car. Please try again.');
                    setOpenAddDialog(false);
                })
        } catch (e) {
            console.error('General error:', e);
            toast.error('Something went wrong. Please try again.');
            setOpenAddDialog(false);
        }
        setRegistrationNumber("");
        setColor("");
        setBrand("");
    };

    const handleRegistrationNumber = (event) => {
        setRegistrationNumber(event.target.value);
    }

    const handleColor = (event) => {
        setColor(event.target.value);
    }

    const handleBrand = (event) => {
        setBrand(event.target.value);
    }

    const handleDelete = (car) => {
        dispatch(deleteCar(car.id))
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    YOUR CARS
                </Typography>
                <Grid container justifyContent="flex-end">
                    <GradientButton data-cy='new-car-button' variant="contained" margin="normal" onClick={handleAdd}>NEW CAR</GradientButton>
                </Grid>
                <Grid item xs={12}>
                    {cars && cars.length > 0 ? (
                        <List>
                            {cars.map((car) => (
                                <Paper data-cy={'car-item'} key={car.id} elevation={3} style={{ padding: 20, margin: 10 }}>
                                    <DriveEtaIcon sx={{ fontWeight: 'bold', fontSize: '1.2rem' }} />
                                    <Typography data-cy='car-registration' variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                        Registration number: {car.registrationNumber}
                                    </Typography>
                                    <Typography data-cy='car-color' variant="body1">Color: {car.color}</Typography>
                                    <Typography data-cy='car-brand' variant="body1">Brand: {car.brand}</Typography>
                                    <div style={{ textAlign: 'right' }}>
                                        <IconButton data-cy='car-edit-button' style={{ fontSize: 30 }} color="primary" aria-label="edit" onClick={() => handleEdit(car)}>
                                            <ModeEditIcon />
                                        </IconButton>
                                        <IconButton data-cy='car-delete-button' style={{ fontSize: 30 }} color="primary" aria-label="cancel" onClick={() => handleDelete(car)}>
                                            <DeleteIcon style={{ fontSize: 30 }} />
                                        </IconButton>
                                    </div>
                                </Paper>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body1" align="center">
                            No cars connected to your profile.
                        </Typography>
                    )}
                </Grid>
            </Box>
            <Dialog open={openAddDialog} onClose={handleAddDialogClose}>
                <DialogTitle>ADD NEW CAR</DialogTitle>
                <DialogContent>
                    <Grid>
                        <TextField
                            data-cy='registration-number'
                            label="Registration Number"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={registrationNumber}
                            required
                            onChange={handleRegistrationNumber}
                        />
                        <TextField
                            data-cy='color'
                            label="Color"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={color}
                            required
                            onChange={handleColor}
                        />
                        <TextField
                            data-cy='brand'
                            label="Brand"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={brand}
                            required
                            onChange={handleBrand}
                        />
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button data-cy='cancel-button' onClick={handleAddDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button data-cy='save-button' onClick={handleAddSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
                <DialogTitle>EDIT CAR</DialogTitle>
                <DialogContent>
                    <Grid>
                        <TextField
                            data-cy='registration-number'
                            label="Registration Number"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={editCar?.registrationNumber || ''}
                            required={true}
                            onChange={(e) => setEditCar({ ...editCar, registrationNumber: e.target.value })}
                        />
                        <TextField
                            data-cy='color'
                            label="Color"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={editCar?.color || ''}
                            required={true}
                            onChange={(e) => setEditCar({ ...editCar, color: e.target.value })}
                        />
                        <TextField
                            data-cy='brand'
                            label="Brand"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={editCar?.brand || ''}
                            required={true}
                            onChange={(e) => setEditCar({ ...editCar, brand: e.target.value })}
                        />
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button data-cy='cancel-button' onClick={handleEditDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button data-cy='save-button' onClick={handleEditSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
