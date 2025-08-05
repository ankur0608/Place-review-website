import { Suspense } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  useMediaQuery,
  useTheme as useMUITheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "../store/ThemeContext";
import heroimg from "../assets/photo.webp";
import PlacesSlider from "../Components/Slider";

export default function Home() {
  const { theme } = useTheme();
  const muiTheme = useMUITheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  return (
    <>
      <Box
        sx={{
          backgroundColor: theme === "dark" ? "#121212" : "#f9f9f9",
          color: theme === "dark" ? "#fff" : "#000",
          minHeight: "100vh",
          py: { xs: 4, md: 10 },
          px: { xs: 2, md: 6 },
        }}
      >
        <Grid
          container
          spacing={isMobile ? 4 : 33} // Smaller spacing on small screens
          alignItems="center"
          justifyContent="center"
        >
          {/* Left Hero Text Section */}
          <Grid item xs={12} md={6}>
            <Typography
              variant={isMobile ? "h4" : "h3"}
              component="h1"
              fontWeight="bold"
              gutterBottom
            >
              Discover & <br />
              <Box component="span" color="primary.main">
                Review Amazing
              </Box>{" "}
              Places
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, mt: 5 }}>
              Find the best spots to visit and share your experiences with
              others.
            </Typography>

            <Button
              component={Link}
              to="/places"
              variant="contained"
              size="large"
              sx={{ borderRadius: 3, px: 4 }}
            >
              Explore
            </Button>
          </Grid>

          {/* Right Image Section */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={heroimg}
              alt="Hero"
              sx={{
                width: "100%",
                maxHeight: { xs: 250, md: 400 },
                objectFit: "cover",
                borderRadius: 3,
                boxShadow: 4,
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Slider Section */}
      <Box sx={{ mt: { xs: 4, md: 6 }, px: { xs: 2, md: 6 } }}>
        <Suspense
          fallback={<Typography align="center">Loading Places...</Typography>}
        >
          <PlacesSlider />
        </Suspense>
      </Box>
    </>
  );
}
