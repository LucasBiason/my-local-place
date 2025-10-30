/**
 * COMPONENTE: SystemUsageChart
 * 
 * Grafico UNICO com CPU, RAM e Disco da maquina.
 * Usa Recharts para visualizacao em tempo real.
 */

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useEffect, useState } from 'react';
import type { SystemMetrics } from '../types';

type Props = {
  metrics: SystemMetrics | null;
};

type DataPoint = {
  time: string;
  cpu: number;
  memory: number;
  disk: number;
};

export const SystemUsageChart = ({ metrics }: Props) => {
  const [history, setHistory] = useState<DataPoint[]>([]);

  useEffect(() => {
    if (!metrics) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newPoint: DataPoint = {
      time: timeStr,
      cpu: parseFloat(metrics.cpu_percent.toFixed(1)),
      memory: parseFloat(metrics.memory.percent.toFixed(1)),
      disk: parseFloat(metrics.disk.percent.toFixed(1)),
    };

    setHistory(prev => {
      const updated = [...prev, newPoint];
      // Manter apenas ultimos 12 pontos (1 hora se atualiza a cada 5min)
      return updated.slice(-12);
    });
  }, [metrics]);

  if (history.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-white font-bold text-lg mb-4">System Usage</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          Collecting data...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-white font-bold text-lg mb-4">System Usage Over Time</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={history}>
          <defs>
            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorDisk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          
          <XAxis 
            dataKey="time" 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          
          <YAxis 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            domain={[0, 100]}
          />
          
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value: number) => `${value}%`}
          />
          
          <Area 
            type="monotone" 
            dataKey="cpu" 
            stroke="#10b981" 
            fillOpacity={1} 
            fill="url(#colorCpu)"
            strokeWidth={2}
            name="CPU"
          />
          
          <Area 
            type="monotone" 
            dataKey="memory" 
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorMemory)"
            strokeWidth={2}
            name="Memory"
          />
          
          <Area 
            type="monotone" 
            dataKey="disk" 
            stroke="#f59e0b" 
            fillOpacity={1} 
            fill="url(#colorDisk)"
            strokeWidth={2}
            name="Disk"
          />
        </AreaChart>
      </ResponsiveContainer>
      
      {/* Legenda */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm text-gray-400">CPU</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-sm text-gray-400">Memory</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-sm text-gray-400">Disk</span>
        </div>
      </div>
    </div>
  );
};

