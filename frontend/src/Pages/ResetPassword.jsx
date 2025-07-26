import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const { theme } = useTheme(); // Your custom theme context
  const muiTheme = useMUITheme(); // MUI theme

  const handleReset = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      toast.error("Failed to update password.");
      console.error(error);
    } else {
      toast.success("Password updated!");
      setTimeout(() => navigate("/login"), 1500);
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
        onSubmit={handleReset}
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
          Reset Password
        </Typography>

        <TextField
          type="password"
          label="New Password"
          fullWidth
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
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
          Update Password
        </Button>
      </Box>
    </Box>
  );
}
