import { Activity, Box } from 'lucide-react';
import type { HealthStatus } from '../types';

type HeaderProps = {
  health: HealthStatus | null;
};

export const Header = ({ health }: HeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Box className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold">MyLocalPlace</h1>
              <p className="text-blue-100 text-sm">Docker Container Management</p>
            </div>
          </div>

          {health && (
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <Activity
                className={`w-5 h-5 ${
                  health.docker_connected ? 'text-green-300' : 'text-red-300'
                }`}
              />
              <div className="text-sm">
                <div className="font-medium">
                  {health.docker_connected ? 'Docker Connected' : 'Docker Offline'}
                </div>
                <div className="text-blue-100 text-xs">v{health.version}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

