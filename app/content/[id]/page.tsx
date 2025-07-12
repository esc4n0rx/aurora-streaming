"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Download, Heart, Share2, ThumbsUp, ThumbsDown, Star, Clock } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"

export default function ContentDetail() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState("overview")
  const [isInWatchlist, setIsInWatchlist] = useState(false)

  // Mock content data - in real app, fetch based on params.id
  const content = {
    id: 1,
    title: "The Last Kingdom",
    year: 2023,
    rating: "TV-MA",
    duration: "45min",
    seasons: 5,
    episodes: 46,
    imdbRating: 8.5,
    rtRating: 91,
    genres: ["Drama", "Action", "History", "War"],
    synopsis:
      "As Alfred the Great defends his kingdom from Norse invaders, Uhtred - born a Saxon but raised by Vikings - seeks to claim his ancestral birthright. Set in the 9th century, this epic tale follows the warrior's journey through a land divided by war, politics, and shifting loyalties.",
    fullSynopsis:
      "As Alfred the Great defends his kingdom from Norse invaders, Uhtred - born a Saxon but raised by Vikings - seeks to claim his ancestral birthright. Set in the 9th century, this epic tale follows the warrior's journey through a land divided by war, politics, and shifting loyalties. Based on Bernard Cornwell's Saxon Stories series, The Last Kingdom brings to life the brutal and beautiful world of medieval England, where kingdoms rise and fall, and honor is earned through blood and steel.",
    director: "Peter Kosminsky",
    creators: ["Stephen Butchard"],
    cast: [
      { name: "Alexander Dreymon", character: "Uhtred of Bebbanburg", image: "/placeholder.svg?height=200&width=150" },
      { name: "Emily Cox", character: "Brida", image: "/placeholder.svg?height=200&width=150" },
      { name: "David Dawson", character: "King Alfred", image: "/placeholder.svg?height=200&width=150" },
      { name: "Ian Hart", character: "Beocca", image: "/placeholder.svg?height=200&width=150" },
    ],
    backdrop: "/placeholder.svg?height=1080&width=1920",
    poster: "/placeholder.svg?height=600&width=400",
    trailer: "/placeholder.svg?height=400&width=600",
    languages: ["English", "Old English"],
    subtitles: ["English", "Spanish", "French", "German"],
    quality: ["4K", "HDR", "Dolby Vision", "Dolby Atmos"],
    match: 98,
  }

  const episodes = [
    {
      id: 1,
      title: "Episode 1",
      description: "Uhtred is captured and raised by Vikings after his father is killed in battle.",
      duration: "57min",
      thumbnail: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      title: "Episode 2",
      description: "Young Uhtred struggles with his identity as he grows up among his captors.",
      duration: "54min",
      thumbnail: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "Episode 3",
      description: "Uhtred must choose between his Viking family and his Saxon heritage.",
      duration: "58min",
      thumbnail: "/placeholder.svg?height=200&width=300",
    },
  ]

  const relatedContent = [
    { id: 2, title: "Vikings", image: "/placeholder.svg?height=400&width=300", match: 94 },
    { id: 3, title: "The Crown", image: "/placeholder.svg?height=400&width=300", match: 89 },
    { id: 4, title: "Peaky Blinders", image: "/placeholder.svg?height=400&width=300", match: 87 },
    { id: 5, title: "Outlander", image: "/placeholder.svg?height=400&width=300", match: 85 },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <Image
            src={content.backdrop || "/placeholder.svg"}
            alt={content.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        </div>

        <div className="relative z-10 flex items-center h-full">
          <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            {/* Poster */}
            <div className="lg:col-span-1">
              <div className="relative w-80 mx-auto">
                <Image
                  src={content.poster || "/placeholder.svg"}
                  alt={content.title}
                  width={400}
                  height={600}
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 bg-blue-600 text-white px-3 py-2 rounded-full font-semibold">
                  {content.match}% Match
                </div>
              </div>
            </div>

            {/* Content Info */}
            <div className="lg:col-span-2">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">{content.title}</h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-lg">
                <span className="text-green-400 font-semibold">{content.year}</span>
                <span className="border border-gray-500 px-2 py-1 text-sm">{content.rating}</span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {content.duration}
                </span>
                <span className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  {content.imdbRating}
                </span>
                <span className="text-red-500 font-semibold">{content.rtRating}% RT</span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {content.genres.map((genre) => (
                  <Badge key={genre} variant="outline" className="border-white/30 text-white">
                    {genre}
                  </Badge>
                ))}
              </div>

              {/* Quality Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {content.quality.map((quality) => (
                  <Badge key={quality} className="bg-blue-600 text-white">
                    {quality}
                  </Badge>
                ))}
              </div>

              {/* Synopsis */}
              <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-3xl">{content.synopsis}</p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <Button className="bg-white text-black hover:bg-gray-200 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105">
                  <Play className="w-6 h-6 mr-2" />
                  Play
                </Button>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-xl backdrop-blur-sm bg-transparent"
                >
                  <Download className="w-6 h-6 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsInWatchlist(!isInWatchlist)}
                  className={`border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-xl backdrop-blur-sm ${
                    isInWatchlist ? "bg-red-600 border-red-600" : ""
                  }`}
                >
                  <Heart className={`w-6 h-6 mr-2 ${isInWatchlist ? "fill-current" : ""}`} />
                  {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                </Button>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 p-4 rounded-xl backdrop-blur-sm bg-transparent"
                >
                  <Share2 className="w-6 h-6" />
                </Button>
              </div>

              {/* Rating Actions */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-400">Rate this:</span>
                <Button variant="ghost" className="text-white hover:text-green-400 p-2">
                  <ThumbsUp className="w-5 h-5" />
                </Button>
                <Button variant="ghost" className="text-white hover:text-red-400 p-2">
                  <ThumbsDown className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="relative z-10 -mt-20 bg-black/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
          {/* Tab Navigation */}
          <div className="flex space-x-8 mb-8 border-b border-white/10">
            {[
              { id: "overview", label: "Overview" },
              { id: "episodes", label: "Episodes" },
              { id: "trailers", label: "Trailers & More" },
              { id: "cast", label: "Cast & Crew" },
              { id: "details", label: "Details" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-lg font-medium transition-colors ${
                  activeTab === tab.id ? "text-white border-b-2 border-blue-500" : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-96">
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Synopsis</h3>
                  <p className="text-gray-300 leading-relaxed text-lg">{content.fullSynopsis}</p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Created by</h3>
                  <p className="text-gray-300">{content.creators.join(", ")}</p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Directed by</h3>
                  <p className="text-gray-300">{content.director}</p>
                </div>
              </div>
            )}

            {activeTab === "episodes" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold">Season 1</h3>
                  <select className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-white/20">
                    <option>Season 1</option>
                    <option>Season 2</option>
                    <option>Season 3</option>
                  </select>
                </div>
                <div className="grid gap-4">
                  {episodes.map((episode) => (
                    <div
                      key={episode.id}
                      className="flex gap-4 p-4 bg-gray-900/50 rounded-xl hover:bg-gray-900/70 transition-colors group cursor-pointer"
                    >
                      <div className="relative w-48 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={episode.thumbnail || "/placeholder.svg"}
                          alt={episode.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold">{episode.title}</h4>
                          <span className="text-gray-400">{episode.duration}</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed">{episode.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "cast" && (
              <div>
                <h3 className="text-2xl font-semibold mb-6">Main Cast</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {content.cast.map((actor) => (
                    <div key={actor.name} className="text-center group cursor-pointer">
                      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-3">
                        <Image
                          src={actor.image || "/placeholder.svg"}
                          alt={actor.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="font-semibold group-hover:text-blue-400 transition-colors">{actor.name}</h4>
                      <p className="text-gray-400 text-sm">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "details" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Technical Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Audio Languages:</span>
                      <span>{content.languages.join(", ")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtitles:</span>
                      <span>{content.subtitles.join(", ")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Quality:</span>
                      <span>{content.quality.join(", ")}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Series Info</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Seasons:</span>
                      <span>{content.seasons}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Episodes:</span>
                      <span>{content.episodes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rating:</span>
                      <span>{content.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Content */}
      <section className="py-16 px-6 md:px-16 bg-gray-900/30">
        <h2 className="text-3xl font-semibold mb-8">More Like This</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedContent.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <div className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    {item.match}%
                  </div>
                </div>
              </div>
              <h3 className="font-semibold group-hover:text-blue-400 transition-colors">{item.title}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
