"use client";

import { Facebook, Instagram } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa"; // Importa o ícone do WhatsApp
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappNumber = "5511999999999"; // Substitua pelo número real
  const whatsappMessage = "Olá, gostaria de ajuda com um pedido."; // Mensagem padrão

  return (
    <footer className="bg-card text-card-foreground border-t border-border mt-12 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Seção 1: Logo e Redes Sociais */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image
                src="/logo-store.jpg"
                alt="StoreGBS Logo"
                width={40}
                height={40}
                className="rounded-full object-cover border border-primary/50 shadow-md"
              />
              <span className="text-2xl font-bold text-primary">
                Store<span className="text-accent">GBS</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs mb-4">
              A sua loja online de camisas de futebol, onde a paixão pelo jogo encontra o estilo.
            </p>
            <div className="flex space-x-4">
              {/* Ícone do Instagram */}
              <Link
                href="#" // Adicione o link do Instagram aqui
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </Link>
              {/* Ícone do WhatsApp */}
              <Link
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp size={20} />
              </Link>
            </div>
          </div>

          {/* Seção 2: Links da Empresa */}
          <div>
            <h4 className="font-semibold text-lg text-card-foreground mb-4">
              Empresa
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  href="/press"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Imprensa
                </Link>
              </li>
            </ul>
          </div>

          {/* Seção 3: Links de Ajuda */}
          <div>
            <h4 className="font-semibold text-lg text-card-foreground mb-4">
              Ajuda
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/exchange-policy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Política de Troca
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Devoluções
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Entre em Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Seção 4: Newsletter */}
          <div>
            <h4 className="font-semibold text-lg text-card-foreground mb-4">
              Assine nossa Newsletter
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Receba as últimas novidades e ofertas exclusivas!
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="w-full sm:flex-1 p-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground py-2 px-4 rounded-md font-semibold hover:bg-primary/90 transition-colors"
              >
                Assinar
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          &copy; {currentYear} StoreGBS. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}