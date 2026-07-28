"use client";

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  /** Permite ajustar el ancho máximo según el contenido (ej: form vs confirmación) */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'; 
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = "",
  maxWidth = "md"
}: ModalProps) {

  // Efecto para bloquear el scroll del fondo y cerrar con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Bloquea el scroll de la página
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset'; // Restaura el scroll al desmontar
    };
  }, [isOpen, onClose]);

  // Renderizado condicional (si no está abierto, no renderiza nada)
  if (!isOpen) return null;

  // Diccionario de anchos máximos responsivos
  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  return (
    // Contenedor principal: fixed, centrado, y z-index ultra alto
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      
      {/* Overlay Semitransparente (bg-black al 50%) */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Contenedor del Modal */}
      <div
        className={`
          relative w-full ${maxWidthClass} max-h-[90vh] flex flex-col
          bg-white rounded-[12px] shadow-[0_15px_35px_rgba(0,0,0,0.15)]
          /* Animación fadeIn definida en tu informe */
          animate-[fadeIn_0.5s_ease-out_forwards]
          ${className}
        `}
        role="dialog"
        aria-modal="true"
      >
        {/* Header condicional (Si pasas un título, renderiza cabecera, si no, solo el botón flotante) */}
        {title ? (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
            <h3 className="font-bold text-[1.5rem] text-[#2d3748] font-['Montserrat',sans-serif]">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-[#a0aec0] hover:text-[#e53e3e] transition-colors p-1 rounded-full hover:bg-[#edf2f7]"
              aria-label="Cerrar modal"
            >
              <X size={24} />
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-[#a0aec0] hover:text-[#e53e3e] transition-colors p-1 rounded-full hover:bg-[#edf2f7]"
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        )}

        {/* Contenido principal (con overflow automático si el contenido es muy largo) */}
        <div className="p-6 overflow-y-auto font-['Inter',sans-serif]">
          {children}
        </div>
      </div>
    </div>
  );
}