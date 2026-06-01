'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Home, BookOpen, Activity, Award, Settings, ChevronLeft, ChevronRight, GraduationCap, User, LogOut } from 'lucide-react';
import { SidebarItem, UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  userProfile?: UserProfile;
}

const MENU_ITEMS: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', iconName: 'Home' },
  { id: 'courses', label: 'My Courses', iconName: 'BookOpen' },
  { id: 'activity', label: 'Activity', iconName: 'Activity' },
  { id: 'achievements', label: 'Achievements', iconName: 'Award' },
  { id: 'profile', label: 'Profile', iconName: 'User' },
  { id: 'settings', label: 'Settings', iconName: 'Settings' },
];

export default function Sidebar({ activeTab, setActiveTab, userProfile }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Home': return <Home className="w-5 h-5" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Activity': return <Activity className="w-5 h-5" />;
      case 'Award': return <Award className="w-5 h-5" />;
      case 'Settings': return <Settings className="w-5 h-5" />;
      case 'User': return <User className="w-5 h-5" />;
      default: return <Home className="w-5 h-5" />;
    }
  };

  return (
    <>
      {/* Desktop and Tablet Sidebar */}
      <nav 
        id="sidebar-desktop" 
        className={`hidden md:flex flex-col h-screen sticky top-0 bg-[#09090b] border-r border-zinc-800 transition-all duration-300 z-30 ${
          isCollapsed ? 'w-20' : 'w-64 lg:w-72'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-zinc-800 h-20" id="sidebar-header">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              {!logoError ? (
                <img 
                  src="https://imotive.in/assets/logo-3HyrHKwN.png" 
                  alt="IMotive Logo" 
                  className="w-full h-full object-contain" 
                  onError={() => setLogoError(true)} 
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="m12 19 9 2 2-11-9-2-9 2 2 11 9-2Z"/>
                  <path d="M12 11V3"/>
                </svg>
              )}
            </div>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col min-w-0"
              >
                <span className="font-sans font-bold text-lg tracking-tight text-white whitespace-nowrap truncate leading-tight">
                  IMotive
                </span>
                <span className="text-[9px] text-zinc-500 font-medium truncate font-sans uppercase tracking-wider">
                  Reshape Your Destiny
                </span>
              </motion.div>
            )}
          </div>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            id="sidebar-collapse-btn"
            className="flex p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Menu Links */}
        <div className="flex-1 px-4 py-8 space-y-2 overflow-y-auto" id="sidebar-links-container">
          {MENU_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium relative transition-colors duration-200 cursor-pointer ${
                  isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {/* Active Background Pill with layoutId */}
                {isActive && (
                  <motion.div
                    layoutId="activeMenuHighlight"
                    className="absolute inset-0 bg-zinc-800/50 rounded-xl border border-zinc-700/50"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    style={{ zIndex: 0 }}
                  />
                )}
                
                {/* Active Left Glow Line */}
                {isActive && (
                  <motion.div 
                    layoutId="activeGlowBar"
                    className="absolute left-0 w-1 h-6 bg-gradient-to-b from-violet-500 to-indigo-500 rounded-r-md"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    style={{ zIndex: 1 }}
                  />
                )}

                <div className={`relative z-10 flex-shrink-0 ${isActive ? 'text-violet-400' : 'text-neutral-400'}`}>
                  {getIcon(item.iconName)}
                </div>

                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative z-10 font-sans tracking-wide"
                  >
                    {item.label}
                  </motion.span>
                )}
              </button>
            );
          })}
        </div>

        {/* Actions at Bottom */}
        <div className="p-4 border-t border-zinc-800 flex flex-col gap-2" id="sidebar-footer">
          {/* Log Out Button */}
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to log out?")) {
                window.location.reload();
              }
            }}
            id="sidebar-logout-btn"
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300 transition-all duration-300 cursor-pointer"
            title="Log Out"
          >
            <div className="flex-shrink-0">
              <LogOut className="w-4 h-4 text-red-400" />
            </div>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono"
              >
                Log Out
              </motion.span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <nav 
        id="sidebar-mobile" 
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800 z-40 flex items-center justify-around px-2 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.8)]"
      >
        {MENU_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-link-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center w-14 h-12 relative cursor-pointer"
            >
              {isActive && (
                <motion.div
                  layoutId="activeMobileMenuHighlight"
                  className="absolute inset-0 bg-zinc-800/50 rounded-xl border border-zinc-700/50"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  style={{ zIndex: 0 }}
                />
              )}
              <div className={`relative z-10 ${isActive ? 'text-indigo-400' : 'text-zinc-500'}`}>
                {getIcon(item.iconName)}
              </div>
              <span className={`text-[10px] mt-0.5 relative z-10 font-sans ${isActive ? 'text-white' : 'text-neutral-500'}`}>
                {item.id === 'dashboard' ? 'Home' : item.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
