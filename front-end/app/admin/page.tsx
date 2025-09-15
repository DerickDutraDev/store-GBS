"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDashboard() {
  const { user } = useAuth(); // Mantemos o user para exibir o nome

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-extrabold text-foreground text-center mb-8 animate-fade-in-up">
        Painel do Administrador
      </h1>
      <div className="bg-card p-6 rounded-lg shadow-lg max-w-2xl mx-auto border border-border">
        <p className="mt-4 text-muted-foreground">
          Bem-vindo, <span className="font-semibold text-card-foreground">Admin</span>. Aqui você pode gerenciar os produtos da loja e outras configurações.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link href="/admin/products/new">
            <Button className="w-full bg-primary text-primary-foreground py-3 font-semibold hover:bg-primary/90 animate-pulse-glow">
              Cadastrar Nova Camisa
            </Button>
          </Link>
          <Link href="/admin/products">
            <Button 
              variant="outline"
              className="w-full border-primary text-primary py-3 font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Ver Todas as Camisas
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}