# Melhorias Sugeridas - MyLocalPlace v2.0

**Data**: 30/10/2025  
**Foco**: Baixo uso de memória + UX aprimorada

---

## 🎯 Suas Solicitações

1. ✅ **Percentual de uso de memória/disco por container**
2. ✅ **Gráficos no dashboard** (uso mínimo de memória)
3. ✅ **Ícones de logos** (Postgres, Redis, etc)

---

## 📊 MELHORIA 1: Métricas Individuais (Já Implementada!)

### Status Atual

**Você JÁ TEM** endpoint para stats de container individual:

```
GET /api/v1/containers/{name}/stats
```

**Retorna**:
```json
{
  "cpu_percent": 2.45,
  "memory_usage_mb": 156.8,
  "memory_limit_mb": 2048.0,
  "memory_percent": 7.66,  ← PERCENTUAL DE MEMÓRIA!
  "network_rx_mb": 12.34,
  "network_tx_mb": 6.78
}
```

### O Que Falta

**Backend**: ✅ NADA! Já retorna tudo  
**Frontend**: ❌ ContainerCard não mostra essas métricas

---

## 📈 MELHORIA 2: Gráficos Leves

### Opções (Ordenadas por Uso de Memória)

#### Opção 1: CSS Puro (0 KB extras) ⭐ RECOMENDADO

**Barra de progresso com TailwindCSS**:
```tsx
<div className="w-full bg-gray-200 rounded-full h-2">
  <div 
    className="bg-blue-600 h-2 rounded-full transition-all"
    style={{ width: `${memory_percent}%` }}
  />
</div>
```

**Vantagens**:
- ✅ Zero dependências
- ✅ Zero bytes extras
- ✅ Animado com CSS
- ✅ Responsivo

**Desvantagens**:
- ❌ Apenas barras (sem gráficos de linha)

---

#### Opção 2: Recharts (Leve) - ~50KB gzipped

**Biblioteca**: `recharts` (mais usada em React)

**Exemplo**:
```tsx
import { LineChart, Line, XAxis, YAxis } from 'recharts';

<LineChart width={300} height={100} data={historyData}>
  <Line type="monotone" dataKey="memory" stroke="#3b82f6" />
</LineChart>
```

**Vantagens**:
- ✅ Gráficos de linha/área/barra
- ✅ Leve (~50KB)
- ✅ Bem documentado
- ✅ Responsivo

**Desvantagens**:
- ❌ +50KB no bundle
- ❌ Precisa armazenar histórico (frontend)

---

#### Opção 3: Chart.js (Médio) - ~200KB gzipped

**Desvantagens**:
- ❌ Pesado (~200KB)
- ❌ NÃO recomendado para baixo uso de memória

---

### Recomendação Final

**HÍBRIDO** (melhor custo/benefício):

1. **Cards de container**: Barras CSS puras (0 KB)
2. **Sistema geral**: Mini gráfico Recharts (50 KB, 1x só)

**Exemplo**:

```tsx
// ContainerCard.tsx
<div className="mt-2">
  <div className="flex justify-between text-xs mb-1">
    <span>Memory</span>
    <span>{stats.memory_percent.toFixed(1)}%</span>
  </div>
  <div className="w-full bg-gray-200 rounded-full h-1.5">
    <div 
      className="bg-blue-600 h-1.5 rounded-full"
      style={{ width: `${stats.memory_percent}%` }}
    />
  </div>
  
  <div className="flex justify-between text-xs mb-1 mt-2">
    <span>CPU</span>
    <span>{stats.cpu_percent.toFixed(1)}%</span>
  </div>
  <div className="w-full bg-gray-200 rounded-full h-1.5">
    <div 
      className="bg-green-600 h-1.5 rounded-full"
      style={{ width: `${stats.cpu_percent}%` }}
    />
  </div>
</div>
```

**Custo**: 0 bytes extras!

---

## 🎨 MELHORIA 3: Ícones de Logos

### Status Atual

**Problema**: Todos containers têm ícone genérico (Box)

### Solução: Mapeamento Simples

**Criar arquivo** `src/utils/containerIcons.tsx`:

```tsx
import { 
  Database,      // Postgres, MongoDB
  Box,           // Redis
  Rabbit,        // RabbitMQ  
  Brain,         // Ollama
  FlaskConical,  // Langflow
  BookOpen,      // Jupyter
  Globe,         // OpenWebUI
  Settings       // PgAdmin
} from 'lucide-react';

export const getContainerIcon = (name: string) => {
  // Mapeia nome do container para ícone
  const iconMap: Record<string, any> = {
    'local-postgres': Database,
    'local-mongodb': Database,
    'local-redis': Box,
    'local-rabbitmq': Rabbit,
    'local-ollama': Brain,
    'local-langflow': FlaskConical,
    'local-jupyter': BookOpen,
    'local-openwebui': Globe,
    'local-dbadmin': Settings,
  };
  
  return iconMap[name] || Box;  // Fallback: Box
};

export const getContainerColor = (name: string) => {
  // Cores temáticas
  const colorMap: Record<string, string> = {
    'local-postgres': 'text-blue-500',
    'local-mongodb': 'text-green-500',
    'local-redis': 'text-red-500',
    'local-rabbitmq': 'text-orange-500',
    'local-ollama': 'text-purple-500',
    'local-langflow': 'text-pink-500',
    'local-jupyter': 'text-yellow-500',
    'local-openwebui': 'text-cyan-500',
    'local-dbadmin': 'text-gray-500',
  };
  
  return colorMap[name] || 'text-gray-400';
};
```

**Uso em ContainerCard**:
```tsx
import { getContainerIcon, getContainerColor } from '../utils/containerIcons';

const Icon = getContainerIcon(container.name);
const iconColor = getContainerColor(container.name);

<Icon className={`w-8 h-8 ${iconColor}`} />
```

**Vantagens**:
- ✅ Zero bytes extras (Lucide já instalado)
- ✅ Ícones temáticos
- ✅ Cores identificáveis
- ✅ Fácil de estender

**Limitação**:
- ⚠️ Não são logos EXATOS (Postgres, Redis, etc)
- ⚠️ São ícones REPRESENTATIVOS do Lucide

---

### Alternativa: Logos Reais (Pesado)

**Opção**: Usar `react-icons` com logos reais

```bash
npm install react-icons
```

```tsx
import { SiPostgresql, SiRedis, SiMongodb, SiRabbitmq } from 'react-icons/si';
```

**Custo**: +100KB no bundle  
**Recomendação**: ❌ NÃO vale a pena (muito peso para pouco benefício)

---

## 💾 MELHORIA 4: Disco por Container

### Problema

Docker SDK **NÃO retorna** uso de disco por container diretamente.

### Solução 1: Simples (Aproximação)

**Endpoint**: `GET /api/v1/containers/{name}/size`

**Backend**:
```python
def get_container_size(self, name: str) -> Dict[str, Any]:
    """Get approximate container disk usage."""
    container = self.client.containers.get(name)
    
    # Tamanho do container (layers + writable layer)
    size_rw = container.attrs.get('SizeRw', 0)  # Camada gravável
    size_root = container.attrs.get('SizeRootFs', 0)  # Total
    
    return {
        "writable_mb": round(size_rw / 1024 / 1024, 2),
        "total_mb": round(size_root / 1024 / 1024, 2),
    }
```

**Custo**: Rápido, não bloqueia

---

### Solução 2: Precisa (Volumes)

**Endpoint**: `GET /api/v1/volumes` (JÁ EXISTE!)

Mostra uso de disco dos **volumes** (dados persistentes).

---

## 🎨 IMPLEMENTAÇÃO SUGERIDA

### Versão 1: Minimalista (0 KB extras) ⭐⭐⭐

**O que fazer**:
1. Adicionar barras CSS no ContainerCard
2. Adicionar ícones Lucide temáticos
3. Mostrar percentuais de CPU/RAM

**Tempo**: ~30min  
**Impacto**: Grande melhoria visual  
**Custo**: 0 bytes

---

### Versão 2: Completa (50 KB extras) ⭐⭐

**O que fazer**:
1. Tudo da v1
2. Adicionar Recharts
3. Mini gráfico histórico (últimos 10 pontos)
4. Armazenar histórico no frontend (useState)

**Tempo**: ~90min  
**Impacto**: Muito melhor UX  
**Custo**: +50KB bundle

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### FASE 1: Métricas Visuais (30min)

- [ ] Criar `utils/containerIcons.tsx`
- [ ] Adicionar barras CSS em ContainerCard
- [ ] Mostrar CPU%, Memory%, Network
- [ ] Adicionar ícones temáticos
- [ ] Testar visualmente
- [ ] Commit: `feat: add container metrics visualization`

### FASE 2: Gráficos (Opcional - 90min)

- [ ] `npm install recharts`
- [ ] Criar hook `useContainerHistory(name)`
- [ ] Armazenar últimos 10 pontos
- [ ] Adicionar LineChart em modal/card expandido
- [ ] Limitar histórico (10 pontos = ~1min de dados)
- [ ] Commit: `feat: add historical metrics charts`

### FASE 3: Disco (Opcional - 45min)

- [ ] Adicionar `get_container_size()` no repository
- [ ] Endpoint `/containers/{name}/size`
- [ ] Mostrar em ContainerCard
- [ ] Commit: `feat: add container disk usage`

---

## 🚀 RECOMENDAÇÃO FINAL

**FAÇA AGORA** (enquanto lê documentação):

### FASE 1 APENAS (30min)

Adicione **barras CSS + ícones** - **Zero custo de memória**, grande impacto visual!

**Por quê?**:
- ✅ Rápido (30min)
- ✅ Zero dependências
- ✅ Melhoria imediata
- ✅ Aprende mais sobre componentes React
- ✅ Prática enquanto estuda

**FASE 2 e 3**: Deixe para depois (opcional)

---

## 💡 SUGESTÃO ENQUANTO ESTUDA

**Ordem recomendada**:

1. **LER Guia React** (1h) 📖
   - `frontend/GUIA_DE_ESTUDOS_REACT.md`
   - Entender hooks, componentes, props

2. **IMPLEMENTAR Barras CSS** (30min) 💻
   - Criar `utils/containerIcons.tsx`
   - Modificar `ContainerCard.tsx`
   - **PRATICAR** o que acabou de ler!

3. **CONTINUAR Leitura** (1h) 📖
   - Estudar arquivos documentados
   - Fazer exercícios do guia

4. **TESTAR Comandos Customizados** (30min) ⚙️
   - Copiar `.cursorrules`
   - Testar `/checkup`

5. **REVISAR Projeto Completo** (30min) ✅
   - Ver tudo funcionando
   - Tirar screenshots
   - Validar qualidade

**TOTAL**: 3.5h (tarde produtiva!)

---

## 🎨 PREVIEW DO RESULTADO

**ContainerCard COM melhorias**:

```
┌─────────────────────────────────────┐
│ [🗄️] local-postgres      [Running] │
│                                     │
│ postgres:17                         │
│ 5432:5432/tcp                       │
│                                     │
│ Memory          156.8 MB    7.7%    │
│ ████░░░░░░░░░░░░░░░░░░░░            │
│                                     │
│ CPU                        2.5%     │
│ ██░░░░░░░░░░░░░░░░░░░░░░            │
│                                     │
│ Network   ↓ 12.3 MB  ↑ 6.8 MB      │
│                                     │
│ [Start] [Stop] [Restart] [Logs]    │
└─────────────────────────────────────┘
```

**IMPACTO**: Muito mais informativo!  
**CUSTO**: 0 KB extras!

---

## 🔧 IMPLEMENTAÇÃO IMEDIATA

Quer que eu implemente **FASE 1** (barras + ícones) agora?

**Vou fazer**:
1. Criar `utils/containerIcons.tsx` (mapeamento)
2. Modificar `ContainerCard.tsx` (adicionar barras)
3. Buscar stats individuais (já tem endpoint)
4. Commit limpo

**Tempo**: 30 minutos  
**Você**: Continua lendo documentação

**AUTORIZA?** 🚀

