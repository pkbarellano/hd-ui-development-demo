import {
    createHashRouter,
    RouterProvider
} from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';

import axios from '../../Axios';
import RouteList from './RouteList';
import { NAVIGATION_SET } from '../../reducer/ActionTypes';
import { NavContext } from '../../context/NavigationContext';

import App from '../../App';
import DefaultLayout from '../defaultLayout/DefaultLayout';
import AppTopnav from '../../component/AppTopnav';
import AppDrawer from '../../component/AppDrawer';
import AppContainer from '../../component/AppContainer';
import Landing from '../../view/landing/Landing';
import Login from '../../view/login/Login';
import LoginForm from '../../view/login/loginForm/LoginForm';
import Signup from '../../view/signup/Signup';
import SignupForm from '../../view/signup/signupForm/SignupForm';

import hmacSHA256 from '../../helper/crypto.helper';

const fetchRoutes = async (navState, navDispatch) => {

    try {

        if (localStorage.getItem('HD-Sess') !== null) {

            const localSession = JSON.parse(localStorage.getItem('HD-Sess'));

            let url;
            let staffRouteList = [];
            let cPanelRouteList = [];
            let allRoutes = [];
            const sessionNav = JSON.parse(localStorage.getItem('HD-Sess-Nav'));

            if (localSession.clientType === 0 || localSession.clientType === 2) {

                url = "navigation/agent";

                staffRouteList = RouteList.filter(el => {

                    return el.panel === "AGENT";
                });

                cPanelRouteList = RouteList.filter(el => {

                    return el.panel === "CPANEL"
                });
            } else {

                url = "navigation/user";

                staffRouteList = RouteList.filter(el => {

                    return el.panel === "USER";
                });
            }

            let data = {
                group: localSession.group
            };

            let headers = {
                'X-HD-Sign': hmacSHA256(data)
            };

            const nav = await axios({
                url: url,
                method: 'post',
                headers: headers,
                data: data
            })
                .then(response => {

                    const data = response.data;

                    const dispatchData = {
                        mainComponentRouteList: staffRouteList,
                        cPanelComponentRouteList: cPanelRouteList,
                        mainPanelNavigation: (data.mainPanelNavigation) ? data.mainPanelNavigation : {},
                        cPanelNavigation: (data.cPanelNavigation) ? data.cPanelNavigation : {}
                    };

                    if (data.status === true) {
                        navDispatch({
                            type: NAVIGATION_SET,
                            data: dispatchData
                        });
                    }

                    return data;
                })
                .catch(error => console.log(error));

            if (nav) {

                if (sessionNav.interface === 'MAIN' && staffRouteList.length > 0) {

                    allRoutes = nav.mainPanelNavigation.firstLevel.rows.map(firstLevelItem => {

                        if (firstLevelItem.Navigation.hasSub === 'Y') {

                            let findFirstNav = staffRouteList.filter(firstEl => {
                                return firstEl.firstLevel === firstLevelItem.Navigation.firstLevel && firstEl.secondLevel === 0 && firstEl.thirdLevel === 0 && firstEl.hasSub === 'Y';
                            });

                            let childrenFilter = nav.mainPanelNavigation.secondLevel.rows.filter(child => {

                                return firstLevelItem.Navigation.firstLevel === child.Navigation.firstLevel && child.Navigation.secondLevel > 0;
                            });

                            let children = childrenFilter.map(secondLevelItem => {

                                if (secondLevelItem.Navigation.hasSub === 'Y') {

                                    let findSecondNav = staffRouteList.filter(secondEl => {

                                        return secondEl.firstLevel === secondLevelItem.Navigation.firstLevel && secondEl.secondLevel === secondLevelItem.Navigation.secondLevel && secondEl.thirdLevel === 0;
                                    });

                                    let grandChildrenFilter = nav.mainPanelNavigation.thirdLevel.rows.filter(grandChild => {

                                        return secondLevelItem.Navigation.firstLevel === grandChild.Navigation.firstLevel && secondLevelItem.Navigation.secondLevel === grandChild.Navigation.secondLevel && grandChild.Navigation.thirdLevel > 0;
                                    });

                                    let grandChildren = grandChildrenFilter.map(thirdLevelItem => {

                                        let findThirdNav = staffRouteList.filter(thirdEl => {

                                            return thirdEl.firstLevel === thirdLevelItem.Navigation.firstLevel && thirdEl.secondLevel === thirdLevelItem.Navigation.secondLevel && thirdEl.thirdLevel > 0;
                                        });

                                        if (findThirdNav.length > 0) {

                                            return {
                                                path: findThirdNav[0].url,
                                                element: findThirdNav[0].component
                                            };
                                        } else {

                                            return {};
                                        }
                                    });

                                    if (findSecondNav.length > 0) {

                                        return {
                                            path: findSecondNav[0].url,
                                            element: findSecondNav[0].component,
                                            children: grandChildren
                                        };
                                    } else {

                                        return {};
                                    }
                                } else {

                                    let findSecondNav = staffRouteList.filter(secondEl => {

                                        return secondEl.firstLevel === secondLevelItem.Navigation.firstLevel && secondEl.secondLevel === secondLevelItem.Navigation.secondLevel && secondEl.thirdLevel === 0;
                                    });

                                    if (findSecondNav.length > 0) {

                                        return {
                                            path: findSecondNav[0].url,
                                            element: findSecondNav[0].component
                                        };
                                    } else {

                                        return {};
                                    }
                                }
                            });

                            if (findFirstNav.length > 0) {

                                return {
                                    path: findFirstNav[0].url,
                                    element: findFirstNav[0].component,
                                    children: children
                                };
                            } else {

                                return {};
                            }
                        } else {

                            let findFirstNav = staffRouteList.filter(firstEl => {
                                return firstEl.firstLevel === firstLevelItem.Navigation.firstLevel && firstEl.secondLevel === 0 && firstEl.thirdLevel === 0 && firstEl.hasSub === 'N';
                            });

                            if (findFirstNav.length > 0) {

                                return {
                                    path: findFirstNav[0].url,
                                    element: findFirstNav[0].component
                                };
                            } else {

                                return {};
                            }
                        }
                    });
                }

                if (sessionNav.interface === 'CPANEL' && cPanelRouteList.length > 0) {

                    allRoutes = nav.cPanelNavigation.firstLevel.rows.map(firstLevelItem => {

                        if (firstLevelItem.Navigation.hasSub === 'Y') {

                            let findFirstNav = cPanelRouteList.filter(firstEl => {
                                return firstEl.firstLevel === firstLevelItem.Navigation.firstLevel && firstEl.secondLevel === 0 && firstEl.thirdLevel === 0 && firstEl.hasSub === 'Y';
                            });

                            let childrenFilter = nav.cPanelNavigation.secondLevel.rows.filter(child => {

                                return firstLevelItem.Navigation.firstLevel === child.Navigation.firstLevel && child.Navigation.secondLevel > 0;
                            });

                            let children = childrenFilter.map(secondLevelItem => {

                                if (secondLevelItem.Navigation.hasSub === 'Y') {

                                    let findSecondNav = cPanelRouteList.filter(secondEl => {

                                        return secondEl.firstLevel === secondLevelItem.Navigation.firstLevel && secondEl.secondLevel === secondLevelItem.Navigation.secondLevel && secondEl.thirdLevel === 0;
                                    });

                                    let grandChildrenFilter = nav.cPanelNavigation.thirdLevel.rows.filter(grandChild => {

                                        return secondLevelItem.Navigation.firstLevel === grandChild.Navigation.firstLevel && secondLevelItem.Navigation.secondLevel === grandChild.Navigation.secondLevel && grandChild.Navigation.thirdLevel > 0;
                                    });

                                    let grandChildren = grandChildrenFilter.map(thirdLevelItem => {

                                        let findThirdNav = cPanelRouteList.filter(thirdEl => {

                                            return thirdEl.firstLevel === thirdLevelItem.Navigation.firstLevel && thirdEl.secondLevel === thirdLevelItem.Navigation.secondLevel && thirdEl.thirdLevel > 0;
                                        });

                                        if (findThirdNav.length > 0) {

                                            return {
                                                path: findThirdNav[0].url,
                                                element: findThirdNav[0].component
                                            };
                                        } else {

                                            return {};
                                        }
                                    });

                                    if (findSecondNav.length > 0) {

                                        return {
                                            path: findSecondNav[0].url,
                                            element: findSecondNav[0].component,
                                            children: grandChildren
                                        };
                                    } else {

                                        return {};
                                    }
                                } else {

                                    let findSecondNav = cPanelRouteList.filter(secondEl => {

                                        return secondEl.firstLevel === secondLevelItem.Navigation.firstLevel && secondEl.secondLevel === secondLevelItem.Navigation.secondLevel && secondEl.thirdLevel === 0;
                                    });

                                    if (findSecondNav.length > 0) {

                                        return {
                                            path: findSecondNav[0].url,
                                            element: findSecondNav[0].component
                                        };
                                    } else {

                                        return {};
                                    }
                                }
                            });

                            if (findFirstNav.length > 0) {

                                return {
                                    path: findFirstNav[0].url,
                                    element: findFirstNav[0].component,
                                    children: children
                                };
                            } else {

                                return {};
                            }
                        } else {

                            let findFirstNav = cPanelRouteList.filter(firstEl => {
                                return firstEl.firstLevel === firstLevelItem.Navigation.firstLevel && firstEl.secondLevel === 0 && firstEl.thirdLevel === 0 && firstEl.hasSub === 'N';
                            });

                            if (findFirstNav.length > 0) {

                                return {
                                    path: findFirstNav[0].url,
                                    element: findFirstNav[0].component
                                };
                            } else {

                                return {};
                            }
                        }
                    });
                }
            }

            return [
                {
                    path: '/',
                    element: <App />,
                    children: [
                        {
                            path: '/',
                            element: <DefaultLayout />,
                            children: [
                                {
                                    path: '/',
                                    element: <AppTopnav />,
                                    children: [
                                        {
                                            path: '/',
                                            element: <AppDrawer />,
                                            children: [
                                                {
                                                    path: '/',
                                                    element: <AppContainer />,
                                                    children: allRoutes
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                        }
                    ]
                }
            ];

        } else {

            return [
                {
                    path: '/',
                    element: <App />,
                    children: [
                        {
                            path: '/',
                            element: <DefaultLayout />,
                            children: [
                                {
                                    path: '/',
                                    element: <AppTopnav />,
                                    children: [
                                        {
                                            path: '/',
                                            element: <AppDrawer />,
                                            children: [
                                                {
                                                    path: '/',
                                                    element: <AppContainer />,
                                                    children: [
                                                        {
                                                            path: '/',
                                                            element: <Landing />
                                                        },
                                                        {
                                                            path: 'login',
                                                            element: <Login />,
                                                            children: [
                                                                {
                                                                    path: '',
                                                                    element: <LoginForm />
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            path: 'signup',
                                                            element: <Signup />,
                                                            children: [
                                                                {
                                                                    path: '',
                                                                    element: <SignupForm />
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                        }
                    ]
                }
            ];
        }

    } catch (err) {

        console.error('Error fetching routes: ' + err);

        return [];
    }
};

const createRoutes = (data) => {

    return data.map(route => ({
        path: route.path,
        element: route.element,
        children: route.children ? createRoutes(route.children) : []
    }));
};

const RouterComponent = () => {

    const [navState, navDispatch] = useContext(NavContext);

    const [router, setRouter] = useState(null);

    useEffect(() => {

        const initializeRoutes = async () => {
            const routeData = await fetchRoutes(navState, navDispatch);
            const routes = createRoutes(routeData);
            setRouter(createHashRouter(routes));
        };

        initializeRoutes();
    }, []);

    if (!router) {
        return;
    }

    return <RouterProvider router={router} />;
};

export default RouterComponent;