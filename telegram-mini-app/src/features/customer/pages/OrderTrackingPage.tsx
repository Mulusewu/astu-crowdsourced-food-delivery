import { useParams } from "react-router-dom";

export default function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div>
      <h1>Tracking Order #{orderId}</h1>
      {/* Live tracking UI will go here */}
    </div>
  );
}
