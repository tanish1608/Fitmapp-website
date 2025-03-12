import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { CreatePlanModal } from '../components/plans/CreatePlanModal';
import { usePlanStore } from '../stores/planStore';

export function PlansPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { plans, isLoading, error, loadPlans, createPlan } = usePlanStore();

  useEffect(() => {
    loadPlans();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-400">Loading plans...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
          Error loading plans: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Plans</h1>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Create New Plan
        </button>
      </div>

      <div className="space-y-4">
        {plans.map(plan => (
          <div
            key={plan.id}
            className="bg-[#1E1E1E] rounded-lg p-4 hover:bg-[#2A2A2A] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                {plan.thumbnail_url && (
                  <img
                    src={plan.thumbnail_url}
                    alt={plan.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                    <div className="text-gray-400">
                      Plan Duration: {plan.duration} Months
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Last Updated: {format(new Date(plan.updated_at), 'MM/dd/yyyy')}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-gray-400">
                    Workout frequency: {plan.workout_frequency} D/W
                  </div>
                  <div className="text-right">
                    Workouts: {plan.workouts_count}
                  </div>
                  <div className="text-gray-400">
                    Avg calories in/day: {plan.calories_per_day}
                  </div>
                  <div className="text-right">
                    Diet: {plan.diet_count}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-semibold mb-1">
                  ${plan.price}
                </div>
                <div className="text-gray-400 mb-1">
                  Sales: 0
                </div>
                <div className="text-green-500">
                  Revenue: $0
                </div>
              </div>
            </div>
          </div>
        ))}

        {plans.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No plans created yet. Click the button above to create your first plan.
          </div>
        )}
      </div>

      <CreatePlanModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createPlan}
      />
    </div>
  );
}