// app/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {HeroSection} from "@/components/hero-section";
import {FeaturedProducts} from "@/components/featured-products";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) {
      return;
    }
    if (user?.name === 'admin') {
      router.push("/admin/products");
    }
  }, [user, router]);

  if (user === undefined) {
    return <div className="text-center mt-20 text-foreground text-xl">Carregando...</div>;
  }
  
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturedProducts />
      </main>
      <Footer />
    </>
  );
}