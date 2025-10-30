/**
 * CUSTOM HOOK: useContainers
 * 
 * ============================================================================
 * O QUE SAO HOOKS?
 * ============================================================================
 * 
 * Hooks sao funcoes especiais do React que permitem usar recursos do React
 * em componentes funcionais (funcoes normais de JavaScript).
 * 
 * HOOKS NATIVOS DO REACT:
 * - useState: Cria uma variavel de "estado" que ao mudar, re-renderiza o componente
 * - useEffect: Executa codigo quando o componente monta ou quando algo muda
 * - useCallback, useMemo, useRef, etc.
 * 
 * CUSTOM HOOKS:
 * Sao hooks que NOS criamos, combinando hooks nativos para encapsular logica.
 * Sempre comecam com "use" (convencao do React).
 * 
 * ============================================================================
 * O QUE ESTE HOOK FAZ?
 * ============================================================================
 * 
 * useContainers() gerencia TODA a logica relacionada a containers:
 * - Buscar lista de containers da API
 * - Atualizar automaticamente a cada 5 segundos
 * - Fornecer funcoes para start/stop/restart containers
 * - Gerenciar estado de loading
 * 
 * BENEFICIO: Componentes so precisam chamar useContainers() e recebem
 * tudo pronto, sem precisar saber COMO funciona por dentro.
 * 
 * ============================================================================
 * EXEMPLO DE USO EM UM COMPONENTE:
 * ============================================================================
 * 
 * function MeuComponente() {
 *   const { containers, loading, handleStart } = useContainers();
 * 
 *   if (loading) return <p>Carregando...</p>;
 * 
 *   return (
 *     <div>
 *       {containers.map(c => (
 *         <div key={c.id}>
 *           {c.name}
 *           <button onClick={() => handleStart(c.name)}>Start</button>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 */

import { useEffect, useState } from 'react';
import {
  listContainers,
  restartContainer,
  startContainer,
  stopContainer,
} from '../services/api';
import type { Container } from '../types';

/**
 * Hook principal para gerenciar containers
 * 
 * @returns Objeto com:
 *   - containers: Array com todos os containers
 *   - loading: true enquanto busca dados da API
 *   - handleStart: Funcao para iniciar container
 *   - handleStop: Funcao para parar container
 *   - handleRestart: Funcao para reiniciar container
 *   - refresh: Funcao para atualizar lista manualmente
 */
export const useContainers = () => {
  /**
   * ESTADO 1: containers
   * 
   * useState<Container[]>([]) cria uma variavel de estado:
   * - containers: Valor atual (comeca como array vazio [])
   * - setContainers: Funcao para mudar o valor
   * - <Container[]>: TypeScript dizendo que eh array de Container
   * 
   * IMPORTANTE: Quando setContainers() eh chamado, React RE-RENDERIZA
   * o componente que usa este hook, mostrando os novos dados na tela.
   */
  const [containers, setContainers] = useState<Container[]>([]);
  
  /**
   * ESTADO 2: loading
   * 
   * Indica se estamos buscando dados da API.
   * Comeca false, vira true durante fetch, volta false no final.
   * 
   * UTILIDADE: Componente pode mostrar "Carregando..." enquanto loading=true
   */
  const [loading, setLoading] = useState(false);

  /**
   * fetchContainers - Busca containers da API
   * 
   * Esta funcao:
   * 1. Ativa loading (setLoading(true))
   * 2. Chama listContainers() da API
   * 3. Atualiza estado com setContainers(data)
   * 4. Desativa loading (setLoading(false))
   * 
   * TRY/CATCH/FINALLY:
   * - try: Tenta executar codigo
   * - catch: Se der erro, captura e loga no console
   * - finally: Sempre executa, erro ou nao (desativa loading)
   * 
   * ASYNC: Funcao assincrona para usar await com Promises
   */
  const fetchContainers = async () => {
    setLoading(true);
    try {
      const data = await listContainers(true);  // Busca todos containers
      setContainers(data);  // Atualiza estado -> React re-renderiza
    } catch (error) {
      console.error('Failed to fetch containers:', error);
    } finally {
      setLoading(false);  // Sempre desativa loading
    }
  };

  /**
   * handleStart - Inicia um container
   * 
   * @param name - Nome do container a iniciar
   * 
   * FLUXO:
   * 1. Chama startContainer(name) da API
   * 2. Chama fetchContainers() para atualizar lista
   * 
   * RESULTADO: Container inicia e UI atualiza automaticamente
   */
  const handleStart = async (name: string) => {
    await startContainer(name);
    await fetchContainers();  // Atualiza lista apos iniciar
  };

  /**
   * handleStop - Para um container
   * 
   * @param name - Nome do container a parar
   */
  const handleStop = async (name: string) => {
    await stopContainer(name);
    await fetchContainers();  // Atualiza lista apos parar
  };

  /**
   * handleRestart - Reinicia um container
   * 
   * @param name - Nome do container a reiniciar
   */
  const handleRestart = async (name: string) => {
    await restartContainer(name);
    await fetchContainers();  // Atualiza lista apos reiniciar
  };

  /**
   * useEffect - Executa codigo quando componente monta
   * 
   * Este eh um dos hooks mais importantes do React!
   * 
   * ESTRUTURA:
   * useEffect(() => {
   *   // Codigo a executar
   *   return () => {
   *     // Cleanup (limpeza) quando componente desmonta
   *   }
   * }, [dependencias]);
   * 
   * DEPENDENCIAS ([]):
   * - [] (vazio): Executa APENAS quando componente monta (1x)
   * - [var]: Executa quando 'var' muda
   * - Sem array: Executa em TODA re-renderizacao (cuidado!)
   * 
   * O QUE ESTE useEffect FAZ:
   * 1. Busca containers imediatamente (fetchContainers())
   * 2. Cria intervalo para buscar a cada 5000ms (5 segundos)
   * 3. Retorna funcao de cleanup que limpa o intervalo
   * 
   * RESULTADO: Lista atualiza automaticamente a cada 5s
   * 
   * POR QUE CLEANUP?
   * Se componente desmontar (usuario sair da pagina), precisamos
   * parar o setInterval para nao fazer requests desnecessarios.
   */
  useEffect(() => {
    fetchContainers();  // Busca inicial
    
    // Busca automatica a cada 5 segundos
    const interval = setInterval(fetchContainers, 5000);
    
    // Cleanup: Para o intervalo quando componente desmontar
    return () => clearInterval(interval);
  }, []);  // [] = Executa apenas no mount

  /**
   * RETORNO DO HOOK
   * 
   * Retorna objeto com tudo que componentes precisam:
   * - Dados (containers, loading)
   * - Acoes (handleStart, handleStop, handleRestart, refresh)
   * 
   * CONCEITO: Componente "consome" este hook fazendo:
   * const { containers, loading, handleStart } = useContainers();
   * 
   * Isso eh chamado "destructuring" - extrai propriedades do objeto
   */
  return {
    containers,
    loading,
    handleStart,
    handleStop,
    handleRestart,
    refresh: fetchContainers,  // Alias: fetchContainers vira 'refresh'
  };
};
