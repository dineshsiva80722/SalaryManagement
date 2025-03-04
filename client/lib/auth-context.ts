import { createContext, useContext } from "react"

type User = {
  id: string
  username: string
  role: "superadmin" | "admin" | "lecturer"
}

type AuthContextType = {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

