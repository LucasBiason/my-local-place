/**
 * COMPONENTE: ContainersComparisonChart
 * 
 * Grafico comparativo mostrando uso de recursos de CADA container.
 * Usuario pode selecionar quais metricas ver (CPU, Memory, Disk).
 */

import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getContainerStats } from '../services/api';
import type { Container } from '../types';

type Props = {
  containers: Container[];
};

type MetricType = 'cpu' | 'memory' | 'disk';

type ContainerMetric = {
  name: string;
  cpu: number;
  memory: number;
  disk: number;
};

export const ContainersComparisonChart = ({ containers }: Props) => {
  const [data, setData] = useState<ContainerMetric[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<MetricType[]>(['cpu', 'memory']);

  const toggleMetric = (metric: MetricType) => {
    setSelectedMetrics(prev => 
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  useEffect(() => {
    const fetchAllStats = async () => {
      const runningContainers = containers.filter(c => c.running);
      
      if (runningContainers.length === 0) {
        setData([]);
        return;
      }

      const statsPromises = runningContainers.map(async (container) => {
        try {
          const stats = await getContainerStats(container.name);
          return {
            name: container.name.replace('local-', '').replace('mylocalplace-', ''),
            cpu: parseFloat(stats.cpu_percent.toFixed(1)),
            memory: parseFloat(stats.memory_percent.toFixed(1)),
            disk: 0, // Docker SDK nao retorna disk individual
          };
        } catch {
          return null;
        }
      });

      const results = await Promise.all(statsPromises);
      const validResults = results.filter((r): r is ContainerMetric => r !== null);
      setData(validResults);
    };

    fetchAllStats();
    const interval = setInterval(fetchAllStats, 5000);
    return () => clearInterval(interval);
  }, [containers]);

  if (data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-white font-bold text-lg mb-4">Container Resources</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No running containers
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      {/* Header com seletores */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold text-lg">Container Resources</h3>
        
        <div className="flex gap-3">
          <button
            onClick={() => toggleMetric('cpu')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedMetrics.includes('cpu')
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            CPU
          </button>
          
          <button
            onClick={() => toggleMetric('memory')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedMetrics.includes('memory')
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            Memory
          </button>
        </div>
      </div>

      {/* Grafico */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          
          <XAxis 
            dataKey="name" 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          
          <YAxis 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            domain={[0, 100]}
            label={{ 
              value: 'Usage (%)', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: '#9ca3af' }
            }}
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
          
          <Legend 
            wrapperStyle={{ 
              paddingTop: '20px'
            }}
          />
          
          {selectedMetrics.includes('cpu') && (
            <Bar 
              dataKey="cpu" 
              fill="#10b981" 
              name="CPU %" 
              radius={[8, 8, 0, 0]}
            />
          )}
          
          {selectedMetrics.includes('memory') && (
            <Bar 
              dataKey="memory" 
              fill="#3b82f6" 
              name="Memory %" 
              radius={[8, 8, 0, 0]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
      
      {/* Info */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Showing {selectedMetrics.join(', ').toUpperCase()} usage for {data.length} running container{data.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

