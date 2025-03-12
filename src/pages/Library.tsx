import React, { useEffect } from 'react';
import { Search } from 'lucide-react';
import { useLibraryStore } from '../stores/libraryStore';
import { ExerciseList } from '../components/library/ExerciseList';
import { FoodList } from '../components/library/FoodList';

export function LibraryPage() {
  const { selectedTab, setSelectedTab, loadCategories } = useLibraryStore();

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedTab('exercises')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              selectedTab === 'exercises'
                ? 'bg-purple-500 text-white'
                : 'bg-[#1a1a1a] text-gray-400'
            }`}
          >
            Exercises
          </button>
          <button
            onClick={() => setSelectedTab('foods')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              selectedTab === 'foods'
                ? 'bg-purple-500 text-white'
                : 'bg-[#1a1a1a] text-gray-400'
            }`}
          >
            Foods
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-[#1a1a1a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {selectedTab === 'exercises' ? <ExerciseList /> : <FoodList />}
    </div>
  );
}