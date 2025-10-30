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
  const [loading, setLoading] = useState(false);

  const fetchContainers = async () => {
    setLoading(true);
    try {
      const data = await listContainers(true);
      setContainers(data);
    } catch (error) {
      console.error('Failed to fetch containers:', error);
    } finally {
      setLoading(false);
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
    const interval = setInterval(fetchContainers, 5000);
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

