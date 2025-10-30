/**
 * Custom hook for fetching individual container statistics.
 * 
 * Retrieves resource usage metrics for a specific container,
 * updating every 5 seconds while container is running.
 * Maintains last known values to prevent UI flickering.
 * 
 * @param containerName - Name or ID of container
 * @param isRunning - Whether container is currently running
 * @returns Container statistics or null
 * 
 * @example
 * ```tsx
 * const stats = useContainerStats('local-postgres', container.running);
 * 
 * if (!stats) return null;
 * 
 * return (
 *   <div>
 *     CPU: {stats.cpu_percent}%
 *     RAM: {stats.memory_percent}%
 *   </div>
 * );
 * ```
 */

import { useEffect, useState } from 'react';
import { getContainerStats } from '../services/api';
import type { ContainerStats } from '../types';

export const useContainerStats = (
  containerName: string,
  isRunning: boolean
): ContainerStats | null => {
  const [stats, setStats] = useState<ContainerStats | null>(null);

  useEffect(() => {
    if (!isRunning) {
      setStats(null);
      return;
    }

    const fetchStats = async () => {
      try {
        const data = await getContainerStats(containerName);
        setStats(data);
      } catch (error) {
        console.error(`Failed to fetch stats for ${containerName}:`, error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [containerName, isRunning]);

  return stats;
};
