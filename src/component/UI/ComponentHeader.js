import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import {
    CardHeader,
    Avatar,
} from '@mui/material';
import { grey } from '@mui/material/colors';

import { NavContext } from '../../context/NavigationContext';

const ComponentHeader = () => {

    const location = useLocation();

    const [navState] = useContext(NavContext);

    const [componentLabel, setComponentLabel] = useState('');

    useEffect(() => {

        const labelHandler = () => {

            const sessNav = JSON.parse(localStorage.getItem('HD-Sess-Nav'));

            const navStateRoute = (sessNav.interface === 'CPANEL') ? navState.cPanelComponentRouteList : navState.mainComponentRouteList;

            const routeComponent = navStateRoute.filter(el => {

                return el.url === location.pathname;
            });

            if (routeComponent.length > 0) {

                setComponentLabel(routeComponent[0].label.toUpperCase());
            }
        };

        return labelHandler();
    }, []);

    return (
        <>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: grey[600] }} aria-label="clients">
                        {componentLabel.charAt(0)}
                    </Avatar>
                }
                title={componentLabel}
                titleTypographyProps={{ variant: 'h6' }}
            />
        </>
    );
};

export default ComponentHeader;