import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { ClientsTable } from '../components/clients/ClientsTable';
import { ClientDashboard } from '../components/clients/ClientDashboard';
import { AddClientModal } from '../components/clients/AddClientModal';
import { useClientStore } from '../stores/clientStore';

export function ClientsPage() {
  const { clients, selectedClient, isLoading, error, loadClients, selectClient, addClient } = useClientStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-400">
        Loading clients...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {selectedClient ? (
        <ClientDashboard
          client={selectedClient}
          onBack={() => selectClient(null)}
        />
      ) : (
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-2">Clients</h1>
              <p className="text-gray-400">
                {clients.length} {clients.length === 1 ? 'client' : 'clients'} total
              </p>
            </div>
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
            onClientClick={(id) => selectClient(id)}
          />

          <AddClientModal 
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={addClient}
          />
        </div>
      )}
    </div>
  );
}