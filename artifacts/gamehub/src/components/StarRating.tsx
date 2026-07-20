import { Star } from "lucide-react";

export function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5 text-accent">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-3.5 h-3.5 fill-current" />
      ))}
      {hasHalfStar && (
        <div className="relative w-3.5 h-3.5">
          <Star className="w-3.5 h-3.5 text-muted-foreground absolute inset-0" />
          <div className="overflow-hidden w-[50%] absolute inset-0 text-accent">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-3.5 h-3.5 text-muted-foreground" />
      ))}
    </div>
  );
}