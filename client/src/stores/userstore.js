import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from '../config/axios.js'

const url = import.meta.env.VITE_API_URL

export const useUserStore = create(
  persist(
    (set) => ({

      user: null,
      loading: false,
      hydrated: false, 

     
      setUser: (user) => set({ user }),

     
      login: async (email, password, remember = false) => {
        set({ loading: true })

        try {
          const res = await axios.post(
            `${url}/api/auth/login`,
            { email, password, remember },
            { withCredentials: true }
          )

          
          set({ user: res.data.user, loading: false })

          return res.data
        } catch (err) {
          set({ loading: false })
          throw err
        }
      },

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

  
      fetchUser: async () => {
        try {
          const res = await axios.get(`${url}/api/auth/user`, { withCredentials: true })

       
          set({ user: res.data.user || null })
        } catch (err) {
          set({ user: null })
        } finally {
          set({ hydrated: true }) 
        }
      }
    }),

    {
      name: 'user-store',

    
      partialize: (state) => ({
        hydrated: state.hydrated
      })
    }
  )
)
