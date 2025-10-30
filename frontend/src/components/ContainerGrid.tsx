import { ContainerCard } from './ContainerCard';
import type { Container } from '../types';

type ContainerGridProps = {
  containers: Container[];
  loading: boolean;
  onStart: (name: string) => void;
  onStop: (name: string) => void;
  onRestart: (name: string) => void;
  onViewLogs: (name: string) => void;
};

export const ContainerGrid = ({
  containers,
  loading,
  onStart,
  onStop,
  onRestart,
  onViewLogs,
}: ContainerGridProps) => {
  if (loading) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-12">
        Loading containers...
      </div>
    );
  }

  if (containers.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-12">
        No containers found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {containers.map((container) => (
        <ContainerCard
          key={container.id}
          container={container}
          onStart={onStart}
          onStop={onStop}
          onRestart={onRestart}
          onViewLogs={onViewLogs}
        />
      ))}
    </div>
  );
};

