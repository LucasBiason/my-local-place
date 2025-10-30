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
 * - Atualiza automaticamente a cada 10 minutos
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
   * useEffect - Busca health check APENAS UMA VEZ
   * 
   * MUDANCA DE ESTRATEGIA (sugestao do usuario):
   * Antes: Polling a cada 10s (desnecessario)
   * Agora: Busca apenas 1x no inicio
   * 
   * RAZAO:
   * useContainers e useSystemMetrics ja monitoram API continuamente (5s).
   * Se API cair, eles vao detectar.
   * Health check so precisa validar INICIALMENTE se API esta operante.
   * 
   * BENEFICIOS:
   * - Menos requests (1 vs infinitos)
   * - Menos processamento
   * - Mais eficiente
   * - Mesma funcionalidade
   * 
   * DEPENDENCIAS: []
   * Array vazio = executa APENAS quando componente monta (1x)
   * NUNCA mais executa, mesmo com re-renders.
   */
  useEffect(() => {
    /**
     * fetchHealth - Busca status de saude da API
     * 
     * EXECUCAO UNICA:
     * Esta funcao executa apenas 1x (no mount do App).
     * 
     * TRY/CATCH:
     * - try: API online -> setHealth(data)
     * - catch: API offline -> setHealth(null)
     * 
     * RESULTADO:
     * Header mostra status baseado na resposta inicial.
     * Se API estiver online, mostra "Docker Connected".
     * Se offline, nao mostra nada (health=null).
     */
    const fetchHealth = async () => {
      try {
        const data = await healthCheck();
        setHealth(data);  // API online
      } catch (error) {
        console.error('Health check failed:', error);
        setHealth(null);  // API offline
      }
    };

    // Busca UNICA ao montar componente
    fetchHealth();
    
    // SEM setInterval!
    // SEM cleanup necessario!
  }, []);  // [] = Executa apenas no mount, NUNCA mais

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
