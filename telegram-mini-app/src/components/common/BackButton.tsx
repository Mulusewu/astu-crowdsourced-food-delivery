import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="text-gray-700 text-lg font-medium mb-6"
    >
      ← Back
    </button>
  );
}