import { useState, useCallback } from 'react';
import { RouterProvider } from 'react-router-dom';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';
import ThemeModeProvider from 'contexts/ThemeContext';

import ScrollTop from 'components/ScrollTop';
import SplashScreen from 'components/SplashScreen';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashDone = useCallback(() => setSplashDone(true), []);

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
