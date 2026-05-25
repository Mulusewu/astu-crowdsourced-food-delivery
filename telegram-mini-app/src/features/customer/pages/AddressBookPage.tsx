import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Plus,
  Trash2,
  Check,
  Building,
  Loader2,
} from "lucide-react";
import { useCustomerStore } from "@/store/customer/customerStore";
import { CAMPUS_BLOCKS } from "@/constants/blocks";

export function AddAddressModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (address: any) => void; // Replace 'any' with your Address type
}) {
  const [form, setForm] = useState({
    label: "Home",
    blockId: "",
    roomNumber: "",
    isDefault: false,
  });

  const handleSave = () => {
    if (!form.blockId) return;
    const block = CAMPUS_BLOCKS.find((b) => b.id === form.blockId);
    if (!block) return;

    const newAddress = {
      id: `addr_${Date.now()}`,
      label: form.label,
      street: block.name,
      floor: form.roomNumber,
      city: "ASTU Campus",
      latitude: block.lat,
      longitude: block.lng,
      isDefault: form.isDefault,
    };
    onSave(newAddress);
    onClose();
  };

  const labelOptions = ["Home", "Work", "Other"];

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end">
      {/* Backdrop (Covers full screen) */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sheet (Constrained to Mobile Width: w-full max-w-md mx-auto) */}
      <div className="relative w-full max-w-md mx-auto bg-white dark:bg-gray-950 rounded-t-[32px] px-5 pt-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl animate-in slide-in-from-bottom-full duration-300">

        {/* Drag handle */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full" />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[18px] font-black text-gray-900 dark:text-white">
            Add New Address
          </h2>
        </div>

        {/* Label selector */}
        <div className="flex gap-2 mb-5">
          {labelOptions.map((l) => (
            <button
              key={l}
              onClick={() => setForm((f) => ({ ...f, label: l }))}
              className={`flex-1 py-2.5 rounded-[14px] text-[13px] font-bold transition-all active:scale-95 ${form.label === l
                  ? "bg-[#F26A1C] text-white shadow-md"
                  : "bg-[#FFF4ED] dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-orange-100 dark:border-gray-700"
                }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Form Fields */}
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1 pb-2 [&::-webkit-scrollbar]:hidden">
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Building size={18} className="text-gray-400" />
            </div>
            <select
              value={form.blockId}
              onChange={(e) => setForm((f) => ({ ...f, blockId: e.target.value }))}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[14px] pl-11 pr-4 py-3.5 text-[14px] text-gray-900 dark:text-white appearance-none outline-none focus:border-[#F26A1C] focus:ring-1 focus:ring-[#F26A1C] transition-all"
            >
              <option value="" disabled>Select Campus Block *</option>
              {CAMPUS_BLOCKS.map((block) => (
                <option key={block.id} value={block.id}>
                  {block.name}
                </option>
              ))}
            </select>
          </div>
          
          <input
            type="text"
            placeholder="Room / Floor number (Optional)"
            value={form.roomNumber}
            onChange={(e) => setForm((f) => ({ ...f, roomNumber: e.target.value }))}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[14px] px-4 py-3.5 text-[14px] text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:border-[#F26A1C] focus:ring-1 focus:ring-[#F26A1C] transition-all"
          />
        </div>

        {/* Default toggle */}
        <button
          onClick={() => setForm((f) => ({ ...f, isDefault: !f.isDefault }))}
          className="flex items-center gap-3 mt-4 w-full active:opacity-70"
        >
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${form.isDefault
                ? "bg-[#F26A1C] border-[#F26A1C]"
                : "border-gray-300 dark:border-gray-600"
              }`}
          >
            {form.isDefault && (
              <Check size={13} className="text-white" strokeWidth={3} />
            )}
          </div>
          <span className="text-[14px] font-semibold text-gray-700 dark:text-gray-300">
            Set as default address
          </span>
        </button>

        <button
          onClick={handleSave}
          disabled={!form.blockId}
          className="w-full mt-6 bg-[#F26A1C] hover:bg-[#e05d15] text-white rounded-[20px] font-bold text-[15px] py-4 shadow-[0_8px_20px_rgba(242,106,28,0.25)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none"
        >
          Save Address
        </button>
      </div>
    </div>
  );
}

// ─── Address Card ──────────────────────────────────────────────────────────────
export function AddressCard({
  address,
  onSetDefault,
  onDelete,
}: {
  address: any;
  onSetDefault: (id: string) => Promise<void>;
  onDelete: (id: string) => void;
}) {
  const [isSetting, setIsSetting] = useState(false);

  const handleSetDefault = async () => {
    setIsSetting(true);
    try {
      await onSetDefault(address.id);
    } finally {
      setIsSetting(false);
    }
  };

  return (
    <div
      className={`w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-[20px] p-4 border shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all ${address.isDefault
          ? "border-[#F26A1C]/30 shadow-[0_4px_20px_rgba(242,106,28,0.12)]"
          : "border-gray-100 dark:border-gray-800"
        }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${address.isDefault ? "bg-[#FFF4ED] dark:bg-orange-900/30" : "bg-gray-50 dark:bg-gray-800"
              }`}
          >
            <MapPin
              size={20}
              className={address.isDefault ? "text-[#F26A1C]" : "text-gray-400"}
            />
          </div>
          <div>
            <p className="font-bold text-[14px] text-gray-900 dark:text-white">
              {address.label}
            </p>
            {address.isDefault && (
              <span className="text-[10px] font-bold text-[#F26A1C] uppercase tracking-wide">
                Default
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(address.id)}
          className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-90"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex items-start gap-2 mb-4">
        <MapPin size={14} className="text-[#F26A1C] shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-200">
            {address.street}
          </p>
          {(address.area || address.building || address.floor) && (
            <p className="text-[12px] text-gray-500 mt-0.5">
              {[address.building, address.floor, address.area]
                .filter(Boolean)
                .join(", ")}
            </p>
          )}
          {address.city && (
            <p className="text-[12px] text-gray-400">{address.city}</p>
          )}
          {address.landmark && (
            <p className="text-[11px] text-gray-400 italic mt-0.5">
              Near: {address.landmark}
            </p>
          )}
        </div>
      </div>

      {!address.isDefault && (
        <button
          onClick={handleSetDefault}
          disabled={isSetting}
          className="w-full py-2.5 text-[13px] font-bold text-[#F26A1C] bg-[#FFF4ED] dark:bg-orange-900/20 rounded-[14px] active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isSetting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : null}
          {isSetting ? "Saving..." : "Set as Default"}
        </button>
      )}
    </div>
  );
}
// ─── Page ──────────────────────────────────────────────────────────────────────
export default function AddressBookPage() {
  const navigate = useNavigate();
  const { addresses, addAddress, deleteAddress, setDefaultAddress } =
    useCustomerStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Wraps addAddress + setDefaultAddress so the default flag is properly
  // synced to the backend when saving a new address marked as default.
  const handleSaveAddress = async (newAddress: any) => {
    addAddress(newAddress);
    if (newAddress.isDefault) {
      await setDefaultAddress(newAddress.id);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans flex flex-col pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md px-5 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-[#FFF4ED] dark:bg-gray-900 rounded-[12px] flex items-center justify-center text-[#F26A1C] active:scale-95 transition-transform"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <h1 className="text-xl font-black text-gray-900 dark:text-white">
              Address Book
            </h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-10 h-10 bg-[#F26A1C] rounded-full flex items-center justify-center text-white shadow-[0_4px_12px_rgba(242,106,28,0.3)] active:scale-95 transition-transform"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      <main className="flex-1 px-5 pt-5">
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-orange-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-5">
              <MapPin size={36} className="text-orange-200" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">
              No Saved Addresses
            </h3>
            <p className="text-sm text-gray-400 font-medium mb-6 max-w-[200px]">
              Save your delivery addresses to speed up checkout.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#F26A1C] text-white font-bold py-3.5 px-8 rounded-full shadow-md active:scale-95 transition-transform"
            >
              Add Address
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <AddressCard
                key={addr.id}
                address={addr}
                onSetDefault={setDefaultAddress}
                onDelete={deleteAddress}
              />
            ))}

            {/* Add more button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-[#F26A1C]/30 rounded-[20px] text-[#F26A1C] font-bold text-[14px] active:scale-[0.98] transition-transform hover:bg-orange-50/50"
            >
              <Plus size={18} />
              Add New Address
            </button>
          </div>
        )}
      </main>

      {isModalOpen && (
        <AddAddressModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveAddress}
        />
      )}
    </div>
  );
}
