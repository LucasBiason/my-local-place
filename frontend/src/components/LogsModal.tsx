import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getContainerLogs } from '../services/api';
import type { ContainerLogs } from '../types';

type LogsModalProps = {
  containerName: string | null;
  onClose: () => void;
};

export const LogsModal = ({ containerName, onClose }: LogsModalProps) => {
  const [logs, setLogs] = useState<ContainerLogs | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!containerName) return;

    const fetchLogs = async () => {
      setLoading(true);
      try {
        const data = await getContainerLogs(containerName, 100);
        setLogs(data);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [containerName]);

  if (!containerName) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Logs: {containerName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="text-center text-gray-500">Loading logs...</div>
          ) : logs && logs.lines.length > 0 ? (
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs font-mono overflow-x-auto">
              {logs.lines.join('\n')}
            </pre>
          ) : (
            <div className="text-center text-gray-500">No logs available</div>
          )}
        </div>

        <div className="p-4 border-t dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {logs?.tail || 0} lines
          </div>
        </div>
      </div>
    </div>
  );
};

