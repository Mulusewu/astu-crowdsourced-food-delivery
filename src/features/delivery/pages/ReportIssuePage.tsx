import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrderStore } from "@/store/orders/orderStore";

const ISSUES_LIST = [
  "Restaurant Refused the Order",
  "Order Not Ready",
  "Restaurant Closed",
  "Other",
];

export default function ReportIssuePage() {
  const { deliveryId } = useParams<{ deliveryId: string }>();
  const navigate = useNavigate();
  const { activeOrders, currentOrder, fetchOrderById, submitOrderIssue, isLoading } = useOrderStore();

  const [selectedIssue, setSelectedIssue] = useState<string>(ISSUES_LIST[0]);
  const [description, setDescription] = useState("");

  // Find the specific order from the list or fetch it if not present
  const order = activeOrders.find(o => o.id === deliveryId) || currentOrder;

  useEffect(() => {
    if (deliveryId && (!order || order.id !== deliveryId)) {
      fetchOrderById(deliveryId);
    }
  }, [deliveryId, order, fetchOrderById]);

  const handleSubmit = async () => {
    if (!deliveryId) return;

    await submitOrderIssue(deliveryId, {
      type: selectedIssue,
      description: description
    });

    navigate(-1); // Navigate back after submission
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FDFDFD] font-sans pb-10 text-gray-900">
      {/* Header */}
      <header className="px-5 pt-[max(2.5rem,env(safe-area-inset-top))] pb-6">
        <div className="relative flex items-center justify-center h-12">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 flex h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-[#FFEFE5] text-[#F26A1C] transition hover:bg-orange-200 active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={2} />
          </button>
          <h1 className="text-[22px] font-black text-black tracking-tight">
            What Is The Issue ?
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 mt-6">
        {/* Issue Options */}
        <div className="flex flex-col gap-[22px]">
          {ISSUES_LIST.map((issue) => {
            const isSelected = selectedIssue === issue;
            return (
              <button
                key={issue}
                type="button"
                onClick={() => setSelectedIssue(issue)}
                className="flex items-center gap-3 w-full text-left focus:outline-none transition-opacity active:opacity-70"
              >
                <div
                  className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-[2px] transition-colors ${isSelected ? "border-[#F26A1C]" : "border-[#F26A1C]"
                    }`}
                >
                  {isSelected && (
                    <div className="h-[12px] w-[12px] rounded-full bg-[#F26A1C]" />
                  )}
                </div>
                <span className="text-[15px] font-medium text-black">
                  {issue}
                </span>
              </button>
            );
          })}
        </div>

        {/* Text Area Section */}
        <div className="mt-10">
          <h2 className="text-[16px] font-black text-black mb-[10px] tracking-tight">
            Reporting For Order #{order?.orderNumber?.replace("ORD-", "") || "..."}
          </h2>
          <textarea
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder="Describe The Problem Here.."
            className="h-[220px] w-full resize-none rounded-[16px] border border-gray-300 bg-white p-4 text-[15px] text-gray-800 placeholder-gray-400 outline-none transition-colors focus:border-[#F26A1C] focus:ring-1 focus:ring-[#F26A1C] shadow-sm"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-12 flex justify-center pb-6">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            type="button"
            className="flex min-w-[220px] items-center justify-center rounded-full bg-[#F26A1C] px-8 py-[12px] text-[20px] font-medium text-white transition hover:bg-[#F26A1C]/90 active:scale-95 shadow-md disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

