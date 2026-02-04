import { create } from "zustand"
import { persist } from "zustand/middleware"

interface LoggedInUserState {
  loggedInUser: boolean
  setLoggedInUser: (loggedIn: boolean) => void
}

const useLoggedInUserStore = create<LoggedInUserState>()(
  persist(
    (set) => ({
      loggedInUser: false,
      setLoggedInUser: (loggedIn: boolean) => {
        set({ loggedInUser: loggedIn })
      },
    }),
    {
      name: "fundilink-logged-in-user",
      partialize: (state) => ({
        loggedInUser: state.loggedInUser,
      }),
    },
  ),
)

export default useLoggedInUserStore
