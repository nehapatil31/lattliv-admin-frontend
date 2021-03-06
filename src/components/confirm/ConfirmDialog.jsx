import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ConfirmDialog = (props) => {
    const { title, children, open, setOpen, onConfirm } = props;
    return (
        <Dialog
            open={open.state}
            onClose={() => setOpen({
                ...open,
                state: false
            })}
            aria-labelledby="confirm-dialog"
        >
            <DialogTitle id="confirm-dialog">{title}</DialogTitle>
            <DialogContent>{children}</DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={() => setOpen({
                        ...open,
                        state: false
                    })}
                    // color="secondary"
                >
                    No
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        setOpen({
                            ...open,
                            state: false
                        })
                        onConfirm();
                    }}
                    // color="default"
                >
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default ConfirmDialog;