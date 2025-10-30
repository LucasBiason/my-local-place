import { useEffect, useState } from 'react';
import { healthCheck } from '../services/api';
import type { HealthStatus } from '../types';

export const useHealth = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await healthCheck();
        setHealth(data);
      } catch (error) {
        console.error('Health check failed:', error);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return health;
};

