# Aurora+ Streaming - Sistema de Autenticação

## Visão Geral

Este projeto implementa um sistema completo de autenticação para a plataforma Aurora+ Streaming, seguindo a documentação da API fornecida.

## Estrutura do Sistema

### 1. Tipos (`lib/types.ts`)
- `User`: Interface para dados do usuário
- `Profile`: Interface para perfis do usuário
- `AuthResponse`: Resposta da API de autenticação
- `LoginPayload`, `RegisterPayload`: Payloads para login e registro

### 2. API (`lib/api.ts`)
- `checkEmail()`: Verifica se email existe
- `login()`: Realiza login do usuário
- `register()`: Registra novo usuário
- `getToken()`, `setToken()`, `removeToken()`: Gerenciamento de token
- `isAuthenticated()`: Verifica se usuário está autenticado

### 3. Contexto de Autenticação (`lib/auth-context.tsx`)
- `AuthProvider`: Provider do contexto
- `useAuth()`: Hook para acessar dados de autenticação
- Gerenciamento de estado: user, profiles, token, isLoading

### 4. Modal de Autenticação (`components/auth-modal.tsx`)
- Fluxo em 3 passos: email → senha/registro
- Verificação automática de email
- Interface responsiva e moderna
- Tratamento de erros

### 5. Hook do Modal (`hooks/use-auth-modal.tsx`)
- `useAuthModal()`: Hook para gerenciar estado do modal
- Controle de abertura/fechamento e modo (login/register)

## Fluxo de Autenticação

### 1. Verificação de Email
```typescript
// Usuário digita email
// Sistema verifica automaticamente se existe
// Se existe → vai para senha
// Se não existe → vai para registro
```

### 2. Login
```typescript
// Usuário digita senha
// Sistema faz login via API
// Salva token no localStorage
// Redireciona para /profiles
```

### 3. Registro
```typescript
// Usuário preenche dados
// Sistema cria conta via API
// Salva token no localStorage
// Redireciona para /profiles
```

## Como Usar

### 1. Configurar AuthProvider
```tsx
// app/layout.tsx
import { AuthProvider } from '@/lib/auth-context'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

### 2. Usar o Modal de Autenticação
```tsx
import { useAuthModal } from '@/hooks/use-auth-modal'

function MyComponent() {
  const { openModal } = useAuthModal()
  
  return (
    <button onClick={() => openModal('login')}>
      Entrar
    </button>
  )
}
```

### 3. Verificar Autenticação
```tsx
import { useAuth } from '@/lib/auth-context'

function MyComponent() {
  const { isAuthenticated, user, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <div>Faça login para continuar</div>
  }
  
  return (
    <div>
      <p>Olá, {user?.nome}!</p>
      <button onClick={logout}>Sair</button>
    </div>
  )
}
```

## API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### Autenticação
- `POST /auth/check-email` - Verificar se email existe
- `POST /auth/login` - Login do usuário
- `POST /auth/register` - Registro de novo usuário

### Perfis
- `GET /profiles` - Listar perfis do usuário
- `GET /profiles/{profileId}` - Obter perfil por ID
- `POST /profiles` - Criar novo perfil
- `PUT /profiles/{profileId}` - Atualizar perfil
- `DELETE /profiles/{profileId}` - Excluir perfil
- `PUT /profiles/{profileId}/avatar` - Atualizar avatar do perfil
- `POST /profiles/authenticate` - Autenticar perfil com senha
- `GET /profiles/avatars` - Listar avatares disponíveis

## Configuração

1. Certifique-se de que o backend está rodando em `http://localhost:3000`
2. O sistema salva o token JWT no localStorage como `aurora_token`
3. O contexto de autenticação é inicializado automaticamente

## Recursos

### Autenticação
- ✅ Verificação automática de email
- ✅ Fluxo de login/registro intuitivo
- ✅ Gerenciamento de estado global
- ✅ Tratamento de erros
- ✅ Interface responsiva
- ✅ Persistência de sessão
- ✅ Tipagem TypeScript completa

### Perfis
- ✅ Listagem de perfis do usuário
- ✅ Criação de novos perfis
- ✅ Seleção de avatares
- ✅ Exclusão de perfis
- ✅ Diferenciação entre perfis principais e kids
- ✅ Autenticação de perfil com senha
- ✅ Interface moderna e responsiva 