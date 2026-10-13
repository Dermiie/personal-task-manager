import axios from 'axios';
import type { ITask, ITaskResponse } from './types';

export type Tab = 'all' | 'Important' | 'Urgent';

export interface GetTasksParams {
  page?: number;
  pageSize?: number;
  search?: string;
  tab?: Tab;
  completed?: boolean;
}

const api = axios.create({
  baseURL: `http://localhost:5001`,
  headers: { 'Content-Type': 'application/JSON' },
});

export async function getTasks({
  page,
  pageSize,
  search,
  tab,
  completed,
}: GetTasksParams = {}) {
  const res = await api.get('/api/tasks', {
    params: {
      page,
      pageSize,
      search: search?.trim() || undefined, // '' becomes undefined, so it's omitted
      tab: tab && tab !== 'all' ? tab : undefined, // 'all' is the default, no need to send it
      completed,
    },
  });
  return res.data as ITaskResponse;
}
export function createTask(data: ITask) {
  api.post('/api/create-task', data);
}
