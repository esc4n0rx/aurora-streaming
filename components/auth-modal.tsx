"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

interface AuthModalProps {
  mode: "login" | "register"
  onClose: () => void
  onSwitchMode: (mode: "login" | "register") => void
}

export default function AuthModal({ mode, onClose, onSwitchMode }: AuthModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    router.push("/profiles")
    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg animate-scale-in">
        <div className="bg-[#18181b]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl flex flex-col items-center">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div className="flex flex-col items-center mb-6 mt-2">
            <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center mb-3">
              <span className="text-white text-2xl font-bold">A<span className="text-blue-500">+</span></span>
            </div>
            <span className="text-xs text-gray-400 font-semibold tracking-widest uppercase">Aurora+</span>
          </div>

          {/* Título e subtítulo */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">Continue com o e-mail</h2>
          <p className="text-gray-300 text-base mb-6 text-center max-w-md">
            Você pode iniciar sessão se já tiver uma conta ou podemos ajudar você a criar uma.
          </p>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4 mb-6">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800/60 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-12 w-full max-w-md text-lg px-5"
              placeholder="E-mail"
              required
              autoFocus
            />
            <Button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg transition-all duration-300 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Continuando...
                </div>
              ) : (
                "Continuar"
              )}
            </Button>
          </form>

          {/* Ícone ilustrativo */}
          <div className="flex flex-col items-center mb-4">
            <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="20" fill="#23272F" />
              <path d="M13 28v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
              <circle cx="16" cy="18" r="2" fill="#60A5FA" />
              <circle cx="24" cy="18" r="2" fill="#60A5FA" />
            </svg>
          </div>

          {/* Texto de privacidade */}
          <p className="text-xs text-gray-400 text-center mb-2 max-w-xs">
            Suas informações são usadas apenas para autenticação e segurança. Nunca enviaremos spam.
          </p>
          <a href="#" className="text-xs text-blue-400 hover:underline text-center block mb-2">Veja como seus dados são gerenciados...</a>
        </div>
      </div>
    </div>
  )
}
