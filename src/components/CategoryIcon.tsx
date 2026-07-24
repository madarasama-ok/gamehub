import { Swords, Sparkles, Ghost, Trophy, Brain, Map, Shield, Gamepad2 } from "lucide-react";

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  switch (name.toLowerCase()) {
    case "acción": return <Swords className={className} />;
    case "anime": return <Sparkles className={className} />;
    case "terror": return <Ghost className={className} />;
    case "deportes": return <Trophy className={className} />;
    case "estrategia": return <Brain className={className} />;
    case "aventura": return <Map className={className} />;
    case "rpg": return <Shield className={className} />;
    default: return <Gamepad2 className={className} />;
  }
}