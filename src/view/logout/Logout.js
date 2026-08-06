import { useState, useContext, useEffect } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';

import ModalUI from '../../component/UI/Modal';
import LoadingButtonUI from '../../component/UI/Buttons/LoadingButton';
import CloseButtonUI from '../../component/UI/Buttons/CloseButton';

import axios from '../../Axios';
import hmacSHA256 from '../../helper/crypto.helper';
import reloadToHashPath from '../../helper/reload.helper';
import { AuthContext } from '../../context/AuthContext';
import { AUTH_DESTROY } from '../../reducer/ActionTypes';

const ChildModal = ({ showChildModal, title, body, bgcolor, textColor, closeHandler }) => {

    return (
        <ModalUI
            title={title}
            body={body}
            open={showChildModal}
            bgcolor={bgcolor}
            textColor={textColor}
            closeHandler={closeHandler}
        />
    );
}

const Logout = ({ logoutState, closeLogoutHandler }) => {

    const [authState, authDispatch] = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);

    const [showChildModal, setShowChildModal] = useState(false);

    const [willLogout, setWillLogout] = useState(false);

    const logoutHandler = () => {

        try {

            if (localStorage.getItem('HD-Sess') !== null) {

                setIsLoading(true);

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
                    url: 'auth/destroy',
                    method: 'POST',
                    headers: headers,
                    data: data
                }).then(response => {

                    const responseData = response.data;

                    if (responseData.status === true) {

                        setWillLogout(true);
                        
                        authDispatch({
                            type: AUTH_DESTROY
                        });

                        closeLogoutHandler();
                    } else {

                        showChildModal(true);
                    }
                })
                    .catch(error => console.log(error))
                    .finally(() => setIsLoading(false));
            }

        } catch (err) {

            console.log('Error terminating session: ' + err.message);
        }
    };

    const closeChildModalHandler = () => {
        setShowChildModal(false);
    };

    useEffect(() => {

        const navigateLogoutHandler = () => {

            if (!localStorage.getItem('HD-Sess') && authState.sessionKey === null && willLogout === true) {

                setWillLogout(false);

                reloadToHashPath('/');
            }
        };

        return navigateLogoutHandler();

    }, [authState, willLogout]);

    return (
        <>
            <ModalUI
                title='Logout Account'
                open={logoutState}
                body={(
                    "Are you sure you want to logout?"
                )}
                button={
                    <>
                        <LoadingButtonUI
                            type="button"
                            loading={isLoading}
                            fullWidth={false}
                            sx={{
                                backgroundColor: '#ed6c02',
                                '&:hover': {
                                    backgroundColor: '#e65100'
                                }
                            }}
                            label="Yes"
                            onClick={logoutHandler}
                            icon={<LogoutIcon />}
                        />
                        <CloseButtonUI
                            onClick={closeLogoutHandler}
                        />
                    </>
                }
                closeHandler={closeLogoutHandler}
            />
            <ChildModal
                showChildModal={showChildModal}
                title="Failed"
                body="Unable to terminate session."
                bgcolor="warning.main"
                textColor="#fff"
                closeHandler={closeChildModalHandler}
            />
        </>
    );
};

export default Logout