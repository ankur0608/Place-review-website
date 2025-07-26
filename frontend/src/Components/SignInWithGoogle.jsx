// SignInWithGoogle.jsx

import { Button, Box, Typography } from "@mui/material";
import supabase from "../../lib/supabaseClient";
import GoogleLogo from "../assets/google.png"; 

const SignInWithGoogle = () => {
  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error("Google Sign-In Error:", error.message);
      alert("Google Sign-In failed. Please try again.");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
    >
      <Typography variant="h6" gutterBottom>
        Sign in to your account
      </Typography>

      <Button
        onClick={handleGoogleSignIn}
        variant="contained"
        sx={{
          backgroundColor: "#ffffff",
          color: "#000",
          textTransform: "none",
          fontWeight: "bold",
          border: "1px solid #ccc",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
        }}
      >
        <img
          src={GoogleLogo}
          alt="Google logo"
          style={{ width: 20, height: 20 }}
        />
        Sign in with Google
      </Button>
    </Box>
  );
};

export default SignInWithGoogle;
