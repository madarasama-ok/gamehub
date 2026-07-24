import { Link } from "wouter";
import { Gamepad2, Play, Music, Tv, Youtube } from "lucide-react";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-border">
      <div className="flex justify-around items-center h-16">

        <Link href="/">
          <div className="flex flex-col items-center text-xs text-muted-foreground">
            <Gamepad2 size={24}/>
            <span>Juegos</span>
          </div>
        </Link>

        <Link href="/apps">
          <div className="flex flex-col items-center text-xs text-muted-foreground">
            <Play size={24}/>
            <span>Apps</span>
          </div>
        </Link>

        <Link href="/spotify">
          <div className="flex flex-col items-center text-xs text-muted-foreground">
            <Music size={24}/>
            <span>Spotify</span>
          </div>
        </Link>

        <Link href="/netflix">
          <div className="flex flex-col items-center text-xs text-muted-foreground">
            <Tv size={24}/>
            <span>Netflix</span>
          </div>
        </Link>

        <Link href="/youtube">
          <div className="flex flex-col items-center text-xs text-muted-foreground">
            <Youtube size={24}/>
            <span>YouTube</span>
          </div>
        </Link>

      </div>
    </nav>
  );
}
