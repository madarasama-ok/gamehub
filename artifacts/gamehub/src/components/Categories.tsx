import {
  Gamepad2,
  Swords,
  Car,
  Crosshair,
  Ghost,
  Sparkles,
  Globe,
  Trophy,
  Puzzle
} from "lucide-react";

const categories = [
  {name:"Arcade", icon:Gamepad2},
  {name:"Acción", icon:Swords},
  {name:"Carreras", icon:Car},
  {name:"Shooter", icon:Crosshair},
  {name:"Terror", icon:Ghost},
  {name:"RPG", icon:Sparkles},
  {name:"Mundo abierto", icon:Globe},
  {name:"Deportes", icon:Trophy},
  {name:"Puzzle", icon:Puzzle},
];

export function Categories(){

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

const Icon = category.icon;

return (

<button
key={category.name}
className="
min-w-[120px]
h-[80px]
rounded-3xl
bg-[#121018]
border
border-white/10
flex
flex-col
items-center
justify-center
gap-2
transition
active:scale-95
hover:border-purple-500
"
>

<Icon
size={25}
className="text-purple-400"
/>

<span className="text-sm font-bold">
{category.name}
</span>

</button>

)

})}

</div>

</section>
)

}
