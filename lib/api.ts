import type { 
  AuthResponse, 
  CheckEmailResponse, 
  LoginPayload, 
  RegisterPayload, 
  CheckEmailPayload,
  ProfilesResponse,
  ProfileResponse,
  AvatarsResponse,
  CreateProfilePayload,
  UpdateProfilePayload,
  AuthenticateProfilePayload,
  UpdateAvatarPayload,
  ContentListResponse,
  ContentResponse,
  PopularContentResponse,
  RecordViewPayload,
  RecordViewResponse
} from './types'
import { config, getAvatarUrl } from './config'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${config.API_BASE_URL}${endpoint}`
  
  const requestConfig: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, requestConfig)
  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(response.status, data.message || 'Erro na requisição')
  }

  return data
}

// Função para verificar se email existe
export async function checkEmail(payload: CheckEmailPayload): Promise<CheckEmailResponse> {
  return apiRequest<CheckEmailResponse>('/auth/check-email', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// Função para login
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// Função para registro
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// Função para obter token do localStorage
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('aurora_token')
  }
  return null
}

// Função para salvar token no localStorage
export function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('aurora_token', token)
  }
}

// Função para remover token do localStorage
export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('aurora_token')
  }
}

// Função para verificar se usuário está autenticado
export function isAuthenticated(): boolean {
  return getToken() !== null
}

// Função para obter headers com token de autenticação
function getAuthHeaders(): HeadersInit {
  const token = getToken()
  console.log('Token obtido:', token ? 'Presente' : 'Ausente')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

// ===== FUNÇÕES DE PERFIS =====

// Listar perfis do usuário
export async function listProfiles(): Promise<ProfilesResponse> {
  return apiRequest<ProfilesResponse>('/profiles', {
    method: 'GET',
    headers: getAuthHeaders(),
  })
}

// Obter perfil por ID
export async function getProfile(profileId: string): Promise<ProfileResponse> {
  return apiRequest<ProfileResponse>(`/profiles/${profileId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
}

// Criar novo perfil
export async function createProfile(payload: CreateProfilePayload): Promise<ProfileResponse> {
  return apiRequest<ProfileResponse>('/profiles', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })
}

// Atualizar perfil
export async function updateProfile(profileId: string, payload: UpdateProfilePayload): Promise<ProfileResponse> {
  return apiRequest<ProfileResponse>(`/profiles/${profileId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })
}

// Excluir perfil
export async function deleteProfile(profileId: string): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(`/profiles/${profileId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
}

// Atualizar avatar do perfil
export async function updateProfileAvatar(profileId: string, payload: UpdateAvatarPayload): Promise<ProfileResponse> {
  return apiRequest<ProfileResponse>(`/profiles/${profileId}/avatar`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })
}

// Autenticar perfil com senha
export async function authenticateProfile(payload: AuthenticateProfilePayload): Promise<ProfileResponse> {
  return apiRequest<ProfileResponse>('/profiles/authenticate', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })
}

// Listar avatares disponíveis
export async function getAvatars(category?: string): Promise<AvatarsResponse> {
  const url = category ? `/profiles/avatars?category=${category}` : '/profiles/avatars'
  return apiRequest<AvatarsResponse>(url, {
    method: 'GET',
  })
}

// Validar token e obter dados do usuário
export async function validateToken(): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/validate', {
    method: 'GET',
    headers: getAuthHeaders(),
  })
}

// ===== FUNÇÕES DE CONTEÚDO =====

// Listar conteúdos com filtros
export async function listContents(params?: {
  categoria?: string
  subcategoria?: string
  ativo?: boolean
  rating_min?: number
  rating_max?: number
  temporada?: number
  limit?: number
  offset?: number
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}): Promise<ContentListResponse> {
  const queryParams = new URLSearchParams()
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString())
      }
    })
  }
  
  const url = queryParams.toString() ? `/contents?${queryParams.toString()}` : '/contents'
  
  return apiRequest<ContentListResponse>(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
}

// Obter conteúdo por ID
export async function getContent(contentId: string): Promise<ContentResponse> {
  return apiRequest<ContentResponse>(`/contents/${contentId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
}

// Obter conteúdos populares
export async function getPopularContents(limit?: number): Promise<PopularContentResponse> {
  const url = limit ? `/contents/popular?limit=${limit}` : '/contents/popular'
  
  return apiRequest<PopularContentResponse>(url, {
    method: 'GET',
  })
}

// Obter episódios de uma série
export async function getSeriesEpisodes(seriesName: string, season?: number): Promise<ContentListResponse> {
  const url = season ? `/contents/series/${seriesName}/episodes?season=${season}` : `/contents/series/${seriesName}/episodes`
  
  return apiRequest<ContentListResponse>(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
}

// Registrar visualização de conteúdo
export async function recordContentView(contentId: string, payload: RecordViewPayload): Promise<RecordViewResponse> {
  return apiRequest<RecordViewResponse>(`/contents/${contentId}/view`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })
}

// Obter URL do stream para reprodução (versão alternativa)
export async function getStreamUrlAlternative(contentId: string): Promise<{ success: boolean; message: string; data: { streamUrl: string } }> {
  const token = getToken()
  if (!token) {
    throw new ApiError(401, 'Token de autenticação não encontrado')
  }

  // Construir a URL do stream diretamente baseada no padrão do backend
  const streamUrl = `${config.BACKEND_BASE_URL}/api/v1/stream/8fa41ddc0e3843a3d694b7160889159e49727c6f/video`
  
  console.log('URL do stream construída:', streamUrl)
  
  return {
    success: true,
    message: 'Stream URL construída com base no padrão do backend',
    data: { streamUrl }
  }
}

// Obter URL do stream para reprodução
export async function getStreamUrl(contentId: string): Promise<{ success: boolean; message: string; data: { streamUrl: string } }> {
  const url = `${config.API_BASE_URL}/stream/content/${contentId}/play`
  console.log('Fazendo requisição para:', url)
  
  const headers = getAuthHeaders()
  console.log('Headers de autenticação:', headers)
  
  const requestConfig: RequestInit = {
    method: 'GET',
    headers,
    redirect: 'manual', // Não seguir redirecionamentos automaticamente
    mode: 'cors', // Adicionar modo CORS explícito
  }

  try {
    const response = await fetch(url, requestConfig)
    console.log('Status da resposta:', response.status)
    console.log('Headers da resposta:', Object.fromEntries(response.headers.entries()))
    
    // Se for um redirecionamento 302, pegar a URL do header Location
    if (response.status === 302) {
      const location = response.headers.get('Location')
      console.log('Location header:', location)
      if (location) {
        // Se a URL for relativa, adicionar o base URL
        const streamUrl = location.startsWith('http') ? location : `${config.BACKEND_BASE_URL}${location}`
        console.log('URL final do stream:', streamUrl)
        
        return {
          success: true,
          message: 'Stream URL obtida com sucesso',
          data: { streamUrl }
        }
      }
    }

    // Se for 200, tentar ler como JSON
    if (response.status === 200) {
      try {
        const data = await response.json()
        console.log('Dados da resposta JSON:', data)
        
        if (data.success && data.data && data.data.streamUrl) {
          return data
        } else {
          throw new ApiError(400, 'Resposta inválida do servidor')
        }
      } catch (error) {
        console.error('Erro ao processar resposta JSON:', error)
        throw new ApiError(response.status, 'Erro ao processar resposta do servidor')
      }
    }

    // Se não for redirecionamento nem 200, tentar ler como JSON para erro
    try {
      const data = await response.json()
      console.log('Dados da resposta de erro:', data)
      throw new ApiError(response.status, data.message || 'Erro na requisição')
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      console.error('Erro ao processar resposta:', error)
      throw new ApiError(response.status, 'Erro ao processar resposta do servidor')
    }
  } catch (error) {
    // Se for erro de rede (status 0), tentar uma abordagem diferente
    if (error instanceof TypeError || (error as any).message?.includes('Failed to fetch')) {
      console.error('Erro de rede detectado:', error)
      
      // Tentar fazer a requisição sem CORS para obter a URL de redirecionamento
      try {
        const authHeader = typeof headers === 'object' && 'Authorization' in headers 
          ? headers.Authorization 
          : Array.isArray(headers) 
            ? headers.find(([key]) => key === 'Authorization')?.[1] 
            : '';
            
        const simpleResponse = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': authHeader || '',
          },
          redirect: 'manual',
        })
        
        if (simpleResponse.status === 302) {
          const location = simpleResponse.headers.get('Location')
          if (location) {
            const streamUrl = location.startsWith('http') ? location : `${config.BACKEND_BASE_URL}${location}`
            console.log('URL do stream obtida via fallback:', streamUrl)
            return {
              success: true,
              message: 'Stream URL obtida com sucesso (fallback)',
              data: { streamUrl }
            }
          }
        }
      } catch (fallbackError) {
        console.error('Erro no fallback:', fallbackError)
      }
      
      throw new ApiError(0, 'Erro de conexão com o servidor. Verifique se o backend está rodando.')
    }
    
    throw error
  }
}

// Função para corrigir URLs de avatares (mantida para compatibilidade)
export function fixAvatarUrl(url: string): string {
  return getAvatarUrl(url)
} 