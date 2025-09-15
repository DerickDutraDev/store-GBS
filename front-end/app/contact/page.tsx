import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function ContactPage() {
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
        Entre em Contato
      </h1>
      <div className="bg-card p-6 rounded-lg shadow-lg max-w-4xl mx-auto border border-border">
        <p className="text-muted-foreground leading-relaxed">
          Estamos aqui para ajudar! Utilize as opções abaixo para entrar em contato com a nossa equipe.
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4 text-muted-foreground">
          <li><strong>E-mail:</strong> <a href="mailto:contato@storegbs.com.br" className="text-primary hover:underline">contato@storegbs.com.br</a></li>
          <li><strong>WhatsApp:</strong> <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">+55 (11) 99999-9999</a></li>
          <li><strong>Horário de Atendimento:</strong> Segunda a Sexta, das 9h às 18h</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-4">
          Para assuntos relacionados à imprensa, por favor, utilize o e-mail específico na página de imprensa.
        </p>
      </div>
    </div>
  );
}