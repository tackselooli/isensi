import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Aos from 'aos';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes/router';
import { Provider } from 'react-redux';
import SplashScreen from './components/splashScreen/SplashScreen'; // Import the SplashScreen
import store from './app/store';

const queryClient = new QueryClient();
Aos.init();

const App = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(false);

  useEffect(() => {
    // Check if the splash screen has already been shown during this session
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');

    if (!hasSeenSplash) {
      // If not, show the splash screen
      setIsSplashVisible(true);
      const splashTimeout = setTimeout(() => {
        setIsSplashVisible(false);
        // Mark splash screen as seen in sessionStorage
        sessionStorage.setItem('hasSeenSplash', 'true');
      }, 3000); // Splash screen is shown for 3 seconds

      return () => clearTimeout(splashTimeout); // Cleanup the timeout
    }
  }, []);

  if (isSplashVisible) {
    return <SplashScreen />; // Show SplashScreen while visible
  }

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
