import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  useMediaQuery,
  useTheme as useMuiTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  FaBlog,
  FaHome,
  FaMapMarkedAlt,
  FaInfoCircle,
  FaEnvelope,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
} from "react-icons/fa";

import Dropdown from "../../Components/Dropdown.jsx";
import { useTheme } from "../../store/ThemeContext";
import supabase from "../../../lib/supabaseClient.js";
import CloseIcon from "@mui/icons-material/Close";

const navItems = [
  { name: "Home", path: "/", icon: <FaHome /> },
  { name: "Places", path: "/places", icon: <FaMapMarkedAlt /> },
  { name: "About", path: "/about", icon: <FaInfoCircle /> },
  { name: "Contact", path: "/contact", icon: <FaEnvelope /> },
  { name: "Blog", path: "/blog", icon: <FaBlog /> },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setIsLoggedIn(true);
        const userAvatar = session.user.user_metadata?.avatar_url || "";
        setAvatar(userAvatar);
      }
    };

    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getSession();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setMobileOpen(false);
    navigate("/login");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const activeStyle = {
    backgroundColor: "#38bdf8",
    color: "#0f172a",
    fontWeight: "bold",
    borderRadius: "6px",
    padding: "6px 12px",
    transition: "0.3s ease",
  };
  const MobileView = () => (
    <>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <IconButton color="inherit" onClick={handleDrawerToggle} edge="start">
          ☰
        </IconButton>

        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            color: "#ffffff",
            "& span": {
              color: "#38bdf8",
            },
          }}
        >
          Place<span>Review</span>
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Dropdown avatar={avatar} onLogout={handleLogout} />
        </Box>
      </Toolbar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: "70%",
            backgroundColor: "#0f172a",
            color: "#ffffff",
            paddingX: 2,
            paddingY: 1,
          },
        }}
      >
        {/* Top Bar with Close Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", pl: 1 }}>
            Menu
          </Typography>
          <IconButton onClick={handleDrawerToggle} sx={{ color: "#ffffff" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Nav Items */}
        <List>
          {navItems.map(({ name, path, icon }) => (
            <NavLink
              to={path}
              key={name}
              style={() => ({
                textDecoration: "none",
                color: "#ffffff",
              })}
              onClick={handleDrawerToggle}
            >
              <ListItem
                button
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  backgroundColor: ({ isActive }) =>
                    isActive ? "#38bdf8" : "transparent",
                  "&:hover": {
                    backgroundColor: "#1e293b",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>{icon}</ListItemIcon>
                <ListItemText
                  primary={name}
                  primaryTypographyProps={{ fontSize: "1rem" }}
                />
              </ListItem>
            </NavLink>
          ))}
        </List>

        <Divider sx={{ backgroundColor: "rgba(255,255,255,0.2)", my: 2 }} />

        {/* Auth Buttons */}
        <List>
          {isLoggedIn ? (
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                "&:hover": { backgroundColor: "#1e293b" },
              }}
            >
              <ListItemIcon sx={{ color: "#ffffff" }}>
                <FaSignOutAlt />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          ) : (
            <>
              <NavLink
                to="/signup"
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? "#0f172a" : "#ffffff",
                })}
                onClick={handleDrawerToggle}
              >
                <ListItem
                  button
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: ({ isActive }) =>
                      isActive ? "#38bdf8" : "transparent",
                    "&:hover": {
                      backgroundColor: "#1e293b",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>
                    <FaUserPlus />
                  </ListItemIcon>
                  <ListItemText primary="Sign Up" />
                </ListItem>
              </NavLink>
              <NavLink
                to="/login"
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? "#0f172a" : "#ffffff",
                })}
                onClick={handleDrawerToggle}
              >
                <ListItem
                  button
                  sx={{
                    borderRadius: 2,
                    backgroundColor: ({ isActive }) =>
                      isActive ? "#38bdf8" : "transparent",
                    "&:hover": {
                      backgroundColor: "#1e293b",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>
                    <FaSignInAlt />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItem>
              </NavLink>
            </>
          )}
        </List>
      </Drawer>
    </>
  );

  const DesktopView = () => (
    <Toolbar sx={{ justifyContent: "space-between" }}>
      <Typography
        variant="h6"
        component={Link}
        to="/"
        sx={{
          color: "#ffffff",
          textDecoration: "none",
          fontWeight: "bold",
          pr: 4,
          fontSize: "1.5rem",
        }}
      >
        Place
        <span
          style={{
            color: "#38bdf8",
            fontWeight: "bold",
          }}
        >
          Review
        </span>
      </Typography>

      <Box
        sx={{ display: "flex", gap: 5, alignItems: "center" }}
        aria-label="Navigation Links"
      >
        {navItems.map(({ name, path }) => (
          <NavLink
            key={name}
            to={path}
            style={({ isActive }) => ({
              color: "#ffffff",
              textDecoration: "none",
              ...(isActive ? activeStyle : {}),
            })}
          >
            <p
              style={{
                fontSize: "1.1rem",
                // fontWeight: "500",
              }}
            >
              {name}
            </p>
          </NavLink>
        ))}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {isLoggedIn ? (
          <Dropdown avatar={avatar} onLogout={handleLogout} />
        ) : (
          <>
            <Button color="inherit" component={Link} to="/signup">
              Sign Up
            </Button>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          </>
        )}
      </Box>
    </Toolbar>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: "#0f172a" }}>
      {isMobile ? <MobileView /> : <DesktopView />}
    </AppBar>
  );
}
