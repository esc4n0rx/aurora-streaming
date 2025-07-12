"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Play, Plus, Info, Star, Clock, Calendar, Users } from "lucide-react"
import Image from "next/image"
import { getContent, recordContentView, getStreamUrl, getStreamUrlAlternative } from "@/lib/api"
import type { Content } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import VideoPlayer from "@/components/video-player"

interface ContentDetailModalProps {
  contentId: string | null
  onClose: () => void
}

export default function ContentDetailModal({ contentId, onClose }: ContentDetailModalProps) {
  const { user, selectedProfile } = useAuth()
  const [content, setContent] = useState<Content | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  useEffect(() => {
    if (contentId) {
      loadContent()
    }
  }, [contentId])

  const loadContent = async () => {
    if (!contentId) return

    setLoading(true)
    setError(null)

    try {
      const response = await getContent(contentId)
      setContent(response.data)
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar conteúdo')
    } finally {
      setLoading(false)
    }
  }

  const handlePlay = async () => {
    if (!content || !user || !selectedProfile) {
      alert('Usuário não autenticado. Faça login novamente.')
      return
    }

    // Ir direto para o player com loading
    setShowVideoPlayer(true)
    setVideoUrl('') // URL vazia para mostrar loading

    try {
      console.log('Iniciando reprodução para:', content.nome)
      console.log('Usuário:', user.id)
      console.log('Perfil:', selectedProfile.id)

      let streamResponse
      
      try {
        // Tentar registrar visualização primeiro
        await recordContentView(content.id, {
          user_id: user.id,
          profile_id: selectedProfile.id,
          view_duration: 0,
          view_percentage: 0
        })
        console.log('Visualização registrada com sucesso')
      } catch (err: any) {
        // Se der erro 400 (visualização já registrada), continuar mesmo assim
        if (err.status === 400 && err.message.includes('já registrada')) {
          console.log('Visualização já registrada, continuando...')
        } else {
          // Se for outro erro, mostrar e parar
          console.error('Erro ao registrar visualização:', err)
          // Não mostrar alert, apenas log do erro
        }
      }

      // Obter URL do stream (independente se a visualização foi registrada ou não)
      console.log('Obtendo URL do stream...')
      
      try {
        streamResponse = await getStreamUrl(content.id)
        console.log('Resposta do stream:', streamResponse)
      } catch (error) {
        console.log('Erro na função principal, tentando alternativa...')
        try {
          streamResponse = await getStreamUrlAlternative(content.id)
          console.log('Resposta do stream (alternativa):', streamResponse)
        } catch (altError) {
          console.error('Erro na função alternativa:', altError)
          throw error // Re-throw o erro original
        }
      }
      
      if (streamResponse.success && streamResponse.data.streamUrl) {
        console.log('URL do stream obtida:', streamResponse.data.streamUrl)
        
        // Verificar se a URL é válida
        if (!streamResponse.data.streamUrl.startsWith('http')) {
          console.error('URL do stream inválida:', streamResponse.data.streamUrl)
          alert('Erro: URL do stream inválida. Tente novamente.')
          setShowVideoPlayer(false)
          return
        }
        
        // Configurar URL do vídeo (o player fará auto-play)
        setVideoUrl(streamResponse.data.streamUrl)
      } else {
        console.error('Erro ao obter URL do stream:', streamResponse.message)
        alert('Erro ao iniciar reprodução. Tente novamente.')
        setShowVideoPlayer(false)
      }
    } catch (err: any) {
      console.error('Erro ao reproduzir conteúdo:', err)
      alert('Erro ao reproduzir conteúdo. Tente novamente.')
      setShowVideoPlayer(false)
    }
  }

  const handleCloseVideoPlayer = () => {
    setShowVideoPlayer(false)
    setVideoUrl(null)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  if (!contentId) return null

  // Se o video player estiver ativo, mostrar apenas ele
  if (showVideoPlayer) {
    return (
      <div className="fixed inset-0 z-50 animate-fade-in">
        <VideoPlayer
          onClose={handleCloseVideoPlayer}
          title={content?.nome || 'Reproduzindo...'}
          videoUrl={videoUrl || undefined}
        />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="bg-[#18181b]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-1 z-10"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>

          {loading && (
            <div className="flex items-center justify-center p-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="p-8 text-center">
              <p className="text-red-400">{error}</p>
              <Button onClick={onClose} className="mt-4">Fechar</Button>
            </div>
          )}

          {content && !loading && (
            <>
              {/* Hero Section */}
              <div className="relative h-96 md:h-[500px] rounded-t-3xl overflow-hidden">
                <Image
                  src={content.poster}
                  alt={content.nome}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                
                {/* Content Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Poster */}
                    <div className="w-48 h-72 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={content.poster}
                        alt={content.nome}
                        width={192}
                        height={288}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.nome}</h1>
                      
                      {/* Metadata */}
                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{content.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-gray-300">{content.metadata.ano_lancamento}</span>
                        <span className="border border-gray-500 text-gray-300 px-2 py-0.5 rounded">
                          {content.metadata.idade_recomendada || 'L'}
                        </span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{formatDuration(content.metadata.duracao)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{formatNumber(content.total_visualizations)} visualizações</span>
                        </div>
                      </div>

                      {/* Genres */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {content.categoria}
                        </span>
                        <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm">
                          {content.subcategoria}
                        </span>
                        {content.is_series && content.temporada && (
                          <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                            Temporada {content.temporada}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4">
                        <Button
                          onClick={handlePlay}
                          className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-medium rounded-xl transition-all duration-300 hover:scale-105"
                        >
                          <Play className="w-5 h-5 mr-2" />
                          Assistir
                        </Button>
                        <Button
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg rounded-xl backdrop-blur-sm bg-transparent"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Minha Lista
                        </Button>
                        <Button
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white/10 p-3 rounded-xl backdrop-blur-sm bg-transparent"
                        >
                          <Info className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Description */}
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-semibold mb-4">Sinopse</h3>
                    <p className="text-gray-300 leading-relaxed">{content.metadata.descricao}</p>
                  </div>

                  {/* Additional Info */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Detalhes</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-400">Direção:</span>
                        <p className="text-white">{content.metadata.diretor}</p>
                      </div>
                      {content.metadata.elenco && (
                        <div>
                          <span className="text-gray-400">Elenco:</span>
                          <p className="text-white">{content.metadata.elenco.join(', ')}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-400">Qualidades:</span>
                        <div className="flex gap-2 mt-1">
                          {content.qualidades.map((quality) => (
                            <span
                              key={quality}
                              className="bg-gray-700 text-white px-2 py-1 rounded text-xs"
                            >
                              {quality}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
