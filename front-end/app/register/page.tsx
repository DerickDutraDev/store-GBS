"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import "../auth.css";
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Tenta criar a conta do usuário no Supabase Auth
    const { data: userData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      toast.error(signUpError.message);
      setError(signUpError.message);
      setLoading(false);
      return; // Retorna aqui para não continuar se houver erro
    }

    // 2. Se a conta foi criada com sucesso, insere o perfil na tabela 'user_profiles'
    if (userData.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: userData.user.id, // O ID do auth.user é a chave primária
            email: email,
            name: nome,
            is_admin: false, // Por padrão, o novo usuário não é admin
          },
        ]);
        
      if (profileError) {
        console.error("Erro ao salvar o perfil do usuário:", profileError);
        toast.error("Ocorreu um erro ao salvar o seu perfil.");
        setLoading(false);
        return;
      }
    }
    
    toast.success("Conta criada com sucesso! Você já pode fazer o login.");
    setLoading(false);
    router.push("/login"); // Redireciona o usuário para a página de login
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
          Criar Conta na Store<span style={{ color: "var(--accent)" }}>GBS</span>
        </h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

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

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Criando Conta..." : "Criar Conta"}
          </button>
        </form>
        {error && (
            <div className="bg-destructive/20 text-destructive border-l-4 border-destructive p-4 mt-4 rounded-md animate-fade-in-up">
              <p className="font-semibold">{error}</p>
            </div>
          )}
        <div className="auth-secondary">
          Já tem uma conta?{" "}
          <Link href="/login" className="auth-link">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}