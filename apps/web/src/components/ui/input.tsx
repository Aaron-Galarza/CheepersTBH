import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Icono opcional de Lucide React que se renderizará a la izquierda */
  icon?: React.ReactNode;
  /** Estado de error que cambia los bordes a rojo */
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", icon, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {/* Contenedor del icono (posición absoluta según el informe) */}
        {icon && (
          <div className="absolute left-[15px] top-1/2 -translate-y-1/2 text-[#a0aec0] flex items-center justify-center">
            {icon}
          </div>
        )}
        
        {/* Input principal */}
        <input
          ref={ref}
          className={`
            w-full bg-white text-[1rem] text-[#4a5568] placeholder-[#718096]
            border rounded-[8px] transition-all duration-200 outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            
            /* Padding condicional: Si hay icono, deja espacio a la izquierda (45px) */
            ${icon ? 'py-[12px] pr-[15px] pl-[45px]' : 'py-[12px] px-[15px]'}
            
            /* Colores de borde y ring de focus (Normal vs Error) */
            ${error 
              ? 'border-[#f87171] focus:border-[#f87171] focus:ring-[3px] focus:ring-[#f87171]/20' 
              : 'border-[#cbd5e0] focus:border-[#e53e3e] focus:ring-[3px] focus:ring-[#e53e3e]/20'
            }
            
            ${className}
          `}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;