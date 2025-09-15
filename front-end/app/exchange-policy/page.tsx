import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function ExchangePolicyPage() {
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
        Política de Troca
      </h1>
      <div className="bg-card p-6 rounded-lg shadow-lg max-w-4xl mx-auto border border-border">
        <p className="text-muted-foreground leading-relaxed">
          Nossa política de troca e devolução está em conformidade com o Código de Defesa do Consumidor. A seguir, detalhamos as condições para a troca de produtos.
        </p>
        <h2 className="text-2xl font-bold text-card-foreground mt-6 mb-2">1. Prazo para Troca</h2>
        <p className="text-muted-foreground leading-relaxed">
          O cliente tem até 7 dias corridos, a partir da data de recebimento do produto, para solicitar a troca.
        </p>
        <h2 className="text-2xl font-bold text-card-foreground mt-6 mb-2">2. Condições do Produto</h2>
        <p className="text-muted-foreground leading-relaxed">
          O produto deve ser devolvido na embalagem original, sem sinais de uso, lavagem ou dano. Etiquetas e lacres originais devem estar intactos.
        </p>
        <h2 className="text-2xl font-bold text-card-foreground mt-6 mb-2">3. Processo de Solicitação</h2>
        <p className="text-muted-foreground leading-relaxed">
          Entre em contato com o nosso time de atendimento através do e-mail de contato, informando o número do pedido e o motivo da troca. Aguarde as instruções para o envio do produto.
        </p>
      </div>
    </div>
  );
}