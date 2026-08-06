import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

import axios from '../../../Axios';
import hmacSHA256 from '../../../helper/crypto.helper';

import Department from '../../../component/appInput/AppDepartment';
import ModalUI from '../../../component/UI/Modal';
import LoadingButtonUI from '../../../component/UI/Buttons/LoadingButton';

const SignupForm = () => {

    const [signupFormState, setSignupFormState] = useState({
        department: {
            onChange: (e, v) => departmentOnChangeHandler(e, v),
            required: true,
            label: 'Department',
            autoFocus: true,
            error: false,
            value: null,
            helperText: '',
            disabled: false,
            textFieldType: 'select'
        },
        firstName: {
            onChange: e => inputOnChangeHandler(e),
            autoComplete: "given-name",
            name: "firstName",
            required: true,
            id: "firstName",
            label: "First Name",
            error: false,
            value: '',
            helperText: '',
            disabled: false,
            textFieldType: 'text'
        },
        middleName: {
            onChange: e => inputOnChangeHandler(e),
            autoComplete: "middle-name",
            name: "middleName",
            required: true,
            id: "middleName",
            label: "Middle Name",
            error: false,
            value: '',
            helperText: '',
            disabled: false,
            textFieldType: 'text'
        },
        lastName: {
            onChange: e => inputOnChangeHandler(e),
            autoComplete: "family-name",
            name: "lastName",
            required: true,
            id: "lastName",
            label: "Last Name",
            error: false,
            value: '',
            helperText: '',
            disabled: false,
            textFieldType: 'text'
        },
        email: {
            onChange: e => inputOnChangeHandler(e),
            autoComplete: "email",
            name: "email",
            required: true,
            id: "email",
            label: "Email Address",
            error: false,
            value: '',
            helperText: '',
            disabled: false,
            textFieldType: 'text'
        },
        username: {
            onChange: e => inputOnChangeHandler(e),
            autoComplete: "new-username",
            name: "username",
            required: true,
            id: "username",
            label: "Username",
            error: false,
            value: '',
            helperText: '',
            disabled: false,
            textFieldType: 'text'
        },
        password: {
            onChange: e => inputOnChangeHandler(e),
            autoComplete: "new-password",
            name: "password",
            required: true,
            id: "password",
            label: "Password",
            type: "password",
            error: false,
            value: '',
            helperText: '',
            disabled: false,
            textFieldType: 'text'
        }
    });

    const [modalState, setModalState] = useState({
        title: '',
        body: '',
        open: false,
        closeHandler: () => closeModalHandler,
        textColor: '',
        bgcolor: ''
    });

    const [signupProgressState, setSignupProgressState] = useState(false);

    useEffect(() => {
        Object.keys(signupFormState).forEach(key => {
            setSignupFormState(prevState => ({
                ...prevState,
                [key]: {
                    ...prevState[key],
                    disabled: signupProgressState
                }
            }));
        });
    }, [signupProgressState]);

    const handleSubmit = (event) => {

        setSignupProgressState(true);

        event.preventDefault();

        const form = event.currentTarget;

        if (form.checkValidity() === true) {

            let data = {
                department: signupFormState.department.value.value,
                firstName: signupFormState.firstName.value,
                middleName: signupFormState.middleName.value,
                lastName: signupFormState.lastName.value,
                email: signupFormState.email.value,
                username: signupFormState.username.value,
                password: signupFormState.password.value
            };

            let headers = {
                'X-HD-Sign': hmacSHA256(data)
            };

            axios({
                url: 'signup/create',
                method: 'POST',
                headers: headers,
                data: data
            })
                .then(response => {

                    const data = response.data;

                    if (data.status === true) {

                        setModalState(prevState =>
                        ({
                            ...prevState,
                            open: true,
                            title: 'Completed',
                            body: data.message,
                            bgcolor: 'success.main',
                            textColor: '#fff'
                        })
                        );

                        resetSignupForm();
                    } else {

                        setModalState(prevState =>
                        ({
                            ...prevState,
                            open: true,
                            title: 'Signup invalid',
                            body: data.message,
                            bgcolor: 'warning.main',
                            textColor: '#fff'
                        })
                        );
                    }
                })
                .catch(error => console.log(error))
                .finally(() => setSignupProgressState(false));
        } else {

            checkFormValidity();

            event.stopPropagation();

            setSignupProgressState(false);
        }
    };

    const checkFormValidity = () => {

        Object.keys(signupFormState).forEach(key => {

            if (signupFormState[key].required === true && (signupFormState[key].value === '' || signupFormState[key].value === null)) {

                setSignupFormState(prevState => ({
                    ...prevState,
                    [key]: {
                        ...prevState[key],
                        error: true,
                        helperText: `${prevState[key].label} is required`
                    }
                }));
            }
        });
    }

    const departmentOnChangeHandler = (e, v) => {

        let value = (v !== null && v.value) ? v : null;

        setSignupFormState(prevState => ({
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

        setSignupFormState(prevState => ({
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

    const resetSignupForm = () => {

        Object.keys(signupFormState).forEach(key => {

            setSignupFormState(prevState => ({
                ...prevState,
                [key]: {
                    ...prevState[key],
                    error: false,
                    helperText: '',
                    value: (prevState[key].textFieldType === 'select') ? null : ''
                }
            }));
        });
    }

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
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Department
                            {...signupFormState.department}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            {...signupFormState.firstName}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            {...signupFormState.middleName}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            {...signupFormState.lastName}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            {...signupFormState.email}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            {...signupFormState.username}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            {...signupFormState.password}
                        />
                    </Grid>
                </Grid>
                <LoadingButtonUI
                    type="submit"
                    loading={signupProgressState}
                    fullWidth={true}
                    sx={{
                        mt: 3,
                        mb: 2,
                        backgroundColor: 'info',
                        '&:hover': {
                            backgroundColor: 'darkinfo'
                        }
                    }}
                    label="Sign Up"
                    icon={<AppRegistrationIcon />}
                />
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Link href="login" variant="body2">
                            Already have an account? Sign in
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default SignupForm;