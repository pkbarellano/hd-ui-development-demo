import * as React from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'drawerWidth' })(
    ({ theme, drawerWidth }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        width: '100%',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    transition: theme.transitions.create('margin', {
                        easing: theme.transitions.easing.easeOut,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    marginLeft: 0,
                },
            },
        ],
    }),
);

const AppContainer = () => {

    const theme = useTheme();

    const {
        drawerWidth,
        open,
        DrawerHeader
    } = useOutletContext();

    return (

        <Main
            open={open}
            drawerWidth={drawerWidth}
        >
            <DrawerHeader />
            <Outlet />
        </Main>
    );
}

export default AppContainer;