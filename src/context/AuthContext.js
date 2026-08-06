import React, { useReducer, createContext } from 'react';

import { initialState, reducer } from '../reducer/Auth';

const AuthContextStore = props => {

    const [state, dispatch] = useReducer(reducer, initialState);

    return (

        <AuthContext.Provider value={[state, dispatch]}>
            {props.children}
        </AuthContext.Provider>
    );
};

export const AuthContext = createContext(initialState);

export default AuthContextStore;