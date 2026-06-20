import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project imports
import Drawer from './Drawer';
import Header from './Header';
import Footer from './Footer';
import Loader from 'components/Loader';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// ==============================|| MAIN LAYOUT ||============================== //

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const { menuMaster, menuMasterLoading } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened;
  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));
  const initial = useRef(true);

  // set initial drawer state based on screen size (only on mount)
  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      handlerDrawerOpen(!downXL);
    }
  }, []);

  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  if (menuMasterLoading) return <Loader />;

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header />
      <Drawer />

      <Box component="main" sx={{ width: { xs: '100%', lg: `calc(100% - ${!downLG && drawerOpen ? 260 : !downLG ? 60 : 0}px)` }, flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Toolbar sx={{ mt: 'inherit' }} />
        <Box
          sx={{
            ...{ px: { xs: 0, sm: 2 } },
            position: 'relative',
            minHeight: 'calc(100vh - 110px)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {pathname !== '/apps/profiles/account/my-account' && <Breadcrumbs />}
          <Outlet />
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}
