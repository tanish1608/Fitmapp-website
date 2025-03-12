import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useLibraryStore } from '../../stores/libraryStore';
import type { Exercise } from '../../types/library';

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise?: Exercise;
}

export function ExerciseModal({ isOpen, onClose, exercise }: ExerciseModalProps) {
  const { categories, addExercise, updateExercise } = useLibraryStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Exercise>>(exercise || {
    name: '',
    equipment_id: null,
    muscle_group_id: null,
    movement_type_id: null,
    force_type: null,
    mechanics: null,
    expertise_level: 1,
    video_url: null,
    instructions: null,
    secondary_muscles: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (exercise) {
        await updateExercise(exercise.id, formData);
      } else {
        await addExercise(formData as Omit<Exercise, 'id' | 'trainer_id' | 'created_at' | 'updated_at'>);
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
            {exercise ? 'Edit Exercise' : 'Add Exercise'}
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
          <div className="aspect-video bg-gray-800 rounded-lg mb-6 flex items-center justify-center">
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Handle video upload
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
              Upload Video
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Equipment</label>
              <select
                value={formData.equipment_id || ''}
                onChange={(e) => setFormData({ ...formData, equipment_id: e.target.value })}
                className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
              >
                <option value="">Select Equipment</option>
                {categories
                  .filter((c) => c.type === 'equipment')
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Target Muscle</label>
              <select
                value={formData.muscle_group_id || ''}
                onChange={(e) => setFormData({ ...formData, muscle_group_id: e.target.value })}
                className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
              >
                <option value="">Select Muscle Group</option>
                {categories
                  .filter((c) => c.type === 'muscle_group')
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Instructions</label>
            <textarea
              value={formData.instructions || ''}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white h-32"
              placeholder="Step by step instructions..."
            />
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
              {isSubmitting ? 'Saving...' : exercise ? 'Save Changes' : 'Add Exercise'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}