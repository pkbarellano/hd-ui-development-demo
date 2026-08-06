import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import axios from '../../Axios';
import hmacSHA256 from '../../helper/crypto.helper';

import Department from '../../component/appInput/AppDepartment';
import ModalUI from '../../component/UI/Modal';

const Copyright = (props) => {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link href="/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const Signup = () => {

    const [signupFormState, setSignupFormState] = useState({
        department: {
            onChange: (e, v) => departmentOnChangeHandler(e, v),
            required: true,
            label: 'Department',
            autoFocus: true,
            error: false,
            value: '',
            helperText: ''
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
            helperText: ''
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
            helperText: ''
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
            helperText: ''
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
            helperText: ''
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
            helperText: ''
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
            helperText: ''
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

    const handleSubmit = (event) => {

        event.preventDefault();

        let form = event.currentTarget;

        if (form.checkValidity() === true) {

            let data = {
                department: signupFormState.department.value,
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
                url: 'department/create',
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

                        resetLoginForm();
                    } else {

                        setModalState(prevState =>
                        ({
                            ...prevState,
                            open: true,
                            title: 'Invalid',
                            body: data.message,
                            bgcolor: 'warning.main',
                            textColor: '#fff'
                        })
                        );
                    }
                })
                .catch(error => console.log(error));
        } else {

            checkFormValidity();

            event.stopPropagation();
        }
    };

    const checkFormValidity = () => {

        Object.keys(signupFormState).forEach(key => {

            if (signupFormState[key].value === '') {

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

        let value = (v !== null && v.value) ? v.value : '';

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

    const resetLoginForm = (event) => {
        event.preventDefault();
        Object.keys(signupFormState).forEach(key => {

            setSignupFormState(prevState => ({
                ...prevState,
                [key]: {
                    ...prevState[key],
                    error: false,
                    helperText: '',
                    value: ''
                }
            }));
        });
    }

    return (
        <Container component="main" maxWidth="xs">
            <ModalUI
                title={modalState.title}
                body={modalState.body}
                open={modalState.open}
                closeHandler={modalState.closeHandler()}
                textColor={modalState.textColor}
                bgcolor={modalState.bgcolor}
            />
            <Card>
                <CardContent>
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <AppRegistrationRoundedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                        {/* <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}> */}
                        <Box component="form" noValidate onSubmit={resetLoginForm} sx={{ mt: 3 }}>
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
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign Up
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link href="login" variant="body2">
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Copyright sx={{ mt: 5 }} />
                </CardContent>
            </Card>
        </Container>
    );
}

export default Signup;