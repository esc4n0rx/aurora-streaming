export interface User {
  id: string
  nome: string
  email: string
  data_nascimento: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  user_id: string
  nome: string
  tipo: "principal" | "kids"
  avatar_id: string
  avatar_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Avatar {
  id: string
  filename: string
  url: string
  category: "all" | "kids" | "principal" | "general"
  isDefault: boolean
}

export interface CreateProfilePayload {
  nome: string
  tipo: "principal" | "kids"
  senha: string
  avatar_id: string
}

export interface UpdateProfilePayload {
  nome?: string
  senha?: string
  avatar_id?: string
}

export interface AuthenticateProfilePayload {
  profileId: string
  senha: string
}

export interface UpdateAvatarPayload {
  avatar_id: string
}

export interface ProfilesResponse {
  success: boolean
  message: string
  data: Profile[]
}

export interface ProfileResponse {
  success: boolean
  message: string
  data: Profile
}

export interface AvatarsResponse {
  success: boolean
  message: string
  data: Avatar[]
}

// ===== TIPOS DE CONTEÚDO =====

export interface ContentMetadata {
  descricao: string
  duracao: number
  ano_lancamento: number
  diretor: string
  elenco?: string[]
  idade_recomendada?: string
}

export interface Content {
  id: string
  nome: string
  url_transmissao?: string
  poster: string
  categoria: string
  subcategoria: string
  ativo: boolean
  temporada?: number
  episodio?: number
  rating: number
  total_visualizations: number
  qualidades: string[]
  metadata: ContentMetadata
  created_at: string
  updated_at: string
  is_series: boolean
  view_count: number
}

export interface ContentListResponse {
  success: boolean
  message: string
  data: Content[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

export interface ContentResponse {
  success: boolean
  message: string
  data: Content
}

export interface PopularContentResponse {
  success: boolean
  message: string
  data: Content[]
}

export interface RecordViewPayload {
  user_id: string
  profile_id: string
  view_duration: number
  view_percentage: number
}

export interface RecordViewResponse {
  success: boolean
  message: string
  data: {
    id: string
    content_id: string
    user_id: string
    profile_id: string
    ip_address: string
    view_duration: number
    view_percentage: number
    created_at: string
  }
}

export interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user: User
    profiles: Profile[]
    token: string
  }
}

export interface CheckEmailResponse {
  success: boolean
  message: string
  data?: {
    exists: boolean
  }
}

export interface LoginPayload {
  email: string
  senha: string
}

export interface RegisterPayload {
  nome: string
  email: string
  senha: string
  data_nascimento: string
}

export interface CheckEmailPayload {
  email: string
} 