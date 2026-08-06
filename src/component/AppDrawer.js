import { useContext } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { AuthContext } from '../context/AuthContext';
import { NavContext } from '../context/NavigationContext';
import AppDrawerMenu from './appDrawer/AppDrawerMenu';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const AppDrawer = () => {

    const theme = useTheme();

    const [authState] = useContext(AuthContext);

    const [navState] = useContext(NavContext);

    const {
        drawerWidth,
        open,
        handleDrawerClose
    } = useOutletContext();

    return (
        <>
            {(authState.sessionKey === null && navState.mainComponentRouteList.length === 0) ?
                (<></>) : (
                    <>
                        <Drawer
                            sx={{
                                width: drawerWidth,
                                flexShrink: 0,
                                '& .MuiDrawer-paper': {
                                    width: drawerWidth,
                                    boxSizing: 'border-box',
                                },
                            }}
                            variant="persistent"
                            anchor="left"
                            open={open}
                        >
                            <DrawerHeader>
                                <IconButton onClick={handleDrawerClose}>
                                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                                </IconButton>
                            </DrawerHeader>
                            <Divider />
                            <AppDrawerMenu />
                        </Drawer>
                    </>
                )}
            <Outlet
                context={{
                    drawerWidth: drawerWidth,
                    open: open,
                    DrawerHeader: DrawerHeader
                }}
            />
        </>
    );
};

export default AppDrawer;