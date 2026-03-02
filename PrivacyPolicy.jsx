// PrivacyPolicy.jsx
// Route: /privacy
// Add to App.jsx: <Route path="/privacy" element={<PrivacyPolicy />} />

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Privacy Policy | TrivialSports</title>
        <meta name="description" content="Privacy Policy for TrivialSports.com — learn how we handle your data, cookies, and advertising." />
      </Helmet>

      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 20px 80px',
        fontFamily: "'Oswald', sans-serif",
        color: '#e0e0e0',
        lineHeight: '1.7',
      }}>
        <Link to="/" style={{
          color: '#c8a951',
          textDecoration: 'none',
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          ← Back to Home
        </Link>

        <h1 style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: '2.2rem',
          color: '#ffffff',
          marginTop: '24px',
          marginBottom: '8px',
          textTransform: 'uppercase',
        }}>
          Privacy Policy
        </h1>

        <p style={{ color: '#888', fontSize: '14px', marginBottom: '32px' }}>
          Last updated: March 2, 2026
        </p>

        <Section title="Overview">
          TrivialSports.com ("we," "our," or "the site") is a free sports trivia gaming platform. 
          We respect your privacy and are committed to being transparent about how we collect and 
          use data. This policy explains what information we gather, how we use it, and your choices.
        </Section>

        <Section title="Information We Collect">
          <strong>Gameplay data:</strong> We track anonymous play counts and game interactions 
          (such as scores and game completions) to improve our games and understand which content 
          is most popular. This data is not tied to any personally identifiable information.
          <br /><br />
          <strong>Analytics data:</strong> We use Google Analytics to collect standard usage data 
          such as pages visited, time on site, browser type, device type, and general geographic 
          location. This helps us understand how visitors use our site so we can improve it.
          <br /><br />
          <strong>Local storage:</strong> Some games use your browser's local storage to save 
          game progress so you don't lose your place if you refresh the page. This data stays 
          on your device and is not sent to our servers.
        </Section>

        <Section title="Advertising">
          We use Google AdSense to display advertisements on our site. Google and its advertising 
          partners may use cookies and similar technologies to serve ads based on your prior visits 
          to this site or other websites. This is commonly known as interest-based or personalized 
          advertising.
          <br /><br />
          Google's use of advertising cookies enables it and its partners to serve ads based on 
          your browsing activity. You can opt out of personalized advertising by visiting{' '}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" 
             style={{ color: '#c8a951' }}>
            Google's Ad Settings
          </a>. You can also visit{' '}
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer"
             style={{ color: '#c8a951' }}>
            www.aboutads.info
          </a>{' '}
          to opt out of third-party cookies for personalized advertising.
        </Section>

        <Section title="Cookies">
          Our site uses cookies for the following purposes:
          <br /><br />
          <strong>Essential cookies:</strong> Required for basic site functionality.
          <br />
          <strong>Analytics cookies:</strong> Google Analytics cookies help us understand site usage.
          <br />
          <strong>Advertising cookies:</strong> Google AdSense and its partners use cookies to 
          serve relevant ads and measure ad performance.
          <br /><br />
          Most web browsers allow you to control cookies through their settings. Note that 
          disabling cookies may affect your experience on our site.
        </Section>

        <Section title="Third-Party Services">
          We use the following third-party services:
          <br /><br />
          <strong>Google AdSense</strong> — for advertising ({' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"
             style={{ color: '#c8a951' }}>
            Google Privacy Policy
          </a>)
          <br />
          <strong>Google Analytics</strong> — for site analytics ({' '}
          <a href="https://support.google.com/analytics/answer/6004245" target="_blank" rel="noopener noreferrer"
             style={{ color: '#c8a951' }}>
            Google Analytics Privacy
          </a>)
          <br />
          <strong>Supabase</strong> — for anonymous gameplay data storage ({' '}
          <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer"
             style={{ color: '#c8a951' }}>
            Supabase Privacy Policy
          </a>)
        </Section>

        <Section title="Children's Privacy">
          Our site is intended for a general audience. We do not knowingly collect personal 
          information from children under 13. If you believe a child has provided us with 
          personal information, please contact us so we can take appropriate action.
        </Section>

        <Section title="Data Retention">
          Anonymous gameplay and analytics data is retained indefinitely to help us improve 
          our games. Since we do not collect personally identifiable information, there is 
          no personal data to delete.
        </Section>

        <Section title="Changes to This Policy">
          We may update this privacy policy from time to time. Any changes will be posted 
          on this page with an updated "Last updated" date.
        </Section>

        <Section title="Contact Us">
          If you have questions about this privacy policy, you can reach us through our 
          site's contact page or by emailing us at the address listed there.
        </Section>
      </div>
    </>
  );
};

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '28px' }}>
    <h2 style={{
      fontFamily: "'Oswald', sans-serif",
      fontSize: '1.2rem',
      color: '#c8a951',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '10px',
    }}>
      {title}
    </h2>
    <p style={{
      fontSize: '15px',
      color: '#ccc',
      lineHeight: '1.7',
      margin: 0,
    }}>
      {children}
    </p>
  </div>
);

export default PrivacyPolicy;
