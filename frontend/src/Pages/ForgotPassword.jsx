import { useState } from "react";
import supabase from "../../lib/supabaseClient";
import {
  Box,
  Typography,
  TextField,
  Button,
  useTheme as useMUITheme,
} from "@mui/material";
import toast from "react-hot-toast";
import { useTheme } from "../store/ThemeContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const { theme } = useTheme(); 
  const muiTheme = useMUITheme();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error("Failed to send reset link.");
      console.error(error);
    } else {
      toast.success("Password reset email sent!");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme === "dark" ? "#121212" : "#f4f4f4",
        color: theme === "dark" ? "#fff" : "#111",
        transition: "all 0.3s ease",
      }}
    >
      <Box
        component="form"
        onSubmit={handleForgotPassword}
        sx={{
          backgroundColor: theme === "dark" ? "#1e1e1e" : "#fff",
          padding: 4,
          borderRadius: 2,
          boxShadow: 4,
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Forgot Password
        </Typography>

        <TextField
          type="email"
          label="Email Address"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          InputLabelProps={{
            style: { color: theme === "dark" ? "#ccc" : "#333" },
          }}
          InputProps={{
            style: {
              color: theme === "dark" ? "#fff" : "#000",
              background: theme === "dark" ? "#2a2a2a" : "#fafafa",
            },
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Send Reset Link
        </Button>
      </Box>
    </Box>
  );
}
