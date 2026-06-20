import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import logo from 'assets/images/logo.png';

export default function AboutDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>About OpenSpace KillerTool</DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        <Box component="img" src={logo} alt="OpenSpace" sx={{ width: 64, height: 64, borderRadius: 2, mb: 2 }} />
        <Typography variant="h6">OpenSpace KillerTool</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Version 1.0.0
        </Typography>
        <Typography variant="body2" color="text.secondary">
          A collection of 12 power-tools for developers, designers, and power users.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={onClose} variant="contained">OK</Button>
      </DialogActions>
    </Dialog>
  );
}
