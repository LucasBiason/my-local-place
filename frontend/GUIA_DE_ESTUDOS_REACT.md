# Guia de Estudos React - MyLocalPlace Frontend

**Data**: 30/10/2025  
**Projeto**: MyLocalPlace v2.0  
**Objetivo**: Aprender React estudando codigo real e bem documentado

---

## Ordem de Estudo Recomendada

### 1. Fundamentos TypeScript (30 min)

**Arquivo**: `src/types/index.ts`

**Conceitos**:
- O que sao tipos
- Type safety
- Union types (`string | null`)
- Objetos tipados

**Exercicio**:
- Leia cada tipo
- Tente criar um tipo novo (ex: `Alert`)
- Entenda por que tipos previnem bugs

---

### 2. Cliente HTTP e API (45 min)

**Arquivo**: `src/services/api.ts`

**Conceitos**:
- O que eh HTTP (GET, POST)
- axios e configuracao
- async/await
- Promises
- Destructuring (`const { data } = ...`)
- Template strings
- Query parameters

**Exercicio**:
- Leia cada funcao de API
- Tente adicionar nova funcao (ex: `pauseContainer`)
- Entenda diferenca GET vs POST

---

### 3. Hooks - useState (60 min)

**Arquivo**: `src/hooks/useHealth.ts` (mais simples)

**Conceitos**:
- O que sao hooks
- useState basico
- Estado vs variavel comum
- Re-renderizacao

**Exercicio**:
- Leia useHealth completo
- Entenda por que comeca com null
- Crie hook simples (ex: `useCounter`)

---

### 4. Hooks - useEffect (90 min)

**Arquivo**: `src/hooks/useContainers.ts` (mais completo)

**Conceitos**:
- useEffect e lifecycle
- Dependencias `[]`
- Cleanup (return)
- setInterval e clearInterval
- try/catch/finally

**Exercicio**:
- Leia useContainers linha por linha
- Entenda fluxo: mount -> fetch -> interval -> cleanup
- Tente mudar intervalo de 5s para 10s

---

### 5. Hooks Avancados (60 min)

**Arquivos**: 
- `src/hooks/useSystemMetrics.ts`
- `src/hooks/useContainerFilter.ts`

**Conceitos**:
- Hook que busca dados vs hook que transforma dados
- useEffect com multiplas dependencias
- Filtragem de arrays
- Array.filter(), includes(), toLowerCase()

**Exercicio**:
- Compare useHealth vs useSystemMetrics (quase identicos)
- Entenda useContainerFilter (nao busca API)
- Tente adicionar novo filtro (ex: por imagem Docker)

---

### 6. Componentes e Props (90 min)

**Arquivos**:
- `src/components/Header.tsx`
- `src/App.tsx`

**Conceitos**:
- O que eh componente
- Props e tipos de props
- Renderizacao condicional (`&&`, operador ternario)
- TailwindCSS classes
- Lucide Icons
- Composicao de componentes

**Exercicio**:
- Leia Header.tsx completo
- Entenda como App passa dados para Header
- Tente criar componente simples (ex: `Footer`)

---

### 7. Fluxo de Dados Completo (120 min)

**Arquivo**: `src/App.tsx`

**Conceitos**:
- Componente raiz
- Composicao de multiplos hooks
- Passar callbacks via props
- Fluxo unidirecional de dados
- Estado local vs estado de hooks

**Exercicio**:
- Trace fluxo completo: API -> Hook -> App -> Componente filho
- Entenda como clique em botao vira acao na API
- Desenhe diagrama do fluxo de dados

---

## Arquitetura Frontend - Resumo

```
src/
├── types/           -> Definicoes TypeScript (contratos de dados)
├── services/        -> Comunicacao HTTP com backend (axios)
├── hooks/           -> Logica reutilizavel (estado + efeitos)
├── components/      -> UI visual (JSX + TailwindCSS)
└── App.tsx          -> Componente raiz (orquestra tudo)
```

**Fluxo de dados**:
```
API Backend (FastAPI)
    ↓
services/api.ts (axios.get/post)
    ↓
hooks/useContainers.ts (useState + useEffect)
    ↓
App.tsx (usa hook)
    ↓
components/ContainerGrid.tsx (recebe props)
    ↓
Usuario ve na tela
```

---

## Conceitos Chave React

### 1. Componente
Funcao que retorna JSX. Building block da UI.

### 2. Props
Parametros passados de pai para filho. Imutaveis.

### 3. Estado (State)
Dados que ao mudar, re-renderizam componente. Criado com `useState`.

### 4. Efeitos (Effects)
Codigo que executa em momentos especificos (mount, update). Criado com `useEffect`.

### 5. Hooks
Funcoes que permitem usar recursos React (estado, efeitos, etc).

### 6. Custom Hooks
Hooks criados por nos para encapsular logica reutilizavel.

---

## Padroes Usados no Projeto

### 1. Custom Hooks para Logica
- `useContainers`: Busca containers
- `useHealth`: Busca health
- `useSystemMetrics`: Busca metricas
- `useContainerFilter`: Filtra dados localmente

**Beneficio**: Componentes ficam simples, apenas renderizam.

### 2. Props Callbacks
Passar funcoes como props para comunicacao filho -> pai.

**Exemplo**:
```tsx
// Pai
<Filho onChange={minhaFuncao} />

// Filho
onChange("novo valor")  // Chama funcao do pai
```

### 3. Renderizacao Condicional
Mostrar/ocultar elementos baseado em condicoes.

**Opcoes**:
```tsx
{condicao && <Componente />}           // Mostra se true
{condicao ? <A /> : <B />}             // Ternario
{valor || 'Padrao'}                    // Fallback
```

### 4. Componentes Controlados
React controla valor de inputs via estado.

**Exemplo**:
```tsx
const [text, setText] = useState('');
<input value={text} onChange={(e) => setText(e.target.value)} />
```

---

## Proximos Passos

Apos estudar arquivos documentados:

1. **Praticar**: Modificar componentes, adicionar features
2. **Criar**: Novo componente do zero
3. **Debugar**: Usar console.log para ver dados fluindo
4. **Explorar**: TailwindCSS docs, React docs, TypeScript docs

---

## Recursos

- **React Docs**: https://react.dev
- **TypeScript Docs**: https://typescriptlang.org
- **TailwindCSS Docs**: https://tailwindcss.com
- **Axios Docs**: https://axios-http.com

---

**Status**: Projeto completo e totalmente documentado  
**Nivel**: Iniciante em React (documentacao adaptada)  
**Tempo de estudo**: ~8-10 horas para entender tudo

