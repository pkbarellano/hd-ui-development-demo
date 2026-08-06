import {
    AUTH_SET,
    AUTH_DESTROY
} from './ActionTypes';

export const initialState = {
    sessionKey: null,
    firstName: null,
    middleName: null,
    lastName: null,
    username: null,
    email: null,
    department: 0,
    departmentName: null,
    team: 0,
    teamName: null,
    group: 0,
    groupName: null,
    clientType: null,
    clientTypeName: null
};

const setSessionHandler = (sessionKey, clientType, clientTypeName, department, group) => {

    let sessObj = {
        sessionKey: sessionKey,
        clientType: clientType,
        clientTypeName: clientTypeName,
        department: department,
        group: group
    };

    let navObj = {
        interface: 'MAIN'
    }

    localStorage.setItem('HD-Sess', JSON.stringify(sessObj));

    if (!localStorage.getItem('HD-Sess-Nav')) {

        localStorage.setItem('HD-Sess-Nav', JSON.stringify(navObj));
    }
};

const destroySessionHandler = () => {

    localStorage.removeItem('HD-Sess');
    localStorage.removeItem('HD-Sess-Nav');
}

export const reducer = (state, action) => {

    switch (action.type) {

        case AUTH_SET:

            setSessionHandler(action.data.sessionKey, action.data.clientType, action.data.clientTypeName, action.data.department, action.data.group)

            return {
                ...state,
                ...action.data
            };

        case AUTH_DESTROY:

            destroySessionHandler();

            return {
                ...state,
                sessionKey: null,
                firstName: null,
                middleName: null,
                lastName: null,
                username: null,
                email: null,
                departmentId: 0,
                departmentName: null,
                teamId: 0,
                teamName: null,
                groupId: 0,
                groupName: null,
                clientType: null,
                clientTypeName: null
            }

        default:

            return {
                ...state,
                sessionKey: null,
                firstName: null,
                middleName: null,
                lastName: null,
                username: null,
                email: null,
                departmentId: 0,
                departmentName: null,
                teamId: 0,
                teamName: null,
                groupId: 0,
                groupName: null,
                clientType: null,
                clientTypeName: null
            };
    }
};