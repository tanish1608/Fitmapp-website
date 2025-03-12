import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { Client } from '../types/client';
import { Calendar } from './Calendar';
import { WorkoutPlan } from './WorkoutPlan';
import { useWorkoutStore } from '../stores/workoutStore';

interface ClientDashboardProps {
  client: Client;
  onBack: () => void;
}

export function ClientDashboard({ client, onBack }: ClientDashboardProps) {
  const [activeTab, setActiveTab] = useState<'workout' | 'diet'>('workout');
  const { plans, loadWorkoutPlans } = useWorkoutStore();

  useEffect(() => {
    loadWorkoutPlans(client.id);
  }, [client.id]);

  return (
    <div className="p-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="grid grid-cols-3 gap-6">
        {/* Client Info */}
        <div className="col-span-2 bg-[#1a1a1a] rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-700 rounded-full overflow-hidden">
              {client.avatar_url && (
                <img
                  src={client.avatar_url}
                  alt={client.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{client.name}</h2>
              <p className="text-gray-400">
                Age: {client.age} • Gender: {client.gender}
              </p>
              {client.is_vegetarian && (
                <span className="inline-block px-2 py-1 bg-green-500/10 text-green-500 text-sm rounded mt-1">
                  Vegetarian
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <div className="text-3xl font-bold text-purple-500">
                {plans.length}
              </div>
              <div className="text-sm text-gray-400">Active plans</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-500">
                {client.weight}
              </div>
              <div className="text-sm text-gray-400">Weight (kg)</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-500">
                {client.height}
              </div>
              <div className="text-sm text-gray-400">Height</div>
            </div>
          </div>

          {plans.length > 0 && (
            <div className="bg-[#232323] rounded px-4 py-3 mb-6">
              <div className="text-sm text-gray-400">
                Current Plan: {plans[0].name}
              </div>
              <div className="text-sm text-gray-400">
                Plan tenure: {new Date(plans[0].start_date).toLocaleDateString()} -{' '}
                {new Date(plans[0].end_date).toLocaleDateString()}
              </div>
            </div>
          )}

          <Calendar />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <h3 className="font-semibold mb-3">Dietary restrictions</h3>
            <ul className="list-disc list-inside text-gray-400">
              {client.dietary_restrictions.map((restriction, index) => (
                <li key={index}>{restriction}</li>
              ))}
            </ul>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <h3 className="font-semibold mb-3">Movement restrictions</h3>
            <ul className="list-disc list-inside text-gray-400">
              {client.movement_restrictions.map((restriction, index) => (
                <li key={index}>{restriction}</li>
              ))}
            </ul>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <h3 className="font-semibold mb-3">Measurements</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-purple-500">
                  {client.weight}
                  <span className="text-sm text-gray-400 ml-1">kg</span>
                </div>
                <div className="text-sm text-gray-400">Weight</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-500">
                  {client.height}
                </div>
                <div className="text-sm text-gray-400">Height</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workout/Diet Tabs */}
      <div className="mt-6">
        <div className="flex gap-2 mb-4">
          <button
            className={`px-6 py-2 rounded-lg ${
              activeTab === 'workout'
                ? 'bg-purple-500 text-white'
                : 'bg-[#1a1a1a] text-gray-400'
            }`}
            onClick={() => setActiveTab('workout')}
          >
            Workout
          </button>
          <button
            className={`px-6 py-2 rounded-lg ${
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
          <WorkoutPlan clientId={client.id} />
        ) : (
          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <p className="text-gray-400">Diet plan content here...</p>
          </div>
        )}
      </div>
    </div>
  );
}