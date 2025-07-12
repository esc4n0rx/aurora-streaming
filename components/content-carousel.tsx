"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Plus, Info, Star } from "lucide-react"
import Image from "next/image"

interface ContentItem {
  id: number
  title: string
  image: string
  progress?: number
  trending?: number
  isNew?: boolean
  match?: number
  type: "movie" | "series"
}

interface ContentCarouselProps {
  title: string
  items: ContentItem[]
  className?: string
}

export default function ContentCarousel({ title, items, className = "" }: ContentCarouselProps) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className={`px-6 md:px-16 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll("left")}
            className="border-white/20 text-white hover:bg-white/10 rounded-full p-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll("right")}
            className="border-white/20 text-white hover:bg-white/10 rounded-full p-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="relative flex-shrink-0 w-72 group cursor-pointer"
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-blue-500/20">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Progress Bar for Continue Watching */}
              {item.progress && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}

              {/* Trending Badge */}
              {item.trending && (
                <div className="absolute top-3 left-3">
                  <div className="bg-red-600 text-white text-sm font-bold px-2 py-1 rounded">#{item.trending}</div>
                </div>
              )}

              {/* New Badge */}
              {item.isNew && (
                <div className="absolute top-3 right-3">
                  <div className="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-full">NEW</div>
                </div>
              )}

              {/* Match Percentage */}
              {item.match && (
                <div className="absolute top-3 left-3">
                  <div className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    {item.match}%
                  </div>
                </div>
              )}

              {/* Hover Overlay */}
              {hoveredItem === item.id && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-white text-black hover:bg-gray-200 rounded-full p-2">
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 rounded-full p-2 bg-transparent"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 rounded-full p-2 bg-transparent"
                    >
                      <Info className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="mt-3">
              <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors truncate">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm capitalize">{item.type}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
