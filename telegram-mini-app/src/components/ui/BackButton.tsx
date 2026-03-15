import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="text-orange-500 text-2xl mb-8"
    >
      ←
    </button>
  );
}