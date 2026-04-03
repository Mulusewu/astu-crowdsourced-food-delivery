import { useState, useMemo } from "react";
import localDb from "@/lib/localDb.json";
import type { Restaurant } from "@/types/restaurant";

const restaurants = localDb.restaurants as Restaurant[];

export const useRestaurants = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Restaurants");
  
  const [sortBy, setSortBy] = useState("Location");
  const [filterBy, setFilterBy] = useState("All");

  const displayedRestaurants = useMemo(() => {
    let result = [...restaurants];

    // Search
    result = result.filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase())
    );

    // Category
    if (selectedCategory !== "All") {
      result = result.filter((r) => r.tags.includes(selectedCategory));
    }

    // Location filter
    if (filterBy !== "All") {
      result = result.filter((r) => r.location === filterBy);
    }

    // Sorting
    if (sortBy === "Rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "Location") {
      result.sort((a, b) => a.location.localeCompare(b.location));
    } else if (sortBy === "Newest To Oldest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "Oldest To Newest") {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    return result;
  }, [search, selectedCategory, filterBy, sortBy]);

  const topRestaurants = useMemo(() => {
    return [...displayedRestaurants].sort((a, b) => b.rating - a.rating).slice(0, 5);
  }, [displayedRestaurants]);

  const popular = useMemo(() => {
    // Picking adjacent top items for popular variation
    return displayedRestaurants.length > 5 
      ? displayedRestaurants.slice(2, 7)
      : displayedRestaurants;
  }, [displayedRestaurants]);

  const nearForYou = useMemo(() => {
    return displayedRestaurants.filter(r => ["In-Campus", "Main Gate", "Geda Gate"].includes(r.location)).slice(0, 5);
  }, [displayedRestaurants]);

  return {
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    displayedRestaurants,
    topRestaurants,
    popular,
    nearForYou
  };
};
