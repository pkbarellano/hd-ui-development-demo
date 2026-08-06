import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import CloseButtonUI from './Buttons/CloseButton';

const ModalUI = ({ width, bgcolor, open, closeHandler, textColor, title, body, button }) => {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: (width) ? width : 'auto',
        bgcolor: (bgcolor) ? bgcolor : 'background.paper',
        border: '0px',
        boxShadow: 24,
        p: 4,
        borderRadius: 1
    };

    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={closeHandler}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 700
                    }
                }}
                disableEscapeKeyDown
            >
                <Fade in={open}>
                    <Box sx={style} elevation={8}>

                        <Typography variant='h6' component='h2' sx={{
                            color: textColor
                        }}
                            style={{
                                marginBottom: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                            {title}
                        </Typography>
                        <Box sx={{ mt: 2, color: textColor }}>
                            {body}
                        </Box>
                        <Stack
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                            spacing={.5}
                            sx={{
                                marginTop: 3
                            }}
                        >
                            {(button) ? button : <CloseButtonUI
                                onClick={closeHandler}
                            />}
                        </Stack>
                    </Box>
                </Fade>
            </Modal >
        </>
    );
};

export default ModalUI;