import React, { useState, useEffect } from 'react';
import Snackbar, { SnackbarCloseButton } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const SnackbarUI = ({ openSnackbar, message, severity }) => {

    const [open, setOpen] = useState(false);

    const closeHandler = () => {

        setOpen(false);
    };

    useEffect(() => {

        const setOpenSnackbarHandler = () => {
            setOpen(openSnackbar);
        };

        return setOpenSnackbarHandler();
    }, [openSnackbar]);

    return (
        <>
            <Snackbar
                open={open}
                anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                onClose={closeHandler}
            >
                <Alert
                    onClose={closeHandler}
                    severity={severity}
                    variant='filled'
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </>
    );

};

export default SnackbarUI;