import React from "react";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import QRCode from 'qrcode.react';


function QRPopup(props) {

    return (
        <Dialog
            open={props.open}
            onClose={() => props.setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Scan to connect drone"}</DialogTitle>
            <DialogContent sx={{
                flexGrow: 1, p: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <QRCode value={props.connectionData} />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.setOpen(false)} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )

}

export default QRPopup

