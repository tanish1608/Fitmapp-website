import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { StatCard } from './components/StatCard';
import { TaskList } from './components/TaskList';
import { FloatingChat } from './components/FloatingChat';
import { NotificationPanel } from './components/notifications/NotificationPanel';
import { Bell } from 'lucide-react';
import { useNotifications } from './hooks/useNotifications';
import { ClientsPage } from './pages/Clients';

const mockTasks = [
  { clientName: "John Doe", dueDate: "Today" },
  { clientName: "Jane Smith", dueDate: "Tomorrow" },
  { clientName: "Mike Johnson", dueDate: "15/01/2025" }
];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'clients'>('dashboard');
  const {
    notifications,
    isOpen: notificationsOpen,
    unreadCount,
    setIsOpen: setNotificationsOpen,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  const renderContent = () => {
    switch (currentPage) {
      case 'clients':
        return <ClientsPage />;
      default:
        return (
          <>
            <div className="grid grid-cols-4 gap-4 mb-8">
              <StatCard title="Revenue from clients" value="$5000" change="+1400" />
              <StatCard title="Active clients" value="18" change="+2" />
              <StatCard title="Total clients" value="25" subtitle="7 Inactive" />
              <StatCard title="Compliance rate" value="85%" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TaskList title="Workouts" tasks={mockTasks} />
              <TaskList title="Diet" tasks={mockTasks} />
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNavigate={(page) => setCurrentPage(page as 'dashboard' | 'clients')}
        currentPage={currentPage}
      />
      
      <main className={`flex-1 p-8 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">{currentPage === 'dashboard' ? 'Dashboard' : 'Clients'}</h1>
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {notificationsOpen && (
              <NotificationPanel
                notifications={notifications}
                onClose={() => setNotificationsOpen(false)}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
              />
            )}
          </div>
        </div>

        {renderContent()}
      </main>

      <FloatingChat />
    </div>
  );
}

export default App;