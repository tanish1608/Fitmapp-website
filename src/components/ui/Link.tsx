import React from 'react';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  mini?: boolean;
  onClick?: () => void;
}

export function Link({ href, children, active, mini, onClick }: LinkProps) {
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors ${
        active ? 'bg-purple-500/10 text-purple-500' : ''
      } ${mini ? 'justify-center' : ''}`}
    >
      {children}
    </a>
  );
}