import { lazy } from 'react';
import { createHashRouter } from 'react-router-dom';

// project imports
import MainRoutes from './MainRoutes';
import Loadable from 'components/Loadable';

// ==============================|| ROUTING RENDER ||============================== //

const ConfirmClose = Loadable(lazy(() => import('pages/ConfirmClose')));

const router = createHashRouter([
  MainRoutes,
  {
    path: 'confirm-close',
    element: <ConfirmClose />
  }
]);

export default router;
