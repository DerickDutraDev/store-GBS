// app/context/AuthContext.tsx
"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: { id: string; name: string } | null | undefined;
  login: (name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; name: string } | null | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const storedProductId = localStorage.getItem('redirect_to_cart_with_product_id');

      if (session?.user) {
        const userName = session.user.user_metadata?.name || session.user.email?.split('@')[0] || "Usuário";
        
        // Agora, o objeto 'user' do contexto inclui o ID do usuário
        setUser({ id: session.user.id, name: userName });
        
        if (storedProductId) {
          localStorage.removeItem('redirect_to_cart_with_product_id');
          router.push(`/cart?added=${storedProductId}`);
        } else {
          router.push('/');
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const login = (name: string) => {
    setUser({ id: '', name }); // O ID será atualizado pelo listener do Supabase
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}