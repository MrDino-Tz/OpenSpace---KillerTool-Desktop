import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';
import ThemeModeProvider from 'contexts/ThemeContext';
import { ProgressProvider } from 'contexts/ProgressContext';
import ErrorBoundary from 'components/ErrorBoundary';

import ScrollTop from 'components/ScrollTop';
import AboutDialog from 'components/AboutDialog';
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

function useMenuEvents() {
  useEffect(() => {
    if (!window.__TAURI__) return;
    let unlisten;
    (async () => {
      const { listen } = await import('@tauri-apps/api/event');
      unlisten = await listen('menu-about', () => {
        window.dispatchEvent(new CustomEvent('app-menu-about'));
      });
    })();
    return () => { if (unlisten) unlisten(); };
  }, []);
}

const LOGO_DATA_URL = 'data:image/png;base64,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';

function SplashLogo() {
  return (
    <img src={LOGO_DATA_URL} alt="OpenSpace" style={{ width: 64, height: 64 }} />
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  useCloseConfirmation();
  useMenuEvents();

  useEffect(() => {
    const handler = () => setAboutOpen(true);
    window.addEventListener('app-menu-about', handler);
    return () => window.removeEventListener('app-menu-about', handler);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) {
    return (
      <div style={{
        width: '100vw', height: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#121212', color: '#fff',
      }}>
        <div style={{ animation: 'splash-pulse 2s ease-in-out infinite' }}><SplashLogo /></div>
        <style>{`@keyframes splash-pulse { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.05)} }`}</style>
      </div>
    );
  }

  return (
    <ThemeModeProvider>
      <ThemeCustomization>
        <ProgressProvider>
          <ScrollTop>
            <ErrorBoundary>
              <RouterProvider router={router} />
            </ErrorBoundary>
          </ScrollTop>
        </ProgressProvider>
        <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
      </ThemeCustomization>
    </ThemeModeProvider>
  );
}
