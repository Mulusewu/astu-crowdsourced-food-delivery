import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ActiveDeliveryTrackPage() {
  const { deliveryId } = useParams<{ deliveryId: string }>();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (deliveryId) {
      // fetch tracking location from backend or socket
      setLocation({ lat: 9.02, lng: 38.75 });
    }
  }, [deliveryId]);

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">Track Delivery {deliveryId}</h1>
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
