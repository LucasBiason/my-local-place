/**
 * CONTAINER ICONS & COLORS - CLASSIFICACAO VISUAL
 * 
 * Este arquivo mapeia containers para icones e cores baseado no TIPO de aplicacao.
 * 
 * CLASSIFICACOES:
 * - Database (Azul): PostgreSQL, MongoDB
 * - Cache (Vermelho): Redis
 * - Queue (Laranja): RabbitMQ
 * - LLM (Roxo): Ollama, OpenWebUI
 * - AI/ML (Rosa): LangFlow
 * - DevTools (Amarelo): Jupyter
 * - Admin (Cinza): PgAdmin
 * - API (Verde): FastAPI containers
 * - Frontend (Cyan): React containers
 */

import { 
  Database,      // Postgres, MongoDB
  Box,           // Redis
  Rabbit,        // RabbitMQ  
  Brain,         // Ollama (LLM + OpenWebUI)
  Sparkles,      // Langflow
  BookOpen,      // Jupyter
  Settings,      // PgAdmin
  Zap,           // FastAPI (API)
  Layout         // React (Frontend)
} from 'lucide-react';

/**
 * Tipos de aplicacao
 */
export type ContainerType = 
  | 'database'
  | 'cache'
  | 'queue'
  | 'llm'
  | 'ai-tool'
  | 'devtool'
  | 'admin'
  | 'api'
  | 'frontend'
  | 'unknown';

/**
 * Mapeamento container -> tipo
 */
const containerTypeMap: Record<string, ContainerType> = {
  'local-postgres': 'database',
  'local-mongodb': 'database',
  'local-redis': 'cache',
  'local-rabbitmq': 'queue',
  'local-ollama': 'llm',
  'local-openwebui': 'llm',
  'local-langflow': 'ai-tool',
  'local-jupyter': 'devtool',
  'local-dbadmin': 'admin',
  'mylocalplace-api': 'api',
  'mylocalplace-frontend': 'frontend',
};

/**
 * Mapeamento tipo -> icone
 */
const typeIconMap: Record<ContainerType, any> = {
  database: Database,
  cache: Box,
  queue: Rabbit,
  llm: Brain,
  'ai-tool': Sparkles,
  devtool: BookOpen,
  admin: Settings,
  api: Zap,
  frontend: Layout,
  unknown: Box,
};

/**
 * Mapeamento tipo -> cor do icone
 */
const typeColorMap: Record<ContainerType, string> = {
  database: 'text-blue-400',      // Azul
  cache: 'text-red-400',          // Vermelho
  queue: 'text-orange-400',       // Laranja
  llm: 'text-purple-400',         // Roxo
  'ai-tool': 'text-pink-400',     // Rosa
  devtool: 'text-yellow-400',     // Amarelo
  admin: 'text-gray-400',         // Cinza
  api: 'text-green-400',          // Verde
  frontend: 'text-cyan-400',      // Cyan
  unknown: 'text-gray-500',
};

/**
 * Mapeamento tipo -> cor de fundo (para icone circular)
 */
const typeBgColorMap: Record<ContainerType, string> = {
  database: 'bg-blue-500/20',
  cache: 'bg-red-500/20',
  queue: 'bg-orange-500/20',
  llm: 'bg-purple-500/20',
  'ai-tool': 'bg-pink-500/20',
  devtool: 'bg-yellow-500/20',
  admin: 'bg-gray-500/20',
  api: 'bg-green-500/20',
  frontend: 'bg-cyan-500/20',
  unknown: 'bg-gray-500/20',
};

/**
 * Mapeamento tipo -> cor do "cantinho" (corner accent)
 * Estilo Spike Admin
 */
const typeCornerColorMap: Record<ContainerType, string> = {
  database: 'from-blue-500 to-blue-600',      // Gradiente azul
  cache: 'from-red-500 to-red-600',           // Gradiente vermelho
  queue: 'from-orange-500 to-orange-600',     // Gradiente laranja
  llm: 'from-purple-500 to-purple-600',       // Gradiente roxo
  'ai-tool': 'from-pink-500 to-pink-600',     // Gradiente rosa
  devtool: 'from-yellow-500 to-yellow-600',   // Gradiente amarelo
  admin: 'from-gray-500 to-gray-600',         // Gradiente cinza
  api: 'from-green-500 to-green-600',         // Gradiente verde
  frontend: 'from-cyan-500 to-cyan-600',      // Gradiente cyan
  unknown: 'from-gray-400 to-gray-500',
};

/**
 * Obtem tipo do container
 */
export const getContainerType = (name: string): ContainerType => {
  return containerTypeMap[name] || 'unknown';
};

/**
 * Obtem icone do container
 */
export const getContainerIcon = (name: string) => {
  const type = getContainerType(name);
  return typeIconMap[type];
};

/**
 * Obtem cor do icone
 */
export const getContainerIconColor = (name: string): string => {
  const type = getContainerType(name);
  return typeColorMap[type];
};

/**
 * Obtem cor de fundo para icone circular
 */
export const getContainerIconBg = (name: string): string => {
  const type = getContainerType(name);
  return typeBgColorMap[type];
};

/**
 * Obtem cor do "cantinho" (corner accent)
 * Estilo Spike Admin
 */
export const getContainerCornerColor = (name: string): string => {
  const type = getContainerType(name);
  return typeCornerColorMap[type];
};

/**
 * Obtem label do tipo (para tooltip/legenda)
 */
export const getContainerTypeLabel = (name: string): string => {
  const type = getContainerType(name);
  
  const labels: Record<ContainerType, string> = {
    database: 'Database',
    cache: 'Cache',
    queue: 'Message Queue',
    llm: 'LLM',
    'ai-tool': 'AI Tool',
    devtool: 'Dev Tool',
    admin: 'Admin Tool',
    api: 'API',
    frontend: 'Frontend',
    unknown: 'Unknown',
  };
  
  return labels[type];
};

