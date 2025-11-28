import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const url = import.meta.env.VITE_API_URL;

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      loading: false,

      // set user data
      setUser: (user) => set({ user }),

      // login
      login: async (email, password) => {
        set({ loading: true })
        try {
          const res = await axios.post(
            `${url}/api/auth/login`,
            { email, password },
            { withCredentials: true } 
          )

          set({ user: res.data.user, loading: false })

          return res.data
        } catch (err) {
          set({ loading: false })
          throw err
        }
      },

      // logout
      logout: async () => {
        set({ loading: true })
        try {
          await axios.post(`${url}/api/auth/logout`, {}, { withCredentials: true })

          set({ user: null, loading: false })
        } catch (err) {
          set({ loading: false })
          throw err
        }
      },

      // Init user
      fetchUser: async () => {
        set({ loading: true })
        try {
          const res = await axios.get(`${url}/api/user`, {
            withCredentials: true
          })

          set({ user: res.data.user || null, loading: false })
        } catch (err) {
          set({ user: null, loading: false })
        }
      }
    }),

    {
      name: 'user-store' // localStorage key
      // partialize: (state) => ({ user: state.user }) 
    }
  )
)
