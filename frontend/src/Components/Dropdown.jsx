import { useState, useEffect } from "react";
import {
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import userLight from "../../src/assets/user.png";
import userDark from "../assets/user1.png";
import { useTheme } from "../store/ThemeContext";
import supabase from "../../lib/supabaseClient";

export default function AvatarDropdown() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("token");
    handleClose();
    navigate("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUserInfo(data.user);
      }
    };
    fetchUser();
  }, []);

  const storedAvatar = localStorage.getItem("image");
  const avatar =
    userInfo?.user_metadata?.avatar_url ||
    storedAvatar ||
    (theme === "dark" ? userDark : userLight);

  const displayName =
    userInfo?.user_metadata?.full_name ||
    userInfo?.user_metadata?.name ||
    userInfo?.email;

  return (
    <>
      <Tooltip title="Account settings">
        <IconButton onClick={handleClick} size="small" sx={{ ml: 1 }}>
          <Avatar src={avatar} sx={{ width: 40, height: 40 }} />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 2.5,
            borderRadius: 2,
            minWidth: 220,
            bgcolor: theme === "dark" ? "#1e1e1e" : "#fff",
            color: theme === "dark" ? "#fff" : "#222",
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {userInfo && (
          <>
            <Box sx={{ p: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar src={avatar} sx={{ width: 40, height: 40 }} />
              <Box>
                <Typography variant="body1" fontWeight="bold" noWrap>
                  {displayName}
                </Typography>
                <Typography variant="caption" noWrap>
                  {userInfo.email}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 0.5 }} />
          </>
        )}

        <MenuItem component={RouterLink} to="/Profile">
          Profile
        </MenuItem>
        <MenuItem component={RouterLink} to="/SavedPlace">
          Saved Place
        </MenuItem>
        <MenuItem onClick={handleLogout}> Logout</MenuItem>
      </Menu>
    </>
  );
}
