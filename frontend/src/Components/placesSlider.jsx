import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTheme } from "../store/ThemeContext.jsx";
import "./SliderModule.css";

export default function PlaceSlider() {
  const [places, setPlaces] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    async function fetchPlaces() {
      try {
        const response = await fetch("http://localhost:5000/places");
        if (!response.ok) throw new Error("Failed to fetch places.");
        const data = await response.json();
        setPlaces(data);
      } catch (error) {
        console.error("Error fetching places:", error.message);
      }
    }

    fetchPlaces();
  }, []);

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
        {places.map((place) => {
          return (
            <Link
              key={place.id}
              to={`/places/${place.id}`}
              className="cardLink"
            >
              <div key={place.id} className="place-card">
                <img
                  src={place.image}
                  alt={place.name}
                  className="place-image"
                />
                <h3 className={place.name}>{place.name}</h3>
                <p className="place-location">{place.location}</p>
                <p className="place-description">{place.description}</p>
              </div>
            </Link>
          );
        })}
      </Slider>
    </div>
  );
}
