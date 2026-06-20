import { useState, useEffect, useCallback } from 'react';
import { RouterProvider } from 'react-router-dom';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';
import ThemeModeProvider from 'contexts/ThemeContext';

import ScrollTop from 'components/ScrollTop';
import SplashScreen from 'components/SplashScreen';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

function useCloseConfirmation() {
  useEffect(() => {
    if (!window.__TAURI__) return;
    let unlisten;
    (async () => {
      const { getCurrentWebviewWindow, WebviewWindow } = await import('@tauri-apps/api/webviewWindow');
      const mainWin = getCurrentWebviewWindow();
      if (mainWin.label !== 'main') return;
      unlisten = await mainWin.onCloseRequested(async (event) => {
        event.preventDefault();
        const existing = WebviewWindow.getByLabel('confirm-close');
        if (!existing) {
          new WebviewWindow('confirm-close', {
            url: '/#/confirm-close',
            title: 'Close Application',
            width: 400,
            height: 180,
            resizable: false,
            center: true,
          });
        }
      });
    })();
    return () => { if (unlisten) unlisten(); };
  }, []);
}

export default function App() {
  const isConfirmPage = typeof window !== 'undefined' && window.location.hash.includes('confirm-close');
  const [splashDone, setSplashDone] = useState(isConfirmPage);
  const handleSplashDone = useCallback(() => setSplashDone(true), []);

  useCloseConfirmation();

  return (
    <ThemeModeProvider>
      <ThemeCustomization>
        {!splashDone && <SplashScreen onDone={handleSplashDone} />}
        <ScrollTop>
          <RouterProvider router={router} />
        </ScrollTop>
      </ThemeCustomization>
    </ThemeModeProvider>
  );
}
