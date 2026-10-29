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
});

// export async function getUser() {
//   try {
//     const res = await api.get('/auth/me'); // or axios.get('http://localhost:5001/api/auth/me', { withCredentials: true })
//     console.log(res.data);
//     return res.data; // or res.data.user, depending on your backend's response shape
//   } catch (error) {
//     console.log(error);
//     return error; // 401 lands here
//   }
// }

export async function getUser() {
  const res = await api.get('/auth/me');
  return res.data.user;
}

export async function login(data: LoginFormData) {
  const res = await api.post('/auth/sign-in', data);
  return res.data;
}

export async function signup(data: RegisterFormData) {
  const res = await api.post('/auth/sign-up', data);
  return res.data;
}

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
