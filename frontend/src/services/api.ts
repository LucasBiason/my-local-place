/**
 * API client for MyLocalPlace backend.
 * 
 * Centralizes all HTTP requests to FastAPI backend using axios.
 * 
 * @module services/api
 */

import axios from 'axios';
import type { Container, ContainerLogs, ContainerStats, HealthStatus, SystemMetrics } from '../types';

/**
 * Base API URL from environment or default.
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8800';

/**
 * Configured axios instance with base URL and headers.
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Check API health status.
 * 
 * @returns API health information
 */
export const healthCheck = async (): Promise<HealthStatus> => {
  const { data } = await api.get('/health');
  return data;
};

/**
 * List all Docker containers.
 * 
 * @param all - Include stopped containers (default: true)
 * @returns Array of container information
 */
export const listContainers = async (all = true): Promise<Container[]> => {
  const { data } = await api.get('/api/v1/containers', { params: { all } });
  return data;
};

/**
 * Get specific container details.
 * 
 * @param name - Container name or ID
 * @returns Container information
 */
export const getContainer = async (name: string): Promise<Container> => {
  const { data } = await api.get(`/api/v1/containers/${name}`);
  return data;
};

/**
 * Start a stopped container.
 * 
 * @param name - Container name or ID
 */
export const startContainer = async (name: string): Promise<void> => {
  await api.post(`/api/v1/containers/${name}/start`);
};

/**
 * Stop a running container.
 * 
 * @param name - Container name or ID
 */
export const stopContainer = async (name: string): Promise<void> => {
  await api.post(`/api/v1/containers/${name}/stop`);
};

/**
 * Restart a container.
 * 
 * @param name - Container name or ID
 */
export const restartContainer = async (name: string): Promise<void> => {
  await api.post(`/api/v1/containers/${name}/restart`);
};

/**
 * Get container logs.
 * 
 * @param name - Container name or ID
 * @param tail - Number of lines to retrieve (default: 100)
 * @returns Container logs
 */
export const getContainerLogs = async (
  name: string,
  tail = 100
): Promise<ContainerLogs> => {
  const { data } = await api.get(`/api/v1/containers/${name}/logs`, {
    params: { tail },
  });
  return data;
};

/**
 * Get container resource usage statistics.
 * 
 * @param name - Container name or ID
 * @returns Resource usage metrics
 */
export const getContainerStats = async (
  name: string
): Promise<ContainerStats> => {
  const { data } = await api.get(`/api/v1/containers/${name}/stats`);
  return data;
};

/**
 * Get system resource metrics.
 * 
 * @returns System CPU, memory, and disk usage
 */
export const getSystemMetrics = async (): Promise<SystemMetrics> => {
  const { data } = await api.get('/api/v1/system/metrics');
  return data;
};

/**
 * Rebuild a container.
 * 
 * Rebuilds the container image and restarts it.
 * 
 * @param name - Container name or ID
 */
export const rebuildContainer = async (name: string): Promise<void> => {
  await api.post(`/api/v1/containers/${name}/rebuild`);
};
