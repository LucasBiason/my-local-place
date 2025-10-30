import { RefreshCw, Search } from 'lucide-react';

type SearchAndFiltersProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: 'all' | 'running' | 'stopped';
  onFilterChange: (status: 'all' | 'running' | 'stopped') => void;
  onRefresh: () => void;
  loading: boolean;
};

export const SearchAndFilters = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
  onRefresh,
  loading,
}: SearchAndFiltersProps) => {
  const filters: Array<'all' | 'running' | 'stopped'> = ['all', 'running', 'stopped'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search containers..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex gap-2">
          {filters.map((status) => (
            <button
              key={status}
              onClick={() => onFilterChange(status)}
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
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
    </div>
  );
};

