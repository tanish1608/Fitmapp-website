import React from 'react';
import { LayoutDashboard, Users, ClipboardList, Library, Settings, User, ChevronLeft } from 'lucide-react';
import { Link } from './ui/Link';
import logo from '../../Images/logo.png'; // Importing the logo

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Sidebar({ isOpen, onToggle, onNavigate, currentPage }: SidebarProps) {
  return (
    <div className={`bg-[#1a1a1a] h-screen fixed transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      {/* Header Section */}
      <div className="p-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src={logo} 
            alt="Fitmapp Logo" 
            className={`logo ${!isOpen && 'hidden'}`} // Show only when sidebar is open
          />
          {isOpen && (
            <span className="text-purple-500 font-bold text-xl ml-2"></span>
          )}
        </div>
        {/* Toggle Button */}
        <button 
          onClick={onToggle}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-400"
        >
          <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${!isOpen && 'rotate-180'}`} />
        </button>
      </div>
      
      {/* Navigation Section */}
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
            <Link href="#" mini={!isOpen}>
              <ClipboardList className="w-5 h-5" />
              {isOpen && 'Plans'}
            </Link>
          </li>
          <li>
            <Link href="#" mini={!isOpen}>
              <Library className="w-5 h-5" />
              {isOpen && 'Library'}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Footer Section */}
      <div className="mt-auto p-4">
        <ul className="space-y-2">
          <li>
            <Link href="#" mini={!isOpen}>
              <Settings className="w-5 h-5" />
              {isOpen && 'Settings'}
            </Link>
          </li>
          <li>
            <Link href="#" mini={!isOpen}>
              <User className="w-5 h-5" />
              {isOpen && 'Account'}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
