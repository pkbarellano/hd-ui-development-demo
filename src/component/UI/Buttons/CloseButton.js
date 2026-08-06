import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

const CloseButtonUI = ({ color, onClick, label, disabled }) => {

    return (
        <Button
            variant='contained'
            size='small'
            color={(color) ? color : "primary"}
            onClick={onClick}
            startIcon={<CloseIcon />}
            disabled={disabled}
        >
            {(label) ? label : "Close"}
        </Button>
    );

}

export default CloseButtonUI;