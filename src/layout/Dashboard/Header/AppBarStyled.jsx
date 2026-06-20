// material-ui
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';

const AppBarStyled = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  width: '100%'
}));

export default AppBarStyled;
