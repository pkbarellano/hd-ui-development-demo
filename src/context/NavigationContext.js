import React, { useReducer, createContext } from 'react';

import { initialState, reducer } from '../reducer/Navigation';

const NavContextStore = props => {

    const [state, dispatch] = useReducer(reducer, initialState);

    return (

        <NavContext.Provider value={[state, dispatch]}>
            {props.children}
        </NavContext.Provider>
    );
};

export const NavContext = createContext(initialState);

export default NavContextStore;