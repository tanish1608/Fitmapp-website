import React, { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { StatCard } from './components/StatCard';
import { TaskList } from './components/TaskList';
import { FloatingChat } from './components/FloatingChat';
import { NotificationPanel } from './components/notifications/NotificationPanel';
import { Bell } from 'lucide-react';
import { useNotifications } from './hooks/useNotifications';
import { ClientsPage } from './pages/Clients';
import { PlansPage } from './pages/Plans';
import { LibraryPage } from './pages/Library';
import { AccountPage } from './pages/Account';
import { SettingsPage } from './pages/Settings';
import { AuthForm } from './components/auth/AuthForm';
import { useAuthStore } from './stores/authStore';

function App() {
  const { profile, isLoading, loadProfile } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState<'dashboard' | 'clients' | 'plans' | 'library' | 'account' | 'settings'>('dashboard');
  const {
    notifications,
    isOpen: notificationsOpen,
    unreadCount,
    setIsOpen: setNotificationsOpen,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  useEffect(() => {
    loadProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return <AuthForm />;
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'clients':
        return <ClientsPage />;
      case 'plans':
        return <PlansPage />;
      case 'library':
        return <LibraryPage />;
      case 'account':
        return <AccountPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Welcome back, {profile.full_name || profile.email}!</h1>
                  <p className="text-gray-400">Here's what's happening with your clients today</p>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&auto=format&fit=crop&q=80"
                  alt="Fitness"
                  className="w-32 h-32 rounded-lg object-cover"
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4">
              <StatCard 
                title="Revenue this month" 
                value="$5,280" 
                change="+12.3%" 
              />
              <StatCard 
                title="Active clients" 
                value="18" 
                change="+2"
              />
              <StatCard 
                title="Avg. client rating" 
                value="4.8" 
                subtitle="Based on 45 reviews"
              />
              <StatCard 
                title="Compliance rate" 
                value="85%" 
                change="+5%"
              />
            </div>

            {/* Tasks and Calendar */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <TaskList 
                  title="Today's Workouts" 
                  tasks={[
                    { clientName: "Sarah Smith", dueDate: "10:00 AM" },
                    { clientName: "Mike Johnson", dueDate: "2:30 PM" },
                    { clientName: "Emma Davis", dueDate: "4:00 PM" }
                  ]} 
                />
                <TaskList 
                  title="Diet Check-ins" 
                  tasks={[
                    { clientName: "John Wilson", dueDate: "Today" },
                    { clientName: "Lisa Brown", dueDate: "Today" }
                  ]} 
                />
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">Sarah completed her workout</div>
                    <div className="text-gray-400">2m ago</div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">Mike missed his morning session</div>
                    <div className="text-gray-400">1h ago</div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">New client request from John</div>
                    <div className="text-gray-400">2h ago</div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">Emma updated her measurements</div>
                    <div className="text-gray-400">3h ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNavigate={(page) => setCurrentPage(page as typeof currentPage)}
        currentPage={currentPage}
      />
      
      <main className={`flex-1 p-8 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold capitalize">{currentPage}</h1>
          <div className="flex items-center gap-4">
            <div className="text-gray-400">
              Welcome, {profile.full_name || profile.email}
            </div>
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
        </div>

        {renderContent()}
      </main>

      <FloatingChat />
    </div>
  );
}

export default App;