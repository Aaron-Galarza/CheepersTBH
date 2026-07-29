import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  /** Variante visual basada en la paleta de Cheepers */
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'neutral';
}

export default function Badge({
  children,
  variant = 'default',
  className = "",
  ...props
}: BadgeProps) {
  
  // Estilos estructurales base (Pill)
  const baseStyles = "inline-flex items-center justify-center px-[6px] py-[2px] text-[0.7rem] font-bold rounded-full whitespace-nowrap";

  // Diccionario de estilos según el contexto (colores extraídos de tu informe)
  const variants = {
    // Rojo primario para notificaciones estándar
    default: "bg-[#e53e3e] text-white", 
    // Usado específicamente en el carrito de compras del Header
    outline: "bg-white text-[#e53e3e] border-2 border-[#e53e3e]", 
    // Estados positivos o "Entregado"
    success: "bg-[#28a745] text-white", 
    // Estados de alerta o "Pendiente"
    warning: "bg-[#ffc107] text-[#2d3748]", 
    // Usado para tags de "Delivery" o info secundaria
    neutral: "bg-[#e2e8f0] text-[#4a5568]", 
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}