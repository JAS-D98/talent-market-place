"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface AppState {
  isGuest: boolean
  user: {
    name?: string
    phone?: string
    isVerified?: boolean
  } | null
  currentBooking: any
  searchQuery: string
  selectedCategory: string | null
}

interface AppContextType {
  state: AppState
  setState: (updates: Partial<AppState>) => void
  setUser: (user: AppState["user"]) => void
  setBooking: (booking: any) => void
  setSearch: (query: string, category?: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function Providers({ children }: { children: ReactNode }) {
  const [state, setStateInternal] = useState<AppState>({
    isGuest: true,
    user: null,
    currentBooking: null,
    searchQuery: "",
    selectedCategory: null,
  })

  const setState = (updates: Partial<AppState>) => {
    setStateInternal((prev) => ({ ...prev, ...updates }))
  }

  const setUser = (user: AppState["user"]) => {
    setState({ user, isGuest: !user })
  }

  const setBooking = (booking: any) => {
    setState({ currentBooking: booking })
  }

  const setSearch = (query: string, category?: string) => {
    setState({
      searchQuery: query,
      selectedCategory: category || null,
    })
  }

  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        setUser,
        setBooking,
        setSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within a Providers component")
  }
  return context
}
