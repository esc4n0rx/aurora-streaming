// Configurações da aplicação
export const config = {
  // URLs do backend
  API_BASE_URL: 'http://localhost:3000/api/v1',
  BACKEND_BASE_URL: 'http://localhost:3000',
  
  // URLs do frontend
  FRONTEND_BASE_URL: 'http://localhost:3001',
  
  // Configurações de autenticação
  TOKEN_KEY: 'aurora_token',
  SELECTED_PROFILE_KEY: 'selectedProfile',
  
  // Configurações de imagens
  DEFAULT_AVATAR: '/placeholder.svg',
  AVATAR_PATH: '/assets/avatars/',
} as const

// Função para obter URL completa de avatar
export function getAvatarUrl(path: string): string {
  if (!path) return config.DEFAULT_AVATAR
  
  // Se já é uma URL completa, retornar como está
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // Se é um caminho relativo, adicionar o backend base URL
  if (path.startsWith('/')) {
    return `${config.BACKEND_BASE_URL}${path}`
  }
  
  // Se não tem barra, adicionar o caminho padrão
  return `${config.BACKEND_BASE_URL}${config.AVATAR_PATH}${path}`
} 