import { lazy } from 'react';

// project imports
import AuthGuard from 'utils/route-guard/AuthGuard';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// sample page routing
const Dashboard = Loadable(lazy(() => import('views/Dashboard')));
const List = Loadable(lazy(() => import('views/Invoice/List')));
const CreateInvoice = Loadable(lazy(() => import('views/Invoice/CreateInvoice')));
const ViewInvoice = Loadable(lazy(() => import('views/Invoice/ViewInvoice')));
const Master = Loadable(lazy(() => import('views/Master')));
const Vendor = Loadable(lazy(() => import('views/Master/vendor')));
const Entity = Loadable(lazy(() => import('views/Master/entity')));
const Currency = Loadable(lazy(() => import('views/Master/currency')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [        
        {
            path: '/dashboard',
            element: <Dashboard />
        },
        {
            path: '/invoice/create',
            element: <CreateInvoice />
        },
        {
            path: '/invoice/list',
            element: <List />
        },
        {
            path: '/invoice/view/:id',
            element: <ViewInvoice />
        },
        {
            path: '/master',
            element: <Master />
        },
        {
            path: '/master/create/vendor',
            element: <Vendor />
        },
        {
            path: '/master/create/entity',
            element: <Entity />
        },
        {
            path: '/master/create/currency',
            element: <Currency />
        }
    ]
};

export default MainRoutes;
