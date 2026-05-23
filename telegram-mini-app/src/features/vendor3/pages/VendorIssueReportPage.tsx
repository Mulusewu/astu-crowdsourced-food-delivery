import React, { useState } from "react";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const VENDOR_ISSUES = [
  "Technical Glitch with Orders",
  "Payment Delay",
  "Menu Update Problem",
  "Deliverer Conduct Issue",
  "Account Access Issue",
  "Other",
];

export default function VendorIssueReportPage() {
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState<string>(VENDOR_ISSUES[0]);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error("Please provide a description of the issue.");
      return;
    }

    setIsLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Issue Reported", {
      description: "Our support team will review your report and get back to you shortly.",
    });
    
    setIsLoading(false);
    navigate(-1);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FDFDFD] font-outfit text-gray-900 pb-10">
      {/* Header */}
      <header className="px-5 py-6">
        <div className="relative flex items-center justify-center">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-xl border-2 border-orange-200 text-orange-500 transition hover:bg-orange-50 active:scale-95 shadow-sm"
          >
            <ArrowLeft className="h-6 w-6 stroke-[2.5]" />
          </button>
          <h1 className="text-2xl font-black text-black tracking-tight">
            Report an Issue
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 mt-4">
        <div className="bg-orange-50 p-4 rounded-2xl mb-8 flex items-start gap-4 border border-orange-100">
          <AlertCircle className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-orange-800 leading-snug">
            Need immediate help? Our support team typically responds within 2 hours during business hours.
          </p>
        </div>

        {/* Issue Options */}
        <h2 className="text-lg font-black text-black mb-4 uppercase tracking-wider text-[11px] text-gray-400">
          Select Issue Type
        </h2>
        <div className="flex flex-col gap-4">
          {VENDOR_ISSUES.map((issue) => {
            const isSelected = selectedIssue === issue;
            return (
              <button
                key={issue}
                type="button"
                onClick={() => setSelectedIssue(issue)}
                className={`flex items-center gap-4 w-full p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                  isSelected 
                    ? "border-orange-500 bg-orange-50/50 shadow-md" 
                    : "border-gray-100 bg-white"
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    isSelected ? "border-orange-500" : "border-gray-200"
                  }`}
                >
                  {isSelected && (
                    <div className="h-3 w-3 rounded-full bg-orange-500" />
                  )}
                </div>
                <span className={`text-[15px] font-black transition-colors ${
                  isSelected ? "text-orange-900" : "text-gray-700"
                }`}>
                  {issue}
                </span>
              </button>
            );
          })}
        </div>

        {/* Text Area Section */}
        <div className="mt-10">
          <h2 className="text-lg font-black text-black mb-4 uppercase tracking-wider text-[11px] text-gray-400">
            Details
          </h2>
          <textarea
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder="Please describe the issue in detail..."
            className="h-[180px] w-full resize-none rounded-[28px] border-2 border-gray-100 bg-white p-6 text-[15px] text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-orange-500 focus:shadow-xl shadow-sm font-bold"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-12 flex justify-center pb-6">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full max-w-xs flex items-center justify-center rounded-[24px] bg-black py-5 text-lg font-black text-white transition hover:bg-gray-900 active:scale-95 shadow-xl disabled:opacity-70 disabled:scale-100"
          >
            {isLoading ? (
              <Loader2 className="h-7 w-7 animate-spin text-white" />
            ) : (
              "Submit Report"
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
