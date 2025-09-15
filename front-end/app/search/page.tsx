"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ProductCard from '@/components/ProductCard';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  team_slug: string;
}

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q');

  useEffect(() => {
    async function fetchProducts() {
      if (!searchQuery) {
        setProducts([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${searchQuery}%`); // Busca produtos com nome parecido

      if (error) {
        console.error('Erro ao buscar produtos:', error);
        setProducts([]);
      } else {
        setProducts(data as Product[]);
      }
      setLoading(false);
    }
    
    fetchProducts();
  }, [searchQuery]);

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
        Resultados para "{searchQuery}"
      </h1>

      {loading ? (
        <div className="text-center mt-10">Carregando produtos...</div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground mt-10">
          Nenhum produto encontrado para a sua busca.
        </div>
      )}
    </div>
  );
}