/**
 * COMPONENTE: ContainerCard
 * 
 * Card de container com:
 * - Cantinho colorido (Spike Admin style)
 * - Icone tematico com cor por tipo
 * - Metricas de CPU e RAM (barras)
 * - Botoes de acao
 * 
 * DESIGN: Dark mode + cantinho gradiente + icone circular
 */

import { FileText, Play, RotateCw, Square } from 'lucide-react';
import { useState } from 'react';
import { useContainerStats } from '../hooks/useContainerStats';
import type { Container } from '../types';
import {
  getContainerCornerColor,
  getContainerIcon,
  getContainerIconBg,
  getContainerIconColor,
  getContainerTypeLabel,
} from '../utils/containerIcons';

type Props = {
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
}: Props) => {
  const [loading, setLoading] = useState(false);
  
  // Busca stats apenas se container esta rodando
  const stats = useContainerStats(container.name, container.running);

  const handleAction = async (action: () => void) => {
    setLoading(true);
    try {
      await action();
    } finally {
      setLoading(false);
    }
  };

  const isRunning = container.running;
  const Icon = getContainerIcon(container.name);
  const iconColor = getContainerIconColor(container.name);
  const iconBg = getContainerIconBg(container.name);
  const cornerColor = getContainerCornerColor(container.name);
  const typeLabel = getContainerTypeLabel(container.name);

  return (
    <div className="relative bg-gray-800 rounded-xl p-6 overflow-hidden shadow-lg hover:shadow-2xl transition-all">
      {/* CANTINHO COLORIDO (Spike Admin style) */}
      <div 
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cornerColor} opacity-30 rounded-bl-full`}
      />
      
      {/* CONTEUDO */}
      <div className="relative">
        {/* HEADER: Icone + Nome + Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Icone circular com fundo colorido */}
            <div className={`${iconBg} rounded-full p-3`}>
              <Icon className={`w-6 h-6 ${iconColor}`} strokeWidth={2} />
            </div>
            
            <div>
              <h3 className="font-bold text-white text-lg">
                {container.name}
              </h3>
              <p className="text-sm text-gray-400">
                {container.image}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {typeLabel}
              </p>
            </div>
          </div>
          
          {/* Badge de status */}
          <span
            className={`${
              isRunning ? 'bg-green-500' : 'bg-gray-600'
            } text-white text-xs font-bold px-3 py-1 rounded-full shadow-md`}
          >
            {container.status.toUpperCase()}
          </span>
        </div>

        {/* METRICAS (se container rodando) */}
        {isRunning && stats && (
          <div className="mb-4 space-y-3 bg-gray-900/50 rounded-lg p-4">
            {/* CPU */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-gray-400">CPU</span>
                <span className="text-green-400 font-bold">
                  {stats.cpu_percent.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(stats.cpu_percent, 100)}%` }}
                />
              </div>
            </div>

            {/* MEMORIA */}
            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-gray-400">Memory</span>
                <span className="text-blue-400 font-bold">
                  {stats.memory_percent.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(stats.memory_percent, 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.memory_usage_mb.toFixed(0)} / {stats.memory_limit_mb.toFixed(0)} MB
              </div>
            </div>

            {/* NETWORK */}
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">
                ↓ {stats.network_rx_mb.toFixed(1)} MB
              </span>
              <span className="text-gray-400">
                ↑ {stats.network_tx_mb.toFixed(1)} MB
              </span>
            </div>
          </div>
        )}

        {/* INFO */}
        {container.ports.length > 0 && (
          <div className="text-sm text-gray-400 mb-4 bg-gray-900/30 rounded px-3 py-2">
            <span className="text-gray-500 font-medium">Ports:</span> {container.ports.join(', ')}
          </div>
        )}

        {/* BOTOES DE ACAO */}
        <div className="flex gap-2">
          {!isRunning ? (
            <button
              onClick={() => handleAction(() => onStart(container.name))}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <Play className="w-4 h-4" />
              Start
            </button>
          ) : (
            <>
              <button
                onClick={() => handleAction(() => onStop(container.name))}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
              >
                <Square className="w-4 h-4" />
                Stop
              </button>
              <button
                onClick={() => handleAction(() => onRestart(container.name))}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
              >
                <RotateCw className="w-4 h-4" />
                Restart
              </button>
            </>
          )}

          <button
            onClick={() => onViewLogs(container.name)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
          >
            <FileText className="w-4 h-4" />
            Logs
          </button>
        </div>
      </div>
    </div>
  );
};
