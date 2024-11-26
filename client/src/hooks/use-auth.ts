import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { User as DBUser } from "@db/schema";
import type { User as AuthUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  name: string;
}

interface AuthState {
  user: AuthUser | null;
  dbUser: DBUser | null;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: authState, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      return {
        user: session.user,
        dbUser: userData
      };
    },
    staleTime: 1000 * 60 * 5, // 5分
    retry: false
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('ログインエラー:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('ログイン処理中にエラーが発生しました:', error);
    },
    retry: (failureCount, error) => {
      if (error?.message?.includes('認証')) return false;
      return failureCount < 2;
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name
          }
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return {
    user: authState?.user ?? null,
    dbUser: authState?.dbUser ?? null,
    isLoading,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
  };
}
