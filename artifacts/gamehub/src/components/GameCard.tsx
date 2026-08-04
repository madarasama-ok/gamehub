import { Link } from "wouter";
import { Download } from "lucide-react";
import { Game } from "@workspace/api-client-react/src/generated/api.schemas";
import { StarRating } from "./StarRating";

function getBadgeStyle(badge?: string) {
  const value = (badge || "").trim().toUpperCase();

  if (value.includes("MOD")) {
    return "bg-green-500 text-white border-green-400 shadow-green-500/40";
  }

  if (
    value.includes("NUEVO") ||
    value.includes("NEW")
  ) {
    return "bg-red-500 text-white border-red-400 shadow-red-500/40";
  }

  if (
    value.includes("ACTUALIZACIÓN") ||
    value.includes("ACTUALIZACION") ||
    value.includes("UPDATE")
  ) {
    return "bg-orange-500 text-white border-orange-400 shadow-orange-500/40";
  }

  if (value.includes("ONLINE")) {
    return "bg-blue-500 text-white border-blue-400 shadow-blue-500/40";
  }

  if (value.includes("OFFLINE")) {
    return "bg-red-500 text-white border-red-400 shadow-red-500/40";
  }

  if (
    value.includes("EDITOR") ||
    value.includes("CHOICE")
  ) {
    return "bg-orange-500 text-white border-orange-400 shadow-orange-500/40";
  }

  return "bg-primary text-primary-foreground border-primary/70 shadow-primary/40";
}

export function GameCard({ game }: { game: Game }) {
  const badgeStyle = getBadgeStyle(game.badge);

  return (
    <Link
      href={`/game/${game.id}`}
      className="group block h-full"
    >
      <div className="relative bg-card rounded-2xl overflow-hidden border border-border/50 transition-all duration-300 hover:border-primary/50 hover:glow-primary hover:-translate-y-1 h-full flex flex-col">

        <div className="aspect-[16/9] w-full overflow-hidden relative bg-muted">

          <img
            src={game.imageUrl}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          {game.badge && (
            <div className="absolute top-3 left-3 z-20">
              <span
                className={[
                  "inline-flex items-center",
                  "rounded-full",
                  "border",
                  "px-2.5 py-1",
                  "text-[10px]",
                  "font-extrabold",
                  "tracking-wide",
                  "uppercase",
                  "shadow-lg",
                  game.badgeColor
                    ? "text-white border-white/30"
                    : badgeStyle,
                ].join(" ")}
                style={
                  game.badgeColor
                    ? {
                        backgroundColor: game.badgeColor,
                        boxShadow: `0 8px 24px ${game.badgeColor}66`,
                      }
                    : undefined
                }
              >
                {game.badge}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-black/55 text-white border border-white/20 backdrop-blur-md rounded-full">
              {game.category}
            </span>
          </div>

        </div>

        <div className="p-4 flex-1 flex flex-col justify-between z-10 -mt-6">
          <div>
            <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors mb-2">
              {game.title}
            </h3>

            <div className="flex items-center justify-between">
              <StarRating rating={game.rating} />

              <div className="flex items-center text-xs text-muted-foreground gap-1 bg-secondary/50 px-2 py-1 rounded-md">
                <Download className="w-3 h-3" />

                {game.downloadCount > 999
                  ? `${(game.downloadCount / 1000).toFixed(1)}k`
                  : game.downloadCount}
              </div>
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}
