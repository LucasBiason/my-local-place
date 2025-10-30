/**
 * API CLIENT - COMUNICACAO COM O BACKEND
 * 
 * Este arquivo centraliza todas as chamadas HTTP para a API backend.
 * Usamos a biblioteca "axios" para fazer requisicoes HTTP de forma simples.
 * 
 * CONCEITO IMPORTANTE - Cliente HTTP:
 * Em aplicacoes web modernas, o frontend (React) roda no navegador e o
 * backend (FastAPI) roda no servidor. Eles conversam via HTTP (protocolo web).
 * 
 * O axios eh uma ferramenta que facilita fazer:
 * - GET: buscar dados (ex: listar containers)
 * - POST: enviar comandos (ex: iniciar container)
 * - PUT/PATCH: atualizar dados
 * - DELETE: remover dados
 * 
 * ESTRUTURA:
 * 1. Configuracao do axios (base URL, headers)
 * 2. Funcoes de API organizadas por categoria
 * 3. Cada funcao eh async/await para trabalhar com Promises
 */

import axios from 'axios';
import type { Container, ContainerLogs, ContainerStats, HealthStatus, SystemMetrics } from '../types';

/**
 * URL base da API
 * 
 * - import.meta.env.VITE_API_URL: Variavel de ambiente do Vite (build tool)
 * - Se nao existir, usa 'http://localhost:8000' como padrao
 * 
 * CONCEITO: Variaveis de ambiente permitem mudar configuracoes sem alterar
 * codigo. Util para ter URLs diferentes em dev/prod.
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Instancia configurada do axios
 * 
 * axios.create() cria um cliente HTTP pre-configurado com:
 * - baseURL: URL base que sera prefixada em todas requisicoes
 * - headers: Cabecalhos HTTP padrao enviados em toda requisicao
 * 
 * EXEMPLO: Se baseURL eh 'http://localhost:8000' e fazemos GET('/health'),
 * o axios automaticamente faz GET('http://localhost:8000/health')
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',  // Informa que enviamos/recebemos JSON
  },
});

/**
 * ============================================================================
 * FUNCOES DE API - HEALTH CHECK
 * ============================================================================
 */

/**
 * healthCheck - Verifica se a API esta funcionando
 * 
 * Faz uma requisicao GET para /health e retorna o status da API.
 * 
 * CONCEITO async/await:
 * - async: Indica que a funcao eh assincrona (nao bloqueia o codigo)
 * - await: Espera a Promise (axios.get retorna Promise) resolver
 * - Promise<HealthStatus>: TypeScript dizendo que retorna HealthStatus no futuro
 * 
 * DESTRUCTURING:
 * - const { data } = await api.get(): Extrai apenas 'data' da resposta HTTP
 * - Resposta completa tem: data, status, headers, etc. Queremos so 'data'
 * 
 * @returns Promise com dados de saude da API
 */
export const healthCheck = async (): Promise<HealthStatus> => {
  const { data } = await api.get('/health');
  return data;
};

/**
 * ============================================================================
 * FUNCOES DE API - CONTAINERS
 * ============================================================================
 */

/**
 * listContainers - Lista todos os containers Docker
 * 
 * Busca lista de containers da API. Pode incluir ou nao containers parados.
 * 
 * @param all - Se true, inclui containers parados. Se false, so rodando (padrao: true)
 * @returns Promise com array de containers
 * 
 * EXEMPLO DE USO:
 * const containers = await listContainers(true);  // Todos
 * const running = await listContainers(false);     // So rodando
 */
export const listContainers = async (all = true): Promise<Container[]> => {
  const { data } = await api.get('/api/v1/containers', { params: { all } });
  return data;
};

/**
 * getContainer - Busca detalhes de um container especifico
 * 
 * @param name - Nome do container (ex: "local-postgres")
 * @returns Promise com dados do container
 * 
 * TEMPLATE STRINGS:
 * - Backticks (``) permitem inserir variaveis com ${variavel}
 * - `/api/v1/containers/${name}` vira "/api/v1/containers/local-postgres"
 */
export const getContainer = async (name: string): Promise<Container> => {
  const { data } = await api.get(`/api/v1/containers/${name}`);
  return data;
};

/**
 * startContainer - Inicia um container parado
 * 
 * Envia comando POST para /start, que faz o backend chamar Docker SDK.
 * 
 * @param name - Nome do container a iniciar
 * @returns Promise<void> - Nao retorna dados, apenas confirma sucesso
 * 
 * CONCEITO: POST eh usado para "acoes" (start, stop), nao para buscar dados (GET)
 */
export const startContainer = async (name: string): Promise<void> => {
  await api.post(`/api/v1/containers/${name}/start`);
};

/**
 * stopContainer - Para um container rodando
 * 
 * @param name - Nome do container a parar
 * @returns Promise<void>
 */
export const stopContainer = async (name: string): Promise<void> => {
  await api.post(`/api/v1/containers/${name}/stop`);
};

/**
 * restartContainer - Reinicia um container (stop + start)
 * 
 * @param name - Nome do container a reiniciar
 * @returns Promise<void>
 */
export const restartContainer = async (name: string): Promise<void> => {
  await api.post(`/api/v1/containers/${name}/restart`);
};

/**
 * getContainerLogs - Busca logs de um container
 * 
 * Retorna as ultimas N linhas de log do container.
 * 
 * @param name - Nome do container
 * @param tail - Quantas linhas buscar do final (padrao: 100)
 * @returns Promise com logs do container
 * 
 * PARAMETROS DE QUERY:
 * - { params: { tail } } vira ?tail=100 na URL
 * - axios transforma objetos em query strings automaticamente
 */
export const getContainerLogs = async (
  name: string,
  tail = 100
): Promise<ContainerLogs> => {
  const { data } = await api.get(`/api/v1/containers/${name}/logs`, {
    params: { tail },
  });
  return data;
};

/**
 * getContainerStats - Busca estatisticas de uso de um container
 * 
 * Retorna metricas em tempo real de CPU, RAM e Rede.
 * 
 * @param name - Nome do container
 * @returns Promise com estatisticas do container
 */
export const getContainerStats = async (
  name: string
): Promise<ContainerStats> => {
  const { data } = await api.get(`/api/v1/containers/${name}/stats`);
  return data;
};

/**
 * ============================================================================
 * FUNCOES DE API - SISTEMA
 * ============================================================================
 */

/**
 * getSystemMetrics - Busca metricas do sistema hospedeiro
 * 
 * Retorna uso de CPU, RAM e Disco do sistema inteiro (nao apenas containers).
 * Usado para exibir cards de metricas no topo do dashboard.
 * 
 * @returns Promise com metricas do sistema
 */
export const getSystemMetrics = async (): Promise<SystemMetrics> => {
  const { data } = await api.get('/api/v1/system/metrics');
  return data;
};

