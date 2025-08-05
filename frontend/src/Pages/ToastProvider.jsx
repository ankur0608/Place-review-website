// ToastProvider.jsx
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

export const useToast = () => {
  const showToast = (message, type = "default") => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      default:
        toast(message);
    }
  };
  return { showToast };
};

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#333",
          color: "#fff",
        },
        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />
  );
};

export default ToastProvider;
