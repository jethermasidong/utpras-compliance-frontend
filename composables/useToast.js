import { inject } from 'vue';

export function useToast() {
  const toasts = inject('toasts'); 

  const showToast = (type, title, message) => {
    const id = Date.now();
    toasts.value.push({ id, type, title, message });
    
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id);
    }, 3000);
  };

  return { showToast };
}