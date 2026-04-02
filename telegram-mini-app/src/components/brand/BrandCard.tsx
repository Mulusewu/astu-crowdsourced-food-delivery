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
  );
}
