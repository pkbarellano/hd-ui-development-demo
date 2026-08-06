import { useState, useEffect } from 'react';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

const UseHttpErrorHandler = httpClient => {

    const [errorModal, setErrorModal] = useState({
        title: '',
        body: 'Unknown error.',
        open: false
    });

    const reqInterceptor = httpClient.interceptors.request.use(req => {

        errorConfirmHandler();

        return req;
    }, error => {

        return Promise.reject(error);
    });

    const resInterceptor = httpClient.interceptors.response.use(res => {

        return res;
    }, error => {

        if (Object.hasOwn(error.response, "data")) {
            setErrorModal(prevState => ({
                ...prevState,
                title: <ErrorOutlineRoundedIcon />,
                body: error.response.data.message,
                open: true
            }));
        } else {

            setErrorModal(prevState => ({
                ...prevState,
                body: "Unknown error",
                open: true
            }));
        }

        return Promise.reject(error);
    });

    useEffect(() => {

        return () => {

            httpClient.interceptors.request.eject(reqInterceptor);
            httpClient.interceptors.response.eject(resInterceptor);
        };
    }, [httpClient.interceptors.request, httpClient.interceptors.response]);

    const errorConfirmHandler = () => {
        setErrorModal(prevState => ({
            ...prevState,
            open: false
        }));
    };

    return [errorModal, errorConfirmHandler];
};

export default UseHttpErrorHandler;