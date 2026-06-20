import PropTypes from 'prop-types';

// material-ui
import { alpha, styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// third-party
import SimpleBar from 'simplebar-react';
import { BrowserView, MobileView } from 'react-device-detect';

// root style
const RootStyle = styled(BrowserView)({
  flexGrow: 1,
  height: '100%',
  overflow: 'hidden'
});

// scroll bar wrapper
const SimpleBarStyle = styled(SimpleBar)(({ theme }) => ({
  maxHeight: '100%',
  '& .simplebar-scrollbar': {
    '&:before': {
      background: alpha(theme.palette.grey[500], 0.3),
      borderRadius: 4,
      ...theme.applyStyles('dark', { background: alpha(theme.palette.grey[400], 0.25) })
    },
    '&.simplebar-visible:before': {
      opacity: 1
    }
  },
  '& .simplebar-track': {
    zIndex: 1,
    background: 'transparent',
    '&.simplebar-vertical': {
      width: 4,
      right: 0
    }
  },
  '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': {
    height: 4
  },
  '& .simplebar-mask': {
    zIndex: 'inherit'
  }
}));

// ==============================|| SIMPLE SCROLL BAR ||============================== //

export default function SimpleBarScroll({ children, sx, ...other }) {
  const theme = useTheme();

  return (
    <>
      <RootStyle>
        <SimpleBarStyle clickOnTrack={false} sx={sx} data-simplebar-direction="ltr" {...other}>
          {children}
        </SimpleBarStyle>
      </RootStyle>
      <MobileView>
        <Box sx={{ overflowX: 'auto', ...sx }} {...other}>
          {children}
        </Box>
      </MobileView>
    </>
  );
}

SimpleBarScroll.propTypes = { children: PropTypes.any, sx: PropTypes.any, other: PropTypes.any };
