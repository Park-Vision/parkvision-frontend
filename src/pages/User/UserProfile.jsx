
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Home from "../Home/Home";
import { updatePassword, updateName, getUser, disableUser } from "../../actions/userActions";
import {
    Box,
    Button,
    Container,
    Typography,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Paper, InputLabel, OutlinedInput, InputAdornment
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { toast } from "react-toastify";
import { validateName, validatePassword } from "../../utils/validation";
import { logout } from "../../actions/authenticationActions";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { GradientButton } from "../../components/GradientButton";


export default function UserProfile() {
    const authenticationReducer = useSelector((state) => state.authenticationReducer);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [action, setAction] = useState(false);
    const [editing, setEditing] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);
    const user = useSelector((state) => state.userReducer.user);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    useEffect(() => {
        if (authenticationReducer.decodedUser && (authenticationReducer.decodedUser.role === "USER" ||
            authenticationReducer.decodedUser.role === "PARKING_MANAGER")) {
            dispatch(getUser(authenticationReducer.decodedUser.userId))
                .then((response) => {
                    setFirstName(response.firstName);
                    setLastName(response.lastName);
                }
                );
        }
    }, []);

    if (!authenticationReducer.decodedUser || authenticationReducer.decodedUser.role === "ADMIN") {
        navigate("/");
        return <Home />;
    }

    const handleOpenDialog = (type) => {
        setFirstName(user.firstName);
        setLastName(user.lastName)
        setNewPassword("");
        setNewPasswordRepeat("");
        setAction(true);
        if (type === "password") {
            setChangingPassword(true);
        } else if (type === "delete") {
            setDeletingAccount(true);
        } else if (type === "profile") {
            setEditing(true);
        }
    };

    const handleCloseDialog = () => {
        setFirstName(user.firstName);
        setLastName(user.lastName);

        setEditing(false);
        setChangingPassword(false);
        setDeletingAccount(false);
        setAction(false);
    };

    const handleSaveProfile = () => {
        if (!validateName(firstName)) {
            toast.info("First name can not be empty.");
            return;
        }
        else if (!validateName(lastName)) {
            toast.info("Last name can not be empty.");
            return;
        }
        const userId = authenticationReducer.decodedUser.userId;
        const updatedUser = {
            id: userId,
            firstName: firstName,
            lastName: lastName,
        };
        dispatch(updateName(updatedUser))
            .then(() => {
                toast.success("Account data successfully updated!");
                setEditing(false);
                setAction(false);
                dispatch(getUser(userId));
            })
            .catch((error) => {
                console.error("Error updating account data:", error);
                toast.error("An error occurred while updating account data. Please try again.");
            });
        handleCloseDialog();
    };

    const handleChangePassword = () => {
        if (!validatePassword(newPassword)) {
            toast.info('Password must contains eight characters or more, including at least one capital ' +
                'letter, special character and a number.');
            return;
        } else if (newPassword !== newPasswordRepeat) {
            toast.info("Passwords must be the same");
            return;
        }
        const userId = authenticationReducer.decodedUser.userId;
        const passwordData = {
            id: userId,
            password: newPassword,
        };
        dispatch(updatePassword(passwordData))
            .then(() => {
                toast.success("Password successfully changed! Please log in again with the new password.");
                setNewPassword("");
                setNewPasswordRepeat("");
                setChangingPassword(false);
                setAction(false);
                dispatch(logout());
                navigate("/login");
            })
            .catch((error) => {
                console.error("Error changing password:", error);
                toast.error("An error occurred while changing the password. Please try again.");
            });
        handleCloseDialog();
    };

    const handleDeleteAccount = () => {
        const userId = authenticationReducer.decodedUser.userId;
        dispatch(disableUser(userId))
            .then(() => {
                toast.success("Account successfully deleted!");
                setDeletingAccount(false);
                setAction(false);
                dispatch(logout());
                navigate("/");
                return <Home />;

            })
            .catch((error) => {
                console.error("Error deleting account:", error);
                toast.error("An error occurred while deleting the account. Please try again.");
            });
        handleCloseDialog();
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    PROFILE SETTINGS
                </Typography>
                <Grid item xs={12}>
                    <Paper elevation={3} style={{ padding: 20, margin: 10 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                            Email: {authenticationReducer.decodedUser.sub}
                        </Typography>
                        <Typography variant="body1">First name: {user.firstName}</Typography>
                        <Typography variant="body1">Last name: {user.lastName}</Typography>
                    </Paper>
                </Grid>
                <Grid container justifyContent="center" spacing={2}>
                    <Grid item>
                        <GradientButton variant="contained" margin="normal" onClick={() => handleOpenDialog("profile")}>
                            EDIT PROFILE
                        </GradientButton>
                    </Grid>
                    <Grid item>
                        <GradientButton variant="contained" margin="normal" onClick={() => handleOpenDialog("password")}>
                            CHANGE PASSWORD
                        </GradientButton>
                    </Grid>
                    <Grid item>
                        <GradientButton variant="contained" margin="normal" onClick={() => handleOpenDialog("delete")}>
                            DELETE ACCOUNT
                        </GradientButton>
                    </Grid>
                </Grid>

                {action && (
                    <Dialog open={action} onClose={handleCloseDialog}>
                        <DialogTitle>{changingPassword ? "Change Password" : deletingAccount ? "Delete Account" : editing ? "Edit Profile" : ""}</DialogTitle>
                        <DialogContent>
                            {changingPassword ? (
                                <>
                                    <FormControl fullWidth variant="outlined" margin="normal">
                                        <InputLabel htmlFor="newPassword">New Password</InputLabel>
                                        <OutlinedInput
                                            id="newPassword"
                                            label="New Password"
                                            type={showPassword ? 'text' : 'password'}
                                            required={true}
                                            margin={"normal"}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            value={newPassword}
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
                                        <InputLabel htmlFor="newPasswordRepeat">New Password Repeat</InputLabel>
                                        <OutlinedInput
                                            id="newPasswordRepeat"
                                            label="New Password Repeat"
                                            type={showPassword ? 'text' : 'password'}
                                            required={true}
                                            margin={"normal"}
                                            onChange={(e) => setNewPasswordRepeat(e.target.value)}
                                            value={newPasswordRepeat}
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
                                </>
                            ) : deletingAccount ? (
                                <>
                                    <Typography variant="body1" gutterBottom>
                                        Are you sure you want to delete your account?
                                    </Typography>
                                </>
                            ) : editing ? (
                                <>
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
                                        fullWidth
                                        margin="normal"
                                        value={lastName}
                                        required
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </>
                            ) : (
                                <>
                                </>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Cancel</Button>
                            <Button onClick={changingPassword ?
                                handleChangePassword : deletingAccount ?
                                    handleDeleteAccount : handleSaveProfile}
                                variant="contained">
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Box>
        </Container>
    );
}