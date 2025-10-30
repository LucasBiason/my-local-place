# LLM Setup - Qwen2.5-Coder

## Recomendacao para CPU (sem GPU)

Para desenvolvimento local sem GPU, a melhor opcao e:

**Qwen2.5-Coder 3B** - Rapida, leve e excelente para codigo

## Instalacao

### 1. Iniciar Ollama

```bash
# Subir MyLocalPlace com Ollama
make up

# Verificar se Ollama esta rodando
docker ps | grep ollama
```

### 2. Baixar Qwen2.5-Coder 3B

```bash
# Versao 3B (RECOMENDADA para CPU)
docker exec local-ollama ollama pull qwen2.5-coder:3b

# Aguardar download (pode levar alguns minutos)
```

### 3. Verificar instalacao

```bash
# Listar modelos instalados
docker exec local-ollama ollama list

# Deve aparecer:
# qwen2.5-coder:3b
```

### 4. Testar modelo

```bash
# Teste rapido
docker exec -it local-ollama ollama run qwen2.5-coder:3b "Write a Python function to reverse a string"
```

### 5. Usar via OpenWebUI

1. Iniciar OpenWebUI via MyLocalPlace API ou manualmente:
   ```bash
   docker start local-openwebui
   ```

2. Acessar: http://localhost:3000

3. Selecionar modelo: `qwen2.5-coder:3b`

4. Comecar a desenvolver!

## Specs Qwen2.5-Coder 3B

- **Tamanho**: 3 bilhoes de parametros
- **RAM**: ~2.5GB
- **Velocidade**: 20-30 tokens/segundo (CPU)
- **Contexto**: 32k tokens
- **Linguagens**: 92 linguagens de programacao
- **Treinamento**: Codigo de alta qualidade

## Alternativas (caso queira mais poder)

### Opcao 2: Qwen2.5-Coder 7B (se CPU for boa)

```bash
docker exec local-ollama ollama pull qwen2.5-coder:7b
# RAM: ~5GB
# Melhor qualidade, mais lento
```

### Opcao 3: DeepSeek-Coder V2 16B (apenas se tiver CPU potente)

```bash
docker exec local-ollama ollama pull deepseek-coder-v2:16b
# RAM: ~10GB
# Maxima qualidade, BEM mais lento em CPU
```

## Minha Recomendacao Final

**Para CPU sem GPU**: **APENAS Qwen2.5-Coder 3B**

- Rapida o suficiente
- Qualidade excelente
- Usa pouca RAM
- Nao trava sua maquina

## Uso no Dia a Dia

```bash
# Via terminal
docker exec -it local-ollama ollama run qwen2.5-coder:3b

# Via API
curl http://localhost:11434/api/generate -d '{
  "model": "qwen2.5-coder:3b",
  "prompt": "Write a FastAPI endpoint"
}'

# Via OpenWebUI (RECOMENDADO)
# http://localhost:3000
```

## Performance Esperada

**Qwen2.5-Coder 3B em CPU:**
- Resposta curta: ~5-10 segundos
- Codigo medio: ~15-30 segundos
- Codigo complexo: ~30-60 segundos

**Aceitavel para desenvolvimento local!**

