import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function PressPage() {
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
        Imprensa
      </h1>
      <div className="bg-card p-6 rounded-lg shadow-lg max-w-4xl mx-auto border border-border">
        <p className="text-muted-foreground leading-relaxed">
          Se você é um jornalista ou membro da mídia e gostaria de saber mais sobre a StoreGBS, obter informações para reportagens ou solicitar entrevistas, entre em contato conosco através das informações abaixo.
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4 text-muted-foreground">
          <li><strong>E-mail:</strong> <a href="mailto:imprensa@storegbs.com.br" className="text-primary hover:underline">imprensa@storegbs.com.br</a></li>
          <li><strong>Telefone:</strong> +55 (11) 99999-9999</li>
          <li><strong>Kit de Imprensa:</strong> Em breve</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-4">
          Agradecemos o seu interesse na StoreGBS. Estamos ansiosos para colaborar.
        </p>
      </div>
    </div>
  );
}