import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getTasks, type GetTasksParams } from '../api';

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
