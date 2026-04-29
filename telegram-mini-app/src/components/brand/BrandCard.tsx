import { Card } from "@/components/ui/card";

export function BrandCard() {
  return (
    <Card className="w-full max-w-sm mx-auto p-6 text-center">
      <div className="text-3xl font-bold">
        <span className="text-black">ASTU</span>
        <span style={{ color: "#F26A1C" }}>EATS</span>
      </div>
      <div className="text-sm font-semibold mt-1 uppercase">
        <span style={{ color: "#F26A1C" }}>Delivery</span>
      </div>
    </Card>
    //  <div className="absolute top-16 flex items-center justify-center gap-2">
    //       <div className="flex flex-col items-end">
    //         <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">ASTU</span>
    //         <span className="text-2xl font-black text-[#F26A1C] tracking-tighter leading-none">EATS</span>
    //       </div>
    //       <div className="flex flex-col items-center">
    //         <Bike size={32} className="text-[#F26A1C]" strokeWidth={2.5} />
    //         <span className="text-[10px] font-bold text-[#F26A1C] italic mt-0.5">Delivery</span>
    //       </div>
    //     </div>
  );
}
