import {
  useMutation,
  useQuery,
  useQueryClient,
  QueryClient,
} from '@tanstack/react-query';
import { getUser, login, signup } from '../api';
import type { IUser } from '../types';

export const authKeys = {
  currentUser: ['currentUser'] as const,
};

const isUnauthorized = (err: unknown) =>
  (err as { status?: number })?.status === 401;

function setAuthenticatedUser(queryClient: QueryClient, user: IUser | null) {
  // Drop anything cached for a previous session
  queryClient.removeQueries({
    predicate: (q) => q.queryKey[0] !== authKeys.currentUser[0],
  });
  queryClient.setQueryData(authKeys.currentUser, user);
}

export function useCurrentUser() {
  return useQuery<IUser | null>({
    queryKey: authKeys.currentUser,
    queryFn: async () => {
      try {
        return await getUser();
      } catch (err) {
        if (isUnauthorized(err)) return null;
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: (count, err) => !isUnauthorized(err) && count < 2,
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signup,
    onSuccess: (user) => setAuthenticatedUser(queryClient, user),
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (user) => setAuthenticatedUser(queryClient, user),
  });
}

// export function useLogout() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: logout,
//     onSettled: () => setAuthenticatedUser(queryClient, null),
//   });
// }
