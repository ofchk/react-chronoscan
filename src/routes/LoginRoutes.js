import { lazy } from 'react';

// project imports
import GuestGuard from 'utils/route-guard/GuestGuard';
import MinimalLayout from 'layout/MinimalLayout';
import NavMotion from 'layout/NavMotion';
import Loadable from 'ui-component/Loadable';

// login routing
const SelectUser = Loadable(lazy(() => import('views/pages/authentication/selectUser')));
const UserLogin = Loadable(lazy(() => import('views/pages/authentication/UserLogin')));

const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/Login3')));
const AuthRegister = Loadable(lazy(() => import('views/pages/authentication/Register3')));
const AuthForgotPassword = Loadable(lazy(() => import('views/pages/authentication/ForgotPassword3')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
    path: '/',
    element: (
        <NavMotion>
            <GuestGuard>
                <MinimalLayout />
            </GuestGuard>
        </NavMotion>
    ),
    children: [
        {
            path: '/',
            element: <SelectUser />
        },
        {
            path: '/admin/login',
            element: <AuthLogin />
        },
        {
            path: '/user/login',
            element: <UserLogin />
        },
        {
            path: '/register',
            element: <AuthRegister />
        },
        {
            path: '/forgot',
            element: <AuthForgotPassword />
        }
    ]
};

export default LoginRoutes;
