import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import logo from 'assets/images/logo.png';

export default function SplashScreen({ onDone }) {
  const theme = useTheme();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onDone, 500);
    }, 1500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <Box
      sx={{
        position: 'fixed', inset: 0, zIndex: 99999,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        bgcolor: 'transparent',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease-out',
        pointerEvents: fadeOut ? 'none' : 'auto'
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="OpenSpace"
        sx={{ width: 96, height: 96, borderRadius: 3, mb: 3, boxShadow: theme.shadows[4] }}
      />
      <Typography variant="h3" fontWeight={700} color="primary" sx={{ mb: 0.5 }}>
        OpenSpace
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        KillerTool
      </Typography>
      <CircularProgress size={24} />
    </Box>
  );
}
