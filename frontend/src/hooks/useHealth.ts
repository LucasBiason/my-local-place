/**
 * CUSTOM HOOK: useHealth
 * 
 * ============================================================================
 * PROPOSITO
 * ============================================================================
 * 
 * Este hook gerencia o health check (verificacao de saude) da API backend.
 * 
 * FUNCIONALIDADE:
 * - Verifica se API esta respondendo
 * - Verifica se Docker esta conectado
 * - Atualiza automaticamente a cada 10 segundos
 * - Usado para mostrar indicador de conexao no header
 * 
 * ============================================================================
 * DIFERENCA PARA useContainers
 * ============================================================================
 * 
 * useContainers: Mais complexo, retorna objeto com multiplos valores/funcoes
 * useHealth: Mais simples, retorna apenas o estado de saude (ou null)
 * 
 * ============================================================================
 * EXEMPLO DE USO:
 * ============================================================================
 * 
 * function Header() {
 *   const health = useHealth();
 * 
 *   return (
 *     <div>
 *       Status: {health?.status || 'Desconectado'}
 *       {health?.docker_connected ? '✅' : '❌'}
 *     </div>
 *   );
 * }
 * 
 * NOTA: O '?' eh "optional chaining" do JavaScript.
 * Se health for null, nao da erro, apenas retorna undefined.
 */

import { useEffect, useState } from 'react';
import { healthCheck } from '../services/api';
import type { HealthStatus } from '../types';

/**
 * Hook para monitorar saude da API
 * 
 * @returns HealthStatus | null
 *   - HealthStatus: Se conseguiu buscar dados da API
 *   - null: Se ainda nao buscou ou se API esta offline
 * 
 * TIPO DE RETORNO SIMPLES:
 * Diferente de useContainers que retorna objeto { containers, loading, ... },
 * este hook retorna diretamente o valor. Componente usa:
 * const health = useHealth();  // Nao precisa destructuring
 */
export const useHealth = () => {
  /**
   * ESTADO: health
   * 
   * useState<HealthStatus | null>(null) significa:
   * - Pode ser HealthStatus OU null (|= "ou" em TypeScript)
   * - Comeca como null (antes da primeira busca)
   * 
   * POR QUE null INICIAL?
   * Antes de buscar API, nao temos dados. null indica "sem dados ainda".
   * Componente pode checar: if (!health) { return 'Carregando...' }
   */
  const [health, setHealth] = useState<HealthStatus | null>(null);

  /**
   * useEffect - Busca health check periodicamente
   * 
   * ESTRUTURA:
   * 1. Define funcao fetchHealth() dentro do useEffect
   * 2. Chama fetchHealth() imediatamente (busca inicial)
   * 3. Cria intervalo para repetir a cada 10 segundos
   * 4. Retorna cleanup que para o intervalo
   * 
   * POR QUE FUNCAO DENTRO DE useEffect?
   * Funcoes async nao podem ser passadas diretamente para useEffect.
   * Solucao: Criar funcao async dentro e chamar ela.
   * 
   * INTERVALO: 10000ms = 10 segundos
   * Mais lento que useContainers (5s) pois health check eh menos critico.
   */
  useEffect(() => {
    /**
     * fetchHealth - Busca status de saude da API
     * 
     * TRY/CATCH SEM FINALLY:
     * - try: Tenta buscar dados e atualizar estado
     * - catch: Se API estiver offline, apenas loga erro
     * 
     * NOTA: Nao tem setLoading aqui pois nao mostramos "carregando"
     * para health check. Apenas atualizamos quando conseguimos.
     */
    const fetchHealth = async () => {
      try {
        const data = await healthCheck();
        setHealth(data);  // Atualiza estado com dados da API
      } catch (error) {
        // API offline ou erro de rede
        console.error('Health check failed:', error);
        // Poderiamos fazer: setHealth(null) aqui para indicar offline
      }
    };

    // Busca imediata ao montar componente
    fetchHealth();
    
    // Busca automatica a cada 10 segundos
    const interval = setInterval(fetchHealth, 10000);
    
    // Cleanup: Para intervalo ao desmontar
    return () => clearInterval(interval);
  }, []);  // [] = Executa apenas no mount, nunca mais

  /**
   * RETORNO DIRETO
   * 
   * Retorna apenas o estado 'health'.
   * Componente usa: const health = useHealth();
   * 
   * ALTERNATIVA MAIS COMPLEXA (nao usada aqui):
   * Poderiamos retornar objeto como:
   * return { health, isConnected: !!health, refresh: fetchHealth };
   * 
   * Mas para este caso, retorno simples eh suficiente.
   */
  return health;
};
