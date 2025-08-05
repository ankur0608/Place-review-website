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
  Grow,
  ListItemIcon,
} from "@mui/material";
import {
  Person as PersonIcon,
  Bookmark as BookmarkIcon,
  Logout as LogoutIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import userLight from "../../src/assets/user.png";
import userDark from "../assets/user1.png";
import { useTheme } from "../store/ThemeContext";
import supabase from "../../lib/supabaseClient";

export default function AvatarDropdown() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
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
    localStorage.clear();
    handleClose();
    navigate("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserInfo(data.user);
      }
    };
    fetchUser();
  }, []);

  const storedAvatar = localStorage.getItem("image");
  const storedUsername = localStorage.getItem("username");
  const storedEmail = localStorage.getItem("email");

  const avatar =
    userInfo?.user_metadata?.avatar_url ||
    storedAvatar ||
    (theme === "dark" ? userDark : userLight);

  const displayName =
    userInfo?.user_metadata?.full_name ||
    userInfo?.user_metadata?.name ||
    storedUsername ||
    userInfo?.email ||
    "Guest User";

  const displayEmail = userInfo?.email || storedEmail || "guest@example.com";

  return (
    <>
      <Tooltip title="Account settings">
        <IconButton onClick={handleClick} size="small" sx={{ ml: 1 }}>
          <Avatar src={avatar} sx={{ width: 40, height: 40 }}>
            {!avatar && (displayName?.[0] || "U")}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Grow}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 2.5,
            borderRadius: 2,
            minWidth: 245,
            bgcolor: theme === "dark" ? "#1e1e1e" : "#fff",
            color: theme === "dark" ? "#fff" : "#222",
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {(userInfo || storedUsername || storedEmail) && (
          <div>
            <Box sx={{ p: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar src={avatar} sx={{ width: 35, height: 35 }}>
                {!avatar && (displayName?.[0] || "U")}
              </Avatar>
              <Box>
                <Typography variant="body1" fontWeight="bold" noWrap>
                  {displayName}
                </Typography>
                <Typography variant="caption" noWrap>
                  {displayEmail}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 0.5 }} />
          </div>
        )}

        <MenuItem component={RouterLink} to="/Profile">
          <ListItemIcon>
            <PersonIcon
              fontSize="small"
              style={{
                color: theme === "dark" ? "#fff" : "#222",
              }}
            />
          </ListItemIcon>
          Profile
        </MenuItem>

        <MenuItem component={RouterLink} to="/SavedPlace">
          <ListItemIcon>
            <BookmarkIcon
              fontSize="small"
              style={{
                color: theme === "dark" ? "#fff" : "#222",
              }}
            />
          </ListItemIcon>
          Saved Place
        </MenuItem>

        <MenuItem onClick={toggleTheme}>
          <ListItemIcon>
            {theme === "dark" ? (
              <LightModeIcon
                fontSize="small"
                style={{
                  color: theme === "dark" ? "#fff" : "#222",
                }}
              />
            ) : (
              <DarkModeIcon fontSize="small" />
            )}
          </ListItemIcon>
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon
              fontSize="small"
              style={{
                color: theme === "dark" ? "#fff" : "#222",
              }}
            />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
