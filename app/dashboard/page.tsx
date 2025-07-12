"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Play, Plus, Info, Search, Bell } from "lucide-react"
import Image from "next/image"
import ContentCarousel from "@/components/content-carousel"

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentHero, setCurrentHero] = useState(0)

  const heroContent = [
    {
      id: 1,
      title: "The Last Kingdom",
      description:
        "As Alfred the Great defends his kingdom from Norse invaders, Uhtred - born a Saxon but raised by Vikings - seeks to claim his ancestral birthright.",
      backdrop: "/placeholder.svg?height=1080&width=1920",
      logo: "/placeholder.svg?height=200&width=400",
      rating: "TV-MA",
      year: "2023",
      genres: ["Drama", "Action", "History"],
      match: 98,
    },
    {
      id: 2,
      title: "Cosmic Horizons",
      description:
        "Journey through the universe in this breathtaking documentary series that explores the mysteries of space and our place in the cosmos.",
      backdrop: "/placeholder.svg?height=1080&width=1920",
      logo: "/placeholder.svg?height=200&width=400",
      rating: "TV-PG",
      year: "2023",
      genres: ["Documentary", "Science"],
      match: 95,
    },
  ]

  const contentSections = [
    {
      title: "Continue Watching",
      items: [
        { id: 1, title: "Breaking Bad", image: "/placeholder.svg?height=400&width=300", progress: 65, type: "series" },
        { id: 2, title: "The Matrix", image: "/placeholder.svg?height=400&width=300", progress: 23, type: "movie" },
        {
          id: 3,
          title: "Stranger Things",
          image: "/placeholder.svg?height=400&width=300",
          progress: 89,
          type: "series",
        },
        { id: 4, title: "Inception", image: "/placeholder.svg?height=400&width=300", progress: 45, type: "movie" },
      ],
    },
    {
      title: "Trending Now",
      items: [
        { id: 5, title: "Wednesday", image: "/placeholder.svg?height=400&width=300", trending: 1, type: "series" },
        {
          id: 6,
          title: "Top Gun: Maverick",
          image: "/placeholder.svg?height=400&width=300",
          trending: 2,
          type: "movie",
        },
        {
          id: 7,
          title: "House of Dragon",
          image: "/placeholder.svg?height=400&width=300",
          trending: 3,
          type: "series",
        },
        { id: 8, title: "Avatar 2", image: "/placeholder.svg?height=400&width=300", trending: 4, type: "movie" },
        { id: 9, title: "The Bear", image: "/placeholder.svg?height=400&width=300", trending: 5, type: "series" },
      ],
    },
    {
      title: "New Releases",
      items: [
        {
          id: 10,
          title: "The Night Agent",
          image: "/placeholder.svg?height=400&width=300",
          isNew: true,
          type: "series",
        },
        { id: 11, title: "John Wick 4", image: "/placeholder.svg?height=400&width=300", isNew: true, type: "movie" },
        { id: 12, title: "The Diplomat", image: "/placeholder.svg?height=400&width=300", isNew: true, type: "series" },
        { id: 13, title: "Fast X", image: "/placeholder.svg?height=400&width=300", isNew: true, type: "movie" },
      ],
    },
    {
      title: "Recommended for You",
      items: [
        { id: 14, title: "Dark", image: "/placeholder.svg?height=400&width=300", match: 97, type: "series" },
        {
          id: 15,
          title: "Blade Runner 2049",
          image: "/placeholder.svg?height=400&width=300",
          match: 94,
          type: "movie",
        },
        { id: 16, title: "Ozark", image: "/placeholder.svg?height=400&width=300", match: 91, type: "series" },
        { id: 17, title: "Dune", image: "/placeholder.svg?height=400&width=300", match: 89, type: "movie" },
      ],
    },
  ]

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
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image
                src="/placeholder.svg?height=32&width=32"
                alt="Profile"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0">
          <Image
            src={heroContent[currentHero].backdrop || "/placeholder.svg"}
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-2xl ml-6 md:ml-16">
          {/* Content Logo */}
          <div className="mb-6">
            <Image
              src={heroContent[currentHero].logo || "/placeholder.svg"}
              alt={heroContent[currentHero].title}
              width={400}
              height={200}
              className="max-w-md"
            />
          </div>

          {/* Metadata */}
          <div className="flex items-center space-x-4 mb-4 text-sm">
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
              {heroContent[currentHero].match}% Match
            </span>
            <span className="text-gray-300">{heroContent[currentHero].year}</span>
            <span className="border border-gray-500 text-gray-300 px-2 py-0.5 text-xs">
              {heroContent[currentHero].rating}
            </span>
            <div className="flex items-center space-x-1">
              {heroContent[currentHero].genres.map((genre, index) => (
                <span key={genre} className="text-gray-300">
                  {genre}
                  {index < heroContent[currentHero].genres.length - 1 && " •"}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-xl">{heroContent[currentHero].description}</p>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-medium rounded-lg transition-all duration-300 hover:scale-105">
              <Play className="w-5 h-5 mr-2" />
              Play
            </Button>
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg rounded-lg backdrop-blur-sm bg-transparent"
            >
              <Info className="w-5 h-5 mr-2" />
              More Info
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

      {/* Content Sections */}
      <div className="relative z-10 -mt-32 pb-20">
        {contentSections.map((section, index) => (
          <ContentCarousel
            key={section.title}
            title={section.title}
            items={section.items}
            className={index === 0 ? "pt-32" : "pt-12"}
          />
        ))}
      </div>
    </div>
  )
}
