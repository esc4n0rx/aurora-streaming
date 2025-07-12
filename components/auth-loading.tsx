"use client"

import { Loader2 } from "lucide-react"

export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
        <p className="text-gray-400">Verificando autenticação...</p>
      </div>
    </div>
  )
} 