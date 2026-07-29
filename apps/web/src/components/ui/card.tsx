import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card({ 
  className = "", 
  children, 
  ...props 
}: CardProps) {
  return (
    <div
      className={`
        bg-white 
        border border-gray-200 
        rounded-lg 
        shadow-sm 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}