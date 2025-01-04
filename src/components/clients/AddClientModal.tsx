import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (client: any) => void;
}

export function AddClientModal({ isOpen, onClose, onAdd }: AddClientModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'M',
    weight: '',
    height: '',
    isVegetarian: false,
    dietaryRestrictions: '',
    movementRestrictions: '',
    plan: 'Basic Plan'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startDate = new Date().toLocaleDateString();
    const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString();

    const newClient = {
      id: crypto.randomUUID(),
      ...formData,
      startDate,
      endDate,
      workoutScore: 0,
      dietScore: 0,
      lastUpdate: new Date().toLocaleDateString(),
      dietaryRestrictions: formData.dietaryRestrictions.split(',').filter(Boolean),
      movementRestrictions: formData.movementRestrictions.split(',').filter(Boolean),
      plan: {
        name: formData.plan,
        startDate,
        endDate
      },
      sessionsCompleted: 0,
      complianceRate: 0
    };

    onAdd(newClient);
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
              <label className="block text-sm text-gray-400 mb-1">Age</label>
              <input
                type="number"
                required
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
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Weight (kg)</label>
              <input
                type="number"
                required
                className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
                value={formData.weight}
                onChange={e => setFormData(prev => ({ ...prev, weight: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Height</label>
              <input
                type="text"
                required
                placeholder="5'11"
                className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
                value={formData.height}
                onChange={e => setFormData(prev => ({ ...prev, height: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Plan</label>
              <select
                className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
                value={formData.plan}
                onChange={e => setFormData(prev => ({ ...prev, plan: e.target.value }))}
              >
                <option value="Basic Plan">Basic Plan</option>
                <option value="Premium Plan">Premium Plan</option>
                <option value="Elite Plan">Elite Plan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Dietary Restrictions</label>
            <input
              type="text"
              placeholder="Comma separated values"
              className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
              value={formData.dietaryRestrictions}
              onChange={e => setFormData(prev => ({ ...prev, dietaryRestrictions: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Movement Restrictions</label>
            <input
              type="text"
              placeholder="Comma separated values"
              className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
              value={formData.movementRestrictions}
              onChange={e => setFormData(prev => ({ ...prev, movementRestrictions: e.target.value }))}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isVegetarian"
              checked={formData.isVegetarian}
              onChange={e => setFormData(prev => ({ ...prev, isVegetarian: e.target.checked }))}
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