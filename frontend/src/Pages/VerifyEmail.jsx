// src/pages/VerifyEmail.jsx
import { useEffect } from "react";
import  supabase from "../../lib/supabaseClient.js";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../store/ThemeContext.jsx"; 
import toast from "react-hot-toast";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const verifySession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        toast.error("Verification failed or expired.");
      } else {
        toast.success("Email verified successfully!");
        navigate("/profile"); // or wherever you want
      }
    };

    verifySession();
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme === "dark" ? "#111" : "#f8f9fa",
        color: theme === "dark" ? "#fff" : "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.2rem",
      }}
    >
      Verifying email...
    </div>
  );
}
