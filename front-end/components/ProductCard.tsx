// components/ProductCard.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { supabase } from '@/lib/supabaseClient';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  team_slug: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const router = useRouter();

  async function handleAddToCart() {
    if (user && user.id) { // Adicionada verificação de user.id
      // Lógica real de adicionar ao carrinho para usuários logados
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: product.id,
          quantity: 1,
        });

      if (error) {
        toast.error('Erro ao adicionar produto ao carrinho!');
        console.error('Erro ao adicionar item ao carrinho:', error);
      } else {
        toast.success(`"${product.name}" adicionado ao carrinho!`);
      }
    } else {
      localStorage.setItem('redirect_to_cart_with_product_id', product.id);
      toast.info("Você precisa fazer login para adicionar itens ao carrinho.");
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  }

  return (
    <div className="bg-card rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105 group">
      <Link href={`/times/${product.team_slug}`} className="flex-1">
        <div className="relative overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-1">{product.team_slug.toUpperCase().replace('-', ' ')}</p>
          <h3 className="font-semibold text-card-foreground line-clamp-2">{product.name}</h3>
          <p className="text-lg font-bold text-primary mt-2">R$ {product.price.toFixed(2).replace('.', ',')}</p>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold hover:bg-primary/90 transition-colors"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Adicionar ao Carrinho
        </Button>
      </div>
    </div>
  );
}