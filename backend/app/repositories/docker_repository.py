"""Docker repository - Data access layer for Docker Engine.

Similar to how ORMs interact with databases, this repository
interacts with Docker Engine via Docker SDK.
"""

from typing import Dict, List, Any
from docker.errors import NotFound, APIError

from app.core import docker_client


class DockerRepository:
    """Repository for Docker operations (similar to DB repositories/ORMs)."""
    
    def __init__(self):
        """Initialize with docker client."""
        self.client = docker_client.client
    
    def list_containers(self, all: bool = True) -> List[Dict[str, Any]]:
        """List all containers."""
        containers = self.client.containers.list(all=all)
        
        return [
            {
                "id": c.short_id,
                "name": c.name,
                "status": c.status,
                "state": c.attrs['State']['Status'],
                "image": c.image.tags[0] if c.image.tags else c.image.short_id,
                "ports": self._format_ports(c.ports),
                "created": c.attrs['Created'],
                "running": c.status == 'running'
            }
            for c in containers
        ]
    
    def get_container(self, name: str) -> Dict[str, Any]:
        """Get container details."""
        try:
            container = self.client.containers.get(name)
            
            return {
                "id": container.short_id,
                "name": container.name,
                "status": container.status,
                "state": container.attrs['State'],
                "image": container.image.tags[0] if container.image.tags else "unknown",
                "ports": self._format_ports(container.ports),
                "created": container.attrs['Created'],
                "labels": container.labels,
                "running": container.status == 'running'
            }
        except NotFound:
            raise ValueError(f"Container {name} not found")
    
    def start_container(self, name: str) -> Dict[str, str]:
        """Start a container."""
        try:
            container = self.client.containers.get(name)
            container.start()
            return {"status": "success", "message": f"Container {name} started"}
        except NotFound:
            raise ValueError(f"Container {name} not found")
        except APIError as e:
            raise RuntimeError(f"Failed to start container: {e}")
    
    def stop_container(self, name: str, timeout: int = 10) -> Dict[str, str]:
        """Stop a container."""
        try:
            container = self.client.containers.get(name)
            container.stop(timeout=timeout)
            return {"status": "success", "message": f"Container {name} stopped"}
        except NotFound:
            raise ValueError(f"Container {name} not found")
        except APIError as e:
            raise RuntimeError(f"Failed to stop container: {e}")
    
    def restart_container(self, name: str, timeout: int = 10) -> Dict[str, str]:
        """Restart a container."""
        try:
            container = self.client.containers.get(name)
            container.restart(timeout=timeout)
            return {"status": "success", "message": f"Container {name} restarted"}
        except NotFound:
            raise ValueError(f"Container {name} not found")
        except APIError as e:
            raise RuntimeError(f"Failed to restart container: {e}")
    
    def get_logs(self, name: str, tail: int = 100) -> List[str]:
        """Get container logs."""
        try:
            container = self.client.containers.get(name)
            logs = container.logs(
                tail=tail,
                timestamps=True,
                stream=False
            ).decode('utf-8', errors='ignore')
            
            return [line for line in logs.split('\n') if line.strip()]
        except NotFound:
            raise ValueError(f"Container {name} not found")
    
    def get_stats(self, name: str) -> Dict[str, Any]:
        """Get container resource stats."""
        try:
            container = self.client.containers.get(name)
            stats = container.stats(stream=False)
            
            # CPU percentage
            cpu_delta = stats['cpu_stats']['cpu_usage']['total_usage'] - \
                       stats['precpu_stats']['cpu_usage']['total_usage']
            system_delta = stats['cpu_stats']['system_cpu_usage'] - \
                          stats['precpu_stats']['system_cpu_usage']
            cpu_percent = (cpu_delta / system_delta) * 100.0 if system_delta > 0 else 0.0
            
            # Memory
            mem_usage = stats['memory_stats'].get('usage', 0)
            mem_limit = stats['memory_stats'].get('limit', 1)
            mem_percent = (mem_usage / mem_limit) * 100.0
            
            # Network
            networks = stats.get('networks', {})
            rx_bytes = sum(n.get('rx_bytes', 0) for n in networks.values())
            tx_bytes = sum(n.get('tx_bytes', 0) for n in networks.values())
            
            return {
                "cpu_percent": round(cpu_percent, 2),
                "memory_usage_mb": round(mem_usage / 1024 / 1024, 2),
                "memory_limit_mb": round(mem_limit / 1024 / 1024, 2),
                "memory_percent": round(mem_percent, 2),
                "network_rx_mb": round(rx_bytes / 1024 / 1024, 2),
                "network_tx_mb": round(tx_bytes / 1024 / 1024, 2)
            }
        except NotFound:
            raise ValueError(f"Container {name} not found")
    
    @staticmethod
    def _format_ports(ports: Dict) -> List[str]:
        """Format port mappings."""
        if not ports:
            return []
        
        formatted = []
        for container_port, host_bindings in ports.items():
            if host_bindings:
                for binding in host_bindings:
                    host_port = binding.get('HostPort', '')
                    if host_port:
                        formatted.append(f"{host_port}:{container_port}")
        
        return formatted

