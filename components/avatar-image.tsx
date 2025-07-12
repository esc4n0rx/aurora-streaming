"use client"

import Image from "next/image"
import { getAvatarUrl } from "@/lib/config"

interface AvatarImageProps {
  src?: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallback?: string
}

export default function AvatarImage({ 
  src, 
  alt, 
  width = 144, 
  height = 144, 
  className = "w-full h-full object-cover",
  fallback = "/placeholder.svg"
}: AvatarImageProps) {
  const imageSrc = src ? getAvatarUrl(src) : fallback

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={(e) => {
        // Se a imagem falhar, usar fallback
        const target = e.target as HTMLImageElement
        target.src = fallback
      }}
    />
  )
} 