import { useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function ConfirmClose() {
  const handleYes = useCallback(async () => {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke('close_app');
    } catch {
      window.close();
    }
  }, []);

  const handleNo = useCallback(async () => {
    try {
      const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
      const win = getCurrentWebviewWindow();
      await win.close();
    } catch {
      window.close();
    }
  }, []);

  return (
    <Dialog
      open
      maxWidth="xs"
      fullWidth
      slotProps={{ backdrop: { sx: { bgcolor: 'transparent' } } }}
      sx={{ '& .MuiDialog-paper': { m: 0, borderRadius: 2 } }}
    >
      <DialogTitle>Close Application</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to close OpenSpace KillerTool?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleNo} color="primary">
          No
        </Button>
        <Button onClick={handleYes} color="error" variant="contained" autoFocus>
          Yes, Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
