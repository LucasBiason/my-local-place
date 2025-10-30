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
   * Indica se estamos buscando dados da API PELA PRIMEIRA VEZ.
   * Comeca true, vira false apos primeira busca bem-sucedida.
   * 
   * ANTI-FLICKER:
   * - true: Mostra skeleton (primeira carga)
   * - false: Mostra dados (mesmo durante refresh em background)
   * 
   * UTILIDADE: Componente mostra skeleton apenas no inicio,
   * nao a cada refresh (evita piscar).
   */
  const [loading, setLoading] = useState(true);  // Comeca true

  /**
   * fetchContainers - Busca containers da API
   * 
   * Esta funcao:
   * 1. Chama listContainers() da API
   * 2. Atualiza estado com setContainers(data)
   * 3. Desativa loading (apenas primeira vez)
   * 
   * ANTI-FLICKER (otimizacao):
   * NAO faz setLoading(true) a cada refresh!
   * Apenas mantem loading=false apos primeira carga.
   * 
   * RESULTADO:
   * - Primeira busca: Mostra skeleton (loading=true)
   * - Proximas buscas: Atualiza em background (loading=false)
   * - UI nao pisca a cada 5 segundos!
   * 
   * TRY/CATCH:
   * - try: Tenta executar codigo
   * - catch: Se der erro, captura e loga no console
   * - Mantem dados anteriores (nao limpa containers)
   * 
   * ASYNC: Funcao assincrona para usar await com Promises
   */
  const fetchContainers = async () => {
    try {
      const data = await listContainers(true);  // Busca todos containers
      setContainers(data);  // Atualiza estado -> React re-renderiza
      
      // Desativa loading APENAS na primeira vez bem-sucedida
      if (loading) {
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to fetch containers:', error);
      // Mantem containers anteriores em caso de erro temporario
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
   * NOVA ESTRATEGIA (sugestao do usuario):
   * - Refresh completo: A cada 10 MINUTOS (600000ms)
   * - Monitoramento: Cada container individualmente (useContainerStats)
   * 
   * RAZAO:
   * Refresh a cada 5s era agressivo demais.
   * Containers nao mudam tao rapido assim.
   * Stats individuais ja monitoram containers rodando.
   * 
   * BENEFICIOS:
   * - Menos requests (1 a cada 10min vs 12 por minuto)
   * - Menos processamento
   * - Mesma funcionalidade
   * - Monitoramento granular via stats individuais
   * 
   * POR QUE CLEANUP?
   * Se componente desmontar (usuario sair da pagina), precisamos
   * parar o setInterval para nao fazer requests desnecessarios.
   */
  useEffect(() => {
    fetchContainers();  // Busca inicial
    
    // Busca automatica a cada 10 MINUTOS
    const interval = setInterval(fetchContainers, 600000);  // 600000ms = 10min
    
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
