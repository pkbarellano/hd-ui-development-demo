import { useState, useEffect, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LoginIcon from '@mui/icons-material/Login';

import axios from '../../../Axios';
import hmacSHA256 from '../../../helper/crypto.helper';
import reloadToHashPath from '../../../helper/reload.helper';
import { AuthContext } from '../../../context/AuthContext';

import Department from '../../../component/appInput/AppDepartment';
import ClientType from '../../../component/appInput/AppClientType';
import ModalUI from '../../../component/UI/Modal';
import LoadingButtonUI from '../../../component/UI/Buttons/LoadingButton';
import { AUTH_SET } from '../../../reducer/ActionTypes';

const LoginForm = () => {

    const [, authDispatch] = useContext(AuthContext);

    const [loginFormState, setLoginFormState] = useState({
        clientType: {
            onChange: (e, v) => clientTypeOnChangeHandler(e, v),
            margin: 'normal',
            required: false,
            label: 'Client Type',
            autoFocus: true,
            error: false,
            value: null,
            helperText: '',
            disabled: false
        },
        department: {
            onChange: (e, v) => departmentOnChangeHandler(e, v),
            margin: 'normal',
            required: false,
            label: 'Department',
            autoFocus: false,
            error: false,
            value: null,
            helperText: '',
            disabled: false
        },
        username: {
            onChange: e => inputOnChangeHandler(e),
            margin: 'normal',
            autoComplete: "new-username",
            name: "username",
            required: true,
            id: "username",
            label: "Username",
            error: false,
            value: '',
            helperText: '',
            disabled: false
        },
        password: {
            onChange: e => inputOnChangeHandler(e),
            margin: 'normal',
            autoComplete: "new-password",
            name: "password",
            required: true,
            id: "password",
            label: "Password",
            type: "password",
            error: false,
            value: '',
            helperText: '',
            disabled: false
        }
    });

    const [loginProgressState, setLoginProgressState] = useState(false);

    const [modalState, setModalState] = useState({
        title: '',
        body: '',
        open: false,
        closeHandler: () => closeModalHandler,
        textColor: '',
        bgcolor: ''
    });

    const [willLogin, setWillLogin] = useState(false);

    const clientTypeOnChangeHandler = (e, v) => {

        let value = (v !== null && v.value) ? v : null;

        setLoginFormState(prevState => ({
            ...prevState,
            clientType: {
                ...prevState.clientType,
                value: value,
                error: false,
                helperText: ''
            }
        }));
    };

    const departmentOnChangeHandler = (e, v) => {

        let value = (v !== null && v.value) ? v : null;

        setLoginFormState(prevState => ({
            ...prevState,
            department: {
                ...prevState.department,
                value: value,
                error: false,
                helperText: ''
            }
        }));
    };

    const inputOnChangeHandler = e => {

        let controlName = e.target.name;
        let controlValue = e.target.value;

        setLoginFormState(prevState => ({
            ...prevState,
            [controlName]: {
                ...prevState[controlName],
                value: controlValue,
                error: false,
                helperText: ''
            }
        }));
    };

    const closeModalHandler = () => setModalState(prevState => ({
        ...prevState,
        open: false
    }));

    useEffect(() => {
        Object.keys(loginProgressState).forEach(key => {
            setLoginFormState(prevState => ({
                ...prevState,
                [key]: {
                    ...prevState[key],
                    disabled: loginProgressState
                }
            }));
        });
    }, [loginProgressState]);

    const handleSubmit = async event => {

        setLoginProgressState(true);

        event.preventDefault();

        const form = event.currentTarget;

        let data = {
            clientType: (typeof loginFormState.clientType.value === "object" && loginFormState.clientType.value !== null) ? loginFormState.clientType.value.value : 0,
            department: (typeof loginFormState.department.value === "object" && loginFormState.department.value !== null) ? loginFormState.department.value.value : 0,
            username: loginFormState.username.value,
            password: loginFormState.password.value
        };

        let headers = {
            'X-HD-Sign': hmacSHA256(data)
        };

        if (form.checkValidity() === true) {

            axios({
                url: 'auth/read',
                method: 'POST',
                headers: headers,
                data: data
            })
                .then(response => {

                    const data = response.data;

                    if (data.status === true) {

                        setWillLogin(true);

                        authDispatch({
                            type: AUTH_SET,
                            data: data.data
                        });

                    } else {

                        setModalState(prevState =>
                        ({
                            ...prevState,
                            open: true,
                            title: 'Login invalid',
                            body: data.message,
                            bgcolor: 'warning.main',
                            textColor: '#fff'
                        })
                        );
                    }
                })
                .catch(error => console.log(error))
                .finally(() => setLoginProgressState(false));
        } else {

            checkLoginFormValidity();

            setLoginProgressState(false);

            event.stopPropagation();
        }
    };

    const checkLoginFormValidity = () => {

        Object.keys(loginFormState).forEach(key => {

            if (loginFormState[key].required === true && (loginFormState[key].value === '' || loginFormState[key].value === null)) {

                setLoginFormState(prevState => ({
                    ...prevState,
                    [key]: {
                        ...prevState[key],
                        error: true,
                        helperText: `${prevState[key].label} is required`
                    }
                }));
            }
        });
    };

    useEffect(() => {

        const willLoginHandler = () => {

            if (willLogin === true) {

                setWillLogin(false);

                reloadToHashPath('/');
            }
        };

        return willLoginHandler();
    }, [willLogin]);

    return (
        <>
            <ModalUI
                title={modalState.title}
                body={modalState.body}
                open={modalState.open}
                closeHandler={modalState.closeHandler()}
                textColor={modalState.textColor}
                bgcolor={modalState.bgcolor}
            />
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <ClientType
                    {...loginFormState.clientType}
                />
                <Department
                    {...loginFormState.department}
                />
                <TextField
                    {...loginFormState.username}
                />
                <TextField
                    {...loginFormState.password}
                />
                <LoadingButtonUI
                    type="submit"
                    loading={loginProgressState}
                    fullWidth={true}
                    sx={{
                        mt: 3,
                        mb: 2,
                        backgroundColor: 'info',
                        '&:hover': {
                            backgroundColor: 'darkinfo'
                        }
                    }}
                    label="Sign In"
                    icon={<LoginIcon />}
                />
            </Box>
        </>
    );
};

export default LoginForm;