"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

type CartItem = {
  id: string;
  quantity: number;
  products:
    | {
        name: string;
        price: number;
        image: string | null;
      }
    | null;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const addedProductId = searchParams.get("added");
  const { user } = useAuth();

  // Função para buscar carrinho no Supabase
  async function fetchCartItems(userId: string) {
    const { data, error } = await supabase
      .from("cart_items")
      .select("id, quantity, products ( name, price, image )")
      .eq("user_id", userId);

    if (error) {
      console.error("Erro ao buscar carrinho:", error);
      return [];
    }

    return (
      data?.map((row: any) => ({
        id: row.id,
        quantity: row.quantity,
        products: row.products
          ? {
              name: row.products.name,
              price: row.products.price,
              image: row.products.image,
            }
          : null,
      })) ?? []
    );
  }

  // Se houver produto na URL, adiciona no carrinho
  async function addProductToCart(userId: string, productId: string) {
    const { error } = await supabase.from("cart_items").insert([
      {
        user_id: userId,
        product_id: productId,
        quantity: 1,
      },
    ]);

    if (error) {
      console.error("Erro ao adicionar produto no carrinho:", error);
      toast.error("Erro ao adicionar no carrinho.");
    } else {
      toast.success("Produto adicionado ao carrinho!");
    }
  }

  useEffect(() => {
    if (user === undefined) return; // aguardando contexto
    if (user === null) {
      router.push("/login");
      return;
    }

    async function loadCart() {
      setLoading(true);

      const userId = (user as any).id; // segurança extra caso o tipo não seja explícito
      if (!userId) {
        console.error("ID do usuário não disponível");
        setLoading(false);
        return;
      }

      // Se veio produto na URL, adiciona
      if (addedProductId) {
        await addProductToCart(userId, addedProductId);
      }

      // Depois busca tudo
      const items = await fetchCartItems(userId);
      setCartItems(items);
      setLoading(false);
    }

    loadCart();
  }, [user, addedProductId, router]);

  // Aplica o mesmo design do layout principal para a página de carregamento
  if (user === undefined || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-foreground text-xl animate-fade-in-up">
        <p>Carregando carrinho...</p>
        <span className="animate-pulse-glow mt-4">🛒</span> {/* Adiciona um toque visual de animação */}
      </div>
    );
  }

  // Aplica o mesmo design para o carrinho vazio
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center animate-fade-in-up">
        <h1 className="text-4xl font-extrabold text-foreground mb-4">Seu carrinho está vazio 😥</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Parece que você ainda não adicionou nenhum item.
        </p>
        <Link href="/products">
          <Button className="w-full bg-primary text-primary-foreground py-3 font-semibold hover:bg-primary/90 animate-pulse-glow">
            Voltar para a loja
          </Button>
        </Link>
      </div>
    );
  }

  const total = cartItems.reduce(
    (acc, item) => acc + (item.products?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground text-center mb-8 animate-fade-in-up">
        Meu Carrinho
      </h1>

      <div className="bg-card p-6 rounded-lg shadow-2xl max-w-2xl mx-auto border border-border animate-fade-in-up">
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 sm:gap-6 pb-6 border-b border-border last:border-b-0 last:pb-0"
            >
              <Image
                src={item.products?.image || "/placeholder.svg"}
                alt={item.products?.name || "Produto"}
                width={100}
                height={100}
                className="rounded-md object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-card-foreground text-lg">
                  {item.products?.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.quantity}x R$ {(item.products?.price || 0).toFixed(2).replace(".", ",")}
                </p>
              </div>
              <div className="text-xl font-bold text-primary">
                R$ {((item.products?.price || 0) * item.quantity).toFixed(2).replace(".", ",")}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-6 mt-6">
          <div className="flex justify-between font-bold text-xl mb-4">
            <span className="text-card-foreground">Total:</span>
            <span className="text-primary">R$ {total.toFixed(2).replace(".", ",")}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="w-full bg-primary text-primary-foreground py-3 font-semibold hover:bg-primary/90 animate-pulse-glow">
              Finalizar Compra
            </Button>
            <Link href="/products" className="w-full">
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground py-3 font-semibold transition-colors duration-300 ease-in-out"
              >
                Continuar Comprando
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}