import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ActiveDeliveryDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    if (id) {
      // placeholder fetch
      setDetails({ id, status: "In transit" });
    }
  }, [id]);

  if (!details) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">Active Delivery {details.id}</h1>
      <p>Status: {details.status}</p>
    </div>
  );
}
