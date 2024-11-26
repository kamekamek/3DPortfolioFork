import { Button } from "@/components/ui/button";
import { Github, LogOut } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function Navigation() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4">
      <Link href="/">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent cursor-pointer">
          3D Portfolio
        </h1>
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-white">{user.name}</span>
            <Link href="/dashboard">
              <Button variant="outline">管理画面</Button>
            </Link>
            <Button variant="outline" size="icon">
              <Github className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Link href="/auth">
            <Button>ログイン / 新規登録</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
