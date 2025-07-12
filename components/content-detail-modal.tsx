"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Play, Download, Heart, Share2, Star, Clock, Users } from "lucide-react"
import Image from "next/image"
import VideoPlayer from "./video-player"

interface ContentItem {
  id: number
  title: string
  image: string
  genre: string
  year?: number
  rating?: string
  duration?: string
  description?: string
  cast?: string[]
  director?: string
  imdbRating?: number
  quality?: string[]
  languages?: string[]
  match?: number
}

interface ContentDetailModalProps {
  content: ContentItem | null
  onClose: () => void
}

export default function ContentDetailModal({ content, onClose }: ContentDetailModalProps) {
  const [showPlayer, setShowPlayer] = useState(false)
  const [isInWatchlist, setIsInWatchlist] = useState(false)

  if (!content) return null

  // Mock detailed data based on content
  const detailedContent = {
    ...content,
    year: content.year || 2023,
    rating: content.rating || "TV-MA",
    duration: content.duration || "45min",
    description:
      content.description ||
      `${content.title} é uma série dramática que explora temas profundos através de personagens complexos e narrativas envolventes. Uma produção original Aurora+ que redefine o entretenimento premium.`,
    cast: content.cast || ["Alexander Dreymon", "Emily Cox", "David Dawson", "Ian Hart"],
    director: content.director || "Peter Kosminsky",
    imdbRating: content.imdbRating || 8.5,
    quality: content.quality || ["4K", "HDR", "Dolby Vision", "Dolby Atmos"],
    languages: content.languages || ["Português", "English", "Español"],
    match: content.match || Math.floor(Math.random() * 20) + 80,
  }

  if (showPlayer) {
    return <VideoPlayer onClose={() => setShowPlayer(false)} title={content.title} />
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 text-gray-400 hover:text-white transition-colors p-2 bg-black/50 rounded-full backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero Section */}
          <div className="relative h-80 rounded-t-3xl overflow-hidden">
            <Image src={content.image || "/placeholder.svg"} alt={content.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

            {/* Content Info Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-white mb-2">{content.title}</h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge className="bg-blue-600 text-white px-3 py-1">{detailedContent.match}% Match</Badge>
                    <span className="text-green-400 font-semibold">{detailedContent.year}</span>
                    <span className="border border-gray-500 px-2 py-1 text-sm text-white">
                      {detailedContent.rating}
                    </span>
                    <span className="flex items-center text-white">
                      <Clock className="w-4 h-4 mr-1" />
                      {detailedContent.duration}
                    </span>
                    <span className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 mr-1" />
                      {detailedContent.imdbRating}
                    </span>
                  </div>
                  <Badge variant="outline" className="border-white/30 text-white">
                    {content.genre}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-8">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Button
                onClick={() => setShowPlayer(true)}
                className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Play className="w-5 h-5 mr-2" />
                Assistir
              </Button>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-xl backdrop-blur-sm bg-transparent"
              >
                <Download className="w-5 h-5 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsInWatchlist(!isInWatchlist)}
                className={`border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-xl backdrop-blur-sm ${
                  isInWatchlist ? "bg-red-600/20 border-red-600" : "bg-transparent"
                }`}
              >
                <Heart className={`w-5 h-5 mr-2 ${isInWatchlist ? "fill-current text-red-500" : ""}`} />
                {isInWatchlist ? "Na Lista" : "Minha Lista"}
              </Button>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 p-3 rounded-xl backdrop-blur-sm bg-transparent"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Quality Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {detailedContent.quality.map((quality) => (
                <Badge key={quality} className="bg-blue-600/20 text-blue-400 border border-blue-600/30">
                  {quality}
                </Badge>
              ))}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-3">Sinopse</h3>
              <p className="text-gray-300 leading-relaxed text-lg">{detailedContent.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Elenco Principal</h3>
                <div className="space-y-2">
                  {detailedContent.cast.map((actor, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-gray-300">{actor}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Direção</h3>
                  <p className="text-gray-300">{detailedContent.director}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Idiomas</h3>
                  <div className="flex flex-wrap gap-2">
                    {detailedContent.languages.map((language) => (
                      <Badge key={language} variant="outline" className="border-white/20 text-gray-300">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Classificação</h3>
                  <div className="flex items-center space-x-4">
                    <span className="border border-gray-500 px-3 py-1 text-sm text-white rounded">
                      {detailedContent.rating}
                    </span>
                    <span className="text-gray-400">Conteúdo para maiores de idade</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Content */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Conteúdo Similar</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    title: "Vikings",
                    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
                  },
                  {
                    title: "The Crown",
                    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=400&fit=crop",
                  },
                  {
                    title: "Peaky Blinders",
                    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=400&fit=crop",
                  },
                  {
                    title: "Outlander",
                    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop",
                  },
                ].map((item, index) => (
                  <div key={index} className="group cursor-pointer">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors">{item.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
