import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Loader2, Camera, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrderStore } from "@/store/orders/orderStore";
import { ROUTES, buildRoute } from "@/routes/routePaths";

const ISSUES_LIST = [
  "Restaurant Refused The Order",
  "Order Not Ready",
  "Restaurant Closed",
  "Other",
];

export default function ReportIssuePage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { activeOrders, currentOrder, fetchOrderById, submitOrderIssue, isLoading } = useOrderStore();
  
  const [selectedIssue, setSelectedIssue] = useState<string>(ISSUES_LIST[0]);
  const [description, setDescription] = useState("");
  const [, setEvidence] = useState<File | null>(null);
  const [evidencePreview, setEvidencePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Find the specific order from the list or fetch it if not present
  const order = activeOrders.find(o => o.id === orderId) || currentOrder;

  useEffect(() => {
    if (orderId && (!order || order.id !== orderId)) {
      fetchOrderById(orderId);
    }
  }, [orderId, order, fetchOrderById]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEvidence(file);
      setEvidencePreview(URL.createObjectURL(file));
    }
  };

  const removeEvidence = () => {
    setEvidence(null);
    setEvidencePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!orderId) return;
    if (!description.trim()) {
      setError("Please describe the issue before submitting.");
      return;
    }

    setError("");
    
    // In a real app, evidence file would be uploaded first and its URL attached
    await submitOrderIssue(orderId, {
      type: selectedIssue,
      description: description.trim(),
    });

    setSubmitted(true);
    setTimeout(() => {
      navigate(ROUTES.DELIVERY.ACTIVE.LIST);
    }, 800);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FDFDFD] font-sans pb-10 text-gray-900">
      {/* Header */}
      <header className="px-5 pt-[max(2.5rem,env(safe-area-inset-top))] pb-6">
        <div className="relative flex items-center justify-center h-12">
          <button
            onClick={() => navigate(buildRoute(ROUTES.DELIVERY.ACTIVE.DETAILS, { orderId }))}
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
            Reporting For Order #{order?.shortId || "..."}
          </h2>
          <textarea
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder="Describe The Problem Here.."
            className="h-[140px] w-full resize-none rounded-[16px] border border-gray-300 bg-white p-4 text-[15px] text-gray-800 placeholder-gray-400 outline-none transition-colors focus:border-[#F26A1C] focus:ring-1 focus:ring-[#F26A1C] shadow-sm"
          />
          
          {/* Evidence Attachment */}
          <div className="mt-4">
            <h3 className="text-[14px] font-bold text-gray-900 mb-2">Attach Evidence (Optional)</h3>
            {!evidencePreview ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center py-6 border-2 border-dashed border-gray-300 rounded-[16px] bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <Camera size={24} className="text-gray-400 mb-2" />
                <span className="text-[13px] font-medium text-gray-500">Tap to take or upload a photo</span>
              </button>
            ) : (
              <div className="relative w-full h-[140px] rounded-[16px] border border-gray-200 overflow-hidden">
                <img src={evidencePreview} alt="Evidence" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeEvidence}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white active:scale-95"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}
          {submitted && (
            <p className="mt-3 text-sm font-medium text-[#F26A1C]">
              Issue submitted. Returning to active deliveries...
            </p>
          )}
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

