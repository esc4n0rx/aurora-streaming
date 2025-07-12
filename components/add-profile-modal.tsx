"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Loader2 } from "lucide-react"
import Image from "next/image"
import { createProfile, getAvatars } from "@/lib/api"
import type { Avatar, CreateProfilePayload } from "@/lib/types"
import AvatarImage from "@/components/avatar-image"

interface AddProfileModalProps {
  onClose: () => void
  onProfileCreated: () => void
}

export default function AddProfileModal({ onClose, onProfileCreated }: AddProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [avatars, setAvatars] = useState<Avatar[]>([])
  const [selectedAvatar, setSelectedAvatar] = useState<string>("")
  const [formData, setFormData] = useState<CreateProfilePayload>({
    nome: "",
    tipo: "principal",
    senha: "",
    avatar_id: ""
  })

  // Carregar avatares
  useEffect(() => {
    const loadAvatars = async () => {
      try {
        const response = await getAvatars()
        setAvatars(response.data)
        if (response.data.length > 0) {
          setSelectedAvatar(response.data[0].id)
          setFormData(prev => ({ ...prev, avatar_id: response.data[0].id }))
        }
      } catch (err) {
        console.error('Erro ao carregar avatares:', err)
      }
    }

    loadAvatars()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nome || !formData.senha || !formData.avatar_id) return

    setIsLoading(true)
    try {
      await createProfile(formData)
      onProfileCreated()
      onClose()
    } catch (err: any) {
      console.error('Erro ao criar perfil:', err)
      // Aqui você poderia mostrar um toast de erro
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl animate-scale-in">
        <div className="bg-[#18181b]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Adicionar Perfil</h2>
            <p className="text-gray-400">Crie um novo perfil para personalizar sua experiência</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div>
              <Label htmlFor="nome" className="text-white mb-2 block">Nome do Perfil</Label>
              <Input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                className="bg-gray-800/60 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-12 text-lg px-5"
                placeholder="Digite o nome do perfil"
                required
                autoFocus
              />
            </div>

            {/* Tipo */}
            <div>
              <Label className="text-white mb-2 block">Tipo de Perfil</Label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tipo"
                    value="principal"
                    checked={formData.tipo === "principal"}
                    onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as "principal" | "kids" }))}
                    className="text-blue-500"
                  />
                  <span className="text-white">Principal</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tipo"
                    value="kids"
                    checked={formData.tipo === "kids"}
                    onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as "principal" | "kids" }))}
                    className="text-blue-500"
                  />
                  <span className="text-white">Kids</span>
                </label>
              </div>
            </div>

            {/* Senha */}
            <div>
              <Label htmlFor="senha" className="text-white mb-2 block">Senha do Perfil</Label>
              <Input
                id="senha"
                type="password"
                value={formData.senha}
                onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
                className="bg-gray-800/60 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-12 text-lg px-5"
                placeholder="Digite uma senha para o perfil"
                required
              />
            </div>

            {/* Avatares */}
            <div>
              <Label className="text-white mb-4 block">Escolha um Avatar</Label>
              <div className="grid grid-cols-6 gap-4 max-h-48 overflow-y-auto">
                {avatars.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(avatar.id)
                      setFormData(prev => ({ ...prev, avatar_id: avatar.id }))
                    }}
                    className={`relative p-2 rounded-xl transition-all ${
                      selectedAvatar === avatar.id
                        ? 'bg-blue-500/20 border-2 border-blue-500'
                        : 'bg-gray-800/60 border-2 border-transparent hover:border-gray-600'
                    }`}
                  >
                    <AvatarImage
                      src={avatar.url}
                      alt={avatar.filename}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {selectedAvatar === avatar.id && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !formData.nome || !formData.senha || !formData.avatar_id}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Criando perfil...
                </div>
              ) : (
                "Criar Perfil"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
} 