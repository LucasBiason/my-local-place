/**
 * CUSTOM HOOK: useContainerFilter
 * 
 * ============================================================================
 * PROPOSITO
 * ============================================================================
 * 
 * Este hook gerencia filtragem e busca de containers.
 * 
 * FUNCIONALIDADE:
 * - Filtrar por nome (busca textual)
 * - Filtrar por status (all/running/stopped)
 * - Retornar lista filtrada em tempo real
 * 
 * ============================================================================
 * DIFERENCA DOS OUTROS HOOKS
 * ============================================================================
 * 
 * Este hook eh DIFERENTE de useContainers/useHealth/useSystemMetrics:
 * - NAO busca dados da API
 * - RECEBE dados como parametro (containers: Container[])
 * - PROCESSA dados localmente (filtragem no frontend)
 * 
 * CONCEITO: "Hook de Transformacao"
 * Pega dados e transforma/filtra sem fazer requests.
 * 
 * ============================================================================
 * EXEMPLO DE USO:
 * ============================================================================
 * 
 * function ContainerList() {
 *   const { containers } = useContainers();  // Busca containers
 *   
 *   const {
 *     filtered,
 *     searchTerm,
 *     setSearchTerm,
 *     filterStatus,
 *     setFilterStatus
 *   } = useContainerFilter(containers);  // Filtra containers
 * 
 *   return (
 *     <div>
 *       <input 
 *         value={searchTerm} 
 *         onChange={(e) => setSearchTerm(e.target.value)}
 *       />
 *       <button onClick={() => setFilterStatus('running')}>
 *         Apenas Rodando
 *       </button>
 *       {filtered.map(c => <div>{c.name}</div>)}
 *     </div>
 *   );
 * }
 * 
 * ============================================================================
 * FLUXO DE DADOS:
 * ============================================================================
 * 
 * 1. useContainers busca todos containers da API
 * 2. useContainerFilter recebe esses containers
 * 3. Usuario digita texto no input -> setSearchTerm
 * 4. useEffect detecta mudanca e re-filtra
 * 5. Componente recebe lista filtrada e re-renderiza
 */

import { useEffect, useState } from 'react';
import type { Container } from '../types';

/**
 * FilterStatus - Tipo para status de filtro
 * 
 * TIPO UNION: 'all' | 'running' | 'stopped'
 * Significa: Pode ser APENAS um desses 3 valores.
 * 
 * TypeScript nao deixa fazer: setFilterStatus('invalid')
 * Isso previne bugs!
 */
type FilterStatus = 'all' | 'running' | 'stopped';

/**
 * Hook para filtrar containers
 * 
 * @param containers - Array de containers a filtrar (vem de useContainers)
 * @returns Objeto com:
 *   - filtered: Array de containers apos filtragem
 *   - searchTerm: Termo de busca atual
 *   - setSearchTerm: Funcao para mudar termo de busca
 *   - filterStatus: Status de filtro atual ('all'/'running'/'stopped')
 *   - setFilterStatus: Funcao para mudar filtro de status
 * 
 * IMPORTANTE: Este hook DEPENDE de dados externos (containers).
 * Nao busca dados sozinho, apenas processa o que recebe.
 */
export const useContainerFilter = (containers: Container[]) => {
  /**
   * ESTADO 1: searchTerm
   * 
   * Termo de busca digitado pelo usuario.
   * Comeca vazio ('').
   * 
   * UTILIDADE: Filtrar por nome do container.
   * Ex: Usuario digita "postgres", filtra containers com "postgres" no nome.
   */
  const [searchTerm, setSearchTerm] = useState('');
  
  /**
   * ESTADO 2: filterStatus
   * 
   * Status de filtro selecionado.
   * Comeca com 'all' (mostra todos).
   * 
   * OPCOES:
   * - 'all': Mostra todos (rodando + parados)
   * - 'running': Apenas containers rodando
   * - 'stopped': Apenas containers parados
   */
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  
  /**
   * ESTADO 3: filtered
   * 
   * Array de containers APOS filtragem.
   * Este eh o resultado que componente usa para renderizar.
   * 
   * FLUXO: containers -> [filtros aplicados] -> filtered
   */
  const [filtered, setFiltered] = useState<Container[]>([]);

  /**
   * useEffect - Re-filtra quando containers ou filtros mudam
   * 
   * DEPENDENCIAS: [containers, searchTerm, filterStatus]
   * Executa quando QUALQUER uma dessas 3 variaveis mudar:
   * - containers: Lista mudou (novo fetch da API)
   * - searchTerm: Usuario digitou no input
   * - filterStatus: Usuario clicou em botao de filtro
   * 
   * RESULTADO: Lista filtrada sempre atualizada automaticamente
   */
  useEffect(() => {
    /**
     * ALGORITMO DE FILTRAGEM
     * 
     * 1. Comeca com todos containers
     * 2. Aplica filtro de busca (se tiver)
     * 3. Aplica filtro de status (se nao for 'all')
     * 4. Atualiza estado com resultado
     */
    let result = containers;

    /**
     * FILTRO 1: Busca por nome
     * 
     * Se searchTerm nao estiver vazio, filtra containers cujo
     * nome contenha o termo de busca (case-insensitive).
     * 
     * METODOS USADOS:
     * - toLowerCase(): Converte para minusculas ("POSTGRES" -> "postgres")
     * - includes(): Checa se string contem substring
     * - filter(): Cria novo array apenas com itens que passam no teste
     * 
     * EXEMPLO:
     * searchTerm = "post"
     * Containers: ["local-postgres", "local-redis", "local-mongodb"]
     * Resultado: ["local-postgres", "local-mongodb"]  (contem "post")
     */
    if (searchTerm) {
      result = result.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    /**
     * FILTRO 2: Status (running/stopped)
     * 
     * Se filterStatus nao for 'all', filtra por status:
     * - 'running': Apenas containers com c.running === true
     * - 'stopped': Apenas containers com c.running === false
     * 
     * OPERADOR TERNARIO:
     * filterStatus === 'running' ? c.running : !c.running
     * Significa:
     * - Se filterStatus eh 'running', retorna c.running
     * - Senao, retorna !c.running (inverso de c.running)
     * 
     * EXEMPLO:
     * filterStatus = 'running'
     * Containers: [{name: "pg", running: true}, {name: "redis", running: false}]
     * Resultado: [{name: "pg", running: true}]
     */
    if (filterStatus !== 'all') {
      result = result.filter((c) =>
        filterStatus === 'running' ? c.running : !c.running
      );
    }

    /**
     * Atualiza estado com resultado final
     * 
     * setFiltered causa re-renderizacao do componente que usa este hook.
     */
    setFiltered(result);
  }, [containers, searchTerm, filterStatus]);  // Dependencias

  /**
   * RETORNO DO HOOK
   * 
   * Retorna objeto com:
   * - Dados: filtered (resultado da filtragem)
   * - Estados: searchTerm, filterStatus (para input controlado)
   * - Setters: setSearchTerm, setFilterStatus (para mudar filtros)
   * 
   * CONCEITO - Componente Controlado:
   * Componente React usa searchTerm como value do input e setSearchTerm
   * no onChange. Isso faz React controlar o valor do input.
   * 
   * BENEFICIO: React sempre sabe o valor atual, facilitando logica.
   */
  return {
    filtered,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
  };
};
