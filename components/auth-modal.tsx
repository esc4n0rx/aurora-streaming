"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { checkEmail, login, register } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import type { RegisterPayload } from "@/lib/types"

interface AuthModalProps {
  mode: "login" | "register"
  onClose: () => void
  onSwitchMode: (mode: "login" | "register") => void
}

export default function AuthModal({ mode, onClose, onSwitchMode }: AuthModalProps) {
  const router = useRouter()
  const { login: authLogin } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<"email" | "password" | "register">("email")
  const [emailExists, setEmailExists] = useState<boolean | null>(null)
  const [error, setError] = useState("")
  
  // Campos de registro
  const [registerData, setRegisterData] = useState<RegisterPayload>({
    nome: "",
    email: "",
    senha: "",
    data_nascimento: ""
  })

  // Verificar se email existe quando email mudar
  useEffect(() => {
    if (email && email.includes('@')) {
      const checkEmailExists = async () => {
        try {
          const response = await checkEmail({ email })
          setEmailExists(response.data?.exists || false)
          setError("")
        } catch (err) {
          console.error('Erro ao verificar email:', err)
          setError("Erro ao verificar email")
        }
      }
      
      const timeoutId = setTimeout(checkEmailExists, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [email])

  // Função para verificar email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setIsLoading(true)
    setError("")

    try {
      const response = await checkEmail({ email })
      const exists = response.data?.exists || false
      setEmailExists(exists)
      
      if (exists) {
        setStep("password")
      } else {
        setStep("register")
        setRegisterData(prev => ({ ...prev, email }))
      }
    } catch (err: any) {
      setError(err.message || "Erro ao verificar email")
    } finally {
      setIsLoading(false)
    }
  }

  // Função para login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setIsLoading(true)
    setError("")

    try {
      const response = await login({ email, senha: password })
      if (response.success && response.data) {
        authLogin(response.data.token, response.data.user, response.data.profiles)
        // Aguardar um pouco para garantir que o contexto seja atualizado
        await new Promise(resolve => setTimeout(resolve, 100))
        router.push("/profiles")
        onClose()
      }
    } catch (err: any) {
      setError(err.message || "Email ou senha inválidos")
    } finally {
      setIsLoading(false)
    }
  }

  // Função para registro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!registerData.nome || !registerData.email || !registerData.senha || !registerData.data_nascimento) return

    setIsLoading(true)
    setError("")

    try {
      const response = await register(registerData)
      if (response.success && response.data) {
        authLogin(response.data.token, response.data.user, response.data.profiles)
        // Aguardar um pouco para garantir que o contexto seja atualizado
        await new Promise(resolve => setTimeout(resolve, 100))
        router.push("/profiles")
        onClose()
      }
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta")
    } finally {
      setIsLoading(false)
    }
  }

  // Função para voltar ao passo anterior
  const handleBack = () => {
    if (step === "password" || step === "register") {
      setStep("email")
      setPassword("")
      setError("")
    }
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
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Botão voltar */}
          {step !== "email" && (
            <button
              onClick={handleBack}
              className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}

          {/* Logo */}
          <div className="flex flex-col items-center mb-6 mt-2">
            <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center mb-3">
              <span className="text-white text-2xl font-bold">A<span className="text-blue-500">+</span></span>
            </div>
            <span className="text-xs text-gray-400 font-semibold tracking-widest uppercase">Aurora+</span>
          </div>

          {/* Título e subtítulo */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
            {step === "email" && "Continue com o e-mail"}
            {step === "password" && "Digite sua senha"}
            {step === "register" && "Criar conta"}
          </h2>
          <p className="text-gray-300 text-base mb-6 text-center max-w-md">
            {step === "email" && "Você pode iniciar sessão se já tiver uma conta ou podemos ajudar você a criar uma."}
            {step === "password" && "Digite sua senha para acessar sua conta."}
            {step === "register" && "Preencha os dados para criar sua conta."}
          </p>

          {/* Erro */}
          {error && (
            <div className="w-full max-w-md mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Passo 1: Email */}
          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="w-full flex flex-col items-center gap-4 mb-6">
              <div className="w-full max-w-md">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800/60 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-12 w-full text-lg px-5"
                  placeholder="E-mail"
                  required
                  autoFocus
                />
                {emailExists !== null && email && (
                  <p className={`text-xs mt-2 ${emailExists ? 'text-green-400' : 'text-blue-400'}`}>
                    {emailExists ? '✓ Conta encontrada' : '✓ Criar nova conta'}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isLoading || !email || !email.includes('@')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg transition-all duration-300 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Verificando...
                  </div>
                ) : (
                  "Continuar"
                )}
              </Button>
            </form>
          )}

          {/* Passo 2: Senha (Login) */}
          {step === "password" && (
            <form onSubmit={handleLogin} className="w-full flex flex-col items-center gap-4 mb-6">
              <div className="w-full max-w-md">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800/60 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-12 w-full text-lg px-5 pr-12"
                  placeholder="Senha"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <Button
                type="submit"
                disabled={isLoading || !password}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg transition-all duration-300 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Entrando...
                  </div>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          )}

          {/* Passo 3: Registro */}
          {step === "register" && (
            <form onSubmit={handleRegister} className="w-full flex flex-col items-center gap-4 mb-6">
              <div className="w-full max-w-md space-y-4">
                <Input
                  id="nome"
                  type="text"
                  value={registerData.nome}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, nome: e.target.value }))}
                  className="bg-gray-800/60 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-12 w-full text-lg px-5"
                  placeholder="Nome completo"
                  required
                  autoFocus
                />
                <Input
                  id="data_nascimento"
                  type="date"
                  value={registerData.data_nascimento}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, data_nascimento: e.target.value }))}
                  className="bg-gray-800/60 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-12 w-full text-lg px-5"
                  required
                />
                <div className="relative">
                  <Input
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    value={registerData.senha}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, senha: e.target.value }))}
                    className="bg-gray-800/60 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-12 w-full text-lg px-5 pr-12"
                    placeholder="Senha"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading || !registerData.nome || !registerData.senha || !registerData.data_nascimento}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg transition-all duration-300 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Criando conta...
                  </div>
                ) : (
                  "Criar conta"
                )}
              </Button>
            </form>
          )}

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
