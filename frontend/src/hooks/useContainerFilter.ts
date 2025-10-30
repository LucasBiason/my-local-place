import { useEffect, useState } from 'react';
import type { Container } from '../types';

type FilterStatus = 'all' | 'running' | 'stopped';

export const useContainerFilter = (containers: Container[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filtered, setFiltered] = useState<Container[]>([]);

  useEffect(() => {
    let result = containers;

    // Filter by search term
    if (searchTerm) {
      result = result.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter((c) =>
        filterStatus === 'running' ? c.running : !c.running
      );
    }

    setFiltered(result);
  }, [containers, searchTerm, filterStatus]);

  return {
    filtered,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
  };
};

