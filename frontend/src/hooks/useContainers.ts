/**
 * Custom hook for managing Docker containers.
 * 
 * Fetches container list every 10 minutes and provides
 * start/stop/restart actions with automatic refresh.
 * 
 * @returns Container data, loading state, and action handlers
 * 
 * @example
 * ```tsx
 * const { containers, loading, handleStart, handleStop, refresh } = useContainers();
 * 
 * if (loading) return <Skeleton />;
 * 
 * return containers.map(c => (
 *   <ContainerCard 
 *     container={c} 
 *     onStart={handleStart}
 *     onStop={handleStop}
 *   />
 * ));
 * ```
 */

import { useEffect, useState } from 'react';
import {
  listContainers,
  restartContainer,
  startContainer,
  stopContainer,
} from '../services/api';
import type { Container } from '../types';

export const useContainers = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContainers = async () => {
    try {
      const data = await listContainers(true);
      setContainers(data);
      
      if (loading) {
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to fetch containers:', error);
    }
  };

  const handleStart = async (name: string) => {
    await startContainer(name);
    await fetchContainers();
  };

  const handleStop = async (name: string) => {
    await stopContainer(name);
    await fetchContainers();
  };

  const handleRestart = async (name: string) => {
    await restartContainer(name);
    await fetchContainers();
  };

  useEffect(() => {
    fetchContainers();
    const interval = setInterval(fetchContainers, 600000);
    return () => clearInterval(interval);
  }, []);

  return {
    containers,
    loading,
    handleStart,
    handleStop,
    handleRestart,
    refresh: fetchContainers,
  };
};
