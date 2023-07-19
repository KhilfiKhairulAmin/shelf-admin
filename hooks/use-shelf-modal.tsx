import { create } from "zustand"

interface IUseShelfModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useShelfModal = create<IUseShelfModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}))
