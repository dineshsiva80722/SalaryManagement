"use client"

import { useState, useEffect } from "react"
import { AuthContext } from "@/lib/auth-context"

interface User {
  id: string
  username: string
  role: "superadmin" | "admin" | "lecturer"
}

interface MockUser extends User {
  password: string
}

const mockAuth = {
  login: async (username: string, password: string): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const users: MockUser[] = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u) => u.username === username && u.password === password)
    if (user) {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    }
    throw new Error("Invalid username or password")
  },
  logout: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // Initialize mock users if they don't exist
    const existingUsers = localStorage.getItem("users")
    if (!existingUsers) {
      const initialUsers: MockUser[] = [
        { id: "1", username: "superadmin", password: "superadmin123", role: "superadmin" },
        { id: "2", username: "admin", password: "admin123", role: "admin" },
        { id: "3", username: "lecturer", password: "lecturer123", role: "lecturer" },
      ]
      localStorage.setItem("users", JSON.stringify(initialUsers))
    }
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const user = await mockAuth.login(username, password)
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
    } catch (error) {
      console.error("Login error:", error)
      throw error instanceof Error ? error : new Error("An unexpected error occurred during login")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    mockAuth.logout()
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

