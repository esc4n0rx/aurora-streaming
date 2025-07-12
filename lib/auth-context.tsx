"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User, Profile } from './types'
import { getToken, setToken, removeToken, validateToken } from './api'

interface AuthContextType {
  user: User | null
  profiles: Profile[]
  selectedProfile: Profile | null
  token: string | null
  isLoading: boolean
  login: (token: string, user: User, profiles: Profile[]) => void
  logout: () => void
  selectProfile: (profile: Profile) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há token salvo no localStorage
    const savedToken = getToken()
    if (savedToken) {
      setTokenState(savedToken)
      // Carregar dados do usuário e perfis se houver token
      loadUserData(savedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  const loadUserData = async (token: string) => {
    try {
      console.log('Carregando dados do usuário com token:', token)
      // Validar token e obter dados do usuário
      const response = await validateToken()
      if (response.success && response.data) {
        console.log('Dados carregados:', response.data)
        setUser(response.data.user)
        setProfiles(response.data.profiles)
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error)
      // Se houver erro, limpar token inválido
      removeToken()
      setTokenState(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = (newToken: string, userData: User, userProfiles: Profile[]) => {
    console.log('Login realizado:', { userData, userProfiles })
    setToken(newToken)
    setTokenState(newToken)
    setUser(userData)
    setProfiles(userProfiles)
  }

  const logout = () => {
    removeToken()
    setTokenState(null)
    setUser(null)
    setProfiles([])
    setSelectedProfile(null)
  }

  const selectProfile = (profile: Profile) => {
    setSelectedProfile(profile)
    // Salvar perfil selecionado no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedProfile', JSON.stringify(profile))
    }
  }

  const value: AuthContextType = {
    user,
    profiles,
    selectedProfile,
    token,
    isLoading,
    login,
    logout,
    selectProfile,
    isAuthenticated: !!token,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
} 