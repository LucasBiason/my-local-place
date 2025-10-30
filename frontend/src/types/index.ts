/**
 * TIPOS TYPESCRIPT - DEFINICOES DE DADOS
 * 
 * Este arquivo define todos os "tipos" (types) que usamos na aplicacao.
 * Tipos sao como "contratos" que dizem qual formato os dados devem ter.
 * 
 * CONCEITO: Em TypeScript, tipos ajudam a evitar erros e deixam o codigo
 * mais seguro, pois o editor avisa se voce tentar usar dados errados.
 * 
 * Por exemplo: se um tipo diz que 'id' eh string, TypeScript nao deixa
 * voce passar um numero.
 */

/**
 * Container - Representa um container Docker
 * 
 * Este tipo define como os dados de um container Docker sao estruturados
 * quando vem da API. Cada propriedade tem um tipo especifico.
 * 
 * CAMPOS:
 * - id: Identificador unico do container (ex: "abc123")
 * - name: Nome do container (ex: "local-postgres")
 * - status: Status textual (ex: "running", "stopped")
 * - state: Estado detalhado (pode ser string ou objeto complexo)
 * - image: Imagem Docker usada (ex: "postgres:17")
 * - ports: Lista de portas mapeadas (ex: ["5432:5432/tcp"])
 * - created: Data de criacao (formato ISO 8601)
 * - running: Booleano indicando se esta rodando
 */
export type Container = {
  id: string;
  name: string;
  status: string;
  state: string | Record<string, any>;
  image: string;
  ports: string[];
  created: string;
  running: boolean;
};

/**
 * ContainerWithStats - Container + suas estatisticas
 * 
 * Combina informacoes do container com suas metricas de uso.
 * Usado quando precisamos exibir card com metricas em tempo real.
 */
export type ContainerWithStats = Container & {
  stats?: ContainerStats | null;
};

/**
 * ContainerStats - Estatisticas de uso de recursos de um container
 * 
 * Representa os dados de CPU, memoria e rede que um container esta usando
 * em tempo real. Usado para exibir graficos e metricas no dashboard.
 * 
 * CAMPOS:
 * - cpu_percent: Percentual de CPU usado (0-100)
 * - memory_usage_mb: Memoria RAM usada em Megabytes
 * - memory_limit_mb: Limite maximo de memoria em MB
 * - memory_percent: Percentual de memoria usado (0-100)
 * - network_rx_mb: Dados recebidos pela rede em MB
 * - network_tx_mb: Dados transmitidos pela rede em MB
 */
export type ContainerStats = {
  cpu_percent: number;
  memory_usage_mb: number;
  memory_limit_mb: number;
  memory_percent: number;
  network_rx_mb: number;
  network_tx_mb: number;
};

/**
 * ContainerLogs - Logs de um container Docker
 * 
 * Representa as linhas de log que um container gerou. Usado para exibir
 * logs no modal de visualizacao.
 * 
 * CAMPOS:
 * - container: Nome do container que gerou os logs
 * - lines: Array com cada linha de log como string
 * - tail: Numero de linhas retornadas (ex: ultimas 100 linhas)
 */
export type ContainerLogs = {
  container: string;
  lines: string[];
  tail: number;
};

/**
 * SystemMetrics - Metricas do sistema hospedeiro
 * 
 * Representa o uso de recursos do sistema inteiro (nao apenas containers).
 * Usado para exibir cards de CPU, RAM e Disco no topo do dashboard.
 * 
 * CAMPOS:
 * - cpu_percent: Percentual de CPU do sistema (0-100)
 * - memory: Objeto com dados de memoria RAM
 *   - total_gb: Total de RAM em Gigabytes
 *   - used_gb: RAM usada em GB
 *   - percent: Percentual usado (0-100)
 * - disk: Objeto com dados de disco
 *   - total_gb: Espaco total em GB
 *   - used_gb: Espaco usado em GB
 *   - percent: Percentual usado (0-100)
 */
export type SystemMetrics = {
  cpu_percent: number;
  memory: {
    total_gb: number;
    used_gb: number;
    percent: number;
  };
  disk: {
    total_gb: number;
    used_gb: number;
    percent: number;
  };
};

/**
 * HealthStatus - Status de saude da API
 * 
 * Representa se a API backend esta funcionando e se consegue conectar
 * ao Docker. Usado para exibir indicador de conexao no header.
 * 
 * CAMPOS:
 * - status: Status textual (ex: "healthy")
 * - docker_connected: true se Docker esta acessivel
 * - timestamp: Data/hora da verificacao (ISO 8601)
 * - version: Versao da API (ex: "2.0.0")
 */
export type HealthStatus = {
  status: string;
  docker_connected: boolean;
  timestamp: string;
  version: string;
};

