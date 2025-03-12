import React from 'react';
import { LayoutDashboard, Users, ClipboardList, Library, Settings, User, ChevronLeft } from 'lucide-react';
import { Link } from './ui/Link';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Sidebar({ isOpen, onToggle, onNavigate, currentPage }: SidebarProps) {
  return (
    <div className={`bg-[#1a1a1a] h-screen fixed transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-4 flex items-center justify-between">
        <div className={`text-purple-500 font-bold text-2xl ${!isOpen && 'hidden'}`}>fitmapp</div>
        <button 
          onClick={onToggle}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-400"
        >
          <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${!isOpen && 'rotate-180'}`} />
        </button>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2 p-4">
          <li>
            <Link 
              href="#" 
              active={currentPage === 'dashboard'} 
              mini={!isOpen}
              onClick={() => onNavigate('dashboard')}
            >
              <LayoutDashboard className="w-5 h-5" />
              {isOpen && 'Dashboard'}
            </Link>
          </li>
          <li>
            <Link 
              href="#" 
              active={currentPage === 'clients'} 
              mini={!isOpen}
              onClick={() => onNavigate('clients')}
            >
              <Users className="w-5 h-5" />
              {isOpen && 'Clients'}
            </Link>
          </li>
          <li>
            <Link 
              href="#" 
              active={currentPage === 'plans'} 
              mini={!isOpen}
              onClick={() => onNavigate('plans')}
            >
              <ClipboardList className="w-5 h-5" />
              {isOpen && 'Plans'}
            </Link>
          </li>
          <li>
            <Link 
              href="#" 
              active={currentPage === 'library'} 
              mini={!isOpen}
              onClick={() => onNavigate('library')}
            >
              <Library className="w-5 h-5" />
              {isOpen && 'Library'}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto p-4">
        <ul className="space-y-2">
          <li>
            <Link 
              href="#" 
              active={currentPage === 'settings'}
              mini={!isOpen}
              onClick={() => onNavigate('settings')}
            >
              <Settings className="w-5 h-5" />
              {isOpen && 'Settings'}
            </Link>
          </li>
          <li>
            <Link 
              href="#" 
              active={currentPage === 'account'}
              mini={!isOpen}
              onClick={() => onNavigate('account')}
            >
              <User className="w-5 h-5" />
              {isOpen && 'Account'}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}