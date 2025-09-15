import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function ReturnsPage() {
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
        Devoluções
      </h1>
      <div className="bg-card p-6 rounded-lg shadow-lg max-w-4xl mx-auto border border-border">
        <p className="text-muted-foreground leading-relaxed">
          Caso você deseje devolver um produto por arrependimento ou defeito, siga as orientações abaixo.
        </p>
        <h2 className="text-2xl font-bold text-card-foreground mt-6 mb-2">1. Prazo para Devolução</h2>
        <p className="text-muted-foreground leading-relaxed">
          O prazo para desistência da compra é de até 7 dias corridos, contados a partir do recebimento do produto.
        </p>
        <h2 className="text-2xl font-bold text-card-foreground mt-6 mb-2">2. Condições para o Reembolso</h2>
        <p className="text-muted-foreground leading-relaxed">
          O produto devolvido deve estar em perfeitas condições, sem sinais de uso. O reembolso será processado após a chegada e análise do produto em nosso centro de distribuição.
        </p>
      </div>
    </div>
  );
}