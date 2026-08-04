import { Link } from "wouter";
import { Download } from "lucide-react";
import { App } from "@workspace/api-client-react/src/generated/api.schemas";
import { StarRating } from "./StarRating";

export function AppCard({ app }: { app: App }) {
  return (
    <Link href={`/app/${app.id}`} className="group block h-full">
      <div className="relative bg-card rounded-2xl overflow-hidden border border-border/50 transition-all duration-300 hover:border-primary/50 hover:glow-primary hover:-translate-y-1 h-full flex flex-col">
        <div className="aspect-[16/9] w-full overflow-hidden relative bg-muted">
          <img
            src={app.imageUrl}
            alt={app.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          {app.badge && (
              <div className="absolute top-3 left-3 z-10">
                <span
                  className="px-2.5 py-1 text-[10px] font-black tracking-wider uppercase text-white border border-white/20 backdrop-blur-md rounded"
                  style={{
                    backgroundColor: app.badgeColor || "#a855f7",
                  }}
                >
                  {app.badge}
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-primary/20 text-primary border border-primary/30 backdrop-blur-md rounded">
              {app.category}
            </span>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between z-10 -mt-6">
          <div>
            <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors mb-2">
              {app.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
              {app.developer}
            </p>
            <div className="flex items-center justify-between">
              <StarRating rating={app.rating} />
              <div className="flex items-center text-xs text-muted-foreground gap-1 bg-secondary/50 px-2 py-1 rounded-md">
                <Download className="w-3 h-3" />
                {app.downloadCount > 999 ? `${(app.downloadCount/1000).toFixed(1)}k` : app.downloadCount}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
