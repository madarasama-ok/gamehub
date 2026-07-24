import { useState, useEffect } from "react";

const FAVORITES_KEY = "legendleo_favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse favorites", e);
    }
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const newFavs = prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const isFavorite = (id: number) => favorites.includes(id);

  return { favorites, toggleFavorite, isFavorite };
}