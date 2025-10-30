# Autostart MyLocalPlace com Systemd

**Guia para configurar inicialização automática do MyLocalPlace no boot do sistema Linux.**

---

## Pré-requisitos

- Sistema Linux com `systemd`
- Docker e Docker Compose instalados
- MyLocalPlace clonado em: `/home/lucas-biason/Projetos/Estudos/Projetos de Portifolio/my-local-place`

---

## 1. Criar Service File

Crie o arquivo de serviço do systemd:

```bash
sudo nano /etc/systemd/system/mylocalplace.service
```

**Conteúdo**:

```ini
[Unit]
Description=MyLocalPlace Docker Dashboard
After=docker.service
Requires=docker.service

[Service]
Type=simple
User=lucas-biason
WorkingDirectory=/home/lucas-biason/Projetos/Estudos/Projetos de Portifolio/my-local-place
ExecStartPre=/usr/bin/docker compose down
ExecStart=/usr/bin/docker compose --profile frontend up
ExecStop=/usr/bin/docker compose --profile frontend down
Restart=on-failure
RestartSec=10s
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

### Detalhes importantes:

- **User**: Substitua `lucas-biason` pelo seu usuário Linux
- **WorkingDirectory**: Caminho completo do projeto
- **ExecStart**: Sobe API + Frontend
- **Restart=on-failure**: Reinicia automaticamente em caso de falha
- **After=docker.service**: Garante que o Docker está rodando antes

---

## 2. Habilitar o Serviço

### Recarregar configuração do systemd:

```bash
sudo systemctl daemon-reload
```

### Habilitar autostart:

```bash
sudo systemctl enable mylocalplace.service
```

### Iniciar o serviço agora:

```bash
sudo systemctl start mylocalplace.service
```

---

## 3. Verificar Status

### Ver status do serviço:

```bash
sudo systemctl status mylocalplace.service
```

**Saída esperada**:

```
● mylocalplace.service - MyLocalPlace Docker Dashboard
     Loaded: loaded (/etc/systemd/system/mylocalplace.service; enabled)
     Active: active (running) since ...
```

### Ver logs em tempo real:

```bash
sudo journalctl -u mylocalplace.service -f
```

### Ver logs das últimas 100 linhas:

```bash
sudo journalctl -u mylocalplace.service -n 100
```

---

## 4. Comandos Úteis

### Iniciar:

```bash
sudo systemctl start mylocalplace.service
```

### Parar:

```bash
sudo systemctl stop mylocalplace.service
```

### Reiniciar:

```bash
sudo systemctl restart mylocalplace.service
```

### Desabilitar autostart:

```bash
sudo systemctl disable mylocalplace.service
```

### Ver se está habilitado:

```bash
sudo systemctl is-enabled mylocalplace.service
```

---

## 5. Testar Autostart

### Teste 1: Parar e iniciar manualmente

```bash
sudo systemctl stop mylocalplace.service
sudo systemctl start mylocalplace.service
sudo systemctl status mylocalplace.service
```

### Teste 2: Reiniciar o sistema

```bash
sudo reboot
```

Após reboot, verifique:

```bash
sudo systemctl status mylocalplace.service
docker ps | grep mylocalplace
```

**Containers esperados**:
- `mylocalplace-api`
- `mylocalplace-frontend`

**Acessos**:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Docs: http://localhost:8000/docs

---

## 6. Ordem de Inicialização

Com essa configuração, a ordem de boot será:

```
1. Sistema Linux inicia
2. Docker daemon inicia (docker.service)
3. MyLocalPlace inicia (mylocalplace.service)
   ├── mylocalplace-api (Port 8000)
   └── mylocalplace-frontend (Port 3000)
4. Serviços criados (mas NÃO iniciados automaticamente):
   ├── local-postgres
   ├── local-redis
   ├── local-mongodb
   ├── local-rabbitmq
   ├── local-ollama
   ├── local-openwebui
   ├── local-langflow
   ├── local-jupyter
   └── local-dbadmin
```

**Os serviços podem ser iniciados via dashboard ou comando**:

```bash
docker start local-postgres local-redis
```

---

## 7. Troubleshooting

### Serviço não inicia:

```bash
# Ver logs detalhados
sudo journalctl -u mylocalplace.service -xe

# Verificar permissões
ls -la /var/run/docker.sock

# Adicionar usuário ao grupo Docker (se necessário)
sudo usermod -aG docker lucas-biason
newgrp docker
```

### Portas já em uso:

Verifique se há outros serviços usando as portas 3000 ou 8000:

```bash
sudo ss -tlnp | grep -E ':(3000|8000)'
```

### Docker não está rodando:

```bash
sudo systemctl status docker.service
sudo systemctl start docker.service
```

---

## 8. Logs e Monitoramento

### Ver últimos 50 logs:

```bash
sudo journalctl -u mylocalplace.service -n 50
```

### Ver logs desde último boot:

```bash
sudo journalctl -u mylocalplace.service -b
```

### Ver logs de um período específico:

```bash
sudo journalctl -u mylocalplace.service --since "2025-10-30 08:00:00"
```

### Monitorar em tempo real:

```bash
sudo journalctl -u mylocalplace.service -f --output=cat
```

---

## 9. Desabilitar Autostart (se necessário)

```bash
# Parar serviço
sudo systemctl stop mylocalplace.service

# Desabilitar autostart
sudo systemctl disable mylocalplace.service

# Remover arquivo (opcional)
sudo rm /etc/systemd/system/mylocalplace.service

# Recarregar systemd
sudo systemctl daemon-reload
```

---

## 10. Variante: Iniciar Apenas API

Se quiser iniciar **apenas a API** no boot:

**Altere a linha `ExecStart` em `/etc/systemd/system/mylocalplace.service`**:

```ini
ExecStart=/usr/bin/docker compose up api
ExecStop=/usr/bin/docker compose down
```

Depois:

```bash
sudo systemctl daemon-reload
sudo systemctl restart mylocalplace.service
```

---

## 11. Variante: Iniciar API + Serviços Essenciais

Se quiser iniciar **API + Postgres + Redis** automaticamente:

**Altere a linha `ExecStart`**:

```ini
ExecStart=/usr/bin/docker compose up api local-postgres local-redis
```

Depois:

```bash
sudo systemctl daemon-reload
sudo systemctl restart mylocalplace.service
```

---

## Resumo dos Comandos

```bash
# 1. Criar service file
sudo nano /etc/systemd/system/mylocalplace.service

# 2. Habilitar autostart
sudo systemctl daemon-reload
sudo systemctl enable mylocalplace.service
sudo systemctl start mylocalplace.service

# 3. Verificar
sudo systemctl status mylocalplace.service
docker ps

# 4. Acessar
# Frontend: http://localhost:3000
# API: http://localhost:8000
```

---

**Pronto! MyLocalPlace agora inicia automaticamente no boot do sistema!** 🚀

