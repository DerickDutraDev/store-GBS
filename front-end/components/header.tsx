"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";

// --------------------- TIPAGENS ---------------------
type CartItem = {
  id: string;
  quantity: number;
  products:
    | {
        name: string;
        price: number;
        image: string | null;
      }
    | null;
};

type AuthUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  avatar_url?: string | null;
} | null;

// --------------------- CONSTANTES / UTILS ---------------------
const searchSuggestions = [
  "Flamengo",
  "Barcelona",
  "Real Madrid",
  "Brasil Seleção",
  "Manchester City",
  "PSG",
  "Liverpool",
  "Corinthians",
];

function slugify(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const megaMenuData = {
  Times: {
    Brasileiros: ["Flamengo", "Corinthians", "Palmeiras", "São Paulo", "Santos", "Vasco"],
    Europeus: ["Real Madrid", "Barcelona", "Manchester City", "Liverpool", "PSG", "Bayern Munich"],
    Outros: ["Boca Juniors", "River Plate", "Peñarol", "Nacional"],
  },
  Seleções: {
    "América do Sul": ["Brasil", "Argentina", "Uruguai", "Chile", "Colômbia"],
    Europa: ["França", "Alemanha", "Espanha", "Inglaterra", "Itália"],
    Outras: ["Estados Unidos", "México", "Japão"],
  },
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 1024);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

// --------------------- COMPONENTE ---------------------
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // Novo estado para o status de admin

  const searchRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  const [mobileTimesOpen, setMobileTimesOpen] = useState(false);
  const [mobileSelecoesOpen, setMobileSelecoesOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [openMegaMenu, setOpenMegaMenu] = useState<string | null>(null);

  const isMobile = useIsMobile();
  const router = useRouter();

  const { user, logout } = useAuth() as { user: AuthUser; logout: () => void };

  // Efeito para buscar o status de admin
  useEffect(() => {
    async function fetchAdminStatus() {
      if (user) {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        
        if (data && data.is_admin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    }
    fetchAdminStatus();
  }, [user]); // Roda sempre que o estado do usuário muda

  async function fetchCartItems(userId?: string | null) {
    setLoadingCart(true);

    if (!userId) {
      setCartItems([]);
      setLoadingCart(false);
      return;
    }

    const mapRowsToCartItems = (rows: any[]): CartItem[] => {
      return rows.map((row) => {
        const prodRaw = row.products;
        const prod = Array.isArray(prodRaw) ? prodRaw[0] : prodRaw;

        return {
          id: String(row.id),
          quantity: typeof row.quantity === "number" ? row.quantity : Number(row.quantity || 0),
          products: prod
            ? {
                name: prod.name ?? "Produto",
                price: Number(prod.price ?? 0),
                image: prod.image ?? null,
              }
            : null,
        } as CartItem;
      });
    };

    let res = await supabase
      .from("cart_items")
      .select("id, quantity, products ( name, price, image )")
      .eq("user_id", userId);

    if (res.error || !res.data) {
      res = await supabase
        .from("cart")
        .select("id, quantity, products ( name, price, image )")
        .eq("user_id", userId);
    }

    if (res.error) {
      console.error("Erro ao buscar carrinho:", res.error);
      setCartItems([]);
      setLoadingCart(false);
      return;
    }

    const rows = res.data || [];
    const items = mapRowsToCartItems(rows);
    setCartItems(items);
    setLoadingCart(false);
  }

  useEffect(() => {
    fetchCartItems(user?.id);
  }, [user?.id]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setOpenMegaMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const filteredSuggestions = searchSuggestions.filter((s) =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.products?.price || 0) * item.quantity,
    0
  );
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  function handleMegaMenu(menu: string) {
    setOpenMegaMenu((prev) => (prev === menu ? null : menu));
  }

  const goToCart = () => {
    setIsCartOpen(false);
    router.push("/cart");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo-store.jpg"
                alt="StoreGBS Logo"
                width={40}
                height={40}
                className="rounded-full object-cover border border-primary/50 shadow-md transform transition-transform duration-300 hover:scale-110"
              />
              <div className="text-2xl font-bold text-primary cursor-pointer hover:scale-105 transition-transform">
                Store<span className="text-accent">GBS</span>
              </div>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/products" className="text-foreground hover:text-primary transition-colors font-medium relative group">
              Produtos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium relative group">
              Novidades
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>

            <div className="relative group" ref={openMegaMenu === "Times" ? megaMenuRef : undefined}>
              <button
                type="button"
                className="text-foreground hover:text-primary transition-colors font-medium flex items-center gap-1 bg-transparent border-none outline-none"
                onClick={() => handleMegaMenu("Times")}
                tabIndex={0}
              >
                Times
                <ChevronDown className={`h-4 w-4 transition-transform ${openMegaMenu === "Times" ? "rotate-180" : ""}`} />
              </button>
              {openMegaMenu === "Times" && (
                <div className="absolute top-full left-0 mt-2 w-96 bg-card border border-border rounded-lg shadow-lg p-6 animate-fade-in-up z-50">
                  <div className="grid grid-cols-3 gap-6">
                    {Object.entries(megaMenuData.Times).map(([category, teams]) => (
                      <div key={category}>
                        <h4 className="font-semibold text-card-foreground mb-3">{category}</h4>
                        <ul className="space-y-2">
                          {teams.map((team) => (
                            <li key={team}>
                              <Link
                                href={`/times/${slugify(team)}`}
                                className="text-muted-foreground hover:text-primary transition-colors text-sm"
                              >
                                {team}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative group" ref={openMegaMenu === "Seleções" ? megaMenuRef : undefined}>
              <button
                type="button"
                className="text-foreground hover:text-primary transition-colors font-medium flex items-center gap-1 bg-transparent border-none outline-none"
                onClick={() => handleMegaMenu("Seleções")}
                tabIndex={0}
              >
                Seleções
                <ChevronDown className={`h-4 w-4 transition-transform ${openMegaMenu === "Seleções" ? "rotate-180" : ""}`} />
              </button>
              {openMegaMenu === "Seleções" && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg p-6 animate-fade-in-up z-50">
                  <div className="grid grid-cols-2 gap-6">
                    {Object.entries(megaMenuData.Seleções).map(([category, teams]) => (
                      <div key={category}>
                        <h4 className="font-semibold text-card-foreground mb-3">{category}</h4>
                        <ul className="space-y-2">
                          {teams.map((team) => (
                            <li key={team}>
                              <Link
                                href={`/selecoes/${slugify(team)}`}
                                className="text-muted-foreground hover:text-primary transition-colors text-sm"
                              >
                                {team}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium relative group">
              Personalizar
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium relative group">
              Ofertas
              <Badge className="ml-2 bg-accent text-accent-foreground text-xs">Hot</Badge>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="relative" ref={searchRef}>
              {isSearchOpen ? (
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Input
                      placeholder="Buscar camisas, times..."
                      className="w-64 bg-input border-border pr-10"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch(searchQuery);
                        }
                      }}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleSearch(searchQuery)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Buscar"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                    {showSuggestions && searchQuery && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                        {filteredSuggestions.length > 0 ? (
                          filteredSuggestions.map((suggestion) => (
                            <button
                              key={suggestion}
                              className="w-full text-left px-4 py-2 hover:bg-secondary transition-colors text-card-foreground"
                              onClick={() => {
                                handleSearch(suggestion);
                              }}
                            >
                              {suggestion}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-muted-foreground">Nenhum resultado encontrado</div>
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                      setShowSuggestions(false);
                    }}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="hover:bg-secondary">
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>

            <div className="relative" ref={userMenuRef}>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-secondary"
                aria-label="Login ou Cadastro"
                onClick={() => setShowUserMenu((v) => !v)}
              >
                <User className="h-5 w-5" />
              </Button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50 animate-fade-in-up" style={isMobile ? { position: "fixed", top: 70, right: 16, left: 16, width: "auto" } : {}}>
                  {!user ? (
                    <div className="flex flex-col p-4 gap-2">
                      <Link href="/login" className="text-foreground hover:text-primary transition-colors text-sm font-medium" onClick={() => setShowUserMenu(false)}>
                        Login
                      </Link>
                      <Link href="/register" className="text-foreground hover:text-primary transition-colors text-sm font-medium" onClick={() => setShowUserMenu(false)}>
                        Criar Conta
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col p-4 gap-2 items-center">
                      <div className="flex items-center gap-2">
                        <User className="h-6 w-6 text-primary" />
                        <span className="font-semibold text-primary">{user?.name || "Usuário"}</span>
                      </div>
                      <span className="text-muted-foreground text-xs">Você está logado</span>

                      {/* Botão para o Dashboard (visível apenas para admins) */}
                      {isAdmin && (
                         <Link href="/admin" className="w-full">
                           <Button
                             variant="outline"
                             className="w-full border-primary text-primary py-2 font-semibold hover:bg-primary/10 transition-colors"
                             onClick={() => setShowUserMenu(false)}
                           >
                             Dashboard Admin
                           </Button>
                         </Link>
                      )}

                      <button className="auth-secondary-btn mt-2" onClick={logout} style={{ width: "100%" }}>
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative" ref={cartRef}>
              <Button variant="ghost" size="icon" className="relative hover:bg-secondary" onClick={() => setIsCartOpen(!isCartOpen)}>
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse-glow">
                    {cartItemCount}
                  </span>
                )}
              </Button>

              {isCartOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 animate-fade-in-up">
                  <div className="p-4">
                    <h3 className="font-semibold text-card-foreground mb-4">Carrinho de Compras</h3>

                    {loadingCart ? (
                      <p className="text-muted-foreground text-center py-8">Carregando...</p>
                    ) : cartItems.length > 0 ? (
                      <>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center space-x-3">
                              <img src={item.products?.image || "/placeholder.svg"} alt={item.products?.name || "Produto"} className="w-12 h-12 object-cover rounded" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-card-foreground truncate">{item.products?.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {item.quantity}x R$ {(item.products?.price || 0).toFixed(2).replace(".", ",")}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-border mt-4 pt-4">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-semibold text-card-foreground">Total:</span>
                            <span className="font-bold text-primary">R$ {cartTotal.toFixed(2).replace(".", ",")}</span>
                          </div>
                          <Button onClick={goToCart} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Finalizar Compra</Button>
                        </div>
                      </>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">Seu carrinho está vazio</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Button variant="ghost" size="icon" className="lg:hidden hover:bg-secondary" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border/40 animate-fade-in-up">
            <nav className="flex flex-col space-y-4">
              <Link href="/products" className="text-foreground hover:text-primary transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                Produtos
              </Link>
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium flex items-center justify-between">
                Novidades
                <Badge className="bg-accent text-accent-foreground text-xs">Novo</Badge>
              </a>

              <button className="flex items-center justify-between w-full text-foreground hover:text-primary transition-colors font-medium" onClick={() => setMobileTimesOpen(v => !v)}>
                Times
                {mobileTimesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {mobileTimesOpen && (
                <div className="pl-4 pb-2">
                  {Object.entries(megaMenuData.Times).map(([category, teams]) => (
                    <div key={category} className="mb-2">
                      <div className="font-semibold text-sm text-card-foreground mb-1">{category}</div>
                      <ul className="space-y-1">
                        {teams.map((team) => (
                          <li key={team}>
                            <Link href={`/times/${slugify(team)}`} className="text-muted-foreground hover:text-primary transition-colors text-sm block" onClick={() => setIsMenuOpen(false)}>
                              {team}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              <button className="flex items-center justify-between w-full text-foreground hover:text-primary transition-colors font-medium" onClick={() => setMobileSelecoesOpen(v => !v)}>
                Seleções
                {mobileSelecoesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {mobileSelecoesOpen && (
                <div className="pl-4 pb-2">
                  {Object.entries(megaMenuData.Seleções).map(([category, teams]) => (
                    <div key={category} className="mb-2">
                      <div className="font-semibold text-sm text-card-foreground mb-1">{category}</div>
                      <ul className="space-y-1">
                        {teams.map((team) => (
                          <li key={team}>
                            <Link href={`/selecoes/${slugify(team)}`} className="text-muted-foreground hover:text-primary transition-colors text-sm block" onClick={() => setIsMenuOpen(false)}>
                              {team}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">Personalizar</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium flex items-center justify-between">
                Ofertas
                <Badge className="bg-primary text-primary-foreground text-xs">Hot</Badge>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}