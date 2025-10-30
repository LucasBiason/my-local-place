/**
 * Custom hook for API health check.
 * 
 * Performs a single health check on component mount to verify
 * API availability and Docker connection status.
 * 
 * @returns Health status or null if check failed
 * 
 * @example
 * ```tsx
 * const health = useHealth();
 * 
 * return (
 *   <div>
 *     Status: {health?.status || 'Offline'}
 *     {health?.docker_connected && <Icon />}
 *   </div>
 * );
 * ```
 */

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
        setHealth(null);
      }
    };

    fetchHealth();
  }, []);

  return health;
};
