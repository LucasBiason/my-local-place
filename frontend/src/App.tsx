import { useState } from 'react';
import { ContainerGrid } from './components/ContainerGrid';
import { Header } from './components/Header';
import { LogsModal } from './components/LogsModal';
import { SearchAndFilters } from './components/SearchAndFilters';
import { SystemMetrics } from './components/SystemMetrics';
import { useContainerFilter } from './hooks/useContainerFilter';
import { useContainers } from './hooks/useContainers';
import { useHealth } from './hooks/useHealth';
import { useSystemMetrics } from './hooks/useSystemMetrics';

const App = () => {
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null);

  // Custom hooks gerenciam estado e data fetching
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

  // Hook de filtragem
  const { filtered, searchTerm, setSearchTerm, filterStatus, setFilterStatus } =
    useContainerFilter(containers);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header health={health} />

      <main className="container mx-auto px-6 py-8">
        <SystemMetrics metrics={systemMetrics} />

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
