import React, {
    useState,
    useContext,
    useEffect
} from 'react';
import {
    Link as RouterLink,
    Outlet
} from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    ListItemText,
    ListItemIcon
} from '@mui/material';
import AppRegistrationSharpIcon from '@mui/icons-material/AppRegistrationSharp';
import LoginSharpIcon from '@mui/icons-material/LoginSharp';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from '@mui/material/Link';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MenuIcon from '@mui/icons-material/Menu';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import Box from '@mui/material/Box';

import { AuthContext } from '../context/AuthContext';
import { NavContext } from '../context/NavigationContext';
import Logout from '../view/logout/Logout';

const menuBarHandler = (sessionKey, navState, handleClose, logoutModalHandler, switchPanelHandler) => {

    if (sessionKey !== null) {

        const sessionNav = JSON.parse(localStorage.getItem('HD-Sess-Nav'));

        return [
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
            {
                label: 'Logout',
                icon: <LogoutIcon fontSize='small' />,
                onClick: () => {
                    handleClose();
                    logoutModalHandler();
                }
            }
        ];
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

const AppTopnav = () => {

    const [authState] = useContext(AuthContext);

    const [navState] = useContext(NavContext);

    const [anchorEl, setAnchorEl] = useState(null);

    const [menuState, setMenuState] = useState([]);

    const [logoutModalState, setLogoutModalState] = useState(false);

    const [mobileOpen, setMobileOpen] = useState(false);

    const [isClosing, setIsClosing] = useState(false);

    const [willSwitchPanel, setWillSwitchPanel] = useState(false);

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

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
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

                let baseURL = 'http://' + window.location.host;

                const sessionNav = JSON.parse(localStorage.getItem('HD-Sess-Nav'));

                if (sessionNav.interface === 'CPANEL') {

                    baseURL = baseURL + '/systemlogs'
                }

                window.location.replace(baseURL);
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
            <AppBar
                position="fixed"
                sx={{
                    width: (authState.sessionKey === null) ? { sm: `calc(100%)` } : { sm: `calc(100% - 240px)` },
                    ml: { sm: `240px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
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
                    </Box>
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
                </Toolbar>
            </AppBar >
            <Outlet
                context={{
                    mobileOpenContext: { mobileOpen: mobileOpen, setMobileOpen: setMobileOpen },
                    isClosingContext: { isClosing: isClosing, setIsClosing: setIsClosing }
                }}
            />
        </>
    );
}

export default AppTopnav;