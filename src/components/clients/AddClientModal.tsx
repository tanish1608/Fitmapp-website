import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Client } from '../../types/client';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (client: Omit<Client, 'id' | 'trainer_id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

export function AddClientModal({ isOpen, onClose, onAdd }: AddClientModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    is_vegetarian: false,
    dietary_restrictions: '',
    movement_restrictions: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const client = {
      name: formData.name,
      email: formData.email || null,
      age: formData.age ? parseInt(formData.age) : null,
      gender: formData.gender || null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      height: formData.height || null,
      is_vegetarian: formData.is_vegetarian,
      dietary_restrictions: formData.dietary_restrictions.split(',').filter(Boolean),
      movement_restrictions: formData.movement_restrictions.split(',').filter(Boolean)
    };

    await onAdd(client);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add New Client</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input
                type="text"
                required
                className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Age</label>
              <input
                type="number"
                className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
                value={formData.age}
                onChange={e => setFormData(prev => ({ ...prev, age: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Gender</label>
              <select
                className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
                value={formData.gender}
                onChange={e => setFormData(prev => ({ ...prev, gender: e.target.value }))}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
                value={formData.weight}
                onChange={e => setFormData(prev => ({ ...prev, weight: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Height</label>
              <input
                type="text"
                placeholder="e.g., 5'11 or 180cm"
                className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
                value={formData.height}
                onChange={e => setFormData(prev => ({ ...prev, height: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Dietary Restrictions</label>
            <input
              type="text"
              placeholder="Comma separated values"
              className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
              value={formData.dietary_restrictions}
              onChange={e => setFormData(prev => ({ ...prev, dietary_restrictions: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Movement Restrictions</label>
            <input
              type="text"
              placeholder="Comma separated values"
              className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
              value={formData.movement_restrictions}
              onChange={e => setFormData(prev => ({ ...prev, movement_restrictions: e.target.value }))}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isVegetarian"
              checked={formData.is_vegetarian}
              onChange={e => setFormData(prev => ({ ...prev, is_vegetarian: e.target.checked }))}
              className="rounded border-gray-600 text-purple-500 focus:ring-purple-500"
            />
            <label htmlFor="isVegetarian" className="text-sm text-gray-400">Vegetarian</label>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:bg-gray-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              Add Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}