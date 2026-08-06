import * as React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

const AppContainer = () => {

    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                p: 3
            }}
        >
            <Toolbar />
            <Outlet />
        </Box>
    );
}

export default AppContainer;