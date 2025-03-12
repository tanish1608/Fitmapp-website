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
        <div>Age</div>
        <div>Weight</div>
        <div>Height</div>
        <div>Dietary</div>
        <div>Last update</div>
      </div>
      <div className="divide-y divide-gray-800">
        {clients.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400">
            No clients found. Add your first client to get started.
          </div>
        ) : (
          clients.map((client) => (
            <div
              key={client.id}
              className="grid grid-cols-7 gap-4 px-4 py-3 hover:bg-gray-800 cursor-pointer items-center"
              onClick={() => onClientClick(client.id)}
            >
              <div className="col-span-2 flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden">
                  {client.avatar_url && (
                    <img
                      src={client.avatar_url}
                      alt={client.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <div className="text-white">{client.name}</div>
                  <div className="text-sm text-gray-400">{client.email}</div>
                </div>
              </div>
              <div>{client.age || 'N/A'}</div>
              <div>{client.weight ? `${client.weight} kg` : 'N/A'}</div>
              <div>{client.height || 'N/A'}</div>
              <div className="flex items-center gap-1">
                {client.is_vegetarian && (
                  <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-xs rounded">
                    Vegetarian
                  </span>
                )}
                {client.dietary_restrictions?.length > 0 && (
                  <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-xs rounded">
                    {client.dietary_restrictions.length} restrictions
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">
                  {new Date(client.updated_at).toLocaleDateString()}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}