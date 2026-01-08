# Ollama Service

This service provides a local LLM runtime for running large language models without external API calls.

## When to Use

- **Local LLM development** — Run LLMs locally for development and testing
- **Privacy-sensitive applications** — Process data without sending to external APIs
- **Cost-effective experimentation** — Experiment with LLMs without API costs
- **Offline development** — Work with LLMs without internet connection

## Usage

```bash
# Start Ollama only
docker compose up local-ollama

# Start with other services (e.g., backend API)
docker compose up local-ollama local-postgres local-redis
```

## Connection Details

- **Host:** `localhost`
- **Port:** `11434` (default Ollama port)
- **API:** `http://localhost:11434`

## Available Models

The service comes with **Qwen2.5-Coder 3B** pre-installed, a code-focused LLM optimized for programming tasks.

### Installing Additional Models

```bash
# Install a model via API
curl http://localhost:11434/api/pull -d '{"name": "llama2"}'

# Or via Ollama CLI (if installed locally)
ollama pull llama2
```

### Common Models

- **Qwen2.5-Coder 3B** — Code-focused model (pre-installed)
- **Llama2** — General-purpose LLM
- **Mistral** — Fast and efficient model
- **CodeLlama** — Specialized for code generation

## Using Ollama

### Python

```python
import requests

response = requests.post(
    'http://localhost:11434/api/generate',
    json={
        'model': 'qwen2.5-coder:3b',
        'prompt': 'Write a Python function to calculate fibonacci',
        'stream': False
    }
)
print(response.json()['response'])
```

### Node.js

```javascript
const axios = require('axios');

const response = await axios.post('http://localhost:11434/api/generate', {
  model: 'qwen2.5-coder:3b',
  prompt: 'Write a Python function to calculate fibonacci',
  stream: false
});

console.log(response.data.response);
```

### Command Line

```bash
# Generate text
curl http://localhost:11434/api/generate -d '{
  "model": "qwen2.5-coder:3b",
  "prompt": "Write a Python function to calculate fibonacci",
  "stream": false
}'

# Chat interface (if Ollama CLI is installed)
ollama run qwen2.5-coder:3b
```

## Resource Usage

**Important:** LLMs consume significant resources:
- **CPU:** Moderate to high
- **RAM:** 4GB+ depending on model size
- **Disk:** 2GB+ per model

Monitor resource usage via the dashboard or:
```bash
docker stats local-ollama
```

## Configuration

Ollama runs with default settings optimized for development. To customize:

1. Edit `services/ollama.yml`
2. Add environment variables or volume mounts
3. Restart the service

## Health Check

Check if Ollama is running:

```bash
curl http://localhost:11434/api/tags
# Should return list of installed models
```

## Notes

- **Model downloads** — First use of a model will download it automatically (can take time)
- **Resource intensive** — LLMs require significant RAM and CPU
- **Local processing** — All processing happens locally, no external API calls
- **Model persistence** — Models are stored in Docker volumes and persist across restarts

## Troubleshooting

### Out of Memory

If Ollama runs out of memory, try:
- Using a smaller model
- Reducing context window
- Increasing Docker memory limits

### Model Not Found

If a model is not found:
```bash
# List available models
curl http://localhost:11434/api/tags

# Pull a specific model
curl http://localhost:11434/api/pull -d '{"name": "model-name"}'
```

---

**This service is optimized for local development. For production, consider managed LLM services or GPU-optimized infrastructure.**

