export interface ITask {
  title: string;
  description: string;
  tags: 'Urgent' | 'Important';
  completed?: boolean;
}
