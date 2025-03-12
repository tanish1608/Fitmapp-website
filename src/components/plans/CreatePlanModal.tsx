import React, { useState, useEffect } from 'react';
import { X, Plus, Search } from 'lucide-react';
import { useLibraryStore } from '../../stores/libraryStore';
import type { CreatePlanInput } from '../../types/plan';
import type { Exercise } from '../../types/library';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (plan: CreatePlanInput) => Promise<void>;
}

export function CreatePlanModal({ isOpen, onClose, onSubmit }: CreatePlanModalProps) {
  const { exercises, loadExercises } = useLibraryStore();
  const [selectedExercises, setSelectedExercises] = useState<Record<number, Exercise[]>>({});
  const [activeDay, setActiveDay] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'workout' | 'diet'>('workout');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<CreatePlanInput>({
    name: '',
    duration: 3,
    workout_frequency: 3,
    calories_per_day: 2000,
    price: 99,
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadExercises();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredExercises = exercises.filter(exercise => 
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddExercise = (exercise: Exercise) => {
    setSelectedExercises(prev => ({
      ...prev,
      [activeDay]: [...(prev[activeDay] || []), exercise]
    }));
  };

  const handleRemoveExercise = (dayIndex: number, exerciseIndex: number) => {
    setSelectedExercises(prev => ({
      ...prev,
      [dayIndex]: prev[dayIndex].filter((_, index) => index !== exerciseIndex)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] rounded-lg w-[90vw] max-w-7xl h-[90vh] p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create New Plan</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Plan Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
                placeholder="e.g., Weight Loss Program"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Price ($)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Duration (months)</label>
              <input
                type="number"
                required
                min="1"
                max="12"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Workouts per Week</label>
              <input
                type="number"
                required
                min="1"
                max="7"
                value={formData.workout_frequency}
                onChange={(e) => setFormData({ ...formData, workout_frequency: parseInt(e.target.value) })}
                className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Daily Calories Target</label>
              <input
                type="number"
                required
                min="1200"
                max="5000"
                step="100"
                value={formData.calories_per_day}
                onChange={(e) => setFormData({ ...formData, calories_per_day: parseInt(e.target.value) })}
                className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="flex-1 flex">
            {/* Left sidebar - Calendar */}
            <div className="w-48 bg-[#232323] rounded-lg p-4 mr-4">
              <div className="grid grid-cols-7 text-center mb-2">
                <div className="text-gray-400">M</div>
                <div className="text-gray-400">T</div>
                <div className="text-gray-400">W</div>
                <div className="text-gray-400">T</div>
                <div className="text-gray-400">F</div>
                <div className="text-gray-400">S</div>
                <div className="text-gray-400">S</div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 7 }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`aspect-square rounded-lg text-sm ${
                      activeDay === i + 1
                        ? 'bg-purple-500 text-white'
                        : 'bg-[#1a1a1a] text-gray-400 hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveDay(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 bg-[#232323] rounded-lg p-4">
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === 'workout'
                      ? 'bg-purple-500 text-white'
                      : 'bg-[#1a1a1a] text-gray-400'
                  }`}
                  onClick={() => setActiveTab('workout')}
                >
                  Workout
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === 'diet'
                      ? 'bg-purple-500 text-white'
                      : 'bg-[#1a1a1a] text-gray-400'
                  }`}
                  onClick={() => setActiveTab('diet')}
                >
                  Diet
                </button>
              </div>

              {activeTab === 'workout' ? (
                <div className="flex h-full">
                  {/* Exercise list */}
                  <div className="w-1/3 border-r border-gray-700 pr-4">
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search exercises..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1a1a1a] rounded-lg pl-10 pr-4 py-2 text-white"
                      />
                    </div>
                    <div className="space-y-2 h-[calc(100%-4rem)] overflow-y-auto">
                      {filteredExercises.map(exercise => (
                        <div
                          key={exercise.id}
                          className="bg-[#1a1a1a] rounded-lg p-3 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-medium">{exercise.name}</div>
                            <div className="text-sm text-gray-400">
                              {exercise.mechanics} • Level {exercise.expertise_level}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddExercise(exercise)}
                            className="p-1 hover:bg-gray-700 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Selected exercises for the day */}
                  <div className="flex-1 pl-4">
                    <h3 className="font-medium mb-4">Day {activeDay} Exercises</h3>
                    <div className="space-y-2">
                      {selectedExercises[activeDay]?.map((exercise, index) => (
                        <div
                          key={`${exercise.id}-${index}`}
                          className="bg-[#1a1a1a] rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{exercise.name}</div>
                            <button
                              type="button"
                              onClick={() => handleRemoveExercise(activeDay, index)}
                              className="text-red-500 text-sm hover:text-red-400"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            <div>
                              <label className="block text-xs text-gray-400">Sets</label>
                              <input
                                type="number"
                                min="1"
                                className="w-full bg-[#2a2a2a] rounded px-2 py-1 text-sm"
                                defaultValue="3"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400">Reps</label>
                              <input
                                type="number"
                                min="1"
                                className="w-full bg-[#2a2a2a] rounded px-2 py-1 text-sm"
                                defaultValue="12"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400">Weight</label>
                              <input
                                type="number"
                                min="0"
                                className="w-full bg-[#2a2a2a] rounded px-2 py-1 text-sm"
                                placeholder="kg"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400">Rest</label>
                              <input
                                type="number"
                                min="0"
                                className="w-full bg-[#2a2a2a] rounded px-2 py-1 text-sm"
                                placeholder="sec"
                                defaultValue="60"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {(!selectedExercises[activeDay] || selectedExercises[activeDay].length === 0) && (
                        <div className="text-center text-gray-400 py-8">
                          No exercises added for this day. Select exercises from the list.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  Diet planning feature coming soon...
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}