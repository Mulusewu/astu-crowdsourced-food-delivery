import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header Skeleton */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-4">
        <Skeleton className="h-8 w-32 mb-4" />

        {/* Filter Row Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>

      {/* Orders List Skeleton */}
      <div className="px-4 py-4 space-y-3">
        {/* Generate 4 skeleton cards */}
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden border border-gray-100">
            {/* Cafe Header Skeleton */}
            <div className="flex items-center justify-between p-3 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>

            {/* Order Items Skeleton */}
            <div className="p-3">
              <div className="flex gap-3">
                {/* Food Image Skeleton */}
                <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />

                {/* Order Details Skeleton */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>

                  {/* Order Meta Skeleton */}
                  <div className="flex flex-wrap gap-3">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>

                  {/* Location Skeleton */}
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>

              {/* Separator Skeleton */}
              <div className="my-3">
                <Skeleton className="h-[1px] w-full" />
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 flex-1 rounded-lg" />
                <Skeleton className="h-9 flex-1 rounded-lg" />
              </div>
            </div>
          </Card>
        ))}

        {/* Loading More Indicator Skeleton */}
        <div className="py-4 space-y-3">
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="text-center">
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingSkeleton;
