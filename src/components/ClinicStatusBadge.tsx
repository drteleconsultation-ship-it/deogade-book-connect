import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

const ClinicStatusBadge: React.FC = () => {
  const [status, setStatus] = useState<'open' | 'closed' | 'online'>('closed');

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentTime = hours * 60 + minutes;

      // Evening clinic: 6:00 PM - 9:00 PM (18:00 - 21:00)
      const clinicOpen = 18 * 60; // 1080
      const clinicClose = 21 * 60; // 1260

      // Online hours: 9:00 AM - 10:00 PM (9:00 - 22:00)
      const onlineOpen = 9 * 60; // 540
      const onlineClose = 22 * 60; // 1320

      if (currentTime >= clinicOpen && currentTime < clinicClose) {
        setStatus('open');
      } else if (currentTime >= onlineOpen && currentTime < onlineClose) {
        setStatus('online');
      } else {
        setStatus('closed');
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const config = {
    open: {
      label: 'Clinic Open',
      dotClass: 'bg-green-500',
      badgeClass: 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400',
    },
    online: {
      label: 'Online Available',
      dotClass: 'bg-blue-500',
      badgeClass: 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400',
    },
    closed: {
      label: 'Closed',
      dotClass: 'bg-red-500',
      badgeClass: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400',
    },
  };

  const { label, dotClass, badgeClass } = config[status];

  return (
    <Badge variant="outline" className={`gap-1.5 px-2.5 py-1 text-xs font-medium ${badgeClass}`}>
      <span className={`h-2 w-2 rounded-full ${dotClass} ${status !== 'closed' ? 'animate-pulse' : ''}`} />
      {label}
    </Badge>
  );
};

export default ClinicStatusBadge;
