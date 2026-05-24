import { useState } from "react";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function VendorChangePasswordPage() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    // Simulate successful save
    toast.success("Password changed successfully");
    navigate(-1);
  };

  const InputField = ({ label, value, setter, show, setShow }: any) => (
    <div>
      <label className="block text-[#0B1E40] text-[13px] font-bold mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Lock className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => setter(e.target.value)}
          className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-[16px] text-[#0B1E40] text-sm font-medium focus:outline-none focus:border-[#F26A1C] focus:bg-white transition-colors"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-0 pr-4 flex items-center"
        >
          {show ? (
            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
          )}
        </button>
      </div>
    </div>
  );

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
        <h1 className="text-xl font-extrabold text-[#0B1E40] tracking-tight">Change Password</h1>
        <div className="w-10 h-10" /> {/* Spacer */}
      </div>

      <div className="px-4 py-2">
        {/* Form Section */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 mb-6">
          <div className="space-y-4">
            <InputField
              label="Current Password"
              value={currentPassword}
              setter={setCurrentPassword}
              show={showCurrent}
              setShow={setShowCurrent}
            />
            <div className="pt-2">
              <InputField
                label="New Password"
                value={newPassword}
                setter={setNewPassword}
                show={showNew}
                setShow={setShowNew}
              />
            </div>
            <InputField
              label="Confirm New Password"
              value={confirmPassword}
              setter={setConfirmPassword}
              show={showConfirm}
              setShow={setShowConfirm}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pb-8">
          <button
            onClick={handleSave}
            className="w-full bg-[#F26A1C] text-white py-4 rounded-2xl font-bold text-[15px] shadow-sm hover:bg-orange-600 transition-colors active:scale-[0.98]"
          >
            Update Password
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
