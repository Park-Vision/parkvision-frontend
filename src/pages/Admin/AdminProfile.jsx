import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Home from "../Home/Home";
import {assignParking, deleteUser, disableUser, getManagers} from "../../actions/userActions";
import convertDate from "../../utils/convertDate";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, InputLabel, Select,
    TextField,
    Typography
} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {toast} from "react-toastify";
import Grid from "@mui/material/Grid";
import {validateEmail, validateName} from "../../utils/validation";
import {registerManager} from "../../actions/authenticationActions";
import {getParkings} from "../../actions/parkingActions";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import MenuItem from "@mui/material/MenuItem";

export default function AdminProfile() {
    const authenticationReducer = useSelector((state) => state.authenticationReducer);
    const users = useSelector((state) => state.userReducer.users);
    const parkings = useSelector((state) => state.parkingReducer.parkings);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openAssignDialog, setOpenAssignDialog] = useState(false);
    const [parkingId, setParkingId] = useState("");
    const [managerId, setManagerId] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    useEffect(() => {
        if (authenticationReducer.decodedUser && authenticationReducer.decodedUser.role === "ADMIN") {
            dispatch(getManagers());
            dispatch(getParkings());
        }
    }, []);

    console.log(users)
    console.log(parkings);

    if (!authenticationReducer.decodedUser && authenticationReducer.decodedUser.role === "ADMIN") {
        navigate('/');
        return <Home />;
    }

    const handleDelete = (userId) => {
        dispatch(disableUser(userId)).then(() => {
            toast.success('Manager deleted successfully.');
        }).catch((error) => {
            toast.error('Error deleting manager:' + error.message);
        });
    };

    const handleAssignParking = (managerId) => {
        setManagerId(managerId);
        setOpenAssignDialog(true);
        console.log(parkings)
        console.log(parkingId)
    }

    const handleAssignDialogClose = () => {
        setOpenAssignDialog(false);
        console.log(parkings)
    }

    const handleAdd = () => {
        setOpenAddDialog(true);
    }

    const handleAddDialogClose = () => {
        setOpenAddDialog(false);
    };

    function generateRandomPassword() {
        const length = 8;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJK" +
                                "LMNOPQRSTUVWXYZ0123456789!@#$%&*_-?";
        let password = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset.charAt(randomIndex);
        }
        return password;
    }

    const handleAddSubmit = () => {
        if (!validateEmail(email)){
            toast.info('Invalid email data.');
            return;
        }
        if (!validateName(firstName)){
            toast.info('Invalid first name data.');
            return;
        }
        if (!validateName(lastName)){
            toast.info('Invalid last name data.');
            return;
        }
        else {
            const password = generateRandomPassword();
            console.log(password)
            dispatch(registerManager(email, firstName, lastName, password))
                .then(response => {
                    console.log(response);
                    setEmail("");
                    setFirstName("");
                    setLastName("");
                    toast.success('Registration successful');
                })
                .catch(error => {
                    toast.error('Something went wrong. Try again.');
                })
            setOpenAddDialog(false);
            dispatch(getManagers());

        }

    };
    const handleAssignSubmit = () => {
        const assignData = {
            userId: managerId,
            parkingId: parkingId,
        }
        console.log(assignData)
        dispatch(assignParking(assignData))
            .then(response => {
                setParkingId("");
                toast.success('Parking assigned successfully.');
            })
            .catch(error => {
                toast.error('Something went wrong. Try again.');
            })
        dispatch(getManagers());
        setOpenAssignDialog(false);
    }

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.3, align: 'right', minWidth: 50 },
        {
            field: 'firstName', headerName: 'First Name', flex: 0.8, minWidth: 200
        },
        {
            field: 'lastName', headerName: 'Last Name', flex: 0.8, minWidth: 200,

        },
        {
            field: 'email', headerName: 'Email', flex: 0.8, minWidth: 200,

        },
        { field: 'parkingId', headerName: 'Parking ID', flex: 1, align: 'right', minWidth: 50,
            valueGetter: ({ row }) => row.parkingDTO?.id || 'N/A'
        },

        {
            field: 'parkingName', headerName: 'Parking Name', flex: 0.6, minWidth: 150,
            valueGetter: ({ row }) => row.parkingDTO?.name || 'N/A'
        },
        {
            field: 'actions', headerName: 'Actions', flex: 0.5, minWidth: 100, align: 'center', sortable: false, filterable: false,
            renderCell: (params) => (
                <>
                    {!params.row.parkingDTO && (
                        <IconButton style={{ fontSize: 30 }} color="primary" aria-label="edit" onClick={() => handleAssignParking(params.row.id)}>
                            <ModeEditIcon style={{ fontSize: 30 }} />
                        </IconButton>
                    ) }
                    <IconButton style={{ fontSize: 30 }} color="primary" aria-label="cancel" onClick={() => handleDelete(params.row.id)}>
                        <DeleteIcon style={{ fontSize: 30 }} />
                    </IconButton>
                </>
            ),
        },

    ];

    return (
        <Container maxWidth="xl" style={{ height: "100%" }}>
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    MANAGERS
                </Typography>
                <Grid container justifyContent="flex-end">
                    <Button variant="contained" margin="normal" onClick={handleAdd}>NEW MANAGER</Button>
                </Grid>
            </Box>
            <Box style={{ height: "100%" }}>
                <div style={{ height: "100%" }}>
                    <DataGrid
                        rows={users}
                        columns={columns}
                        pageSize={5}
                        sx={{ overflowX: 'scroll' }}
                    />
                </div>
            </Box>

            <Dialog open={openAddDialog} onClose={handleAddDialogClose}>
                <DialogTitle>ADD NEW MANAGER</DialogTitle>
                <DialogContent>
                    <Grid>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            label="First Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={firstName}
                            required
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <TextField
                            label="Last Name"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={lastName}
                            required
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openAssignDialog} onClose={handleAssignDialogClose}>
                <DialogTitle>ASSIGN PARKING</DialogTitle>
                <DialogContent>
                    <Grid>
                        <InputLabel id="parking-select-label">Parking</InputLabel>
                        <Select
                            labelId="parking-select-label"
                            id="parking-select"
                            value={parkingId}
                            onChange={(e) => setParkingId(e.target.value)}
                            label="Parking"
                            style={{ width: '300px' }}
                        >
                            <MenuItem value="" disabled>
                                Select Parking
                            </MenuItem>
                            {parkings.map((parking) => (
                                <MenuItem key={parking.id} value={parking.id}>
                                    {parking.name}, {parking.city}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAssignDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAssignSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}