import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const SavedPlaces = () => {
  const [savedPlaces, setSavedPlaces] = useState([]);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchSavedPlaces = async () => {
      try {
        const res = await axios.get(
          `https://place-review-website-real.onrender.com/api/savedplaces/user/${userId}`
        );

        if (!Array.isArray(res.data)) {
          toast.error("Invalid data format");
          return;
        }

        setSavedPlaces(res.data);
        toast.success("Saved places loaded!");
      } catch (err) {
        toast.error("Failed to fetch saved places");
        console.error(err);
      }
    };

    if (userId) {
      fetchSavedPlaces();
    } else {
      toast.error("User not logged in");
    }
  }, [userId]);

  return (
    <div>
      <h2>Saved Places</h2>
      {savedPlaces.length === 0 ? (
        <p>No saved places yet.</p>
      ) : (
        <div className="grid">
          {savedPlaces.map((saved) => {
            const place = saved.places;

            return (
              <div key={saved.id} className="card">
                <h3>{place?.name || "Unnamed Place"}</h3>
                {place?.image && (
                  <img
                    src={
                      place.image_url?.startsWith("http")
                        ? place.image_url
                        : `https://your-supabase-project.supabase.co/storage/v1/object/public/your-bucket/${place.image_url}`
                    }
                    alt={place.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                )}
                <p>{place?.description || "No description available."}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedPlaces;
