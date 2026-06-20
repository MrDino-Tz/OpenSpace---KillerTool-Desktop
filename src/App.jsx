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

function SplashLogo() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: 48, height: 48 }}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M50 5 L90 28 L90 72 L50 95 L10 72 L10 28 Z" strokeWidth="2" opacity="0.6" />
        <path d="M50 15 L78 32 L78 68 L50 85 L22 68 L22 32 Z" strokeWidth="3" opacity="0.5" />
        <path d="M50 25 L66 36 L66 64 L50 75 L34 64 L34 36 Z" strokeWidth="4" />
        <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.8" />
      </g>
    </svg>
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
        backgroundColor: '#121212',
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
