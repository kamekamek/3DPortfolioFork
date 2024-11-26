import { createClient } from '@supabase/supabase-js';
import { db } from "../db";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";
import type { User } from "@db/schema";

// Supabaseクライアントの初期化
// Supabaseクライアントの作成
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials are missing');
}

export const supabase = createClient(
  `https://${supabaseUrl}`,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

// サインアップ機能
export async function signUp(email: string, password: string, name: string): Promise<User | null> {
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name
      }
    }
  });

  if (signUpError) throw signUpError;
  if (!authData.user) return null;

  // ユーザー情報をローカルDBに保存
  const [user] = await db
    .insert(users)
    .values({
      id: authData.user.id,
      email: authData.user.email!,
      name
    })
    .returning();

  return user;
}

// サインイン機能
export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
}

// サインアウト機能
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// セッション取得
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

// ユーザー情報の取得
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user: authUser }, error } = await supabase.auth.getUser();
  
  if (error || !authUser) return null;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, authUser.id))
    .limit(1);
    
  return user || null;
}

// セッションの変更を監視
export function onAuthStateChange(callback: (event: 'SIGNED_IN' | 'SIGNED_OUT', session: any) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event as 'SIGNED_IN' | 'SIGNED_OUT', session);
  });
}
