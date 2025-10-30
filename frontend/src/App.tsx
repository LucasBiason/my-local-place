/**
 * COMPONENTE PRINCIPAL: App
 * 
 * ============================================================================
 * O QUE EH UM COMPONENTE REACT?
 * ============================================================================
 * 
 * Componente eh uma FUNCAO que retorna JSX (HTML + JavaScript).
 * React pega esse JSX e renderiza na tela como HTML real.
 * 
 * COMPONENTE FUNCIONAL:
 * const MeuComponente = () => {
 *   return <div>Conteudo aqui</div>;
 * }
 * 
 * JSX:
 * Parece HTML, mas eh JavaScript. Permite:
 * - Inserir variaveis: <div>{minhaVariavel}</div>
 * - Fazer loops: {array.map(item => <div>{item}</div>)}
 * - Condicionais: {condicao && <div>Mostra se true</div>}
 * 
 * ============================================================================
 * O QUE ESTE COMPONENTE FAZ?
 * ============================================================================
 * 
 * App.tsx eh o componente RAIZ da aplicacao. Ele:
 * 1. Usa 4 custom hooks para buscar dados
 * 2. Renderiza estrutura principal (Header, Main, Modal)
 * 3. Passa dados para componentes filhos via "props"
 * 4. Gerencia modal de logs
 * 
 * ANTES DA REFATORACAO: 161 linhas com toda logica misturada
 * DEPOIS DA REFATORACAO: 66 linhas, logica nos hooks
 * 
 * BENEFICIO: Codigo limpo, facil de ler e manter
 * 
 * ============================================================================
 * FLUXO DE DADOS (DATA FLOW):
 * ============================================================================
 * 
 * 1. Hooks buscam dados da API
 *    useHealth() -> health
 *    useSystemMetrics() -> systemMetrics
 *    useContainers() -> containers, loading, actions
 *    useContainerFilter(containers) -> filtered
 * 
 * 2. App passa dados para componentes filhos
 *    <Header health={health} />
 *    <SystemMetrics metrics={systemMetrics} />
 *    <ContainerGrid containers={filtered} />
 * 
 * 3. Componentes filhos renderizam dados
 *    Header mostra status de conexao
 *    SystemMetrics mostra cards de CPU/RAM/Disco
 *    ContainerGrid mostra cards de containers
 * 
 * CONCEITO: Unidirecional (top-down)
 * Dados fluem de cima (App) para baixo (componentes filhos)
 */

import { useState } from 'react';
import { ContainerGrid } from './components/ContainerGrid';
import { Header } from './components/Header';
import { LogsModal } from './components/LogsModal';
import { SearchAndFilters } from './components/SearchAndFilters';
import { SystemMetrics } from './components/SystemMetrics';
import { useContainerFilter } from './hooks/useContainerFilter';
import { useContainers } from './hooks/useContainers';
import { useHealth } from './hooks/useHealth';
import { useSystemMetrics } from './hooks/useSystemMetrics';

/**
 * Componente principal da aplicacao
 * 
 * ESTRUTURA:
 * 1. Estados locais (selectedContainer para modal)
 * 2. Custom hooks (busca dados)
 * 3. JSX (renderizacao visual)
 * 
 * @returns JSX.Element - Estrutura visual da aplicacao
 */
const App = () => {
  /**
   * ESTADO LOCAL: selectedContainer
   * 
   * Controla qual container esta com modal de logs aberto.
   * - null: Modal fechado
   * - string: Nome do container com modal aberto
   * 
   * UTILIDADE: Quando usuario clica "View Logs", salvamos o nome aqui
   * e o modal usa esse nome para buscar logs.
   */
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null);

  /**
   * CUSTOM HOOKS - Gerenciam dados e logica
   * 
   * VANTAGEM: App.tsx nao precisa saber COMO buscar dados.
   * Apenas usa os hooks e recebe dados prontos.
   * 
   * Hook 1: useHealth() - Status da API
   * Hook 2: useSystemMetrics() - Metricas do sistema
   * Hook 3: useContainers() - Lista de containers + acoes
   * Hook 4: useContainerFilter() - Filtragem local
   */
  const health = useHealth();
  const systemMetrics = useSystemMetrics();
  const {
    containers,      // Array de todos containers
    loading,         // true se buscando API
    handleStart,     // Funcao para iniciar container
    handleStop,      // Funcao para parar container
    handleRestart,   // Funcao para reiniciar container
    refresh,         // Funcao para atualizar lista manualmente
  } = useContainers();

  /**
   * Hook de filtragem
   * 
   * IMPORTANTE: useContainerFilter DEPENDE de 'containers'.
   * Quando containers muda, filtered eh recalculado automaticamente.
   * 
   * RESULTADO: filtered sempre contem containers apos aplicar filtros.
   */
  const { filtered, searchTerm, setSearchTerm, filterStatus, setFilterStatus } =
    useContainerFilter(containers);

  /**
   * JSX - RENDERIZACAO VISUAL
   * 
   * ESTRUTURA:
   * - <div> raiz com classes Tailwind
   * - <Header> no topo
   * - <main> com conteudo principal
   * - <LogsModal> condicional (so aparece se selectedContainer)
   * 
   * CLASSES TAILWIND:
   * - min-h-screen: Altura minima da tela
   * - bg-gray-50: Fundo cinza claro
   * - dark:bg-gray-900: Fundo escuro em modo dark
   * - container mx-auto: Centraliza conteudo
   * - px-6 py-8: Padding horizontal/vertical
   */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 
        HEADER 
        
        Passa 'health' como prop para Header mostrar status de conexao.
        
        PROPS: Sao parametros que componente pai passa para filho.
        <Header health={health} /> significa:
        - Header recebe { health: valor_de_health }
      */}
      <Header health={health} />

      {/* 
        MAIN - Conteudo principal 
      */}
      <main className="container mx-auto px-6 py-8">
        {/* 
          SystemMetrics 
          
          Mostra cards de CPU, RAM, Disco no topo.
          Recebe 'metrics' via prop.
        */}
        <SystemMetrics metrics={systemMetrics} />

        {/* 
          SearchAndFilters 
          
          Input de busca + botoes de filtro.
          
          PROPS CALLBACK:
          - onSearchChange={setSearchTerm}: Passa funcao como prop
          - Quando usuario digita, SearchAndFilters chama setSearchTerm
          - setSearchTerm atualiza estado -> useEffect re-filtra -> UI atualiza
          
          FLUXO: Input -> onSearchChange -> setSearchTerm -> useEffect -> filtered
        */}
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          onRefresh={refresh}
          loading={loading}
        />

        {/* 
          ContainerGrid 
          
          Grid de cards, cada card eh um container.
          
          PROPS:
          - containers={filtered}: Lista FILTRADA de containers
          - loading: Mostra skeleton enquanto busca
          - onStart/onStop/onRestart: Callbacks para acoes
          - onViewLogs: Callback que abre modal
          
          CALLBACK onViewLogs:
          Quando usuario clica "View Logs", ContainerGrid chama:
          onViewLogs(containerName) -> setSelectedContainer(containerName)
          -> Modal abre
        */}
        <ContainerGrid
          containers={filtered}
          loading={loading}
          onStart={handleStart}
          onStop={handleStop}
          onRestart={handleRestart}
          onViewLogs={setSelectedContainer}
        />
      </main>

      {/* 
        LogsModal - Modal de logs (condicional)
        
        RENDERIZACAO CONDICIONAL:
        So renderiza se selectedContainer nao for null.
        
        Quando modal fecha, chama onClose -> setSelectedContainer(null)
        -> selectedContainer vira null -> modal desaparece
      */}
      <LogsModal
        containerName={selectedContainer}
        onClose={() => setSelectedContainer(null)}
      />
    </div>
  );
};

/**
 * EXPORT DEFAULT
 * 
 * Exporta componente como padrao (default).
 * Outros arquivos importam: import App from './App'
 * 
 * ALTERNATIVA: export { App } (named export)
 * Importaria: import { App } from './App'
 */
export default App;
