import axios from 'axios';
import type { ITask } from './types';

const api = axios.create({
  baseURL: `http://localhost:5001`,
  headers: { 'Content-Type': 'application/JSON' },
});

export async function getTasks() {
  const data = await api.get('/api/all-tasks');

  return data;
}

export function createTask(data: ITask) {
  api.post('/api/create-task', data);
}
