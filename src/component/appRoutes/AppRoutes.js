import * as React from 'react';
import {
    createBrowserRouter,
    RouterProvider
} from 'react-router-dom';

import Landing from '../../view/landing/Landing';
import Login from '../../view/login/Login';
import Signup from '../../view/signup/Signup';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Landing />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/signup',
        element: <Signup />,
    }
], {
    future: {
        v7_normalizeFormMethod: true
    }
});

const AppRoutes = () => {

    return (
        <RouterProvider
            router={router}
            future={{ v7_startTransition: true }}
        />
    );
};

export default AppRoutes;