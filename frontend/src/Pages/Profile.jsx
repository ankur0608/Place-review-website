import { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Box,
  TextField,
  useTheme,
} from "@mui/material";
import supabase from "../../lib/supabaseClient";
import userLogo from "../assets/user.png";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", avatar: "" });
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    async function fetchUserData() {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData?.user) {
        console.error("Auth error:", authError);
        return;
      }

      const user = authData.user;
      const googleUser = user.app_metadata?.provider === "google";
      setIsGoogleUser(googleUser);

      const { data, error } = await supabase
        .from("profiles")
        .select("name, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("DB fetch error:", error.message);
      }

      const name =
        data?.name ||
        user.user_metadata.full_name ||
        user.user_metadata.name ||
        "User";

      const avatar =
        data?.avatar_url ||
        user.user_metadata.avatar_url ||
        user.user_metadata.picture ||
        userLogo;

      setUserData({
        id: user.id,
        email: user.email,
        name,
        avatar,
      });

      setForm({
        name,
        email: user.email,
        avatar,
      });
    }

    fetchUserData();
  }, []);

  const handleEditToggle = () => setIsEditing((prev) => !prev);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (isGoogleUser) {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: form.name,
          avatar_url: form.avatar,
        },
      });

      if (error) {
        console.error("Google update failed:", error);
        return;
      }

      // Update profile table too for consistency
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: userData.id,
        name: form.name,
        avatar_url: form.avatar,
      });

      if (profileError) console.error("Profile update failed:", profileError);
    } else {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: form.name,
          avatar_url: form.avatar,
        })
        .eq("id", userData.id);

      if (error) {
        console.error("Update failed:", error);
        return;
      }
    }

    setUserData({
      ...userData,
      name: form.name,
      email: form.email,
      avatar: form.avatar,
    });

    setIsEditing(false);
  };

  const handleBack = () => {
    navigate("/");
  };

  if (!userData) {
    return (
      <Typography sx={{ mt: 4, textAlign: "center" }}>Loading...</Typography>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Card
        sx={{
          padding: 3,
          backgroundColor:
            theme.palette.mode === "dark" ? "#1e1e1e" : "#f8f8f8",
        }}
      >
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar
              src={isEditing ? form.avatar : userData.avatar}
              sx={{ width: 100, height: 100, mb: 2 }}
            />

            {isEditing ? (
              <>
                <TextField
                  label="Name"
                  name="name"
                  fullWidth
                  margin="dense"
                  value={form.name}
                  onChange={handleChange}
                />
                <TextField
                  label="Email"
                  name="email"
                  fullWidth
                  margin="dense"
                  value={form.email}
                  onChange={handleChange}
                  disabled
                />
                <TextField
                  label="Avatar URL"
                  name="avatar"
                  fullWidth
                  margin="dense"
                  value={form.avatar}
                  onChange={handleChange}
                />
              </>
            ) : (
              <>
                <Typography variant="h6">{userData.name}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {userData.email}
                </Typography>
              </>
            )}

            <Box display="flex" gap={2} mt={2}>
              {isEditing ? (
                <>
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleSave}>
                    Save
                  </Button>
                </>
              ) : (
                <div>
                  <Button
                    variant="contained"
                    onClick={handleBack}
                    sx={{ mr: 2 }}
                    color="primary"
                  >
                    Back to Home
                  </Button>
                  <Button variant="contained" onClick={handleEditToggle}>
                    Edit Profile
                  </Button>
                </div>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
