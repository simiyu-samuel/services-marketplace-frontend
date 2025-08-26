import { toast } from "sonner";

export const showSuccess = (message: string) => {
  toast.success(message);
};

export const showError = (message: string) => {
  toast.error(message);
};

export const showLoading = (message: string) => {
  return toast.loading(message);
};

export const updateToast = (toastId: string | number, options: { type: 'success' | 'error', message: string }) => {
  if (options.type === 'success') {
    toast.success(options.message, { id: toastId });
  } else {
    toast.error(options.message, { id: toastId });
  }
};

export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};
