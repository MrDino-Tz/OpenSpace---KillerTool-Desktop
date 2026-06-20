import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import MinusOutlined from '@ant-design/icons/MinusOutlined';
import BorderOutlined from '@ant-design/icons/BorderOutlined';
import SwitcherOutlined from '@ant-design/icons/SwitcherOutlined';

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
    '&:hover': { bgcolor: 'action.hover' }
  };

  const closeSx = {
    borderRadius: 0,
    minWidth: 46,
    height: '100%',
    color: 'text.secondary',
    '&:hover': { bgcolor: '#e81123', color: 'white' }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', ml: 'auto' }}>
      <IconButton onClick={minimize} sx={btnSx} disableRipple>
        <MinusOutlined style={{ fontSize: 14, strokeWidth: 2 }} />
      </IconButton>
      <IconButton onClick={toggleMaximize} sx={btnSx} disableRipple>
        {maximized ? <SwitcherOutlined style={{ fontSize: 12 }} /> : <BorderOutlined style={{ fontSize: 14 }} />}
      </IconButton>
      <IconButton onClick={close} sx={closeSx} disableRipple>
        <CloseOutlined style={{ fontSize: 14 }} />
      </IconButton>
    </Box>
  );
}
