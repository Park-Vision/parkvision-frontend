import React, { useState } from "react";
import { useDispatch } from "react-redux";
import FormControl from '@mui/material/FormControl';
import Button from "@mui/material/Button";
import { addDrone } from "../actions/droneActions";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { toast } from "react-toastify";


function CreateDronePopup(props) {
    const dispatch = useDispatch();


    // Adding drone
    const [name, setName] = useState("")
    const [model, setModel] = useState("")
    const [serialNumber, setSerialNumber] = useState("")

    const handleName = (event) => {
        setName(event.target.value);
    };

    const handleModel = (event) => {
        setModel(event.target.value);
    };

    const handleSerialNumber = (event) => {
        setSerialNumber(event.target.value);
    };

    const handleCreateDrone = (event) => {
        if (name === "" || model === "" || serialNumber === "") {
            toast.error('Please insert all required data.');
            return;
        }

        const newDrone = {
            name: name,
            model: model,
            serialNumber: serialNumber,
            parkingDTO: {
                id: props.parkingId
            }
        }

        dispatch(addDrone(newDrone))
            .then(() => {
                toast.success('Drone successfully added!');
                props.refreshDrones()
            })
            .catch((error) => {
                console.error('Error during adding drone:', error);
                toast.error('Error during adding drone. Please try again.');
            })
    }

    return (
        <Dialog
            open={props.open}
            onClose={() => props.setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Create new drone"}</DialogTitle>
            <DialogContent>
                <FormControl fullWidth>
                    <TextField id="outlined-basic" label="Name" variant="outlined" sx={{ m: 1 }} onChange={handleName} />
                    <TextField id="outlined-basic" label="Model" variant="outlined" sx={{ m: 1 }} onChange={handleModel} />
                    <TextField id="outlined-basic" label="Serial number" variant="outlined" sx={{ m: 1 }} onChange={handleSerialNumber} />
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.setOpen(false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => {
                    handleCreateDrone()
                    props.setOpen(false)
                }} color="primary" autoFocus>
                    Add drone
                </Button>
            </DialogActions>
        </Dialog>
    )

}

export default CreateDronePopup

