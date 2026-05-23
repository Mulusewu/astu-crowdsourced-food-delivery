// import * as Dialog from "@radix-ui/react-dialog";
// import { ReactNode } from "react";
// import { cn } from "@/lib/utils";

// interface ModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     title: string;
//     description: string;
//     children: ReactNode;
//     className?: string;
// }

// const PopUpModal = ({ isOpen, onClose, title, description, children, className }: ModalProps) => {
//     return (
//         <Dialog.Root open={isOpen} onOpenChange={onClose}>
//             <Dialog.Portal>
//                 <Dialog.Overlay className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px]" />
//                 <Dialog.Content className={cn("fixed left-1/2 top-1/2 z-50 w-full max-w-[calc(100%-40px)] -translate-x-1/2 -translate-y-1/2 rounded-[24px] bg-white p-6 shadow-2xl focus:outline-none text-center", className)}>
//                     <Dialog.Title className="text-[17px] font-black text-gray-900 leading-tight mb-2">
//                         {title}
//                     </Dialog.Title>
//                     <Dialog.Description className="text-[12px] font-semibold text-gray-500 mb-6">
//                         {description}
//                     </Dialog.Description>
//                     <div className="flex gap-3 justify-center">{children}</div>
//                 </Dialog.Content>
//             </Dialog.Portal>
//         </Dialog.Root>
//     );
// };

// export default PopUpModal;