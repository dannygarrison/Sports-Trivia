// BannerAd.jsx
// Sitewide banner ad — sits at the bottom of every page above the footer
// Lazy-loads via IntersectionObserver to protect PageSpeed

import { useState, useEffect, useRef } from 'react';
import AD_CONFIG from './adConfig';

const BannerAd = () => {
  const [isVisible, setIsVisible] = useState(false);
  const placeholderRef = useRef(null);
  const adRef = useRef(null);
  const isLoaded = useRef(false);

  // Lazy load — only render ad when near viewport
  useEffect(() => {
    if (!AD_CONFIG.enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (placeholderRef.current) {
      observer.observe(placeholderRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Push ad once visible
  useEffect(() => {
    if (!isVisible || !AD_CONFIG.enabled || isLoaded.current) return;

    try {
      if (adRef.current && adRef.current.childNodes.length === 0) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isLoaded.current = true;
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, [isVisible]);

  if (!AD_CONFIG.enabled) return null;

  return (
    <div
      ref={placeholderRef}
      style={{
        width: '100%',
        maxWidth: 960,
        margin: '0 auto',
        padding: '16px 28px',
      }}
    >
      {isVisible && (
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={AD_CONFIG.publisherId}
          data-ad-slot={AD_CONFIG.slots.homeBanner.slotId}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
};

export default BannerAd;
