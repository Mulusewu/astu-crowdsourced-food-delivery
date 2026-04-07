import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LockIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    <path d="M12 15v2"></path>
  </svg>
);

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting password change...", { oldPassword, newPassword, confirmPassword });
    // Add logic here
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pb-8">
      
      {/* Header */}
      <div className="mt-14 mb-12 flex items-center">
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
          Change Password
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        {/* Old Password Section */}
        <div className="mb-8">
          <label className="block text-gray-500 text-[15px] mb-3 ml-2">
            Enter Old Password
          </label>
          <div className="relative flex items-center w-full h-[56px] bg-[#FEF6F0] rounded-2xl px-5">
            <div className="text-black/80 flex-shrink-0">
              <LockIcon />
            </div>
            <input 
              type="password" 
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-black text-2xl tracking-[0.25em] font-black pl-5 placeholder-gray-400 placeholder:text-base placeholder:tracking-normal placeholder:font-normal"
              placeholder="•••••••••"
            />
          </div>
        </div>

        {/* New Password Section */}
        <div className="mb-4">
          <label className="block text-gray-500 text-[15px] mb-3 ml-2">
            Create New Password
          </label>
          <div className="flex flex-col gap-4">
            <div className="relative flex items-center w-full h-[56px] bg-[#FEF6F0] rounded-2xl px-5">
              <div className="text-black/80 flex-shrink-0">
                <LockIcon />
              </div>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-black text-base pl-5 placeholder-gray-400"
                placeholder="Create New Password"
              />
            </div>
            
            <div className="relative flex items-center w-full h-[56px] bg-[#FEF6F0] rounded-2xl px-5">
              <div className="text-black/80 flex-shrink-0">
                <LockIcon />
              </div>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-black text-base pl-5 placeholder-gray-400"
                placeholder="Confirm New Password"
              />
            </div>
          </div>
        </div>

        {/* Bottom Button */}
        <div className="mt-auto pt-10 flex justify-center">
          <button 
            type="submit"
            className="w-full max-w-[300px] h-[56px] bg-[#f97316] hover:bg-orange-600 text-white font-bold text-lg rounded-2xl shadow-sm transition-colors active:scale-[0.98]"
          >
            Change Password
          </button>
        </div>
      </form>

    </div>
  );
};

export default ChangePasswordPage;
