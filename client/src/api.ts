import axios from 'axios';
import type { ITask, ITaskResponse } from './types';
import type { LoginFormData } from './pages/Login';
import type { RegisterFormData } from './pages/SignUp';

export type Tab = 'all' | 'Important' | 'Urgent';

export interface GetTasksParams {
  page?: number;
  pageSize?: number;
  search?: string;
  tab?: Tab;
  completed?: boolean;
}

const api = axios.create({
  baseURL: `http://localhost:5001/api`,
  headers: { 'Content-Type': 'application/JSON' },
  timeout: 10000,
  withCredentials: true,
});

// Turn every failed response into an Error carrying the server's message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ?? // { success: false, message: '...' }
      error.response?.data?.error ?? // your 500 handler uses `error`
      (error.request
        ? 'Unable to reach the server. Check your connection.'
        : error.message);
    return Promise.reject(new Error(message));
  },
);

export async function getUser() {
  const res = await api.get('/auth/me');
  return res.data.user ?? null;
}

export async function login(data: LoginFormData) {
  const res = await api.post('/auth/sign-in', data);
  return res.data;
}

export async function signup(data: RegisterFormData) {
  const res = await api.post('/auth/sign-up', data);
  return res.data;
}
export async function logout() {
  const res = await api.post('/auth/logout');
  return res.data;
}

export async function getTasks({
  page,
  pageSize,
  search,
  tab,
  completed,
}: GetTasksParams = {}) {
  const res = await api.get('/tasks', {
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
  api.post('/create-task', data);
}
