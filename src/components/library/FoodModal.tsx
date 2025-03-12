import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useLibraryStore } from '../../stores/libraryStore';
import type { Food } from '../../types/library';

interface FoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  food?: Food;
}

export function FoodModal({ isOpen, onClose, food }: FoodModalProps) {
  const { categories, addFood, updateFood } = useLibraryStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Food>>(food || {
    name: '',
    description: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    diet_types: [],
    ingredients: [],
    allergens: [],
    image_url: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (food) {
        await updateFood(food.id, formData);
      } else {
        await addFood(formData as Omit<Food, 'id' | 'trainer_id' | 'created_at' | 'updated_at'>);
      }
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {food ? 'Edit Food' : 'Add Food'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="aspect-square w-32 h-32 bg-gray-800 rounded-lg mb-6 flex items-center justify-center">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Handle image upload
                }
              }}
            />
            <button
              type="button"
              className="text-gray-400 hover:text-white"
              onClick={() => {
                // Trigger file input
              }}
            >
              Upload Image
            </button>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
              placeholder="Food name"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white h-32"
              placeholder="Food description..."
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Calories</label>
              <input
                type="number"
                required
                min="0"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) })}
                className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Protein (g)</label>
              <input
                type="number"
                required
                min="0"
                step="0.1"
                value={formData.protein}
                onChange={(e) => setFormData({ ...formData, protein: parseFloat(e.target.value) })}
                className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Carbs (g)</label>
              <input
                type="number"
                required
                min="0"
                step="0.1"
                value={formData.carbs}
                onChange={(e) => setFormData({ ...formData, carbs: parseFloat(e.target.value) })}
                className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Fats (g)</label>
              <input
                type="number"
                required
                min="0"
                step="0.1"
                value={formData.fats}
                onChange={(e) => setFormData({ ...formData, fats: parseFloat(e.target.value) })}
                className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Diet Types</label>
            <div className="grid grid-cols-3 gap-2">
              {categories
                .filter((c) => c.type === 'diet_type')
                .map((diet) => (
                  <label key={diet.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.diet_types?.includes(diet.id)}
                      onChange={(e) => {
                        const newDietTypes = e.target.checked
                          ? [...(formData.diet_types || []), diet.id]
                          : (formData.diet_types || []).filter((id) => id !== diet.id);
                        setFormData({ ...formData, diet_types: newDietTypes });
                      }}
                      className="form-checkbox text-purple-500 rounded"
                    />
                    <span className="text-white">{diet.name}</span>
                  </label>
                ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:bg-gray-800 rounded-lg"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : food ? 'Save Changes' : 'Add Food'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}