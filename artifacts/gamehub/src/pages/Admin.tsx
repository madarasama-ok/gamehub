import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useCreateGame, useCreateApp } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

type Tab = "game" | "app";

const emptyForm = {
  title: "",
  description: "",
  category: "",
  developer: "",
  imageUrl: "",
  rating: "4.0",
  platform: "Android",
  size: "",
  version: "",
  downloadUrl: "#",
  featured: false,
  popular: false,
  featuresText: "",
};

export default function Admin() {
  const [adminKey, setAdminKey] = useState<string | null>(() => localStorage.getItem("admin_key"));
  const [passwordInput, setPasswordInput] = useState("");
  const [tab, setTab] = useState<Tab>("game");
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();

  const createGame = useCreateGame();
  const createApp = useCreateApp();

  const isPending = createGame.isPending || createApp.isPending;

  const handleChange = (field: keyof typeof emptyForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => setForm(emptyForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const featuresArray = form.featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const basePayload = {
      title: form.title,
      description: form.description,
      category: form.category,
      imageUrl: form.imageUrl,
      rating: parseFloat(form.rating) || 0,
      platform: form.platform,
      size: form.size,
      version: form.version,
      downloadUrl: form.downloadUrl,
      featured: form.featured,
      popular: form.popular,
    };

    if (tab === "game") {
      createGame.mutate(
        { data: { ...basePayload, modFeatures: featuresArray } },
        {
          onSuccess: () => {
            toast({ title: "¡Juego creado!", description: form.title });
            resetForm();
          },
          onError: (error: any) => {
            if (error?.status === 401) {
              localStorage.removeItem("admin_key");
              setAdminKey(null);
              toast({ title: "Sesión inválida", description: "Volvé a ingresar la contraseña", variant: "destructive" });
              return;
            }
            toast({ title: "Error", description: "No se pudo crear el juego", variant: "destructive" });
          },
        }
      );
    } else {
      createApp.mutate(
        { data: { ...basePayload, developer: form.developer, features: featuresArray } },
        {
          onSuccess: () => {
            toast({ title: "¡App creada!", description: form.title });
            resetForm();
          },
          onError: (error: any) => {
            if (error?.status === 401) {
              localStorage.removeItem("admin_key");
              setAdminKey(null);
              toast({ title: "Sesión inválida", description: "Volvé a ingresar la contraseña", variant: "destructive" });
              return;
            }
            toast({ title: "Error", description: "No se pudo crear la app", variant: "destructive" });
          },
        }
      );
    }
  };

  if (!adminKey) {
    return (
      <div className="min-h-[100dvh] bg-background text-foreground flex items-center justify-center p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            localStorage.setItem("admin_key", passwordInput);
            setAdminKey(passwordInput);
          }}
          className="bg-card/50 border border-border/50 rounded-2xl p-8 w-full max-w-sm space-y-4"
        >
          <h1 className="text-2xl font-black text-white text-glow">🔒 Panel de administración</h1>
          <input
            type="password"
            placeholder="Contraseña"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full h-11 bg-secondary/50 border border-border/50 rounded-lg px-3 text-sm"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl transition-all"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground pb-20">
      <header className="p-4 container mx-auto pt-6">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium text-sm">Volver</span>
        </Link>
      </header>

      <main className="container mx-auto px-4 pb-24 max-w-2xl">
        <h1 className="text-3xl font-black text-white text-glow mb-6">
          ⚙️ Panel de administración
        </h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setTab("game"); resetForm(); }}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              tab === "game" ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground"
            }`}
          >
            🎮 Juego
          </button>
          <button
            onClick={() => { setTab("app"); resetForm(); }}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              tab === "app" ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground"
            }`}
          >
            🛠️ App
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card/50 border border-border/50 rounded-2xl p-6">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Título</label>
            <input
              required
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full h-10 bg-secondary/50 border border-border/50 rounded-lg px-3 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Descripción</label>
            <textarea
              required
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full h-20 bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Categoría</label>
              <input
                required
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full h-10 bg-secondary/50 border border-border/50 rounded-lg px-3 text-sm"
              />
            </div>
            {tab === "app" && (
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Desarrollador</label>
                <input
                  value={form.developer}
                  onChange={(e) => handleChange("developer", e.target.value)}
                  className="w-full h-10 bg-secondary/50 border border-border/50 rounded-lg px-3 text-sm"
                />
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">URL de imagen</label>
            <input
              required
              value={form.imageUrl}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
              className="w-full h-10 bg-secondary/50 border border-border/50 rounded-lg px-3 text-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={(e) => handleChange("rating", e.target.value)}
                className="w-full h-10 bg-secondary/50 border border-border/50 rounded-lg px-3 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Tamaño</label>
              <input
                value={form.size}
                onChange={(e) => handleChange("size", e.target.value)}
                placeholder="150 MB"
                className="w-full h-10 bg-secondary/50 border border-border/50 rounded-lg px-3 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Versión</label>
              <input
                value={form.version}
                onChange={(e) => handleChange("version", e.target.value)}
                placeholder="1.0.0"
                className="w-full h-10 bg-secondary/50 border border-border/50 rounded-lg px-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">URL de descarga</label>
            <input
              value={form.downloadUrl}
              onChange={(e) => handleChange("downloadUrl", e.target.value)}
              className="w-full h-10 bg-secondary/50 border border-border/50 rounded-lg px-3 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">
              {tab === "game" ? "Características (una por línea)" : "Features (una por línea)"}
            </label>
            <textarea
              value={form.featuresText}
              onChange={(e) => handleChange("featuresText", e.target.value)}
              className="w-full h-24 bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm resize-none"
              placeholder={"Sin publicidad\nExportación a PDF"}
            />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => handleChange("featured", e.target.checked)}
              />
              Destacado
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.popular}
                onChange={(e) => handleChange("popular", e.target.checked)}
              />
              Popular
            </label>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl transition-all disabled:opacity-60"
          >
            {isPending ? "Guardando..." : tab === "game" ? "Crear juego" : "Crear app"}
          </button>
        </form>
      </main>
    </div>
  );
}
