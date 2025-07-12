"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Edit3, Loader2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { listProfiles, deleteProfile } from "@/lib/api"
import type { Profile, Avatar } from "@/lib/types"
import AddProfileModal from "@/components/add-profile-modal"
import AuthLoading from "@/components/auth-loading"
import AvatarImage from "@/components/avatar-image"

export default function ProfileSelection() {
  const router = useRouter()
  const { selectProfile, isAuthenticated, isLoading } = useAuth()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState<string | null>(null)
  const [showRemoveModal, setShowRemoveModal] = useState<string | null>(null)
  const [deletingProfile, setDeletingProfile] = useState<string | null>(null)

  // Verificar se usuário está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
      return
    }
  }, [isAuthenticated, isLoading, router])

  // Carregar perfis
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await listProfiles()
        setProfiles(response.data)
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar perfis')
        console.error('Erro ao carregar perfis:', err)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      loadProfiles()
    }
  }, [isAuthenticated])

  const handleProfileSelect = (profile: Profile) => {
    selectProfile(profile)
    router.push("/dashboard")
  }

  const handleDeleteProfile = async (profileId: string) => {
    try {
      setDeletingProfile(profileId)
      await deleteProfile(profileId)
      setProfiles(prev => prev.filter(p => p.id !== profileId))
      setShowRemoveModal(null)
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir perfil')
    } finally {
      setDeletingProfile(null)
    }
  }

  const handleProfileCreated = () => {
    // Recarregar perfis após criar um novo
    const loadProfiles = async () => {
      try {
        const response = await listProfiles()
        setProfiles(response.data)
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar perfis')
      }
    }
    loadProfiles()
  }

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return <AuthLoading />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#18181b] to-[#23272f] text-white flex items-center justify-center p-6">
      <div className="max-w-5xl mx-auto text-center w-full">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-tight drop-shadow-lg">Quem está assistindo?</h1>
          <p className="text-gray-400 text-lg">Selecione ou gerencie seu perfil</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center mb-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            <span className="ml-2 text-gray-400">Carregando perfis...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-12 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Profiles Grid */}
        {!loading && !error && (
          <div className="flex flex-wrap justify-center gap-10 mb-12">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() => handleProfileSelect(profile)}
                className="group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl relative"
              >
                <div className="relative mb-4">
                  <div className="w-36 h-36 rounded-2xl overflow-hidden border-4 border-transparent group-hover:border-blue-400/60 transition-all duration-500 shadow-lg group-hover:shadow-blue-500/30 bg-gray-800">
                    <AvatarImage
                      src={profile.avatar_url}
                      alt={profile.nome}
                      width={144}
                      height={144}
                      className="w-full h-full object-cover"
                    />
                    {/* Edit Icon */}
                    <button
                      className="absolute top-2 right-2 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={e => { e.stopPropagation(); setShowEditModal(profile.id); }}
                      title="Editar perfil"
                    >
                      <Edit3 className="w-5 h-5 text-white" />
                    </button>
                    {/* Remove Icon */}
                    {profile.tipo !== "kids" && (
                      <button
                        className="absolute bottom-2 right-2 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={e => { e.stopPropagation(); setShowRemoveModal(profile.id); }}
                        title="Remover perfil"
                      >
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    )}
                  </div>
                  {profile.tipo === "kids" && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-medium shadow">KIDS</div>
                  )}
                </div>
                <h3 className="text-lg font-semibold group-hover:text-blue-400 transition-colors mb-1">{profile.nome}</h3>
              </div>
            ))}

            {/* Add Profile */}
            <div
              className="group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl flex flex-col items-center justify-center"
              onClick={() => setShowAddModal(true)}
            >
              <div className="w-36 h-36 rounded-2xl border-2 border-dashed border-gray-600 group-hover:border-blue-400/60 flex items-center justify-center mb-4 bg-gray-800 transition-all duration-500">
                <Plus className="w-10 h-10 text-gray-600 group-hover:text-blue-400 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 group-hover:text-blue-400 transition-colors">Adicionar Perfil</h3>
            </div>
          </div>
        )}

        {/* Manage Profiles */}
        <Button
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10 px-6 py-3 rounded-xl backdrop-blur-sm transition-all duration-300 bg-transparent"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Gerenciar Perfis
        </Button>
      </div>

      {/* Modais */}
      {showAddModal && (
        <AddProfileModal
          onClose={() => setShowAddModal(false)}
          onProfileCreated={handleProfileCreated}
        />
      )}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Editar Perfil</h2>
            <p className="text-gray-400 mb-6">Funcionalidade em breve.</p>
            <Button onClick={() => setShowEditModal(null)} className="w-full">Fechar</Button>
          </div>
        </div>
      )}
      {showRemoveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Remover Perfil</h2>
            <p className="text-gray-400 mb-6">Tem certeza que deseja remover este perfil? Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowRemoveModal(null)} 
                variant="outline" 
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                onClick={() => handleDeleteProfile(showRemoveModal)} 
                variant="destructive" 
                className="flex-1"
                disabled={deletingProfile === showRemoveModal}
              >
                {deletingProfile === showRemoveModal ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Removendo...
                  </>
                ) : (
                  'Remover'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
