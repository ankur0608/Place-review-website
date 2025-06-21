import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";

import Signup from "./Pages/Sign-up.jsx";
import About from "./Pages/About.jsx";
import Navbar from "./Pages/Navbar/Navbar.jsx";
import Contact from "./Pages/Contact.jsx";
import Login from "./Pages/Login.jsx";
import ForgotPassword from "./Pages/ForgotPassword.jsx";
import { useTheme } from "./store/ThemeContext.jsx";
import Footer from "./Pages/Footer.jsx";
import Home from "./Pages/Home.jsx";
import Profile from "./Pages/Profile.jsx";
const Places = lazy(() => import("./Pages/Places.jsx"));
const PlaceDetails = lazy(() => import("./Pages/PlaceDetails.jsx"));

const Layout = () => (
  <>
    <Navbar />
    <main>
      <Outlet />
      <Footer />
    </main>
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },

      { path: "about", element: <About /> },
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

      { path: "contact", element: <Contact /> },
      { path: "Profile", element: <Profile /> },
      { path: "*", element: <h2>404 - Page Not Found</h2> },
    ],
  },
  { path: "signup", element: <Signup /> },
  { path: "login", element: <Login /> },
  { path: "forgot-password", element: <ForgotPassword /> },
]);

function App() {
  const { theme } = useTheme();

  return (
    <div className={`app-container ${theme}`}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
