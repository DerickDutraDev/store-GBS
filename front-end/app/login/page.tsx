"use client";
import "../auth.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Redireciona se o usuário já estiver logado
  useEffect(() => {
    async function checkUserAndRedirect() {
      if (user) {
        // Tenta buscar o status de admin do usuário logado
        const { data, error: userError } = await supabase
          .from('user_profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (userError) {
          console.error("Erro ao buscar status de admin:", userError);
          router.push('/');
          return;
        }

        if (data?.is_admin) {
          router.push('/admin');
        } else {
          router.push('/');
        }
      }
    }
    checkUserAndRedirect();
  }, [user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { user: supabaseUser }, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      if (loginError.message.includes("Invalid login credentials")) {
        setError("E-mail ou senha inválidos. Por favor, verifique seus dados ou crie uma conta.");
      } else {
        setError(loginError.message);
      }
      setLoading(false);
      return;
    }

    if (supabaseUser) {
      const { data, error: userError } = await supabase
        .from('user_profiles')
        .select('is_admin')
        .eq('id', supabaseUser.id)
        .single();
      
      if (userError) {
        console.error("Erro ao buscar dados do usuário:", userError);
        router.push('/');
        return;
      }
      
      if (data?.is_admin) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }

    setLoading(false);
  }

  // Não renderiza nada enquanto o redirecionamento está sendo processado
  if (user) {
    return null; 
  }

  return (
    <div className="auth-container relative">
      <div className="absolute top-8 left-8">
        <Link href="/">
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Voltar
          </Button>
        </Link>
      </div>

      <div className="auth-card">
        <div className="flex justify-center mb-4">
          <Image
            src="/logo-store.jpg"
            alt="Store GBS Logo"
            width={100}
            height={100}
            className="auth-logo"
          />
        </div>
        <h2 className="auth-title">
          Entrar na Store<span style={{ color: "var(--accent)" }}>GBS</span>
        </h2>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="bg-destructive/20 text-destructive border-l-4 border-destructive p-4 mt-4 rounded-md animate-fade-in-up">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <div className="auth-secondary">
          Não tem uma conta?{" "}
          <Link href="/register" className="auth-link">
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}