/**
 * Custom hook for system resource monitoring.
 * 
 * Fetches CPU, memory, and disk metrics every 5 seconds,
 * maintaining last known values to prevent UI flickering.
 * 
 * @returns System metrics or null if not yet fetched
 * 
 * @example
 * ```tsx
 * const metrics = useSystemMetrics();
 * 
 * if (!metrics) return <Loading />;
 * 
 * return (
 *   <div>
 *     CPU: {metrics.cpu_percent}%
 *     RAM: {metrics.memory.percent}%
 *   </div>
 * );
 * ```
 */

import { useEffect, useState } from 'react';
import { getSystemMetrics } from '../services/api';
import type { SystemMetrics } from '../types';

export const useSystemMetrics = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getSystemMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return metrics;
};
