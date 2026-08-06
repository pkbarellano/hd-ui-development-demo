import { useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';

import axios from '../../Axios';
import hmacSHA256 from '../../helper/crypto.helper';
import { AuthContext } from '../../context/AuthContext';
import { AUTH_SET, AUTH_DESTROY } from '../../reducer/ActionTypes';

const DefaultLayout = () => {

    const [, authDispatch] = useContext(AuthContext);

    const [dataState, setDataState] = useState(null);

    const [renderComponentState, setRenderComponentState] = useState(false);

    const [dispatchDataState, setDispatchDataState] = useState(false);

    useEffect(() => {

        const authenticateCheck = () => {

            if (renderComponentState === false && dispatchDataState === false) {

                try {

                    if (localStorage.getItem('HD-Sess') !== null) {

                        const localSession = JSON.parse(localStorage.getItem('HD-Sess'));

                        let data = {
                            sessionKey: localSession.sessionKey,
                            clientType: localSession.clientType,
                            department: localSession.department
                        };

                        let headers = {
                            'X-HD-Sign': hmacSHA256(data)
                        };

                        axios({
                            url: 'session/read',
                            method: 'POST',
                            headers: headers,
                            data: data
                        }).then(response => {

                            const responseData = response.data;

                            if (responseData.status === true) {

                                setDataState(responseData.data);
                            } else {

                                authDispatch({
                                    type: AUTH_DESTROY
                                });
                            }

                            setDispatchDataState(true)
                        })
                            .catch(error => console.log(error));
                    } else {

                        setDispatchDataState(true);
                    }

                } catch (err) {

                    console.error('Error validating authentication: ' + err.message);
                }
            }
        }

        return authenticateCheck();
    }, []);

    useEffect(() => {

        const renderHandler = () => {

            if (dispatchDataState === true) {

                try {

                    if (dataState !== null) {

                        authDispatch({
                            type: AUTH_SET,
                            data: dataState
                        });
                    }

                    setRenderComponentState(true);
                } catch (err) {

                    console.log('Error default layout dispatch: ' + err.message);
                }
            }
        };

        return renderHandler();
    }, [dispatchDataState]);

    return (
        <Box sx={{ display: "flex" }}>
            {(renderComponentState) &&
                <Outlet />}
        </Box>
    );
};

export default DefaultLayout;