# BentoPDF - Ferramenta de Manipulação de PDFs

## 📋 Resumo

O **BentoPDF** é uma ferramenta open-source para manipulação de arquivos PDF, com foco em **privacidade** e **processamento local**. Todas as operações são realizadas diretamente no navegador, sem necessidade de uploads para servidores externos.

## ✨ Principais Características

### 🔒 Privacidade e Segurança
- **Processamento 100% local**: Todos os arquivos são processados no navegador
- **Sem uploads**: Seus documentos nunca saem do seu dispositivo
- **Sem cadastro**: Utilize imediatamente, sem criar contas ou fornecer e-mails
- **Sem rastreamento**: Não coleta dados pessoais

### 🆓 Gratuito e Sem Limitações
- **Acesso ilimitado**: Sem custos ou restrições ocultas
- **Sem limites de tamanho**: Processe PDFs de qualquer tamanho
- **Todas as funcionalidades**: Acesso completo a todas as ferramentas

### 🛠️ Funcionalidades Principais

1. **Mesclar PDFs**: Combine múltiplos PDFs em um único arquivo
2. **Dividir PDFs**: Separe um PDF em múltiplos arquivos
3. **Comprimir PDFs**: Reduza o tamanho dos arquivos
4. **Editar PDFs**: Adicione texto, imagens, formas
5. **Converter**: Converta PDFs para outros formatos
6. **Assinar**: Adicione assinaturas digitais
7. **Organizar Páginas**: Reordene, rotacione, exclua páginas
8. **Proteger**: Adicione senhas e permissões
9. **Extrair**: Extraia texto, imagens ou páginas específicas
10. **Anotar**: Adicione comentários e anotações

### 🌐 Compatibilidade
- **Multiplataforma**: Windows, macOS, Linux, iOS, Android
- **Navegadores modernos**: Chrome, Firefox, Safari, Edge
- **Sem instalação**: Funciona diretamente no navegador

### 📜 Licenciamento
- **Open Source**: GNU Affero General Public License v3.0 (AGPL-3.0)
- **Uso livre**: Para projetos open-source
- **Licença comercial**: Disponível para uso em aplicações proprietárias

## 🐳 Integração no My Local Place

### Configuração

O BentoPDF está configurado como um serviço no `docker-compose.yml`:

```yaml
local-bentopdf:
  extends:
    file: services/bentopdf.yml
    service: bentopdf
  networks:
    - local-services-network
  profiles: ["services"]
```

### Variáveis de Ambiente

Adicione ao seu `.env`:

```bash
# BentoPDF
BENTOPDF_PORT=8080
BENTOPDF_SIMPLE_MODE=false  # true para interface simplificada
```

### Acesso

Após iniciar o serviço:

```bash
docker-compose --profile services up -d local-bentopdf
```

Acesse em: `http://localhost:8080`

### Modo Simples

Para uma interface mais limpa e focada apenas nas ferramentas essenciais:

```bash
BENTOPDF_SIMPLE_MODE=true
```

## 📚 Recursos Adicionais

- **GitHub**: https://github.com/alam00000/bentopdf
- **Website**: https://bentopdf.com
- **Docker Hub**: https://hub.docker.com/r/bentopdf/bentopdf

## 🎯 Casos de Uso

1. **Estudos**: Organizar apostilas e materiais de cursos
2. **Trabalho**: Mesclar relatórios, comprimir documentos
3. **Pessoal**: Editar e assinar documentos importantes
4. **Desenvolvimento**: Processar PDFs em projetos

## ⚠️ Observações

- O BentoPDF processa tudo localmente no navegador
- Não há backend que processa os PDFs
- Ideal para uso pessoal e privacidade
- Para processamento em servidor, considere outras soluções

## 🔗 Integração com Outros Serviços

O BentoPDF pode ser integrado com:
- **N8N**: Automatizar tarefas de manipulação de PDFs
- **API**: Via webhooks (se implementado)
- **Frontend**: Embed em dashboards personalizados



