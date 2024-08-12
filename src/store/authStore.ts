import { create } from "zustand";
import { Role, User } from "../types";
import { persist } from "zustand/middleware";
import { supabase } from "../services/client";

interface AuthState {
    user: User | null
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            login: async (email, password) => {
                const { data: { user, session }, error } = await supabase.auth.signInWithPassword({ email, password })
                if (error) console.log('email pass error', error)

                if (session && user) {
                    const { data, error: err } = await supabase.from('roles').select('role').eq('user_id', user.id)
                    if (err) console.log(err)
                    else {
                        set({
                            user: {
                                id: user.id,
                                email: user.email ? user.email : ':without email',
                                token: session.access_token,
                                role: data[0].role as Role
                            }
                        })
                    }

                }
            },
            logout: async () => {
                const { error } = await supabase.auth.signOut()
                if (error) throw error
                set({ user: null })
            }
        })
        , {
            name: 'auth-storage'
        }
    )
)