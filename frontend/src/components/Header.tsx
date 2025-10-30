/**
 * Application header component.
 * 
 * Displays logo, branding, and API/Docker connection status.
 * 
 * @component
 */

import { Activity } from 'lucide-react';
import { Logo } from './Logo';
import type { HealthStatus } from '../types';

type HeaderProps = {
  /** API health status */
  health: HealthStatus | null;
};

export const Header = ({ health }: HeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-2xl border-b border-blue-700">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Logo />

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
