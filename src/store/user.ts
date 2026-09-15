import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfile {
  name: string
  phone: string
  isLoggedIn: boolean
  setUserProfile: (name: string, phone: string) => void
  logout: () => void
}

export const useUserStore = create<UserProfile>()(
  persist(
    (set) => ({
      name: '',
      phone: '',
      isLoggedIn: false,
      setUserProfile: (name: string, phone: string) =>
        set({
          name: name.trim(),
          phone: phone.trim().replace(/\D/g, '').slice(0, 10),
          isLoggedIn: true,
        }),
      logout: () =>
        set({
          name: '',
          phone: '',
          isLoggedIn: false,
        }),
    }),
    {
      name: 'underground_cafe_user_v1',
    }
  )
)
