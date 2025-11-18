# MyLocalPlace Frontend

Dashboard React para gerenciar containers Docker.

## Estrutura do Projeto

```
src/
├── App.tsx              ← Componente principal (62 linhas)
├── main.tsx             ← Entry point
├── index.css            ← Estilos globais + Tailwind
│
├── hooks/               ← Logica de negocio (Custom Hooks)
│   ├── useContainers.ts     - Gerencia containers e acoes
│   ├── useHealth.ts         - Health check da API
│   ├── useSystemMetrics.ts  - Metricas CPU/RAM/Disk
│   └── useContainerFilter.ts- Busca e filtros
│
├── components/          ← Componentes de UI
│   ├── Header.tsx           - Cabecalho + status API
│   ├── SystemMetrics.tsx    - Cards CPU/RAM/Disk
│   ├── SearchAndFilters.tsx - Busca + filtros + refresh
│   ├── ContainerGrid.tsx    - Grid de containers
│   ├── ContainerCard.tsx    - Card individual
│   └── LogsModal.tsx        - Modal de logs
│
├── services/            ← Chamadas API
│   └── api.ts              - Axios + endpoints
│
└── types/               ← TypeScript types
    └── index.ts            - Tipos Container, Stats, etc
```

## Como Funciona

### 1. App.tsx (Super Simples!)

```tsx
// App.tsx apenas:
// 1. Importa hooks
// 2. Importa componentes  
// 3. Renderiza UI

const App = () => {
  // Hooks gerenciam TODO o estado
  const health = useHealth();
  const metrics = useSystemMetrics();
  const { containers, handleStart, ... } = useContainers();
  
  // Renderiza componentes
  return (
    <div>
      <Header health={health} />
      <SystemMetrics metrics={metrics} />
      <ContainerGrid containers={containers} />
    </div>
  );
};
```

### 2. Custom Hooks (Lógica)

**useContainers**:
- Busca containers da API
- Atualiza a cada 5 segundos
- Fornece funções: `handleStart`, `handleStop`, `handleRestart`

**useHealth**:
- Verifica status da API
- Atualiza a cada 10 segundos

**useSystemMetrics**:
- Busca CPU/RAM/Disk
- Atualiza a cada 5 segundos

**useContainerFilter**:
- Filtra por status (all/running/stopped)
- Filtra por nome (busca)

### 3. Componentes (UI Pura)

Cada componente recebe **props** e renderiza UI:

```tsx
<Header health={health} />
<SystemMetrics metrics={metrics} />
<ContainerCard container={data} onStart={fn} />
```

### 4. Services (API)

Todas as chamadas HTTP em `api.ts`:

```tsx
import { listContainers, startContainer } from './services/api';

// Uso:
const containers = await listContainers();
await startContainer('postgres');
```

## Comandos

```bash
npm run dev      # Desenvolvimento (port 3000)
npm run build    # Build para producao
npm run preview  # Preview do build
```

## Tecnologias

- React 18
- TypeScript
- Vite
- TailwindCSS
- Axios
- Lucide React (icons)

## Variaveis de Ambiente

Crie `.env`:

```env
VITE_API_URL=http://localhost:8800
```

