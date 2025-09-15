import { supabase } from '@/lib/supabaseClient';
import ProductCard from '@/components/ProductCard';
import { notFound } from 'next/navigation';


export const revalidate = 0;

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  team_slug: string;
}

interface TeamPageProps {
  params: {
    team_slug: string;
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { team_slug } = params;

  console.log('Buscando produtos para o time:', team_slug);

  // A busca dos dados não precisa de opções extras, pois o `revalidate` já cuida disso.
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('team_slug', team_slug);

  if (error || !products || products.length === 0) {
    console.error('Erro na busca Supabase:', error);
    notFound();
  }
  
  const teamName = team_slug.replace('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-extrabold text-foreground text-center mb-12 animate-fade-in-up">
        Camisas do {teamName}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}