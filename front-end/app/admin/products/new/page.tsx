"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/app/context/AuthContext';

export default function NewProductPage() {
  const [name, setName] = useState('');
  const [teamSlug, setTeamSlug] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    let imageUrl = image;

    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error("Erro ao fazer upload da imagem:", uploadError);
        toast.error("Erro ao fazer upload da imagem. Tente novamente.");
        setLoading(false);
        return;
      }
      
      const { data: publicUrlData } = supabase
        .storage
        .from('images')
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;

    } else if (!imageUrl) {
      toast.error("Por favor, forneça uma URL ou um arquivo de imagem.");
      setLoading(false);
      return;
    }

    const newProduct = {
      name,
      team_slug: teamSlug,
      price: parseFloat(price),
      image: imageUrl,
    };

    const { data, error } = await supabase.from('products').insert([newProduct]);

    if (error) {
      console.error("Erro ao cadastrar produto:", error);
      toast.error("Erro ao cadastrar produto. Tente novamente.");
    } else {
      toast.success("Produto cadastrado com sucesso!");
      router.push('/admin/products');
    }
    setLoading(false);
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/admin">
          <Button
            variant="outline"
            className="border-primary text-primary py-2 px-4 font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-300 ease-in-out"
          >
            Voltar para o Dashboard
          </Button>
        </Link>
      </div>

      <div className="p-6 rounded-lg shadow-2xl max-w-lg mx-auto bg-card/80 border border-border animate-fade-in-up">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Image
              src="/logo-store.jpg"
              alt="StoreGBS Logo"
              width={50}
              height={50}
              className="rounded-full object-cover border border-primary/50 shadow-md"
            />
            <span className="text-3xl font-extrabold text-primary">Admin</span>
          </div>
          <h1 className="text-xl font-bold text-card-foreground">
            Cadastrar Nova Camisa 👕
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-muted-foreground font-semibold mb-2" htmlFor="name">Nome da Camisa</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-md bg-input text-foreground border border-border focus:ring-1 focus:ring-primary outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-muted-foreground font-semibold mb-2" htmlFor="teamSlug">Slug do Time (ex: flamengo)</label>
            <input
              id="teamSlug"
              type="text"
              value={teamSlug}
              onChange={(e) => setTeamSlug(e.target.value)}
              className="w-full p-3 rounded-md bg-input text-foreground border border-border focus:ring-1 focus:ring-primary outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-muted-foreground font-semibold mb-2" htmlFor="price">Preço (R$)</label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-3 rounded-md bg-input text-foreground border border-border focus:ring-1 focus:ring-primary outline-none transition-colors"
              step="0.01"
              required
            />
          </div>
          
          <div>
            <label className="block text-muted-foreground font-semibold mb-2" htmlFor="file">Fazer Upload da Imagem</label>
            <input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="w-full p-3 rounded-md bg-input text-foreground border border-border focus:ring-1 focus:ring-primary outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              accept="image/*"
            />
            {imagePreview && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">Pré-visualização:</p>
                <img src={imagePreview} alt="Pré-visualização da imagem" className="mx-auto max-h-48 rounded-md" />
              </div>
            )}
          </div>
          <div className="text-center text-muted-foreground text-sm">
            <span className="font-bold">OU</span>
          </div>
          <div>
            <label className="block text-muted-foreground font-semibold mb-2" htmlFor="image">URL da Imagem</label>
            <input
              id="image"
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full p-3 rounded-md bg-input text-foreground border border-border focus:ring-1 focus:ring-primary outline-none transition-colors"
              placeholder="https://..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-glow"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
}