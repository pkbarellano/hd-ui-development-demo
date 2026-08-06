import React from 'react';

import UseHttpErrorHandler from '../../hooks/http-error-handler';

import ModalUI from '../../component/UI/Modal';

const WithErrorHandler = (WrappedComponent, axios) => {

    return props => {

        const [errorModal, errorConfirmHandler] = UseHttpErrorHandler(axios);

        return (
            <>
                <ModalUI
                    title={errorModal.title}
                    body={errorModal.body}
                    open={errorModal.open}
                    closeHandler={() => errorConfirmHandler()}
                />
                <WrappedComponent {...props} />
            </>
        );
    };
};

export default WithErrorHandler;