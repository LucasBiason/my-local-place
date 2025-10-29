import axios from 'axios';
import type { Container, ContainerLogs, ContainerStats, HealthStatus, SystemMetrics } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const healthCheck = async (): Promise<HealthStatus> => {
  const { data } = await api.get('/health');
  return data;
};

export const listContainers = async (all = true): Promise<Container[]> => {
  const { data } = await api.get('/api/v1/containers', { params: { all } });
  return data;
};

export const getContainer = async (name: string): Promise<Container> => {
  const { data } = await api.get(`/api/v1/containers/${name}`);
  return data;
};

export const startContainer = async (name: string): Promise<void> => {
  await api.post(`/api/v1/containers/${name}/start`);
};

export const stopContainer = async (name: string): Promise<void> => {
  await api.post(`/api/v1/containers/${name}/stop`);
};

export const restartContainer = async (name: string): Promise<void> => {
  await api.post(`/api/v1/containers/${name}/restart`);
};

export const getContainerLogs = async (
  name: string,
  tail = 100
): Promise<ContainerLogs> => {
  const { data } = await api.get(`/api/v1/containers/${name}/logs`, {
    params: { tail },
  });
  return data;
};

export const getContainerStats = async (
  name: string
): Promise<ContainerStats> => {
  const { data } = await api.get(`/api/v1/containers/${name}/stats`);
  return data;
};

export const getSystemMetrics = async (): Promise<SystemMetrics> => {
  const { data } = await api.get('/api/v1/system/metrics');
  return data;
};

