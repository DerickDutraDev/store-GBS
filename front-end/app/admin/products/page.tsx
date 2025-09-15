"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { toast } from 'react-toastify';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  team_slug: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Erro ao buscar produtos:', error);
      toast.error('Erro ao carregar os produtos.');
    } else {
      setProducts(data as Product[]);
    }
    setLoading(false);
  }

  async function handleDelete(productId: string) {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error('Erro ao excluir produto:', error);
        toast.error('Erro ao excluir o produto.');
      } else {
        toast.success('Produto excluído com sucesso!');
        fetchProducts(); // Atualiza a lista de produtos
      }
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [searchParams]); // Adicionando searchParams como dependência para forçar a atualização

  if (loading) {
    return <div className="text-center mt-20 text-foreground text-xl">Carregando produtos...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-foreground animate-fade-in-up">Gerenciar Camisas</h1>
        <Link href="/admin/products/new">
          <Button className="bg-primary text-primary-foreground py-2 px-4 font-semibold hover:bg-primary/90 transition-colors animate-pulse-glow">
            Adicionar Nova Camisa
          </Button>
        </Link>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow-2xl border border-border overflow-x-auto">
        {products.length === 0 ? (
          <p className="text-muted-foreground text-center py-10">Nenhum produto cadastrado.</p>
        ) : (
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Imagem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Preço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Image src={product.image} alt={product.name} width={50} height={50} className="rounded-md object-cover" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-card-foreground">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">R$ {product.price.toFixed(2).replace('.', ',')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="outline" className="h-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                          Editar
                        </Button>
                      </Link>
                      <Button onClick={() => handleDelete(product.id)} variant="destructive" className="h-8">
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}