"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function UserProfile() {
  const { user, isAuthenticated, logout } = useAuth()

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
      <Avatar>
        <AvatarFallback>
          {user?.nome?.charAt(0)?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <h3 className="font-semibold text-white">{user?.nome}</h3>
        <p className="text-sm text-gray-400">{user?.email}</p>
      </div>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={logout}
        className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
      >
        Sair
      </Button>
    </div>
  )
} 