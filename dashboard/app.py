"""
My Local Place Dashboard - Streamlit
Gerenciamento e observabilidade de serviços locais
"""

import streamlit as st
import docker
import psutil
from datetime import datetime
import time

st.set_page_config(
    page_title="My Local Place Dashboard",
    page_icon="🏠",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Inicializar Docker client
try:
    client = docker.from_env()
    docker_available = True
except Exception as e:
    st.error(f"Erro ao inicializar Docker client: {e}")
    docker_available = False
    st.error("Docker nao disponivel. Certifique-se que Docker esta rodando.")

# Header
st.title("My Local Place Dashboard")
st.markdown("**Gerenciamento de Servicos Locais de Desenvolvimento**")
st.divider()

# Sidebar
with st.sidebar:
    st.header("Controles")
    
    if st.button("Atualizar Status", use_container_width=True):
        st.rerun()
    
    st.divider()
    
    st.subheader("System Info")
    cpu_percent = psutil.cpu_percent(interval=1)
    mem = psutil.virtual_memory()
    disk = psutil.disk_usage('/')
    
    st.metric("CPU Usage", f"{cpu_percent}%")
    st.metric("Memory Usage", f"{mem.percent}%", f"{mem.used / (1024**3):.1f}GB / {mem.total / (1024**3):.1f}GB")
    st.metric("Disk Usage", f"{disk.percent}%", f"{disk.used / (1024**3):.1f}GB / {disk.total / (1024**3):.1f}GB")

# Main content
if docker_available:
    # Obter containers
    try:
        all_containers = client.containers.list(all=True)
        mylocalplace_containers = [c for c in all_containers if 'local-' in c.name or 'ollama' in c.name]
    except Exception as e:
        st.error(f"Erro ao listar containers: {e}")
        mylocalplace_containers = []
    
    # Estatísticas gerais
    col1, col2, col3, col4 = st.columns(4)
    
    running = len([c for c in mylocalplace_containers if c.status == 'running'])
    stopped = len([c for c in mylocalplace_containers if c.status != 'running'])
    
    with col1:
        st.metric("Total Services", len(mylocalplace_containers))
    with col2:
        st.metric("Running", running, delta=None, delta_color="normal")
    with col3:
        st.metric("Stopped", stopped, delta=None, delta_color="inverse")
    with col4:
        uptime = "N/A"
        if mylocalplace_containers:
            # Pegar uptime do primeiro container rodando
            running_containers = [c for c in mylocalplace_containers if c.status == 'running']
            if running_containers:
                container = running_containers[0]
                started = datetime.fromisoformat(container.attrs['State']['StartedAt'].replace('Z', '+00:00'))
                uptime_seconds = (datetime.now(started.tzinfo) - started).total_seconds()
                hours = int(uptime_seconds // 3600)
                minutes = int((uptime_seconds % 3600) // 60)
                uptime = f"{hours}h {minutes}m"
        st.metric("Uptime", uptime)
    
    st.divider()
    
    # Grid de serviços
    st.subheader("Services Status")
    
    # Definir serviços e suas portas
    services_info = {
        'local-postgres': {'name': 'PostgreSQL', 'port': '5432', 'icon': 'PG'},
        'local-dbadmin': {'name': 'PGAdmin', 'port': '8080', 'icon': 'ADM'},
        'local-redis': {'name': 'Redis', 'port': '6379', 'icon': 'RDS'},
        'local-mongodb': {'name': 'MongoDB', 'port': '27017', 'icon': 'MDB'},
        'local-langflow-db': {'name': 'LangFlow DB', 'port': '-', 'icon': 'DB'},
        'local-langflow': {'name': 'LangFlow', 'port': '7860', 'icon': 'LF'},
        'local-ollama': {'name': 'Ollama', 'port': '11434', 'icon': 'OLL'},
        'local-openwebui': {'name': 'OpenWebUI', 'port': '3000', 'icon': 'WUI'}
    }
    
    # Criar grid de 2 colunas
    cols = st.columns(2)
    
    for idx, (container_name, info) in enumerate(services_info.items()):
        col = cols[idx % 2]
        
        # Encontrar container
        container = next((c for c in mylocalplace_containers if c.name == container_name), None)
        
        with col:
            # Card do serviço
            if container:
                status = container.status
                status_color = "🟢" if status == "running" else "🔴"
                status_text = status.upper()
                
                # Expandable card
                with st.expander(f"{info['icon']} {info['name']} {status_color}", expanded=False):
                    st.write(f"**Status:** {status_text}")
                    st.write(f"**Port:** {info['port']}")
                    st.write(f"**Container:** `{container_name}`")
                    
                    # Botões de controle
                    col_btn1, col_btn2, col_btn3 = st.columns(3)
                    
                    with col_btn1:
                        if status == "running":
                            if st.button("🛑 Stop", key=f"stop_{container_name}", use_container_width=True):
                                try:
                                    container.stop()
                                    st.success(f"{info['name']} stopped!")
                                    time.sleep(1)
                                    st.rerun()
                                except Exception as e:
                                    st.error(f"Error: {e}")
                        else:
                            if st.button("▶️ Start", key=f"start_{container_name}", use_container_width=True):
                                try:
                                    container.start()
                                    st.success(f"{info['name']} started!")
                                    time.sleep(1)
                                    st.rerun()
                                except Exception as e:
                                    st.error(f"Error: {e}")
                    
                    with col_btn2:
                        if st.button("🔄 Restart", key=f"restart_{container_name}", use_container_width=True):
                            try:
                                container.restart()
                                st.success(f"{info['name']} restarted!")
                                time.sleep(1)
                                st.rerun()
                            except Exception as e:
                                st.error(f"Error: {e}")
                    
                    with col_btn3:
                        if st.button("📋 Logs", key=f"logs_{container_name}", use_container_width=True):
                            try:
                                logs = container.logs(tail=50).decode('utf-8')
                                st.text_area("Logs:", logs, height=200)
                            except Exception as e:
                                st.error(f"Error: {e}")
            else:
                with st.expander(f"{info['icon']} {info['name']} ⚪", expanded=False):
                    st.warning(f"Container `{container_name}` não encontrado")
    
    st.divider()
    
    # Quick Actions
    st.subheader("⚡ Quick Actions")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if st.button("🚀 Start All", use_container_width=True):
            for container in mylocalplace_containers:
                if container.status != "running":
                    try:
                        container.start()
                    except:
                        pass
            st.success("All services started!")
            time.sleep(2)
            st.rerun()
    
    with col2:
        if st.button("🛑 Stop All", use_container_width=True):
            for container in mylocalplace_containers:
                if container.status == "running":
                    try:
                        container.stop()
                    except:
                        pass
            st.success("All services stopped!")
            time.sleep(2)
            st.rerun()
    
    with col3:
        if st.button("🔄 Restart All", use_container_width=True):
            for container in mylocalplace_containers:
                try:
                    container.restart()
                except:
                    pass
            st.success("All services restarted!")
            time.sleep(2)
            st.rerun()

else:
    st.error("Docker não disponível. Inicie o Docker e recarregue a página.")

# Footer
st.divider()
st.caption(f"Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
