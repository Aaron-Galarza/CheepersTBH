"use client";

import Link from "next/link";
import { Pizza, CupSoda, Sandwich, Cake, Star, Utensils } from "lucide-react";

export default function Navigation() {
  const categories = [
    { name: "Hamburguesas", icon: Utensils, href: "#hamburguesas" },
    { name: "Papas Fritas", icon: Utensils, href: "#papas-fritas" },
    { name: "Pizzas", icon: Pizza, href: "#pizzas" },
    { name: "Bebidas", icon: CupSoda, href: "#bebidas" },
    { name: "Sandwich", icon: Sandwich, href: "#sandwich" },
    { name: "Postres", icon: Cake, href: "#postres" },
    { name: "Promos", icon: Star, href: "#promos" },
  ];

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-4 md:px-6">
        {/* 
          CAMBIO CLAVE: 
          - flex-wrap: Permite que los elementos pasen a la siguiente fila.
          - justify-center: Mantiene todo centrado para que las filas queden balanceadas.
          - gap-x-4 gap-y-4: Separación controlada entre columnas y filas en móvil.
        */}
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-4 md:gap-x-10">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <li key={category.name}>
                <Link
                  href={category.href}
                  className="group flex items-center gap-2 text-[#2d3748] transition-colors duration-200 hover:text-[#e53e3e]"
                >
                  <Icon 
                    size={20} 
                    className="text-[#e53e3e] transition-transform duration-200 group-hover:scale-110" 
                  />
                  {/* whitespace-nowrap asegura que la palabra no se rompa a la mitad, forzando al contenedor a bajarla de fila entera */}
                  <span className="font-bold text-[14px] md:text-[15px] whitespace-nowrap">
                    {category.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}