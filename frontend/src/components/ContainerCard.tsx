import { Box, Clock, FileText, Play, RotateCw, Square } from 'lucide-react';
import { useState } from 'react';
import type { Container } from '../types';

type ContainerCardProps = {
  container: Container;
  onStart: (name: string) => void;
  onStop: (name: string) => void;
  onRestart: (name: string) => void;
  onViewLogs: (name: string) => void;
};

export const ContainerCard = ({
  container,
  onStart,
  onStop,
  onRestart,
  onViewLogs,
}: ContainerCardProps) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: () => void) => {
    setLoading(true);
    try {
      await action();
    } finally {
      setLoading(false);
    }
  };

  const isRunning = container.running;
  const statusColor = isRunning ? 'bg-green-500' : 'bg-gray-400';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Box className="w-8 h-8 text-blue-500" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {container.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {container.image}
            </p>
          </div>
        </div>
        <span
          className={`${statusColor} text-white text-xs font-medium px-2 py-1 rounded-full`}
        >
          {container.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>ID: {container.id}</span>
        </div>
        {container.ports.length > 0 && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Ports: {container.ports.join(', ')}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!isRunning && (
          <button
            onClick={() => handleAction(() => onStart(container.name))}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <Play className="w-4 h-4" />
            Start
          </button>
        )}

        {isRunning && (
          <>
            <button
              onClick={() => handleAction(() => onStop(container.name))}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Square className="w-4 h-4" />
              Stop
            </button>
            <button
              onClick={() => handleAction(() => onRestart(container.name))}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <RotateCw className="w-4 h-4" />
              Restart
            </button>
          </>
        )}

        <button
          onClick={() => onViewLogs(container.name)}
          className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <FileText className="w-4 h-4" />
          Logs
        </button>
      </div>
    </div>
  );
};

