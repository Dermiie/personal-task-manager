import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createTask, getTasks, type GetTasksParams } from '../api';
import { toast } from 'react-toastify';

export const tasksKey = (params: GetTasksParams) =>
  [
    'tasks',
    {
      ...params,
      search: params.search?.trim() || undefined,
      tab: params.tab === 'all' ? undefined : params.tab,
    },
  ] as const;

export function useTasks(params: GetTasksParams) {
  return useQuery({
    queryKey: tasksKey(params),
    queryFn: () => getTasks(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      toast.success('Task created sucessfully');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { mutate, isPending };
}
