import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function VendorReportIssuePage() {
  const navigate = useNavigate();
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!issueType || !description) {
      toast.error("Please fill in all fields");
      return;
    }
    // Simulate submission
    toast.success("Issue reported successfully");
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-md mx-auto font-outfit">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-gray-50 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors bg-white shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-extrabold text-[#0B1E40] tracking-tight">Report Issue</h1>
        <div className="w-10 h-10" /> {/* Spacer */}
      </div>

      <div className="px-4 py-2">
        {/* Form Section */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 mb-6">
          <div className="space-y-5">
            <div>
              <label className="block text-[#0B1E40] text-[13px] font-bold mb-2">
                Issue Type
              </label>
              <div className="relative">
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-[16px] text-[#0B1E40] text-sm font-medium focus:outline-none focus:border-[#F26A1C] focus:bg-white transition-colors appearance-none"
                >
                  <option value="" disabled>Select Issue Type</option>
                  <option value="app_bug">App Bug / Glitch</option>
                  <option value="order_issue">Order Dispute</option>
                  <option value="payment_issue">Payment Issue</option>
                  <option value="other">Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[#0B1E40] text-[13px] font-bold mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail..."
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-[16px] text-[#0B1E40] text-sm font-medium focus:outline-none focus:border-[#F26A1C] focus:bg-white transition-colors h-40 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pb-8">
          <button
            onClick={handleSubmit}
            className="w-full bg-[#F26A1C] text-white py-4 rounded-2xl font-bold text-[15px] shadow-sm hover:bg-orange-600 transition-colors active:scale-[0.98]"
          >
            Submit Report
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-gray-100 text-[#0B1E40] py-4 rounded-2xl font-bold text-[15px] hover:bg-gray-200 transition-colors active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
