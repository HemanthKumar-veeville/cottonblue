import toast from 'react-hot-toast';

interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  icon?: null;
}

const useToast = () => {
  const defaultOptions: ToastOptions = {
    duration: 3000,
    position: 'top-right',
  };

  const showSuccess = (message: string, options?: ToastOptions) => {
    toast.success(message, { ...defaultOptions, ...options });
  };

  const showError = (message: string, options?: ToastOptions) => {
    toast.error(message, { ...defaultOptions, icon: null, ...options });
  };

  const showLoading = (message: string, options?: ToastOptions) => {
    return toast.loading(message, { ...defaultOptions, ...options });
  };

  const showPromise = <T>(
    promise: Promise<T>,
    {
      loading = 'Loading...',
      success = 'Success!',
      error = 'Error occurred',
    } = {},
    options?: ToastOptions
  ) => {
    return toast.promise(
      promise,
      {
        loading,
        success,
        error,
      },
      { ...defaultOptions, ...options }
    );
  };

  const dismiss = (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  return {
    showSuccess,
    showError,
    showLoading,
    showPromise,
    dismiss,
  };
};

export default useToast; 