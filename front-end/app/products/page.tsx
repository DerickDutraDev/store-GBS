"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/app/context/AuthContext';
import ProductCard from '@/components/ProductCard';
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  team_slug: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('price', { ascending: false }); // Adicionada a ordenação por preço, do maior para o menor
    
    if (error) {
      console.error('Erro ao buscar produtos:', error);
    } else {
      setProducts(data as Product[]);
    }
    setLoading(false);
  }

  if (loading) return <div className="text-center mt-10">Carregando produtos...</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center sm:text-left">
        <Link href="/">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300 ease-in-out"
          >
            Voltar para o Menu Principal
          </Button>
        </Link>
      </div>

      <h1 className="text-4xl font-extrabold text-foreground text-center mb-12 animate-fade-in-up">
        Todas as Camisas
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}