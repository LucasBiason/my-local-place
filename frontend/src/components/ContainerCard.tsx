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

import { FileText, Play, RotateCw, Square, Wrench } from 'lucide-react';
import { useState } from 'react';
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
  onRebuild: (name: string) => void;
  onViewLogs: (name: string) => void;
};

export const ContainerCard = ({
  container,
  onStart,
  onStop,
  onRestart,
  onRebuild,
  onViewLogs,
}: Props) => {
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

        {/* INFO */}
        {container.ports.length > 0 && (
          <div className="text-sm text-gray-400 mb-4 bg-gray-900/30 rounded px-3 py-2">
            <span className="text-gray-500 font-medium">Ports:</span> {container.ports.join(', ')}
          </div>
        )}

        {/* BOTOES DE ACAO */}
        <div className="flex gap-2 flex-wrap">
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
            onClick={() => handleAction(() => onRebuild(container.name))}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
            title="Rebuild container (build + restart)"
          >
            <Wrench className="w-4 h-4" />
            Rebuild
          </button>

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
