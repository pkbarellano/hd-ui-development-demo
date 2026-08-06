import React, {
    useContext,
    useState
} from 'react';
import {
    Link as RouterLink,
    useLocation
} from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';

import { NavContext } from '../../context/NavigationContext';

const AppDrawerMenu = () => {

    const location = useLocation();

    const [navState] = useContext(NavContext);

    const [listItemExpand, setListItemExpand] = useState({});

    const handleCollapse = (item) => {

        setListItemExpand((prevState) => ({
            ...prevState,
            [item]: !prevState[item],
        }));
    };

    const routerHandler = () => {

        let drawerMenu = null;

        let panelNavigation = navState.mainPanelNavigation;

        let componentRouteList = navState.mainComponentRouteList;

        const sessionNav = JSON.parse(localStorage.getItem('HD-Sess-Nav'));

        if (localStorage.getItem('HD-Sess-Nav')) {

            if (sessionNav.hasOwnProperty('interface') && sessionNav.interface === 'CPANEL') {

                panelNavigation = navState.cPanelNavigation;
    
                componentRouteList = navState.cPanelComponentRouteList;
            }
        }

        if (Object.keys(panelNavigation).length > 0) {

            drawerMenu = panelNavigation.firstLevel.rows.map(firstLevelItem => {

                if (firstLevelItem.Navigation.hasSub === 'Y') {

                    let findFirstNav = componentRouteList.filter(firstEl => {
                        return firstEl.hasMenu === 'Y' && firstEl.firstLevel === firstLevelItem.Navigation.firstLevel && firstEl.secondLevel === 0 && firstEl.thirdLevel === 0 && firstEl.hasSub === 'Y';
                    });

                    let childrenFilter = panelNavigation.secondLevel.rows.filter(child => {

                        return firstLevelItem.Navigation.firstLevel === child.Navigation.firstLevel && child.Navigation.secondLevel > 0;
                    });

                    let children = childrenFilter.map(secondLevelItem => {

                        if (secondLevelItem.Navigation.hasSub === 'Y') {

                            let findSecondNav = componentRouteList.filter(secondEl => {

                                return secondEl.hasMenu === 'Y' && secondEl.firstLevel === secondLevelItem.Navigation.firstLevel && secondEl.secondLevel === secondLevelItem.Navigation.secondLevel && secondEl.thirdLevel === 0;
                            });

                            let grandChildrenFilter = panelNavigation.thirdLevel.rows.filter(grandChild => {

                                return secondLevelItem.Navigation.firstLevel === grandChild.Navigation.firstLevel && secondLevelItem.Navigation.secondLevel === grandChild.Navigation.secondLevel && grandChild.Navigation.thirdLevel > 0;
                            });

                            let grandChildren = grandChildrenFilter.map(thirdLevelItem => {

                                let findThirdNav = componentRouteList.filter(thirdEl => {

                                    return thirdEl.hasMenu === 'Y' && thirdEl.firstLevel === thirdLevelItem.Navigation.firstLevel && thirdEl.secondLevel === thirdLevelItem.Navigation.secondLevel && thirdEl.thirdLevel > 0;
                                });

                                if (findThirdNav.length > 0) {

                                    let label = findThirdNav[0].label.toUpperCase();

                                    return (
                                        <ListItem key={findThirdNav[0].id} disablePadding>
                                            <ListItemButton selected={location.pathname === findThirdNav[0].url} sx={{ pl: 6 }} to={findThirdNav[0].url} component={RouterLink} state={{ label }}>
                                                <ListItemIcon>
                                                    {findThirdNav[0].icon}
                                                </ListItemIcon>
                                                <ListItemText primary={findThirdNav[0].label} />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                } else {

                                    return {};
                                }
                            });

                            if (findSecondNav.length > 0) {

                                return (
                                    <React.Fragment key={findSecondNav[0].id}>
                                        <ListItem key={findSecondNav[0].id} disablePadding>
                                            <ListItemButton sx={{ pl: 4 }} onClick={() => handleCollapse([secondLevelItem.Navigation.secondLevel])}>
                                                <ListItemIcon>
                                                    {findSecondNav[0].icon}
                                                </ListItemIcon>
                                                <ListItemText primary={findSecondNav[0].label} />
                                                {(listItemExpand[secondLevelItem.Navigation.secondLevel]) ? <ExpandLess /> : <ExpandMore />}
                                            </ListItemButton>
                                        </ListItem>
                                        <Collapse in={listItemExpand[secondLevelItem.Navigation.secondLevel]} timeout="auto" unmountOnExit>
                                            <List>
                                                {grandChildren}
                                            </List>
                                        </Collapse>
                                    </React.Fragment>
                                );
                            } else {

                                return null;
                            }
                        } else {

                            let findSecondNav = componentRouteList.filter(secondEl => {

                                return secondEl.hasMenu === 'Y' && secondEl.firstLevel === secondLevelItem.Navigation.firstLevel && secondEl.secondLevel === secondLevelItem.Navigation.secondLevel && secondEl.thirdLevel === 0;
                            });

                            if (findSecondNav.length > 0) {

                                let label = findSecondNav[0].label.toUpperCase();

                                return (
                                    <ListItem key={findSecondNav[0].id} disablePadding>
                                        <ListItemButton selected={location.pathname === findSecondNav[0].url} sx={{ pl: 4 }} to={findSecondNav[0].url} component={RouterLink} state={{ label }}>
                                            <ListItemIcon>
                                                {findSecondNav[0].icon}
                                            </ListItemIcon>
                                            <ListItemText primary={findSecondNav[0].label} />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            } else {

                                return null;
                            }
                        }
                    });

                    if (findFirstNav.length > 0) {

                        return (
                            <React.Fragment key={findFirstNav[0].id}>
                                <ListItem key={findFirstNav[0].id} disablePadding>
                                    <ListItemButton onClick={() => handleCollapse([firstLevelItem.Navigation.firstLevel])}>
                                        <ListItemIcon>
                                            {findFirstNav[0].icon}
                                        </ListItemIcon>
                                        <ListItemText primary={findFirstNav[0].label} />
                                        {(listItemExpand[firstLevelItem.Navigation.firstLevel]) ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                </ListItem>
                                <Collapse in={listItemExpand[firstLevelItem.Navigation.firstLevel]} timeout="auto" unmountOnExit>
                                    <List>
                                        {children}
                                    </List>
                                </Collapse>
                            </React.Fragment>
                        );
                    } else {

                        return null;
                    }
                } else {

                    let findFirstNav = componentRouteList.filter(firstEl => {
                        return firstEl.hasMenu === 'Y' && firstEl.firstLevel === firstLevelItem.Navigation.firstLevel && firstEl.secondLevel === 0 && firstEl.thirdLevel === 0 && firstEl.hasSub === 'N';
                    });

                    if (findFirstNav.length > 0) {

                        let label = findFirstNav[0].label.toUpperCase();

                        return (
                            <ListItem key={findFirstNav[0].id} disablePadding>
                                <ListItemButton selected={location.pathname === findFirstNav[0].url} to={findFirstNav[0].url} component={RouterLink} state={{ label }}>
                                    <ListItemIcon>
                                        {findFirstNav[0].icon}
                                    </ListItemIcon>
                                    <ListItemText primary={findFirstNav[0].label} />
                                </ListItemButton>
                            </ListItem>
                        );
                    } else {

                        return null;
                    }
                }
            });

        }

        return drawerMenu;
    };

    return (
        <div>
            <List>
                {routerHandler()}
            </List>
        </div>
    );
};

export default AppDrawerMenu;