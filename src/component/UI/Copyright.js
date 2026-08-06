import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const CopyrightUI = props => {

    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link href="/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
};

export default CopyrightUI;