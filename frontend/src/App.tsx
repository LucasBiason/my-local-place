import { RefreshCw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ContainerCard } from './components/ContainerCard';
import { Header } from './components/Header';
import { LogsModal } from './components/LogsModal';
import { SystemMetrics } from './components/SystemMetrics';
import {
  getSystemMetrics,
  healthCheck,
  listContainers,
  restartContainer,
  startContainer,
  stopContainer,
} from './services/api';
import type { Container, HealthStatus, SystemMetrics as SystemMetricsType } from './types';

const App = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [filteredContainers, setFilteredContainers] = useState<Container[]>([]);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetricsType | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'running' | 'stopped'>('all');
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [healthData, containersData, metricsData] = await Promise.all([
        healthCheck(),
        listContainers(true),
        getSystemMetrics(),
      ]);
      setHealth(healthData);
      setContainers(containersData);
      setSystemMetrics(metricsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = containers;

    if (searchTerm) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((c) =>
        filterStatus === 'running' ? c.running : !c.running
      );
    }

    setFilteredContainers(filtered);
  }, [containers, searchTerm, filterStatus]);

  const handleStart = async (name: string) => {
    await startContainer(name);
    await fetchData();
  };

  const handleStop = async (name: string) => {
    await stopContainer(name);
    await fetchData();
  };

  const handleRestart = async (name: string) => {
    await restartContainer(name);
    await fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header health={health} />

      <main className="container mx-auto px-6 py-8">
        <SystemMetrics metrics={systemMetrics} />

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search containers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex gap-2">
              {(['all', 'running', 'stopped'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContainers.map((container) => (
            <ContainerCard
              key={container.id}
              container={container}
              onStart={handleStart}
              onStop={handleStop}
              onRestart={handleRestart}
              onViewLogs={setSelectedContainer}
            />
          ))}
        </div>

        {filteredContainers.length === 0 && !loading && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            No containers found
          </div>
        )}
      </main>

      <LogsModal
        containerName={selectedContainer}
        onClose={() => setSelectedContainer(null)}
      />
    </div>
  );
};

export default App;

