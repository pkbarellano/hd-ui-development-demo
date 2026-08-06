import LoadingButton from "@mui/lab/LoadingButton";

const LoadingButtonUI = ({ type, loading, fullWidth, sx, label, onClick, icon }) => {

    return (
        <LoadingButton
            type={type}
            loading={loading}
            loadingPosition="start"
            startIcon={icon}
            variant="contained"
            fullWidth={fullWidth}
            sx={sx}
            onClick={onClick}
        >
            {label}
        </LoadingButton>
    );
};

export default LoadingButtonUI;