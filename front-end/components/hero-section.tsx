"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const heroSlides = [
  {
    id: 1,
    title: "Vista a Paixão",
    subtitle: "Coleção 2024/25",
    description: "As mais novas camisas dos seus times favoritos com tecnologia de ponta",
    image: "/placeholder-n0vea.png",
    cta: "Ver Coleção Completa",
  },
  {
    id: 2,
    title: "Tecnologia e Tradição",
    subtitle: "Performance Premium",
    description: "Tecidos de alta performance que acompanham cada movimento em campo",
    image: "/placeholder-ronz8.png",
    cta: "Descobrir Tecnologia",
  },
  {
    id: 3,
    title: "Seu Time, Sua Pele",
    subtitle: "Personalização Exclusiva",
    description: "Personalize sua camisa com nome e número. Seja único como sua paixão",
    image: "/placeholder-ysgah.png",
    cta: "Personalizar Agora",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
            index === currentSlide
              ? "opacity-100 scale-100 z-10"
              : "opacity-0 scale-105 z-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white animate-fade-in-up">
              <p className="text-accent font-semibold text-lg mb-2 tracking-wide">
                {slide.subtitle}
              </p>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-pretty opacity-90">
                {slide.description}
              </p>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 text-lg animate-pulse-glow"
              >
                {slide.cta}
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-primary" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  )
}
