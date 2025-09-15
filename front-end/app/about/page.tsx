import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Botão de voltar */}
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
        Sobre a StoreGBS
      </h1>
      <div className="bg-card p-6 rounded-lg shadow-lg max-w-4xl mx-auto border border-border">
        <p className="text-muted-foreground leading-relaxed">
          Bem-vindo à StoreGBS, sua loja online de camisas de futebol. Fundada com a paixão pelo esporte e o desejo de levar a emoção do campo para o seu dia a dia. Nossa missão é oferecer camisas autênticas e de alta qualidade dos maiores clubes e seleções do mundo, com um design que celebra a história e a cultura do futebol.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-4">
          Na StoreGBS, acreditamos que uma camisa de futebol é mais do que apenas uma vestimenta, é um símbolo de identidade, de torcida e de paixão. Por isso, trabalhamos para trazer os melhores produtos e proporcionar uma experiência de compra excepcional.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-4">
          Nosso time é formado por verdadeiros amantes do futebol, dedicados a garantir que você encontre a camisa perfeita e receba um atendimento de primeira. Junte-se a nós e vista a sua paixão!
        </p>
      </div>
    </div>
  );
}