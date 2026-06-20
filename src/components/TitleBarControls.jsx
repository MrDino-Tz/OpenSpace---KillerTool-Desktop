import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

const iconSvgProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round'
};

const MinusIcon = () => (
  <svg {...iconSvgProps}>
    <line x1="3" y1="8" x2="13" y2="8" />
  </svg>
);

const MaximizeIcon = () => (
  <svg {...iconSvgProps}>
    <rect x="2.5" y="2.5" width="11" height="11" rx="1" strokeWidth="1.4" fill="none" />
  </svg>
);

const RestoreIcon = () => (
  <svg {...iconSvgProps}>
    <rect x="4.5" y="1" width="10.5" height="10.5" rx="1" strokeWidth="1.2" fill="currentColor" fillOpacity={0.15} />
    <rect x="1" y="4.5" width="10.5" height="10.5" rx="1" strokeWidth="1.3" fill="none" />
  </svg>
);

const CloseIcon = () => (
  <svg {...iconSvgProps}>
    <line x1="3.5" y1="3.5" x2="12.5" y2="12.5" />
    <line x1="12.5" y1="3.5" x2="3.5" y2="12.5" />
  </svg>
);

export default function TitleBarControls() {
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    if (!window.__TAURI__) return;
    let unlisten;
    (async () => {
      const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
      const win = getCurrentWebviewWindow();
      setMaximized(await win.isMaximized());
      unlisten = await win.onResized(() => {
        win.isMaximized().then(setMaximized);
      });
    })();
    return () => { if (unlisten) unlisten(); };
  }, []);

  const minimize = async () => {
    if (!window.__TAURI__) return;
    const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
    getCurrentWebviewWindow().minimize();
  };

  const toggleMaximize = async () => {
    if (!window.__TAURI__) return;
    const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
    const win = getCurrentWebviewWindow();
    if (await win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  };

  const close = async () => {
    if (!window.__TAURI__) return;
    const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
    getCurrentWebviewWindow().close();
  };

  if (!window.__TAURI__) return null;

  const btnSx = {
    borderRadius: 0,
    minWidth: 46,
    height: '100%',
    color: 'text.secondary',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': { bgcolor: 'action.hover' }
  };

  const closeSx = {
    borderRadius: 0,
    minWidth: 46,
    height: '100%',
    color: 'text.secondary',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': { bgcolor: '#e81123', color: 'white' }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', ml: 'auto' }}>
      <IconButton onClick={minimize} sx={btnSx} disableRipple>
        <MinusIcon />
      </IconButton>
      <IconButton onClick={toggleMaximize} sx={btnSx} disableRipple>
        {maximized ? <RestoreIcon /> : <MaximizeIcon />}
      </IconButton>
      <IconButton onClick={close} sx={closeSx} disableRipple>
        <CloseIcon />
      </IconButton>
    </Box>
  );
}
