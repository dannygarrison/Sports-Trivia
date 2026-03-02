// adConfig.js
// Centralized ad configuration for TrivialSports.com

const AD_CONFIG = {
  // Your Google AdSense Publisher ID
  publisherId: 'ca-pub-2176478427973265',

  // Set to false during development to avoid accidental clicks/impressions
  enabled: import.meta.env.PROD,

  // Ad slot IDs — create these in your AdSense dashboard after approval
  slots: {
    // Sitewide banner ad (bottom of every page)
    homeBanner: {
      slotId: '1234567890',       // Replace with real slot ID after approval
      format: 'horizontal',
      style: { display: 'block' },
    },
  },
};

export default AD_CONFIG;
