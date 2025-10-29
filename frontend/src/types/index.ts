export type Container = {
  id: string;
  name: string;
  status: string;
  state: string | Record<string, any>;
  image: string;
  ports: string[];
  created: string;
  running: boolean;
};

export type ContainerStats = {
  cpu_percent: number;
  memory_usage_mb: number;
  memory_limit_mb: number;
  memory_percent: number;
  network_rx_mb: number;
  network_tx_mb: number;
};

export type ContainerLogs = {
  container: string;
  lines: string[];
  tail: number;
};

export type SystemMetrics = {
  cpu_percent: number;
  memory: {
    total_gb: number;
    used_gb: number;
    percent: number;
  };
  disk: {
    total_gb: number;
    used_gb: number;
    percent: number;
  };
};

export type HealthStatus = {
  status: string;
  docker_connected: boolean;
  timestamp: string;
  version: string;
};

