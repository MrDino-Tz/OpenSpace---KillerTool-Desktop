import { createContext, useContext, useState, useCallback, useRef } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(null);
  const timerRef = useRef(null);

  const showProgress = useCallback((message, value) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setProgress({ message, value });
  }, []);

  const hideProgress = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setProgress(null), 300);
  }, []);

  return (
    <ProgressContext.Provider value={{ progress, showProgress, hideProgress }}>
      {children}
      {progress && (
        <>
          <LinearProgress
            variant={progress.value === -1 ? 'indeterminate' : 'determinate'}
            value={progress.value === -1 ? undefined : progress.value}
            sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}
          />
          <Snackbar
            open
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            sx={{ bottom: { xs: 8, sm: 16 } }}
          >
            <Box sx={{ bgcolor: 'background.paper', px: 2, py: 0.5, borderRadius: 1, boxShadow: 2 }}>
              <Typography variant="caption" color="text.secondary">
                {progress.message}
                {progress.value !== -1 && ` (${Math.round(progress.value)}%)`}
              </Typography>
            </Box>
          </Snackbar>
        </>
      )}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
