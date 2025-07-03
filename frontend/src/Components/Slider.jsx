import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTheme } from "../store/ThemeContext.jsx";
import "./SliderModule.css"; 
import Loading from "./Loading.jsx";
import { useQuery } from "@tanstack/react-query";

function fetchPlaces() {
  return fetch("https://place-review-website-real.onrender.com/places").then(res => res.json());
}

export default function PlacesSlider() {
  const { theme } = useTheme();

  const { data: places, isLoading, error } = useQuery({
    queryKey: ["places"],
    queryFn: fetchPlaces,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const sliderSettings = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div
      className={`slider-container ${
        theme === "dark" ? "dark-theme" : "light-theme"
      }`}
    >
      <div className="view-all">
        <h2 className="slider-title">Places</h2>
        <Link to="/places">View All</Link>
      </div>

      <Slider {...sliderSettings}>
        {isLoading ? (
          <Loading />
        ) : error ? (
          <div style={{ padding: "2rem", color: "red" }}>Failed to load places.</div>
        ) : (
          places?.map((place) => (
            <Link
              key={place.id}
              to={`/places/${place.id}`}
              className="cardLink"
            >
              <div className="place-card">
                <img
                  src={place.image}
                  alt={place.name}
                  className="place-image"
                />
                <h3 className="place-name">{place.name}</h3>
                <p className="place-location">{place.location}</p>
                <p className="place-description">{place.description}</p>
              </div>
            </Link>
          ))
        )}
      </Slider>
    </div>
  );
}
