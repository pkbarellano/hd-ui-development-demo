import React, {
    useState,
    useContext,
    useEffect
} from 'react';
import {
    Link as RouterLink,
    Outlet
} from 'react-router-dom';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginSharpIcon from '@mui/icons-material/LoginSharp';
import AppRegistrationSharpIcon from '@mui/icons-material/AppRegistrationSharp';
import Box from '@mui/material/Box';

import Logo from './UI/Logo';
import reloadToHashPath from '../helper/reload.helper';

import { AuthContext } from '../context/AuthContext';
import { NavContext } from '../context/NavigationContext';
import Logout from '../view/logout/Logout';

const menuBarHandler = (sessionKey, navState, handleClose, logoutModalHandler, switchPanelHandler) => {

    if (sessionKey !== null) {

        const session = JSON.parse(localStorage.getItem('HD-Sess'));

        const sessionNav = JSON.parse(localStorage.getItem('HD-Sess-Nav'));

        let menuBar = [
            {
                label: 'Logout',
                icon: <LogoutIcon fontSize='small' />,
                onClick: () => {
                    handleClose();
                    logoutModalHandler();
                }
            }
        ];

        if (session.clientTypeName === 'agent') {

            menuBar = [
                (sessionNav.interface === 'MAIN') ? {
                    component: RouterLink,
                    label: 'Control Panel',
                    to: '/',
                    icon: <AdminPanelSettingsIcon fontSize='small' />,
                    onClick: () => switchPanelHandler()
                } : {
                    component: RouterLink,
                    label: 'Main Panel',
                    to: '/',
                    icon: <HomeWorkIcon fontSize='small' />,
                    onClick: () => switchPanelHandler()
                },
                ...menuBar,
            ]
        }

        return menuBar;
    } else {

        return [
            {
                component: RouterLink,
                label: 'Signin',
                to: '/login',
                icon: <LoginSharpIcon fontSize='small' />,
                onClick: () => handleClose()
            },
            {
                component: RouterLink,
                label: 'Signup',
                to: '/signup',
                icon: <AppRegistrationSharpIcon fontSize='small' />,
                onClick: () => handleClose()
            }
        ];
    }
};

const drawerWidth = (localStorage.getItem('HD-Sess') !== null) ? 240 : 0;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                width: `calc(100% - ${drawerWidth}px)`,
                marginLeft: `${drawerWidth}px`,
                transition: theme.transitions.create(['margin', 'width'], {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const AppTopnav = () => {

    const [authState] = useContext(AuthContext);

    const [navState] = useContext(NavContext);

    const [anchorEl, setAnchorEl] = useState(null);

    const [menuState, setMenuState] = useState([]);

    const [logoutModalState, setLogoutModalState] = useState(false);

    const [willSwitchPanel, setWillSwitchPanel] = useState(false);

    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logoutModalHandler = () => {

        setLogoutModalState(!logoutModalState);
    };

    const switchPanelHandler = () => {

        const switchPanel = () => {

            const sessionNav = JSON.parse(localStorage.getItem('HD-Sess-Nav'));

            sessionNav.interface = (sessionNav.interface === 'CPANEL') ? 'MAIN' : 'CPANEL';

            localStorage.setItem('HD-Sess-Nav', JSON.stringify(sessionNav));

            setWillSwitchPanel(true);
        };

        return switchPanel();
    };

    useEffect(() => {

        const setMenuStateHandler = () => {

            setMenuState(menuBarHandler(authState.sessionKey, navState, handleClose, logoutModalHandler, switchPanelHandler));
        };

        return setMenuStateHandler();
    }, [authState]);

    useEffect(() => {

        const willSwitchPanelHandler = () => {

            if (willSwitchPanel === true) {

                setWillSwitchPanel(false);

                const sessionNav = JSON.parse(localStorage.getItem('HD-Sess-Nav'));

                reloadToHashPath(sessionNav.interface === 'CPANEL' ? '/systemlogs' : '/');
            }
        };

        return willSwitchPanelHandler();
    }, [willSwitchPanel]);

    return (
        <>
            <Logout
                logoutState={logoutModalState}
                closeLogoutHandler={logoutModalHandler}
            />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    {
                        (authState.sessionKey !== null) && (
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                sx={[
                                    {
                                        mr: 2,
                                    },
                                    open && { display: 'none' },
                                ]}
                            >
                                <MenuIcon />
                            </IconButton>
                        )
                    }
                    <Typography variant="h6" noWrap component="div">
                        <Logo />
                    </Typography>
                    <Box
                        sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'flex-end' }}
                    >
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            edge="end"
                        >
                            <Typography variant="h6" component="div" fontSize='1rem'>
                                Welcome {(authState.sessionKey !== null) ? authState.firstName + ' ' + authState.lastName : 'Guest'}
                            </Typography>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            {
                                (menuState) &&
                                menuState.map((item, index) => {
                                    return (
                                        <Link key={index} component={item.component} to={item.to}>
                                            <MenuItem onClick={item.onClick}>
                                                <ListItemIcon>{item.icon}</ListItemIcon>
                                                <ListItemText>{item.label}</ListItemText>
                                            </MenuItem>
                                        </Link>
                                    );
                                })
                            }
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Outlet
                context={{
                    drawerWidth: drawerWidth,
                    open: open,
                    handleDrawerClose: handleDrawerClose
                }}
            />
        </>
    );
};

export default AppTopnav;