"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Play, Plus, Info, Search, Bell, Loader2 } from "lucide-react"
import Image from "next/image"
import ContentCarousel from "@/components/content-carousel"
import ContentDetailModal from "@/components/content-detail-modal"
import { getPopularContents, listContents } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import type { Content } from "@/lib/types"

export default function Dashboard() {
  const { isAuthenticated, isLoading, user, selectedProfile } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentHero, setCurrentHero] = useState(0)
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null)
  
  // Estados para conteúdo
  const [heroContent, setHeroContent] = useState<Content[]>([])
  const [trendingContent, setTrendingContent] = useState<Content[]>([])
  const [newReleases, setNewReleases] = useState<Content[]>([])
  const [recommendedContent, setRecommendedContent] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar conteúdo
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      loadContent()
    }
  }, [isAuthenticated, isLoading])

  const loadContent = async () => {
    try {
      setLoading(true)
      setError(null)

      // Carregar conteúdos populares para o hero
      const popularResponse = await getPopularContents(5)
      setHeroContent(popularResponse.data)

      // Carregar trending
      const trendingResponse = await listContents({
        subcategoria: 'filme',
        limit: 10,
        sort_by: 'total_visualizations',
        sort_order: 'desc'
      })
      setTrendingContent(trendingResponse.data)

      // Carregar novos lançamentos
      const newReleasesResponse = await listContents({
        limit: 10,
        sort_by: 'created_at',
        sort_order: 'desc'
      })
      setNewReleases(newReleasesResponse.data)

      // Carregar recomendados
      const recommendedResponse = await listContents({
        limit: 10,
        sort_by: 'rating',
        sort_order: 'desc'
      })
      setRecommendedContent(recommendedResponse.data)

    } catch (err: any) {
      setError(err.message || 'Erro ao carregar conteúdo')
      console.error('Erro ao carregar conteúdo:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleContentClick = (contentId: string) => {
    setSelectedContentId(contentId)
  }

  const handleCloseModal = () => {
    setSelectedContentId(null)
  }

  // Se não estiver autenticado, mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-gray-400">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  // Se não estiver autenticado, redirecionar
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Faça login para acessar o dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left Side */}
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-light">
              Aurora<span className="text-blue-500">+</span>
            </h1>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-white hover:text-blue-400 transition-colors font-medium">
                Movies
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Series
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Novelas
              </a>
            </nav>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search movies, series, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-10 rounded-full focus:border-blue-500"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 hover:bg-white/10 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-white">
                  {user?.email || 'Usuário'}
                </p>
                <p className="text-xs text-gray-400">
                  {selectedProfile?.nome || 'Perfil'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/40 transition-colors">
                <Image
                  src={selectedProfile?.avatar_url || "/placeholder-user.jpg"}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {heroContent.length > 0 && (
        <section className="relative h-screen flex items-center">
          <div className="absolute inset-0">
            <Image
              src={heroContent[currentHero]?.poster || "/placeholder.svg"}
              alt="Hero background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          </div>

          <div className="relative z-10 max-w-2xl ml-6 md:ml-16">
            {/* Content Title */}
            <div className="mb-6">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                {heroContent[currentHero]?.nome}
              </h1>
            </div>

            {/* Metadata */}
            <div className="flex items-center space-x-4 mb-4 text-sm">
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                {Math.floor(Math.random() * 20) + 80}% Match
              </span>
              <span className="text-gray-300">{heroContent[currentHero]?.metadata.ano_lancamento}</span>
              <span className="border border-gray-500 text-gray-300 px-2 py-0.5 text-xs">
                {heroContent[currentHero]?.metadata.idade_recomendada || 'L'}
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-gray-300">{heroContent[currentHero]?.categoria}</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-300">{heroContent[currentHero]?.subcategoria}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-xl">
              {heroContent[currentHero]?.metadata.descricao}
            </p>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button 
                onClick={() => heroContent[currentHero] && handleContentClick(heroContent[currentHero].id)}
                className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-medium rounded-lg transition-all duration-300 hover:scale-105"
              >
                <Play className="w-5 h-5 mr-2" />
                Assistir
              </Button>
              <Button
                onClick={() => heroContent[currentHero] && handleContentClick(heroContent[currentHero].id)}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg rounded-lg backdrop-blur-sm bg-transparent"
              >
                <Info className="w-5 h-5 mr-2" />
                Mais Info
              </Button>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 p-3 rounded-lg backdrop-blur-sm bg-transparent"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Hero Navigation */}
          <div className="absolute bottom-8 right-8 flex space-x-2">
            {heroContent.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHero(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentHero ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Content Sections */}
      <div className="relative z-10 -mt-32 pb-20">
        {/* Continue Watching - Em construção */}
        <div className="pt-32 px-6">
          <h2 className="text-2xl font-semibold mb-6 text-white">Continue Assistindo</h2>
          <div className="bg-gray-800/50 rounded-xl p-8 text-center">
            <div className="text-gray-400 mb-4">
              <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Play className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-lg">Funcionalidade em desenvolvimento</p>
              <p className="text-sm">Em breve você poderá continuar de onde parou</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="pt-12 px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-800 aspect-[2/3] rounded-lg mb-2"></div>
                  <div className="bg-gray-800 h-4 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="pt-12 px-6">
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8 text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={loadContent} variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10">
                Tentar Novamente
              </Button>
            </div>
          </div>
        )}

        {/* Trending Now */}
        {trendingContent.length > 0 && (
          <div className="pt-12 px-6">
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
              Em Alta
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {trendingContent.slice(0, 6).map((content) => (
                <div
                  key={content.id}
                  onClick={() => handleContentClick(content.id)}
                  className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 shadow-lg group-hover:shadow-2xl">
                    <Image
                      src={content.poster}
                      alt={content.nome}
                      fill
                      className="object-cover group-hover:brightness-75 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <Play className="w-6 h-6 text-white fill-current" />
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-medium">
                      🔥
                    </div>
                  </div>
                  <h3 className="text-white font-medium text-sm group-hover:text-blue-400 transition-colors truncate">
                    {content.nome}
                  </h3>
                  <p className="text-gray-400 text-xs truncate">
                    {content.metadata.ano_lancamento} • {content.categoria}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Releases */}
        {newReleases.length > 0 && (
          <div className="pt-12 px-6">
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
              Novos Lançamentos
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {newReleases.slice(0, 6).map((content) => (
                <div
                  key={content.id}
                  onClick={() => handleContentClick(content.id)}
                  className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 shadow-lg group-hover:shadow-2xl">
                    <Image
                      src={content.poster}
                      alt={content.nome}
                      fill
                      className="object-cover group-hover:brightness-75 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <Play className="w-6 h-6 text-white fill-current" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded font-medium">
                      NOVO
                    </div>
                  </div>
                  <h3 className="text-white font-medium text-sm group-hover:text-blue-400 transition-colors truncate">
                    {content.nome}
                  </h3>
                  <p className="text-gray-400 text-xs truncate">
                    {content.metadata.ano_lancamento} • {content.categoria}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended */}
        {recommendedContent.length > 0 && (
          <div className="pt-12 px-6">
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              Recomendados para Você
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {recommendedContent.slice(0, 6).map((content) => (
                <div
                  key={content.id}
                  onClick={() => handleContentClick(content.id)}
                  className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 shadow-lg group-hover:shadow-2xl">
                    <Image
                      src={content.poster}
                      alt={content.nome}
                      fill
                      className="object-cover group-hover:brightness-75 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <Play className="w-6 h-6 text-white fill-current" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">
                      {Math.floor(Math.random() * 20) + 80}%
                    </div>
                  </div>
                  <h3 className="text-white font-medium text-sm group-hover:text-blue-400 transition-colors truncate">
                    {content.nome}
                  </h3>
                  <p className="text-gray-400 text-xs truncate">
                    {content.metadata.ano_lancamento} • {content.categoria}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content Detail Modal */}
      <ContentDetailModal
        contentId={selectedContentId}
        onClose={handleCloseModal}
      />
    </div>
  )
}
