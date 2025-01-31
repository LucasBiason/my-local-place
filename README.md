# My Local Place

## Descrição do Projeto

O My Local Place é um projeto que utiliza diversas ferramentas e serviços para gerenciar e analisar dados. O projeto é configurado para rodar em um ambiente Docker, facilitando a instalação e execução dos serviços necessários.

## Ferramentas Utilizadas

O projeto utiliza as seguintes ferramentas, configuradas nos arquivos Docker:

- **PostgreSQL + PGAdmin**
- **MongoDB**
- **Redis**
- **Ollama + openWebUI**
- **LangFlow**

## Instalação e Execução do Ambiente

### Pré-requisitos

- Docker
- Docker Compose

### Passos para Instalação

1. Clone o repositório do projeto:

   ```bash
   git clone git@github.com:LucasBiason/MyLocalPlace.git
   cd MyLocalPlace
   ```

2. Crie um arquivo .env na raiz do projeto com as seguintes variáveis de ambiente:

    ```
    ENV=dev

    PGADMIN_DEFAULT_EMAIL='seu-email-pgadmin'
    PGADMIN_DEFAULT_PASSWORD='sua-senha-para-pgadmin'
    PGADMIN_CONFIG_SERVER_MODE=False

    POSTGRES_USER='seu-usuario-parapostgres'
    POSTGRES_PASSWORD='sua-senha-para-postgres'

    REDIS_PASSWORD='sua-senha-para-redis'

    LANGFLOW_SUPERUSER='seu-user-para-langflow'
    LANGFLOW_SUPERUSER_PASSWORD='sua-senha-para-langflow'

    OPENAI_API_KEY='sua-chave-openai'

    WEBUI_AUTH='seu-usuario'
    WEBUI_NAME='um-nome-para-seu-painel'

    ME_CONFIG_USERNAME='seu-usuario-mongodb'
    ME_CONFIG_PASSWORD='sua-senha-mongodb'
    ```

3. Construa e inicie os serviços Docker:
    ```bash
    make runapp
    ```

### Acessando os Serviços

- **PgAdmin**: http://localhost:8080/browser/ (no primeiro acesso, realizar a adição da conexão com o postgres)
- **Painel openWebUI**: http://localhost:3000/ (no primeiro acesso, realizar o download dos modelos desejados no painel de configurações)
- **LangFlow**: http://127.0.0.1:7860
