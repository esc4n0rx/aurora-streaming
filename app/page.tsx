"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import AuthModal from "@/components/auth-modal"
import Image from "next/image"
import ContentDetailModal from "@/components/content-detail-modal"
import { useRef } from "react"

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")

  const [featuredContent, setFeaturedContent] = useState<any[]>([])
  const [loadingFeatured, setLoadingFeatured] = useState(true)
  const [errorFeatured, setErrorFeatured] = useState<string | null>(null)

  // Buscar dados da API para filmes e séries
  const [series, setSeries] = useState<any[]>([])
  useEffect(() => {
    setLoadingFeatured(true)
    fetch("/api/featured-content")
      .then(async (res) => {
        if (!res.ok) throw new Error("Erro ao buscar conteúdo em destaque")
        return res.json()
      })
      .then((data) => {
        setFeaturedContent(data.movies || [])
        setSeries(data.series || [])
        setNowPlaying(data.nowPlaying || [])
        setLoadingFeatured(false)
      })
      .catch((err) => {
        setErrorFeatured(err.message)
        setLoadingFeatured(false)
      })
  }, [])

  // Novo estado para lançamentos (nowPlaying)
  const [nowPlaying, setNowPlaying] = useState<any[]>([])
  useEffect(() => {
    setLoadingFeatured(true)
    fetch("/api/featured-content")
      .then(async (res) => {
        if (!res.ok) throw new Error("Erro ao buscar conteúdo em destaque")
        return res.json()
      })
      .then((data) => {
        setFeaturedContent(data.movies || [])
        setSeries(data.series || [])
        setNowPlaying(data.nowPlaying || [])
        setLoadingFeatured(false)
      })
      .catch((err) => {
        setErrorFeatured(err.message)
        setLoadingFeatured(false)
      })
  }, [])

  // Novo cálculo para carrossel de 4 cards fixos
  const CARD_WIDTH = 320 + 16; // 320px + 16px de gap
  const [carouselIndex, setCarouselIndex] = useState(0)
  const carouselInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!featuredContent.length) return
    if (carouselInterval.current) clearInterval(carouselInterval.current)
    carouselInterval.current = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % Math.max(1, featuredContent.length - 3))
    }, 3000)
    return () => {
      if (carouselInterval.current) clearInterval(carouselInterval.current)
    }
  }, [featuredContent])

  // Responsividade: cards por vez
  const getCardsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1
      if (window.innerWidth < 1024) return 2
      if (window.innerWidth < 1280) return 3
    }
    return 4
  }
  const [cardsPerView, setCardsPerView] = useState(4)
  useEffect(() => {
    const handleResize = () => setCardsPerView(getCardsPerView())
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [currentHero, setCurrentHero] = useState(0)
  const [selectedContent, setSelectedContent] = useState<any>(null)

  // Hero automático com pré-carregamento
  const [heroFade, setHeroFade] = useState(true)
  const [nextHero, setNextHero] = useState(1)
  const [isNextLoaded, setIsNextLoaded] = useState(false)

  useEffect(() => {
    if (!nowPlaying.length) return
    setHeroFade(true)
    setNextHero((currentHero + 1) % nowPlaying.length)
    setIsNextLoaded(false)
    const img = new window.Image()
    img.src = nowPlaying[(currentHero + 1) % nowPlaying.length]?.backdrop || ""
    img.onload = () => setIsNextLoaded(true)
    const interval = setInterval(() => {
      setHeroFade(false)
      setTimeout(() => {
        if (isNextLoaded) {
          setCurrentHero((prev) => (prev + 1) % nowPlaying.length)
          setHeroFade(true)
        }
      }, 400)
    }, 5000)
    return () => clearInterval(interval)
  }, [nowPlaying, currentHero, isNextLoaded])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Background do Hero */}
        {nowPlaying.length > 0 && (
          <>
            <div className={`absolute inset-0 z-0 transition-opacity duration-700 ${heroFade ? 'opacity-100' : 'opacity-0'}`}>
              <Image
                src={nowPlaying[currentHero]?.backdrop || "/placeholder.jpg"}
                alt={nowPlaying[currentHero]?.title}
                fill
                className="object-cover w-full h-full absolute inset-0"
                style={{ objectFit: "cover" }}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            </div>
            <div className={`relative z-10 flex flex-col md:flex-row items-center justify-center max-w-6xl mx-auto px-6 w-full transition-opacity duration-700 ${heroFade ? 'opacity-100' : 'opacity-0'}`}>
              {/* Poster */}
              <div className="w-64 min-w-[256px] max-w-[256px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 bg-gray-900/40 mr-0 md:mr-12 mb-8 md:mb-0 transition-opacity duration-700">
                <Image
                  src={nowPlaying[currentHero]?.poster || "/placeholder.jpg"}
                  alt={nowPlaying[currentHero]?.title}
                  width={256}
                  height={384}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              {/* Info */}
              <div className="flex-1 text-left flex flex-col justify-center items-start">
                <span className="inline-block bg-white/10 text-xs px-3 py-1 rounded-full mb-4 font-semibold tracking-widest uppercase">Lançamento</span>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">{nowPlaying[currentHero]?.title}</h1>
                <div className="flex flex-wrap gap-2 items-center mb-4">
                  {/* Categoria/IDs - pode ser melhorado para nomes se desejar */}
                  <span className="text-sm text-blue-400 font-semibold">Filme</span>
                  {nowPlaying[currentHero]?.genres?.map((g: any, i: number) => (
                    <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/80 font-medium">{g}</span>
                  ))}
                </div>
                <p className="text-lg text-white/90 mb-8 max-w-2xl drop-shadow-lg">{nowPlaying[currentHero]?.description}</p>
                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      setAuthMode("register")
                      setShowAuth(true)
                    }}
                    className="bg-white text-black px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:bg-gray-200 transition-all"
                  >
                    Entre para Assistir
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/20 text-black hover:bg-white/10 px-8 py-4 text-lg font-medium rounded-xl backdrop-blur-sm transition-all"
                  >
                    <Play className="inline-block text-black mr-2 w-5 h-5" /> Assistir trailer
                  </Button>
                </div>
                <span className="text-xs text-white/60 mt-4 block">Gratis aqui , somente na Aurora+</span>
              </div>
            </div>
            {/* Dots Hero */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {nowPlaying.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentHero(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 border border-white/30 ${index === currentHero ? "bg-white" : "bg-white/40"}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Featured Content Showcase */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold">Assista as estreias</h2>
            <button className="text-gray-400 hover:text-white transition-colors flex items-center group">
              <span className="mr-2">Ver todos</span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out space-x-4 pb-4"
              style={{
                transform: `translateX(-${carouselIndex * CARD_WIDTH}px)`
              }}
            >
              {loadingFeatured ? (
                <span className="text-gray-400">Carregando...</span>
              ) : errorFeatured ? (
                <span className="text-red-400">{errorFeatured}</span>
              ) : featuredContent.length === 0 ? (
                <span className="text-gray-400">Nenhum conteúdo em destaque</span>
              ) : (
                featuredContent.map((item: any, index: number) => (
                  <div
                    key={item.id || index}
                    className="group relative flex-shrink-0 w-80 cursor-pointer content-card animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setSelectedContent(item)}
                  >
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-800 w-80">
                      <Image
                        src={item.poster ? `https://image.tmdb.org/t/p/w500${item.poster}` : "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="320px"
                        priority={index < 4}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Aurora+ Logo */}
                      <div className="absolute bottom-4 right-4 opacity-90">
                        <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                          <span className="text-white text-sm font-semibold">
                            Aurora<span className="text-blue-500">+</span>
                          </span>
                        </div>
                      </div>

                      {/* Title Overlay */}
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-white text-xl font-bold mb-1">{item.title}</h3>
                      </div>

                      {/* Hover Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40">
                        <Button
                          size="sm"
                          className="bg-white/90 text-black hover:bg-white rounded-full p-4 shadow-xl backdrop-blur-sm"
                        >
                          <Play className="w-6 h-6" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Séries em Alta Section */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-semibold">Séries em Alta</h2>
            <button className="text-gray-400 hover:text-white transition-colors flex items-center">
              <span className="mr-2">Ver todos</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
            {loadingFeatured ? (
              <span className="text-gray-400">Carregando...</span>
            ) : errorFeatured ? (
              <span className="text-red-400">{errorFeatured}</span>
            ) : series.length === 0 ? (
              <span className="text-gray-400">Nenhuma série em alta</span>
            ) : (
              series.map((item: any, index: number) => (
                <div
                  key={item.id || index}
                  className="group relative flex-shrink-0 w-80 cursor-pointer"
                  onClick={() => setSelectedContent(item)}
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-blue-500/20 w-80">
                    <Image
                      src={item.poster || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {/* Aurora+ Logo */}
                    <div className="absolute bottom-3 right-3">
                      <span className="text-white text-sm font-semibold bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
                        Aurora<span className="text-blue-500">+</span>
                      </span>
                    </div>
                    {/* Title Overlay */}
                    <div className="absolute bottom-3 left-3">
                      <h3 className="text-white text-lg font-semibold">{item.title}</h3>
                    </div>
                    {/* Hover Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="sm" className="bg-white text-black hover:bg-gray-200 rounded-full p-3">
                        <Play className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold mb-16 text-center">Premium Streaming Experience</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: "🎬",
                title: "4K HDR Streaming",
                description:
                  "Experience cinema-quality visuals with 4K Ultra HD resolution and HDR10+ support for stunning color and contrast.",
              },
              {
                icon: "📱",
                title: "Multi-Device Sync",
                description:
                  "Start watching on one device and seamlessly continue on another. Your progress syncs across all platforms.",
              },
              {
                icon: "⬇️",
                title: "Offline Downloads",
                description:
                  "Download your favorite content to watch offline anywhere, anytime. Perfect for travel and commuting.",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-light mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join millions of viewers worldwide and discover your next favorite show or movie.
          </p>
          <Button
            onClick={() => {
              setAuthMode("register")
              setShowAuth(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
          >
            Start Your Free Trial
          </Button>
        </div>
      </section>

      {/* Auth Modal */}
      {showAuth && (
        <AuthModal mode={authMode} onClose={() => setShowAuth(false)} onSwitchMode={(mode) => setAuthMode(mode)} />
      )}

      {/* Content Detail Modal */}
      {selectedContent && <ContentDetailModal content={selectedContent} onClose={() => setSelectedContent(null)} />}
    </div>
  )
}
