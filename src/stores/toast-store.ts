import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

interface ToastStore {
  message: string;
  type: ToastType;
  visible: boolean;
  show: (message: string, type?: ToastType) => void;
  hide: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  message: '',
  type: 'info',
  visible: false,
  show: (message, type = 'info') => set({ message, type, visible: true }),
  hide: () => set({ visible: false }),
}));

export function useToast() {
  const show = useToastStore((s) => s.show);
  return {
    toast: (message: string, type?: ToastType) => show(message, type),
  };
}
