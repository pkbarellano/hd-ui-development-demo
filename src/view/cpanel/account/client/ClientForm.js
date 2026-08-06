import {
    useState,
    useEffect,
    useRef
} from 'react';

import {
    Box,
    TextField,
    Grid,
    Stack
} from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';

import ModalUI from '../../../../component/UI/Modal';
import SnackbarUI from '../../../../component/UI/Snackbar';
import LoadingButtonUI from '../../../../component/UI/Buttons/LoadingButton';
import CloseButtonUI from '../../../../component/UI/Buttons/CloseButton';
import Department from '../../../../component/appInput/AppDepartment';
import Group from '../../../../component/appInput/AppGroup';
import Status from '../../../../component/appInput/AppStatus';
import axios from '../../../../Axios';
import hmacSHA256 from '../../../../helper/crypto.helper';

const modalBody = ({ formRef, submitHandler, formState }) => {

    return (
        <Box component='form' ref={formRef} onSubmit={submitHandler} noValidate xs={12}>
            <Grid container>
                <Grid item xs={12} display="flex" justifyContent="space-between">
                    <Grid item xs={12}>
                        <Stack spacing={1} direction='row'>
                            <Grid item xs={4}>
                                <TextField
                                    {...formState.firstName}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    {...formState.middleName}
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    {...formState.lastName}
                                />
                            </Grid>
                        </Stack>
                        <Stack spacing={1} direction="row">
                            <Grid item xs={6}>
                                <TextField
                                    {...formState.username}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    {...formState.password}
                                />
                            </Grid>
                        </Stack>
                        <Stack spacing={1} direction='row'>
                            <Grid item xs={6}>
                                <TextField
                                    {...formState.email}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Department
                                    {...formState.department}
                                />
                            </Grid>
                        </Stack>
                        <Stack spacing={1} direction="row">
                            <Grid item xs={6}>
                                <Group
                                    {...formState.group}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Status
                                    {...formState.status}
                                />
                            </Grid>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

const ClientForm = ({ formType, clientFormModalState, setClientFormModalState, selectedRows }) => {

    const formRef = useRef(null);

    const [modalState, setModalState] = useState({
        title: '',
        body: '',
        open: false,
        closeHandler: () => closeClientFormModalHandler,
        textColor: '',
        bgcolor: ''
    });

    const [formState, setFormState] = useState({
        firstName: {
            onChange: e => inputOnChangeHandler(e),
            margin: 'normal',
            autoComplete: 'new-firstName',
            name: 'firstName',
            required: true,
            id: 'firstName',
            label: 'First Name',
            error: false,
            value: '',
            helperText: '',
            disabled: false,
            textfieldtype: 'text'
        },
        middleName: {
            onChange: e => inputOnChangeHandler(e),
            margin: 'normal',
            autoComplete: 'new-middleName',
            name: 'middleName',
            required: true,
            id: 'middleName',
            label: 'Middle Name',
            error: false,
            value: '',
            helperText: '',
            disabled: false,
            textfieldtype: 'text'
        },
        lastName: {
            onChange: e => inputOnChangeHandler(e),
            margin: 'normal',
            autoComplete: 'new-lastName',
            name: 'lastName',
            required: true,
            id: 'lastName',
            label: 'Last Name',
            error: false,
            value: '',
            helperText: '',
            disabled: false,
            textfieldtype: 'text'
        },
        email: {
            onChange: e => inputOnChangeHandler(e),
            margin: 'normal',
            autoComplete: 'new-email',
            name: 'email',
            required: true,
            id: 'email',
            label: 'Email',
            error: false,
            value: '',
            helperText: '',
            disabled: false,
            type: 'email',
            textfieldtype: 'text'
        },
        username: {
            onChange: e => inputOnChangeHandler(e),
            margin: 'normal',
            autoComplete: 'new-username',
            name: 'username',
            required: true,
            id: 'username',
            label: 'Username',
            error: false,
            value: '',
            helperText: '',
            disabled: true,
            textfieldtype: 'text'
        },
        password: {
            onChange: e => inputOnChangeHandler(e),
            margin: 'normal',
            autoComplete: 'new-password',
            name: 'password',
            required: true,
            id: 'password',
            label: 'Password',
            error: false,
            value: '',
            helperText: '',
            disabled: true,
            type: 'password',
            textfieldtype: 'text'
        },
        department: {
            onChange: (e, v) => departmentOnChangeHandler(e, v),
            margin: 'normal',
            required: true,
            label: 'Department',
            autoFocus: false,
            error: false,
            value: null,
            helperText: '',
            disabled: false,
            textfieldtype: 'select'
        },
        group: {
            onChange: (e, v) => groupOnChangeHandler(e, v),
            margin: 'normal',
            required: true,
            label: 'Group',
            autoFocus: false,
            error: false,
            value: null,
            helperText: '',
            disabled: false,
            textfieldtype: 'select'
        },
        status: {
            onChange: (e, v) => statusOnChangeHandler(e, v),
            margin: 'normal',
            required: true,
            label: 'Status',
            autoFocus: false,
            error: false,
            value: null,
            helperText: '',
            disabled: false,
            textfieldtype: 'select'
        }
    });

    const [snackbarState, setSnackbarState] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    const [createClientProgressState, setCreateClientProgressState] = useState(false);

    const submitHandler = async event => {

        setCreateClientProgressState(true);

        event.preventDefault();

        const form = event.currentTarget;

        const session = JSON.parse(localStorage.getItem('HD-Sess'));

        if (form.checkValidity() === true) {

            let data = {
                firstName: formState.firstName.value,
                middleName: formState.middleName.value,
                lastName: formState.lastName.value,
                username: formState.username.value,
                password: formState.password.value,
                email: formState.email.value,
                dpt: formState.department.value.value,
                group: formState.group.value.value,
                status: formState.status.value.value,
                sessionKey: session.sessionKey,
                clientType: session.clientType,
                department: session.department
            };

            let headers = {
                'X-HD-Sign': hmacSHA256(data)
            };

            axios({
                url: 'user/create',
                method: 'POST',
                headers: headers,
                data: data
            })
                .then(response => {

                    const data = response.data;

                    if (data.status === true) {

                        setSnackbarState(prevState => ({
                            ...prevState,
                            open: true,
                            message: data.message,
                            severity: 'success'
                        }));

                        resetForm();
                    } else {

                        setSnackbarState(prevState => ({
                            ...prevState,
                            open: true,
                            message: data.message,
                            severity: 'error'
                        }));
                    }
                })
                .catch(error => console.log(error))
                .finally(() => setCreateClientProgressState(false));
        } else {

            checkFormValidity();

            setCreateClientProgressState(false);

            event.stopPropagation();
        }
    };

    const checkFormValidity = () => {

        Object.keys(formState).forEach(key => {

            if (formState[key].required === true && (formState[key].value === '' || formState[key].value === null)) {

                setFormState(prevState => ({
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

    const closeClientFormModalHandler = () => {

        setModalState(prevState => ({
            ...prevState,
            open: false
        }));

        setClientFormModalState(false);

        resetForm();
    };

    const submitCreateButtonHandler = () => {
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
    };

    const submitUpdateButtonHandler = () => {

        console.log('Submit Update');
    };

    const inputOnChangeHandler = e => {

        let controlName = e.target.name;
        let controlValue = e.target.value;

        setFormState(prevState => ({
            ...prevState,
            [controlName]: {
                ...prevState[controlName],
                value: controlValue,
                error: false,
                helperText: ''
            }
        }));
    };

    const departmentOnChangeHandler = (e, v) => {

        let value = (v !== null && v.value) ? v : null;

        setFormState(prevState => ({
            ...prevState,
            department: {
                ...prevState.department,
                value: value,
                error: false,
                helperText: ''
            }
        }));
    };

    const groupOnChangeHandler = (e, v) => {
        let value = (v !== null && v.value) ? v : null;

        setFormState(prevState => ({
            ...prevState,
            group: {
                ...prevState.group,
                value: value,
                error: false,
                helperText: ''
            }
        }));
    };

    const statusOnChangeHandler = (e, v) => {
        let value = (v !== null && v.value) ? v : null;

        setFormState(prevState => ({
            ...prevState,
            status: {
                ...prevState.status,
                value: value,
                error: false,
                helperText: ''
            }
        }));
    };

    const resetForm = () => {

        Object.keys(formState).forEach(key => {

            setFormState(prevState => ({
                ...prevState,
                [key]: {
                    ...prevState[key],
                    error: false,
                    helperText: '',
                    value: (prevState[key].textfieldtype === 'select') ? null : ''
                }
            }));
        });
    };

    useEffect(() => {
        setModalState(prevState => ({
            ...prevState,
            open: clientFormModalState
        }))
    }, [clientFormModalState]);

    useEffect(() => {
        Object.keys(formState).forEach(key => {
            setFormState(prevState => ({
                ...prevState,
                [key]: {
                    ...prevState[key],
                    disabled: createClientProgressState
                }
            }))
        });
    }, [createClientProgressState]);

    useEffect(() => {

        const setModalTitleHandler = () => {
            setModalState(prevState => ({
                ...prevState,
                title: (formType === 'update') ? 'Update Client' : 'Create Client'
            }));
        };

        return setModalTitleHandler();
    }, [formType]);

    return (
        <>
            <ModalUI
                title={modalState.title}
                body={modalBody({ formRef, submitHandler, formState })}
                open={modalState.open}
                closeHandler={modalState.closeHandler()}
                textColor={modalState.textColor}
                bgcolor={modalState.bgcolor}
                width='55%'
                button={<>
                    <LoadingButtonUI
                        type='button'
                        loading={createClientProgressState}
                        sx={{
                            backgroundColor: '#2e7d32',
                            '&:hover': {
                                backgroundColor: '#1b5e20'
                            }
                        }}
                        label='Submit'
                        icon={<HowToRegIcon />}
                        onClick={(formType === 'add') ? submitCreateButtonHandler : submitUpdateButtonHandler}
                    />
                    <CloseButtonUI
                        disabled={createClientProgressState}
                        onClick={modalState.closeHandler()}
                    />
                </>}
            />
            <SnackbarUI
                openSnackbar={snackbarState.open}
                message={snackbarState.message}
                severity={snackbarState.severity}
            />
        </>
    );
};

export default ClientForm;