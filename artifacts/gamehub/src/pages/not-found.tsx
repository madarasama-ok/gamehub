import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background text-foreground text-center px-4">
      <h1 className="text-8xl font-black text-destructive drop-shadow-[0_0_15px_rgba(248,113,113,0.5)] mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-8">Página no encontrada</h2>
      <Link href="/" className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.5)]">
        Volver a la base
      </Link>
    </div>
  );
}