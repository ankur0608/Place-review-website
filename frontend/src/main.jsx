import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { ThemeProvider } from "./store/ThemeContext.jsx";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import ToastProvider from "./Pages/ToastProvider.jsx";
const queryClient = new QueryClient();
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConvexProvider client={convex}>
        <ToastProvider />
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ConvexProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
