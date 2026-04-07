import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Package,
  Star,
  ChevronRight,
  Calendar,
} from "lucide-react";
import BottomNav from "@/components/common/BottomNav1";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface EarningsSummary {
  today: number;
  thisWeek: number;
  thisMonth: number;
  totalDeliveries: number;
  averageRating: number;
  pendingPayout: number;
}

export default EarningsPage;

//  <div className="flex items-center justify-between mb-3">
//           <Button
//             variant="ghost"
//             onClick={() => navigate("/delivery/dashboard")}
//             className="flex items-center gap-1 text-primary hover:text-primary/80 hover:bg-primary/5 -ml-2"
//           >
//             <ChevronLeft size={20} />
//             <span className="font-medium">Back to Dashboard</span>
//           </Button>

//           {/* Optional: Quick stats badge */}
//           <Badge className="bg-primary/10 text-primary border-0">
//             {filteredOrders.length} Available
//           </Badge>
//         </div>
