import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(() => sessionStorage.getItem('user_id') || null)

  const saveUserId = (id) => {
    setUserId(id)
    sessionStorage.setItem('user_id', id)
  }

  const clearUser = () => {
    setUserId(null)
    sessionStorage.removeItem('user_id')
  }

  return (
    <AuthContext.Provider value={{ userId, saveUserId, clearUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
