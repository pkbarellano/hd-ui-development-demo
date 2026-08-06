import { Outlet } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import CopyrightUI from '../../component/UI/Copyright';

const Login = () => {

    return (
        <Container component="main" maxWidth="xs">
            {process.env.REACT_APP_DEMO_MODE === 'true' && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    <AlertTitle>Demo mode</AlertTitle>
                    No live backend — sign in with any of these (Access Type / Department can be anything):
                    <Box component="ul" sx={{ pl: 2, mb: 0, mt: 0.5 }}>
                        <li>User: <strong>demo.user</strong> / demo1234</li>
                        <li>Agent: <strong>demo.agent</strong> / demo1234</li>
                        <li>Admin (Agent + Control Panel): <strong>demo.admin</strong> / demo1234</li>
                    </Box>
                </Alert>
            )}
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
                            <LockRoundedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Outlet />
                    </Box>
                    <CopyrightUI sx={{ mt: 8, mb: 4 }} />
                </CardContent>
            </Card>
        </Container>
    );
}

export default Login;