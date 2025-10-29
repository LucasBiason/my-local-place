import { Cpu, HardDrive, MemoryStick } from 'lucide-react';
import type { SystemMetrics as SystemMetricsType } from '../types';

type SystemMetricsProps = {
  metrics: SystemMetricsType | null;
};

export const SystemMetrics = ({ metrics }: SystemMetricsProps) => {
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">CPU Usage</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics.cpu_percent.toFixed(1)}%
            </p>
          </div>
          <Cpu className="w-10 h-10 text-blue-500" />
        </div>
        <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(metrics.cpu_percent, 100)}%` }}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Memory</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics.memory.percent.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {metrics.memory.used_gb.toFixed(1)} / {metrics.memory.total_gb.toFixed(1)} GB
            </p>
          </div>
          <MemoryStick className="w-10 h-10 text-green-500" />
        </div>
        <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(metrics.memory.percent, 100)}%` }}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Disk</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics.disk.percent.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {metrics.disk.used_gb.toFixed(1)} / {metrics.disk.total_gb.toFixed(1)} GB
            </p>
          </div>
          <HardDrive className="w-10 h-10 text-purple-500" />
        </div>
        <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(metrics.disk.percent, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

