// useAdSense.js
// Custom hook to load the Google AdSense script once
// Call this in your App.jsx or main layout component

import { useEffect } from 'react';
import AD_CONFIG from './adConfig';

let scriptLoaded = false;

const useAdSense = () => {
  useEffect(() => {
    if (!AD_CONFIG.enabled || scriptLoaded) return;

    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CONFIG.publisherId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';

    // Defer loading slightly so it doesn't block initial render
    const timer = setTimeout(() => {
      document.head.appendChild(script);
      scriptLoaded = true;
    }, 2000); // 2 second delay after mount

    return () => clearTimeout(timer);
  }, []);
};

export default useAdSense;
