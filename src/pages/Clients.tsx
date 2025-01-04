import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { ClientsTable } from '../components/clients/ClientsTable';
import { ClientDashboard } from '../components/clients/ClientDashboard';
import { AddClientModal } from '../components/clients/AddClientModal';
import type { Client } from '../types/client';

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const selectedClient = clients.find(client => client.id === selectedClientId);

  const handleAddClient = (newClient: Client) => {
    setClients(prev => [...prev, newClient]);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {selectedClient ? (
        <ClientDashboard
          client={selectedClient}
          onBack={() => setSelectedClientId(null)}
        />
      ) : (
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Clients</h1>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                Waitlist
              </button>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Client
              </button>
            </div>
          </div>

          <ClientsTable
            clients={clients}
            onClientClick={setSelectedClientId}
          />

          <AddClientModal 
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddClient}
          />
        </div>
      )}
    </div>
  );
}