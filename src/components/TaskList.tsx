import React from 'react';

interface Task {
  clientName: string;
  dueDate: string;
}

interface TaskListProps {
  title: string;
  tasks: Task[];
}

export function TaskList({ title, tasks }: TaskListProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
      <div className="bg-purple-500/10 p-4">
        <h3 className="text-purple-500 font-semibold">{title}</h3>
      </div>
      <div className="p-4">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full" />
              <span className="text-gray-300">{task.clientName}</span>
            </div>
            <span className="text-red-500 text-sm">Due {task.dueDate}</span>
          </div>
        ))}
      </div>
    </div>
  );
}