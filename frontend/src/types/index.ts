/**
 * TypeScript type definitions for Docker container management.
 * 
 * @module types
 */

/**
 * Docker container information.
 */
export type Container = {
  /** Container short ID */
  id: string;
  /** Container name */
  name: string;
  /** Current status (e.g., 'running', 'exited') */
  status: string;
  /** Detailed state information */
  state: string | Record<string, any>;
  /** Docker image name or ID */
  image: string;
  /** Port mappings (e.g., ['5432:5432/tcp']) */
  ports: string[];
  /** ISO 8601 creation timestamp */
  created: string;
  /** True if container is currently running */
  running: boolean;
};

/**
 * Container with optional statistics.
 */
export type ContainerWithStats = Container & {
  /** Optional resource usage statistics */
  stats?: ContainerStats | null;
};

/**
 * Container resource usage statistics.
 */
export type ContainerStats = {
  /** CPU usage percentage (0-100+) */
  cpu_percent: number;
  /** Memory usage in megabytes */
  memory_usage_mb: number;
  /** Memory limit in megabytes */
  memory_limit_mb: number;
  /** Memory usage percentage */
  memory_percent: number;
  /** Network received in megabytes */
  network_rx_mb: number;
  /** Network transmitted in megabytes */
  network_tx_mb: number;
};

/**
 * Container log output.
 */
export type ContainerLogs = {
  /** Container name or ID */
  container: string;
  /** Log lines with timestamps */
  lines: string[];
  /** Number of lines returned */
  tail: number;
};

/**
 * System resource metrics.
 */
export type SystemMetrics = {
  /** System CPU usage percentage */
  cpu_percent: number;
  /** Memory statistics */
  memory: {
    /** Total RAM in gigabytes */
    total_gb: number;
    /** Used RAM in gigabytes */
    used_gb: number;
    /** Usage percentage */
    percent: number;
  };
  /** Disk statistics */
  disk: {
    /** Total disk space in gigabytes */
    total_gb: number;
    /** Used disk space in gigabytes */
    used_gb: number;
    /** Usage percentage */
    percent: number;
  };
};

/**
 * API health status.
 */
export type HealthStatus = {
  /** Health status message */
  status: string;
  /** True if Docker daemon is accessible */
  docker_connected: boolean;
  /** ISO 8601 timestamp of health check */
  timestamp: string;
  /** API version */
  version: string;
};
