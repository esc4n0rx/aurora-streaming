"use client"

import { useState } from 'react'

export function useAuthModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<"login" | "register">("login")

  const openModal = (modalMode: "login" | "register" = "login") => {
    setMode(modalMode)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode)
  }

  return {
    isOpen,
    mode,
    openModal,
    closeModal,
    switchMode,
  }
} 