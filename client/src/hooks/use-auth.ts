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

  const { data: authState, isLoading, error } = useQuery<AuthState | null, Error>({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) return null;

        const { data: session, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        const response = await fetch('/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${session.session?.access_token}`
          }
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        return response.json();
      } catch (error) {
        console.error('ユーザーデータの取得エラー:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5分間キャッシュを維持
    gcTime: 30 * 60 * 1000, // 30分間キャッシュを保持
    retry: (failureCount, error) => {
      if (error?.message?.includes('認証')) return false; // 認証エラーの場合はリトライしない
      return failureCount < 3; // その他のエラーは最大3回までリトライ
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 指数バックオフ
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
