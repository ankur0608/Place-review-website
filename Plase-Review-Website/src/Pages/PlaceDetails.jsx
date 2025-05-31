import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./PlaceDetails.module.css";

export default function PlaceDetails() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlace() {
      try {
        const response = await fetch(`http://localhost:5000/places/${id}`);
        if (!response.ok) throw new Error("Place not found");
        const data = await response.json();
        setPlace(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPlace();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!place) return <p>No place found.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{place.name}</h1>
      <img src={place.image} alt={place.name} className={styles.image} />
      <p className={styles.info}>
        <strong className={styles.locationLabel}>Location:</strong>{" "}
        {place.location}
      </p>
      <p className={styles.description}>{place.description}</p>
      <Link to="/places">
        <button className={styles.button}>Go Back</button>
      </Link>
    </div>
  );
}
