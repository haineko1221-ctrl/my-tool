import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
};

export default function Card({ children, className = '', title }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      {children}
    </div>
  );
}
