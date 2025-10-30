/**
 * Main application component for MyLocalPlace Dashboard.
 * 
 * Orchestrates the entire application, managing state through
 * custom hooks and rendering the complete UI structure.
 * 
 * @component
 */

import { useState } from 'react';
import { ContainerGrid } from './components/ContainerGrid';
import { ContainersComparisonChart } from './components/ContainersComparisonChart';
import { Header } from './components/Header';
import { LogsModal } from './components/LogsModal';
import { SearchAndFilters } from './components/SearchAndFilters';
import { SystemMetricsChart } from './components/SystemMetricsChart';
import { SystemUsageChart } from './components/SystemUsageChart';
import { useContainerFilter } from './hooks/useContainerFilter';
import { useContainers } from './hooks/useContainers';
import { useHealth } from './hooks/useHealth';
import { useSystemMetrics } from './hooks/useSystemMetrics';

const App = () => {
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null);

  const health = useHealth();
  const systemMetrics = useSystemMetrics();
  const {
    containers,
    loading,
    handleStart,
    handleStop,
    handleRestart,
    refresh,
  } = useContainers();

  const { filtered, searchTerm, setSearchTerm, filterStatus, setFilterStatus } =
    useContainerFilter(containers);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header health={health} />

      <main className="container mx-auto px-6 py-8">
        <SystemMetricsChart metrics={systemMetrics} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <SystemUsageChart metrics={systemMetrics} />
          <ContainersComparisonChart containers={containers} />
        </div>

        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          onRefresh={refresh}
          loading={loading}
        />

        <ContainerGrid
          containers={filtered}
          loading={loading}
          onStart={handleStart}
          onStop={handleStop}
          onRestart={handleRestart}
          onViewLogs={setSelectedContainer}
        />
      </main>

      <LogsModal
        containerName={selectedContainer}
        onClose={() => setSelectedContainer(null)}
      />
    </div>
  );
};

export default App;
