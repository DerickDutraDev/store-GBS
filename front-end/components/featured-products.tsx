// components/featured-products.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  team_slug: string;
  is_new: boolean;
  is_bestseller: boolean;
}

// Componente Card de Produto
function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group overflow-hidden border-border bg-card hover:bg-card/80 transition-all duration-300 hover:scale-105">
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {product.is_new && <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">Novo</Badge>}
          {product.originalPrice && (
            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </Badge>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          <Button
            size="icon"
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary hover:bg-primary/90"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-1">{product.team_slug}</p>
          <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">R$ {product.price.toFixed(2).replace(".", ",")}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente principal
export function FeaturedProducts() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: newArrivalsData, error: newArrivalsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_new', true)
        .order('created_at', { ascending: false });

      const { data: bestSellersData, error: bestSellersError } = await supabase
        .from('products')
        .select('*')
        .eq('is_bestseller', true)
        .order('rating', { ascending: false });

      if (newArrivalsError || bestSellersError) {
        console.error('Erro ao buscar produtos:', newArrivalsError || bestSellersError);
      } else {
        setNewArrivals(newArrivalsData as Product[]);
        setBestSellers(bestSellersData as Product[]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-16">Carregando produtos...</div>;
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        {/* Novas Chegadas */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Novas Chegadas</h2>
              <p className="text-muted-foreground">As últimas camisas que chegaram na nossa loja</p>
            </div>
            <Link href="/products" passHref>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                Ver Todas
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Mais Vendidas */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Mais Vendidas</h2>
              <p className="text-muted-foreground">As camisas favoritas dos nossos clientes</p>
            </div>
            <Link href="/products" passHref>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                Ver Todas
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Personalização CTA */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Personalize Sua Camisa</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Adicione seu nome e número favorito. Torne sua camisa única como sua paixão pelo seu time.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3">
            Começar Personalização
          </Button>
        </div>
      </div>
    </section>
  );
}