/**
 * COMPONENTE: SystemMetricsChart
 * 
 * Grafico de metricas do sistema (CPU, RAM, Disco) usando Recharts.
 * Estilo Spike Admin com cantinho colorido.
 * 
 * RESPONSABILIDADE:
 * - Exibir 3 cards com percentuais
 * - Cantinho colorido (amarelo, vermelho, azul)
 * - Icones circulares com fundo colorido
 * - Valores grandes e destacados
 */

import { Cpu, HardDrive, MemoryStick } from 'lucide-react';
import type { SystemMetrics } from '../types';

type Props = {
  metrics: SystemMetrics | null;
};

export const SystemMetricsChart = ({ metrics }: Props) => {
  if (!metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-800 rounded-xl p-6 animate-pulse"
          >
            <div className="h-20 bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  /**
   * Cards de metricas
   * 
   * ESTRUTURA:
   * - CPU: Amarelo (yellow)
   * - Memoria: Vermelho (red)
   * - Disco: Azul (blue)
   * 
   * ESTILO SPIKE ADMIN:
   * - Cantinho colorido (absolute top-right)
   * - Icone circular grande com fundo colorido
   * - Valor grande e destacado
   * - Percentual com cor tematica
   */
  const cards = [
    {
      title: 'CPU',
      value: metrics.cpu_percent.toFixed(1),
      icon: Cpu,
      iconBg: 'bg-yellow-500/20',
      iconColor: 'text-yellow-400',
      cornerColor: 'from-yellow-500 to-yellow-600',
      change: '+2.5%',
    },
    {
      title: 'Memory',
      value: metrics.memory.percent.toFixed(1),
      icon: MemoryStick,
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-400',
      cornerColor: 'from-red-500 to-red-600',
      change: `${metrics.memory.used_gb.toFixed(1)}/${metrics.memory.total_gb.toFixed(0)} GB`,
    },
    {
      title: 'Disk',
      value: metrics.disk.percent.toFixed(1),
      icon: HardDrive,
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      cornerColor: 'from-blue-500 to-blue-600',
      change: `${metrics.disk.used_gb.toFixed(0)}/${metrics.disk.total_gb.toFixed(0)} GB`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        
        return (
          <div
            key={card.title}
            className="relative bg-gray-800 rounded-xl p-6 overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            {/* Cantinho colorido (Spike Admin style) */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.cornerColor} opacity-20 rounded-bl-full`} />
            
            {/* Conteudo */}
            <div className="relative flex items-center justify-between">
              {/* Icone circular */}
              <div className={`${card.iconBg} rounded-full p-4`}>
                <Icon className={`w-8 h-8 ${card.iconColor}`} />
              </div>
              
              {/* Valores */}
              <div className="text-right">
                <div className="text-gray-400 text-sm font-medium mb-1">
                  {card.title}
                </div>
                <div className="text-4xl font-bold text-white mb-1">
                  {card.value}
                  <span className="text-2xl text-gray-400">%</span>
                </div>
                <div className="text-xs text-gray-500">
                  {card.change}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

