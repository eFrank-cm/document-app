import { create } from "zustand";
import { User } from "../types";
import { persist } from "zustand/middleware";

interface State {
    user: User | null
    login: (user: User) => void
    logout: () => void
}

export const useUserStore = create<State>()(
    persist(
        (set) => ({
            user: null,
            login: (user) => set({ user }),
            logout: () => set({ user: null })
        })
        , {
            name: '__session__'
        }
    )
)