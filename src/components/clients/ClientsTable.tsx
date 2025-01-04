import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { Client } from '../../types/client';

interface ClientsTableProps {
  clients: Client[];
  onClientClick: (clientId: string) => void;
}

export function ClientsTable({ clients, onClientClick }: ClientsTableProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-4 px-4 py-3 text-gray-400 border-b border-gray-800">
        <div className="col-span-2">Client's name</div>
        <div>Start date</div>
        <div>End Date</div>
        <div>Workouts</div>
        <div>Diet</div>
        <div>Last update</div>
      </div>
      <div className="divide-y divide-gray-800">
        {clients.map((client) => (
          <div
            key={client.id}
            className="grid grid-cols-7 gap-4 px-4 py-3 hover:bg-gray-800 cursor-pointer items-center"
            onClick={() => onClientClick(client.id)}
          >
            <div className="col-span-2 flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden">
                {client.avatar && (
                  <img
                    src={client.avatar}
                    alt={client.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <span className="text-white">{client.name}</span>
            </div>
            <div>{client.startDate}</div>
            <div>{client.endDate}</div>
            <div className="flex items-center gap-1">
              <span className={client.workoutScore >= 7 ? 'text-green-500' : 'text-red-500'}>•</span>
              {client.workoutScore}/10
            </div>
            <div className="flex items-center gap-1">
              <span className={client.dietScore >= 7 ? 'text-green-500' : 'text-red-500'}>•</span>
              {client.dietScore}/10
            </div>
            <div>{client.lastUpdate}</div>
            <div className="flex justify-end">
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}