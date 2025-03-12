import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useWorkoutStore } from '../stores/workoutStore';
import type { Exercise } from '../types/workout';

interface WorkoutPlanProps {
  clientId: string;
}

export function WorkoutPlan({ clientId }: WorkoutPlanProps) {
  const { plans, exercises, loadWorkoutPlans, loadExercises } = useWorkoutStore();
  const days = Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`);

  useEffect(() => {
    loadWorkoutPlans(clientId);
  }, [clientId]);

  useEffect(() => {
    if (plans.length > 0) {
      loadExercises(plans[0].id);
    }
  }, [plans]);

  const currentPlanExercises = plans.length > 0 ? exercises[plans[0].id] || [] : [];

  const renderExercise = (exercise: Exercise) => (
    <div key={exercise.id} className="bg-[#232323] rounded p-3 mb-2">
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium">{exercise.name}</div>
        <button className="text-purple-500 text-sm">Edit</button>
      </div>
      <div className="grid grid-cols-4 gap-2 text-sm text-gray-400">
        <div>Sets: {exercise.sets}</div>
        <div>Reps: {exercise.reps}</div>
        {exercise.weight && <div>Weight: {exercise.weight}kg</div>}
        {exercise.time && <div>Time: {exercise.time}s</div>}
      </div>
    </div>
  );

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">
          {plans.length > 0 ? plans[0].name : 'No workout plan'}
        </h3>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-800 rounded-lg">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-800 rounded-lg">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {days.map((day, index) => {
          const dayExercises = currentPlanExercises.filter(
            (e) => e.day_of_week === index + 1
          );

          return (
            <div key={day} className="space-y-2">
              <h4 className="font-medium mb-2">{day}</h4>
              {dayExercises.length > 0 ? (
                <>
                  {dayExercises.map(renderExercise)}
                  <button className="w-full py-2 text-sm text-purple-500 hover:bg-purple-500/10 rounded">
                    Add Exercise
                  </button>
                </>
              ) : (
                <div className="bg-[#232323] rounded p-4 text-center text-gray-400">
                  <div className="mb-2">No Exercise Added</div>
                  <div className="text-sm">Rest day</div>
                  <button className="mt-4 w-full py-2 text-sm text-purple-500 hover:bg-purple-500/10 rounded">
                    Add Exercise
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}