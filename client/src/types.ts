export interface IUser {
  fullname: string;
  email: string;
  password: string;
}

export interface ITaskResponse {
  tasks: ITask[];
  success: boolean;
  pagination: IPagination;
}

interface IPagination {
  page: number;
  pageSize: number;
  totalPages: number;
  totalTasks: number;
}

export interface ITask {
  id: string;
  userId: string;
  title: string;
  description: string;
  tags: 'Urgent' | 'Important';
  completed?: boolean;
  updatedAt?: string;
}
