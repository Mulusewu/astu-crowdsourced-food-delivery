import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ActiveDeliveryTrackPage() {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (id) {
      // fetch tracking location from backend or socket
      setLocation({ lat: 9.02, lng: 38.75 });
    }
  }, [id]);

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">Track Delivery {id}</h1>
      {location ? (
        <p>
          Current location: {location.lat}, {location.lng}
        </p>
      ) : (
        <p>Loading location...</p>
      )}
    </div>
  );
}
