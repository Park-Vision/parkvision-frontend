import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Home from "../Home/Home";
import { updateUser, changePassword, deleteUser, getUser } from "../../actions/userActions";
import { Box, Button, Container, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Grid from "@mui/material/Grid";
import { toast } from "react-toastify";
import { validatePassword } from "../../utils/validation";

export default function UserProfile() {
    const authenticationReducer = useSelector((state) => state.authenticationReducer);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [editing, setEditing] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);
    const user = useSelector((state) => state.userReducer.user);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordRepeat, setNewPasswordRepeat] = useState("");

    const handleOpenDialog = (type) => {
        setEditing(true);
        if (type === "password") {
            setChangingPassword(true);
        } else if (type === "delete") {
            setDeletingAccount(true);
        }
    };

    const handleCloseDialog = () => {
        setEditing(false);
        setChangingPassword(false);
        setDeletingAccount(false);
    };

    const handleSaveProfile = () => {
        const userId = authenticationReducer.decodedUser.userId;
        const updatedUser = {
            id: userId,
            firstName: firstName,
            lastName: lastName,
        };
        dispatch(updateUser(updatedUser)).then(() => {
            toast.success("Account data successfully updated!");
            setEditing(false);
        });
        handleCloseDialog();
    };

    const handleChangePassword = () => {
        if (!validatePassword(newPassword)) {
            toast.info("Password must contain eight characters, including at least one capital letter and number");
            return;
        } else if (newPassword !== newPasswordRepeat) {
            toast.info("Passwords must be the same");
            return;
        }
        const userId = authenticationReducer.decodedUser.userId;
        const passwordData = {
            id: userId,
            newPassword: newPassword,
            newPasswordRepeat: newPasswordRepeat,
        };
        // Dispatch an action to change the user password
        // dispatch(changePassword(passwordData)).then(() => {
        //     toast.success("Password successfully changed!");
        //     setEditing(false);
        // });
        handleCloseDialog();
    };

    const handleDeleteAccount = () => {
        const userId = authenticationReducer.decodedUser.userId;
        // dispatch(deleteUser(userId)).then(() => {
        //     toast.success("Account successfully deleted!");
        //     setEditing(false);
        // });
        handleCloseDialog();
    };

    if (!authenticationReducer.decodedUser || authenticationReducer.decodedUser.role !== "USER") {
        navigate("/");
        return <Home />;
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    YOUR PROFILE SETTINGS
                </Typography>
                <Grid container justifyContent="center" spacing={2}>
                    <Grid item>
                        <Button variant="contained" margin="normal" onClick={() => handleOpenDialog("profile")}>
                            EDIT PROFILE
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" margin="normal" onClick={() => handleOpenDialog("password")}>
                            CHANGE PASSWORD
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" margin="normal" onClick={() => handleOpenDialog("delete")}>
                            DELETE ACCOUNT
                        </Button>
                    </Grid>
                </Grid>

                <Dialog open={editing} onClose={handleCloseDialog}>
                    <DialogTitle>{changingPassword ? "Change Password" : deletingAccount ? "Delete Account" : "Edit Profile"}</DialogTitle>
                    <DialogContent>
                        {changingPassword ? (
                            <>
                                <TextField
                                    label="Current Password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={newPassword}
                                    required
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <TextField
                                    label="New Password"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={newPasswordRepeat}
                                    required
                                    onChange={(e) => setNewPasswordRepeat(e.target.value)}
                                />
                            </>
                        ) : deletingAccount ? (
                            <>
                                <Typography variant="body1" gutterBottom>
                                    Are you sure you want to delete your account?
                                </Typography>
                            </>
                        ) : (
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
            </Box>
        </Container>
    );
}