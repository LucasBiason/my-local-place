/**
 * CUSTOM HOOK: useSystemMetrics
 * 
 * ============================================================================
 * PROPOSITO
 * ============================================================================
 * 
 * Este hook busca metricas do sistema hospedeiro (CPU, RAM, Disco).
 * 
 * FUNCIONALIDADE:
 * - Busca metricas da API
 * - Atualiza automaticamente a cada 5 segundos
 * - Usado para exibir cards de metricas no topo do dashboard
 * 
 * ============================================================================
 * SIMILARIDADE COM useHealth
 * ============================================================================
 * 
 * Este hook eh MUITO similar ao useHealth:
 * - Ambos retornam dados diretamente (nao objeto)
 * - Ambos atualizam periodicamente
 * - Ambos comecam com null
 * 
 * DIFERENCA PRINCIPAL: Intervalo de atualizacao (5s vs 10s)
 * 
 * ============================================================================
 * EXEMPLO DE USO:
 * ============================================================================
 * 
 * function SystemMetricsCards() {
 *   const metrics = useSystemMetrics();
 * 
 *   if (!metrics) return <p>Carregando...</p>;
 * 
 *   return (
 *     <div>
 *       <Card title="CPU" value={metrics.cpu_percent} />
 *       <Card title="RAM" value={metrics.memory.percent} />
 *       <Card title="Disco" value={metrics.disk.percent} />
 *     </div>
 *   );
 * }
 */

import { useEffect, useState } from 'react';
import { getSystemMetrics } from '../services/api';
import type { SystemMetrics } from '../types';

/**
 * Hook para monitorar metricas do sistema
 * 
 * @returns SystemMetrics | null
 *   - SystemMetrics: Objeto com CPU, memoria e disco
 *   - null: Se ainda nao buscou ou se API esta offline
 * 
 * ESTRUTURA IDENTICA A useHealth:
 * - Estado com null inicial
 * - useEffect com fetch + interval
 * - Retorno direto do estado
 */
export const useSystemMetrics = () => {
  /**
   * ESTADO: metrics
   * 
   * Armazena dados de metricas do sistema ou null.
   */
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);

  /**
   * useEffect - Busca metricas periodicamente
   * 
   * INTERVALO: 5000ms = 5 segundos
   * Mais rapido que health check (10s) pois metricas mudam mais.
   * CPU e RAM podem variar bastante em poucos segundos.
   */
  useEffect(() => {
    /**
     * fetchMetrics - Busca metricas da API
     * 
     * FLUXO:
     * 1. Chama getSystemMetrics() da API
     * 2. Atualiza estado com setMetrics(data)
     * 3. Se der erro, loga no console
     */
    const fetchMetrics = async () => {
      try {
        const data = await getSystemMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    // Busca inicial
    fetchMetrics();
    
    // Busca automatica a cada 5 segundos
    const interval = setInterval(fetchMetrics, 5000);
    
    // Cleanup
    return () => clearInterval(interval);
  }, []);

  /**
   * RETORNO
   * 
   * Retorna diretamente o estado 'metrics'.
   * Componente usa: const metrics = useSystemMetrics();
   */
  return metrics;
};
