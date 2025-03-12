import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useLibraryStore } from '../../stores/libraryStore';
import { FoodModal } from './FoodModal';

export function FoodList() {
  const { foods, categories, loadFoods } = useLibraryStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadFoods();
  }, []);

  const dietTypes = categories.filter(c => c.type === 'diet_type');

  const foodsByDiet = dietTypes.map(diet => ({
    diet,
    foods: foods.filter(f => f.diet_types.includes(diet.id))
  }));

  return (
    <div>
      {foodsByDiet.map(({ diet, foods }) => (
        <div key={diet.id} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{diet.name}</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-5 gap-4">
            {foods.map(food => (
              <div
                key={food.id}
                className="bg-[#1a1a1a] rounded-lg overflow-hidden"
              >
                <div className="aspect-square bg-gray-800">
                  {food.image_url && (
                    <img
                      src={food.image_url}
                      alt={food.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1">{food.name}</h3>
                  <div className="text-sm text-gray-400 mb-2">
                    {food.calories} kcal
                  </div>
                  <button
                    onClick={() => {}}
                    className="w-full py-1 text-sm text-purple-500 hover:bg-purple-500/10 rounded"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => setIsModalOpen(true)}
              className="aspect-square bg-[#1a1a1a] rounded-lg flex items-center justify-center hover:bg-[#2a2a2a] transition-colors"
            >
              <Plus className="w-8 h-8 text-gray-400" />
            </button>
          </div>
        </div>
      ))}

      <FoodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}