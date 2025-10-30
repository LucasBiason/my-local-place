/**
 * Custom hook for filtering containers by name and status.
 * 
 * Provides local filtering without API calls, updating
 * automatically when containers or filter criteria change.
 * 
 * @param containers - Container list to filter
 * @returns Filtered containers and filter state
 * 
 * @example
 * ```tsx
 * const { filtered, searchTerm, setSearchTerm, filterStatus, setFilterStatus } = 
 *   useContainerFilter(containers);
 * 
 * return (
 *   <>
 *     <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
 *     <button onClick={() => setFilterStatus('running')}>Running Only</button>
 *     {filtered.map(c => <ContainerCard container={c} />)}
 *   </>
 * );
 * ```
 */

import { useEffect, useState } from 'react';
import type { Container } from '../types';

type FilterStatus = 'all' | 'running' | 'stopped';

export const useContainerFilter = (containers: Container[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filtered, setFiltered] = useState<Container[]>([]);

  useEffect(() => {
    let result = containers;

    if (searchTerm) {
      result = result.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

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
