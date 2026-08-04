import {
  Gamepad2,
  Swords,
  Car,
  Crosshair,
  Ghost,
  Sparkles,
  Globe,
  Trophy,
  Puzzle,
  Brain,
  Map
} from "lucide-react";

import { Link } from "wouter";

import {
  useListCategories,
  getListCategoriesQueryKey
} from "@workspace/api-client-react";


const icons:any = {
  accion: Swords,
  carreras: Car,
  shooter: Crosshair,
  terror: Ghost,
  rpg: Sparkles,
  estrategia: Brain,
  aventura: Map,
  "mundo abierto": Globe,
  deportes: Trophy,
  puzzle: Puzzle,
  arcade: Gamepad2,
};


const colors:any = {
  accion: "bg-red-500/10 border-red-500/30 text-red-400",
  carreras: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
  shooter: "bg-orange-500/10 border-orange-500/30 text-orange-400",
  terror: "bg-purple-500/10 border-purple-500/30 text-purple-400",
  rpg: "bg-pink-500/10 border-pink-500/30 text-pink-400",
  estrategia: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  aventura: "bg-green-500/10 border-green-500/30 text-green-400",
  "mundo abierto": "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
  deportes: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  puzzle: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
  arcade: "bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400",
};


export function Categories(){

  const {data} = useListCategories({
    query:{
      queryKey:getListCategoriesQueryKey()
    }
  });


  const categories:any[] = Array.isArray(data) ? data : [];


  return (
    <section className="mt-6 px-6">

      <h2 className="text-xl font-black mb-4">
        🔥 Explorar categorías
      </h2>


      <div className="
        flex
        gap-3
        overflow-x-auto
        pb-3
        scrollbar-hide
      ">

      {categories.map((category)=>{

        const key = category.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g,"");


        const Icon = icons[key] || Gamepad2;
        const style = colors[key] || "bg-zinc-500/10 border-zinc-500/30 text-zinc-400";


        return (

          <Link
            key={category.name}
            href={`/category/${encodeURIComponent(category.name)}`}
          >

            <div
              className={`
                min-w-[125px]
                h-[85px]
                rounded-3xl
                border
                flex
                flex-col
                items-center
                justify-center
                gap-2
                transition
                active:scale-95
                ${style}
              `}
            >

              <Icon size={27}/>

              <span className="
                text-sm
                font-bold
                text-white
              ">
                {category.name}
              </span>

            </div>

          </Link>

        );

      })}

      </div>

    </section>
  );
}
