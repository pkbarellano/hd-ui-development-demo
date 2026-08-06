import {
    NAVIGATION_SET,
    NAVIGATION_DESTROY
} from './ActionTypes';

export const initialState = {
    mainComponentRouteList: [],
    cPanelComponentRouteList: [],
    mainPanelNavigation: {},
    cPanelNavigation: {}
};

export const reducer = (state, action) => {

    switch (action.type) {

        case NAVIGATION_SET:

            return {
                ...state,
                ...action.data
            };

        case NAVIGATION_DESTROY:

            return {
                interface: 'MAIN',
                mainPanelNavigation: {},
                cPanelNavigation: {}
            };

        default:

            return {
                interface: 'MAIN',
                mainPanelNavigation: {},
                cPanelNavigation: {}
            };
    }
};