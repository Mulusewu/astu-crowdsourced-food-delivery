// src/features/customer/pages/SearchPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const recentSearches = ["Special Kitfo", "Doro Wat", "Macchiato", "Tegabino"];

  const priceRanges = ["30-80", "80-100", "100-150", "150-200", "200-300", "300-500"];
  const locations = ["Bole Gate", "Bole Atlas", "CMC Road", "Kazanchis", "Gerji", "Around CMC"];

  const togglePrice = (range: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const toggleLocation = (loc: string) => {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );
  };

  const handleApplyFilters = () => {
    // TODO: Later integrate with search logic
    console.log("Applied filters:", { searchQuery, selectedPriceRanges, selectedLocations });
    navigate(-1); // Go back after applying
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Orange Header */}
      <div className="bg-[#F26A1C] text-white px-4 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold">Search</h1>
        </div>

        {/* Search Input */}
        <div className="mt-4 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70" size={20} />
          <Input
            type="text"
            placeholder="Search restaurants or dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 bg-white/20 border-white/30 text-white placeholder:text-white/70 rounded-2xl h-12"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-140px)]">
        <div className="px-4 py-6 space-y-8">
          {/* Recent Searches */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Recent Searches</h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((item, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="px-4 py-2 text-sm bg-white hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSearchQuery(item)}
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Price</h3>
            <div className="flex flex-wrap gap-2">
              {priceRanges.map((range) => (
                <Badge
                  key={range}
                  variant={selectedPriceRanges.includes(range) ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 ${
                    selectedPriceRanges.includes(range)
                      ? "bg-[#F26A1C] text-white hover:bg-[#F26A1C]/90"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => togglePrice(range)}
                >
                  ETB {range}
                </Badge>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Location</h3>
            <div className="flex flex-wrap gap-2">
              {locations.map((loc) => (
                <Badge
                  key={loc}
                  variant={selectedLocations.includes(loc) ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 ${
                    selectedLocations.includes(loc)
                      ? "bg-[#F26A1C] text-white hover:bg-[#F26A1C]/90"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => toggleLocation(loc)}
                >
                  {loc}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Apply Changes Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <Button
          onClick={handleApplyFilters}
          className="w-full h-14 text-base font-semibold bg-[#F26A1C] hover:bg-[#F26A1C]/90 rounded-2xl"
        >
          Apply Changes
        </Button>
      </div>
    </div>
  );
}