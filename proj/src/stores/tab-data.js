import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useTabDataStore = create (persist((set) => ({

    tab: 'dashboard',
    setTab: (newTab) => set({ tab: newTab }),
}), 

{
    name: 'tab-data-storage', // unique name
    
}))