import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ 
  children, 
  className = "", 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center 
        bg-[#e53e3e] text-white font-medium 
        py-[10px] px-[24px] rounded-[8px] 
        transition-colors duration-200 
        hover:bg-[#e41212] 
        focus:outline-none focus:ring-2 focus:ring-[#e53e3e] focus:ring-offset-2 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}