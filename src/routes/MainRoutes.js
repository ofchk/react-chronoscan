import { lazy } from 'react';

const Dashboard = Loadable(lazy(() => import('Dashboard')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',

  children: [
    {
      path: '/dashboad',
      element: <Dashboard />,
    },
  ],
};

export default MainRoutes;
