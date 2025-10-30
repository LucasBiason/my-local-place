/**
 * CUSTOM HOOK: useContainerStats
 * 
 * ============================================================================
 * PROPOSITO
 * ============================================================================
 * 
 * Busca estatisticas de uso (CPU, RAM, Network) de containers RODANDO.
 * 
 * DIFERENCA de outros hooks:
 * - useContainers: Busca LISTA de containers
 * - useContainerStats: Busca METRICAS de containers especificos
 * 
 * ============================================================================
 * ESTRATEGIA DE BAIXO USO DE MEMORIA
 * ============================================================================
 * 
 * Para evitar sobrecarregar frontend:
 * 1. Busca stats APENAS de containers rodando
 * 2. Nao armazena historico (apenas valor atual)
 * 3. Atualiza apenas quando container esta visivel
 * 4. Usa Map para cache eficiente
 * 
 * ============================================================================
 * EXEMPLO DE USO:
 * ============================================================================
 * 
 * function ContainerCard({ container }) {
 *   const stats = useContainerStats(
 *     container.name, 
 *     container.running
 *   );
 * 
 *   if (!stats) return <div>No stats</div>;
 * 
 *   return (
 *     <div>
 *       CPU: {stats.cpu_percent}%
 *       RAM: {stats.memory_percent}%
 *     </div>
 *   );
 * }
 */

import { useEffect, useState } from 'react';
import { getContainerStats } from '../services/api';
import type { ContainerStats } from '../types';

/**
 * Hook para buscar stats de container individual
 * 
 * @param containerName - Nome do container
 * @param isRunning - Se container esta rodando (apenas busca se true)
 * @returns ContainerStats | null
 * 
 * OTIMIZACAO:
 * Se container nao esta rodando (isRunning=false), retorna null
 * sem fazer request. Economiza requests e processamento.
 */
export const useContainerStats = (
  containerName: string,
  isRunning: boolean
): ContainerStats | null => {
  /**
   * ESTADO: stats
   * 
   * Armazena apenas valor ATUAL (nao historico).
   * Isso mantem uso de memoria baixo.
   */
  const [stats, setStats] = useState<ContainerStats | null>(null);

  /**
   * useEffect - Busca stats apenas se container esta rodando
   * 
   * DEPENDENCIAS: [containerName, isRunning]
   * - containerName: Se mudar container, busca novo
   * - isRunning: Se parar/iniciar, atualiza comportamento
   * 
   * CONDICIONAL:
   * if (!isRunning) { setStats(null); return; }
   * Se container parado, limpa stats e para execucao.
   * 
   * INTERVALO: 5000ms = 5 segundos
   * Mesmo intervalo de useContainers para sincronizar.
   */
  useEffect(() => {
    /**
     * Se container nao esta rodando, limpa stats e retorna
     * 
     * EARLY RETURN:
     * Padrao para evitar codigo aninhado desnecessario.
     */
    if (!isRunning) {
      setStats(null);
      return;
    }

    /**
     * fetchStats - Busca metricas do container
     * 
     * TRY/CATCH:
     * Se der erro (container acabou de parar), apenas loga.
     * Nao quebra UI.
     */
    const fetchStats = async () => {
      try {
        const data = await getContainerStats(containerName);
        setStats(data);
      } catch (error) {
        // Container pode ter parado entre checagens
        console.error(`Failed to fetch stats for ${containerName}:`, error);
        setStats(null);
      }
    };

    // Busca inicial
    fetchStats();
    
    // Busca automatica a cada 5 segundos
    const interval = setInterval(fetchStats, 5000);
    
    // Cleanup
    return () => clearInterval(interval);
  }, [containerName, isRunning]);

  /**
   * RETORNO
   * 
   * Retorna stats ou null.
   * Componente pode checar: if (stats) { ... }
   */
  return stats;
};

