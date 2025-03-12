import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useLibraryStore } from '../../stores/libraryStore';
import { ExerciseModal } from './ExerciseModal';
import type { Category } from '../../types/library';

export function ExerciseList() {
  const { exercises, categories, loadExercises } = useLibraryStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

  useEffect(() => {
    loadExercises();
  }, []);

  const equipmentCategories = categories.filter(c => c.type === 'equipment');

  const filteredExercises = selectedEquipment
    ? exercises.filter(e => e.equipment_id === selectedEquipment)
    : exercises;

  const exercisesByEquipment = equipmentCategories.map(equipment => ({
    equipment,
    exercises: filteredExercises.filter(e => e.equipment_id === equipment.id)
  }));

  return (
    <div>
      {exercisesByEquipment.map(({ equipment, exercises }) => (
        <div key={equipment.id} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{equipment.name}</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-5 gap-4">
            {exercises.map(exercise => (
              <div
                key={exercise.id}
                className="bg-[#1a1a1a] rounded-lg overflow-hidden"
              >
                <div className="aspect-square bg-gray-800">
                  {exercise.video_url && (
                    <video
                      src={exercise.video_url}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-2">{exercise.name}</h3>
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

      <ExerciseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}