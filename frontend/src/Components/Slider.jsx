import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTheme } from "../store/ThemeContext.jsx";
import "./SliderModule.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";

const fetchPlaces = async () => {
  const res = await fetch(
    "https://place-review-website-real.onrender.com/api/places"
  );
  if (!res.ok) throw new Error("Failed to fetch places");
  return res.json();
};

const PlacesSlider = () => {
  const { theme } = useTheme();

  const {
    data: places,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["places"],
    queryFn: fetchPlaces,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const sliderSettings = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1500,
    autoplaySpeed: 2500,
    cssEase: "linear",
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  const renderSkeletonCards = () =>
    Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="place-card skeleton-card">
        <Skeleton height={180} width="100%" borderRadius={12} />
        <div style={{ padding: "0.5rem" }}>
          <Skeleton
            height={20}
            width="70%"
            style={{ marginBottom: "0.5rem" }}
          />
          <Skeleton height={15} width="50%" />
        </div>
      </div>
    ));

  return (
    <div
      className={`slider-container ${
        theme === "dark" ? "dark-theme" : "light-theme"
      }`}
    >
      <div className="view-all">
        <h2 className="slider-title">Places</h2>
        <Link to="/places" className="view-link">
          View All
        </Link>
      </div>

      <Slider {...sliderSettings}>
        {isLoading ? (
          renderSkeletonCards()
        ) : isError ? (
          <div key="error" style={{ padding: "2rem", color: "red" }}>
            Failed to load places.
          </div>
        ) : (
          places?.map((place) => (
            <Link
              key={place.id}
              to={`/places/${place.id}`}
              className="cardLink"
            >
              <div className="place-card">
                <img
                  src={place.image_url || "/placeholder.jpg"}
                  alt={place.name}
                  className="place-image"
                  loading="lazy"
                  width="100%"
                  height="180"
                />
                <h3 className="place-name">{place.name}</h3>
                <p className="place-location">{place.location}</p>
              </div>
            </Link>
          ))
        )}
      </Slider>
    </div>
  );
};

export default memo(PlacesSlider);
