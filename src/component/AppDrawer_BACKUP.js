import React, { useContext } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import {
  Drawer,
  Box
} from '@mui/material';

import AppDrawerMenu from './appDrawer/AppDrawerMenu';

import { AuthContext } from '../context/AuthContext';
import { NavContext } from '../context/NavigationContext';

const drawerWidth = 240;

const AppDrawer = () => {

  const [authState] = useContext(AuthContext);

  const [navState] = useContext(NavContext);

  const {
    mobileOpenContext,
    isClosingContext
  } = useOutletContext();

  const handleDrawerClose = () => {
    isClosingContext.setIsClosing(true);
    mobileOpenContext.setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    isClosingContext.setIsClosing(false);
  };

  return (
    <React.Fragment>
      {(authState.sessionKey === null && navState.mainComponentRouteList.length === 0) ?
        (<React.Fragment></React.Fragment>) : (
          <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="drawer menu"
          >
            <Drawer
              variant="temporary"
              open={mobileOpenContext.mobileOpen}
              onTransitionEnd={handleDrawerTransitionEnd}
              onClose={handleDrawerClose}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
            >
              <AppDrawerMenu />
            </Drawer>
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
              open
            >
              <AppDrawerMenu />
            </Drawer>
          </Box>
        )}
      <Outlet />
    </React.Fragment>
  );
}

export default AppDrawer;