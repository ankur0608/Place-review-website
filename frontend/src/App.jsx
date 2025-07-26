import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";

import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";
import Navbar from "./Pages/Navbar/Navbar.jsx";
import Footer from "./Pages/Footer.jsx";
import ForgotPassword from "./Pages/ForgotPassword.jsx";
import { useTheme } from "./store/ThemeContext.jsx";
import ScrollTop from "./Components/ScrollTop.jsx";
import VerifyEmail from "./Pages/VerifyEmail.jsx";
// Lazy-loaded routes (heavier)
const Places = lazy(() => import("./Pages/Places.jsx"));
const PlaceDetails = lazy(() => import("./Pages/PlaceDetails.jsx"));
const SavedPlace = lazy(() => import("./Components/SavedPlace.jsx"));
const Profile = lazy(() => import("./Pages/Profile.jsx"));
const ChatBox = lazy(() => import("./Components/ChatBox.jsx"));
const Editprofile = lazy(() => import("./Components/Editprofile.jsx"));
const Signup = lazy(() => import("./Pages/Sign-up.jsx"));
const Login = lazy(() => import("./Pages/Login.jsx"));
const BlogList = lazy(() => import("./Pages/BlogList.jsx"));
const BlogPost = lazy(() => import("./Pages/BlogPost.jsx"));

// Chat widget (optional)
import ChatWidget from "./Components/ChatWidget";
const ResetPassword = lazy(() => import("./Pages/ResetPassword.jsx"));

// Shared layout
const Layout = () => (
  <>
    <Navbar />
    <ScrollTop />
    <main>
      <Outlet />
      <Footer />
    </main>
  </>
);

// Route definitions
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },

      {
        path: "places",
        element: (
          <Suspense fallback={<div>Loading Places...</div>}>
            <Places />
          </Suspense>
        ),
      },
      {
        path: "places/:id",
        element: (
          <Suspense fallback={<div>Loading Place Details...</div>}>
            <PlaceDetails />
          </Suspense>
        ),
      },
      {
        path: "SavedPlace",
        element: (
          <Suspense fallback={<div>Loading Saved Places...</div>}>
            <SavedPlace />
          </Suspense>
        ),
      },
      {
        path: "Profile",
        element: (
          <Suspense fallback={<div>Loading Profile...</div>}>
            <Profile />
          </Suspense>
        ),
      },
      {
        path: "Editprofile",
        element: (
          <Suspense fallback={<div>Loading Edit Profile...</div>}>
            <Editprofile />
          </Suspense>
        ),
      },
      {
        path: "ChatBox",
        element: (
          <Suspense fallback={<div>Loading Chat...</div>}>
            <ChatBox />
          </Suspense>
        ),
      },
      {
        path: "reset-password",
        element: (
          <Suspense fallback={<div>Loading Reset Password...</div>}>
            <ResetPassword />
          </Suspense>
        ),
      },

      {
        path: "blog",
        element: (
          <Suspense fallback={<div>Loading Blog...</div>}>
            <BlogList />
          </Suspense>
        ),
      },
      {
        path: "blog/:slug",
        element: (
          <Suspense fallback={<div>Loading Blog...</div>}>
            <BlogPost />
          </Suspense>
        ),
      },

      { path: "*", element: <h2>404 - Page Not Found</h2> },
    ],
  },
  { path: "signup", element: <Signup /> },
  { path: "login", element: <Login /> },
  { path: "email-verified", element: <VerifyEmail /> },
  { path: "forgot-password", element: <ForgotPassword /> },
]);

// console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
// console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);

// Root App
function App() {
  const { theme } = useTheme();

  return (
    <div className={`app-container ${theme}`}>
      <Suspense fallback={<div>Loading App...</div>}>
        <RouterProvider router={router} />
      </Suspense>
      <ChatWidget />
    </div>
  );
}

export default App;
