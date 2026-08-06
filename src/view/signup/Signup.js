import { Outlet } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import CopyrightUI from '../../component/UI/Copyright';

const Signup = () => {

    return (
        <Container component="main" maxWidth="xs">
            <Card>
                <CardContent>
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <AppRegistrationRoundedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                        <Outlet />
                    </Box>
                    <CopyrightUI sx={{ mt: 5 }} />
                </CardContent>
            </Card>
        </Container>
    );
}

export default Signup;