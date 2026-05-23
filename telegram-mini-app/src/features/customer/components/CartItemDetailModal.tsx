import { useEffect, useState } from "react";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { TextArea } from "./TextArea";
import type { CartItem } from "@/store/cart/cartStore";

interface CartItemDetailModalProps {
  item: CartItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (foodId: string, instructions: string) => void;
}

export function CartItemDetailModal({
  item,
  isOpen,
  onClose,
  onSave,
}: CartItemDetailModalProps) {
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    setInstructions(item?.specialInstructions || "");
  }, [item]);

  if (!item) return null;

  const handleSave = () => {
    onSave(item.id, instructions);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cart Item Detail">
      <div className="flex flex-col gap-6">
        {/* Item Summary Area */}
        <div className="flex items-center gap-4 border border-gray-100 bg-white rounded-2xl px-4 py-3 shadow-sm">
          {/* Circular image */}
          <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-white shadow ring-2 ring-gray-100">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-[10px] font-semibold text-gray-400">
                No image
              </span>
            )}
          </div>
          <div className="flex-1">
            <p className="text-base font-bold text-gray-900 truncate">
              {item.name}
            </p>
            <p className="text-sm font-bold text-[#F26A1C] mt-0.5 tracking-tight">
              {item.quantity}X
            </p>
          </div>
        </div>

        {/* Input Area */}
        <div className="flex flex-col gap-2">
          <TextArea
            label="Order Modification(If Any)"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Add special requests, allergies, etc..."
            className="h-24 resize-none"
            focusOnLoad
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-1">
          <Button variant="outlined" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} className="flex-1">
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
