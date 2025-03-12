import React from 'react';
import { Dumbbell } from 'lucide-react';

interface LogoProps {
  className?: string;
}

export function Logo({ className = 'h-6' }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <Dumbbell className={`text-purple-500 ${className}`} />
      <span className="text-white font-bold text-xl">fitmapp</span>
    </div>
  );
}