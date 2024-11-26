import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { User as DBUser } from '@db/schema';

interface AuthContextType {
  user: User | null;
  dbUser: DBUser | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (session?.user) {
          // 並列でユーザーデータを取得
          const [{ data: userData, error: userError }] = await Promise.all([
            supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single()
          ]);

          if (userError) throw userError;
          
          setUser(session.user);
          setDbUser(userData);
        } else {
          setUser(null);
          setDbUser(null);
        }
      } catch (error) {
        console.error('認証エラー:', error);
        setError(error instanceof Error ? error : new Error('認証エラーが発生しました'));
        setUser(null);
        setDbUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        setError(null);
        if (session?.user) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError) throw userError;

          setUser(session.user);
          setDbUser(userData);
        } else {
          setUser(null);
          setDbUser(null);
        }
      } catch (error) {
        console.error('認証状態の更新エラー:', error);
        setError(error instanceof Error ? error : new Error('認証状態の更新に失敗しました'));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, dbUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
