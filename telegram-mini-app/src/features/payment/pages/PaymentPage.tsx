import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ShieldCheck, ArrowLeft, CreditCard } from "lucide-react";
import { apiClient } from "@/api/client/axiosInstance";
import { ROUTES, buildRoute } from "@/routes/routePaths";
import { toast } from "sonner";
export default function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // 1. Production Flow: Get real Chapa URL
  const handlePayWithChapa = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.post("/payments/initialize", { orderId });
      
      if (import.meta.env.DEV) {
        toast.success("Initialized! You can now use the Simulator button.");
        setIsLoading(false);
        return; // Don't redirect in dev mode if you want to use the simulator
      }
      
      const checkoutUrl = res.data.data.checkoutUrl;
      window.location.href = checkoutUrl;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to initialize payment.");
      setIsLoading(false);
    }
  };

  // 2. Developer Flow: Trigger Backend Simulation
  const handleSimulateWebhook = async () => {
    setIsSimulating(true);
    try {
      // Hit the new backend DEV endpoint
      await apiClient.post("/payments/dev/simulate-webhook", { orderId });
      
      toast.success("Payment simulated! Money added to Escrow.");
      
      setTimeout(() => {
        navigate(buildRoute(ROUTES.CUSTOMER.ORDERS.TRACK, { orderId: orderId || "" }));
      }, 1500);
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Simulation failed. Did you click 'Pay with Chapa' first?");
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 flex flex-col p-6 items-center justify-center text-center">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
        <CreditCard size={32} />
      </div>
      <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Secure Checkout</h1>
      <p className="text-gray-500 text-sm mb-10">You are about to transfer funds to ASTU Eats Escrow.</p>
      
      <button 
        onClick={handlePayWithChapa} 
        disabled={isLoading}
        className="w-full max-w-sm bg-[#F26A1C] text-white font-bold h-14 rounded-full shadow-lg flex items-center justify-center gap-2 mb-4"
      >
        {isLoading ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
        Pay with Chapa (Telebirr/CBE)
      </button>

      {/* Developer Tool Only */}
      {import.meta.env.DEV && (
        <button 
          onClick={handleSimulateWebhook}
          disabled={isSimulating}
          className="w-full max-w-sm bg-gray-100 text-gray-600 font-bold h-14 rounded-full flex items-center justify-center"
        >
          {isSimulating ? <Loader2 className="animate-spin" /> : "Developer: Simulate Webhook"}
        </button>
      )}

      <button 
        onClick={() => navigate(-1)}
        className="mt-8 text-gray-400 font-bold flex items-center justify-center gap-2"
      >
        <ArrowLeft size={16} /> Cancel and Return
      </button>
    </div>
  );
}