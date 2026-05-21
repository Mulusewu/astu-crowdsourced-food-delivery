import { useState, useEffect } from "react";

export default function AvailabilityPage() {
  const [available, setAvailable] = useState<boolean>(false);

  useEffect(() => {
    // placeholder for API call to check availability
    setAvailable(true);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">Availability</h1>
      <p>{available ? "You are available" : "You are not available"}</p>
    </div>
  );
}
