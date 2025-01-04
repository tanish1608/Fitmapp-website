import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  subtitle?: string;
}

export function StatCard({ title, value, change, subtitle }: StatCardProps) {
  return (
    <div className="bg-[#1a1a1a] p-4 rounded-lg">
      <div className="text-3xl font-bold mb-1">{value}</div>
      {change && (
        <div className="text-sm text-green-500 mb-1">
          {change}
        </div>
      )}
      <div className="text-gray-400 text-sm">{title}</div>
      {subtitle && (
        <div className="text-sm text-red-500 mt-1">{subtitle}</div>
      )}
    </div>
  );
}