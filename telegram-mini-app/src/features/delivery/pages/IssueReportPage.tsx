import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type IssueType = 
  | "Restaurant Refused The Order" 
  | "Order Not Ready" 
  | "Restorant Closed" 
  | "Other";

const IssueReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [selectedIssue, setSelectedIssue] = useState<IssueType>("Restaurant Refused The Order");
  const [description, setDescription] = useState("");

  // Default to 123 if no orderId is passed in URL
  const reportingOrderId = orderId || "123";

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Issue:", {
      orderId: reportingOrderId,
      issue: selectedIssue,
      description
    });
    // Add real submission logic here
    navigate(-1);
  };

  const issues: IssueType[] = [
    "Restaurant Refused The Order",
    "Order Not Ready",
    "Restorant Closed",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pb-8">
      
      {/* Header */}
      <div className="mt-14 mb-10 flex items-center">
        <button 
          onClick={handleBack}
          className="w-[45px] h-[45px] flex items-center justify-center rounded-xl bg-orange-100 border border-orange-200 text-orange-500 hover:bg-orange-200 transition-colors flex-shrink-0"
          aria-label="Go Back"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="flex-1 text-center text-2xl font-bold text-black pr-10">
          What Is The Issue ?
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        {/* Radio Options */}
        <div className="flex flex-col gap-5 mb-10">
          {issues.map((issue) => (
            <label 
              key={issue} 
              className="flex items-center cursor-pointer group"
              onClick={() => setSelectedIssue(issue)}
            >
              <div className={`w-6 h-6 rounded-full border-[2px] flex items-center justify-center mr-3 transition-colors ${
                selectedIssue === issue ? "border-[#f97316]" : "border-[#f97316]"
              }`}>
                {selectedIssue === issue && (
                  <div className="w-3 h-3 bg-[#f97316] rounded-full"></div>
                )}
              </div>
              <span className="text-gray-900 text-base font-medium">
                {issue}
              </span>
            </label>
          ))}
        </div>

        {/* Text Area Section */}
        <div className="flex flex-col flex-1">
          <label className="text-black font-bold text-lg mb-3">
            Reporting For Order #{reportingOrderId}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe The Problem Here.."
            className="w-full h-64 border border-gray-400 rounded-2xl p-4 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] resize-none"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="mt-12 flex justify-center">
          <button 
            type="submit"
            className="w-full max-w-[280px] h-[56px] bg-[#f97316] hover:bg-orange-600 text-white font-bold text-2xl rounded-[30px] shadow-sm transition-colors active:scale-[0.98]"
          >
            Submit
          </button>
        </div>
      </form>

    </div>
  );
};

export default IssueReportPage;
