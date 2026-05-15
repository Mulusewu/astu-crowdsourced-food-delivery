import { useEffect, useState } from "react";

export default function StatusPage() {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    // TODO: fetch status from backend (express) when available
    setStatus("Online");
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">Delivery Status</h1>
      <p>{status || "Loading..."}</p>
    </div>
  );
}
