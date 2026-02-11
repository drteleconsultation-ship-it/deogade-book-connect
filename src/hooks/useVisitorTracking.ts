import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SESSION_KEY = 'visitor_session_id';

const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

const useVisitorTracking = () => {
  useEffect(() => {
    const trackVisit = async () => {
      const sessionId = getSessionId();
      
      // Check if this session already logged a visit
      const alreadyTracked = sessionStorage.getItem('visit_tracked');
      if (alreadyTracked) return;

      try {
        // Get country info from free API
        let countryCode = null;
        let countryName = null;
        try {
          const geo = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
          if (geo.ok) {
            const data = await geo.json();
            countryCode = data.country_code || null;
            countryName = data.country_name || null;
          }
        } catch {
          // Geo lookup failed, continue without it
        }

        await supabase.from('page_visits').insert({
          page_path: window.location.pathname,
          session_id: sessionId,
          user_agent: navigator.userAgent,
          country_code: countryCode,
          country_name: countryName,
        });

        sessionStorage.setItem('visit_tracked', 'true');
      } catch (err) {
        console.error('Failed to track visit:', err);
      }
    };

    trackVisit();
  }, []);
};

export default useVisitorTracking;
