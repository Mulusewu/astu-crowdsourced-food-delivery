import React from "react";
import { Button } from "./Button";
import { Modal } from "./Modal";

interface ClearCartConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ClearCartConfirmModal: React.FC<ClearCartConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="text-center">
      <div className="flex flex-col items-center gap-4 py-2">
        <h3 className="text-[17px] font-black text-gray-900 leading-tight">
          Are You Sure You Want To
          <br /> Clear Your Cart?
        </h3>
        <p className="text-xs font-semibold text-gray-500">
          All Cart Items Will Be Removed
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <Button variant="outlined" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm} className="flex-1">
          Clear Cart
        </Button>
      </div>
    </Modal>
  );
};
