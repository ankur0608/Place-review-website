// ScrollTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const root = document.getElementById("root");
    const target = root?.scrollTop > 0 ? root : window;

    // Scroll to top on route change
    target.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

export default ScrollTop;
