import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Signup from "./Pages/Sign-up.jsx";
import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Reviews from "./Pages/Reviews.jsx";
import Navbar from "./Pages/Navbar/Navbar.jsx";
import Contact from "./Pages/Contact.jsx";
import Places from "./Pages/Places.jsx";
import Login from "./Pages/Login.jsx";
import ForgotPassword from "./Pages/ForgotPassword.jsx";
import { useTheme } from "./store/ThemeContext.jsx";

const Layout = () => (
  <>
    <Navbar />
    <main>
      <Outlet />
    </main>
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "home", element: <Home /> },
      { path: "about", element: <About /> },
      { path: "places", element: <Places /> },
      { path: "reviews", element: <Reviews /> },
      { path: "contact", element: <Contact /> },
      { path: "signup", element: <Signup /> },
      { path: "login", element: <Login /> },
      { path: "forgot-password", element: <ForgotPassword /> },
    ],
  },
]);

function App() {
  const { theme } = useTheme();
  return (
    <div className={`app-container ${theme}`}>
      <RouterProvider router={router} />;
    </div>
  );
}

export default App;
