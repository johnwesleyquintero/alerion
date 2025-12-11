import React, { useState } from 'react';
import { LayoutDashboard, BarChart3, Settings, Zap, Menu, X, Bell, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { AIOptimizer } from './components/AIOptimizer';

enum View {
  DASHBOARD = 'DASHBOARD',
  OPTIMIZER = 'OPTIMIZER',
  SETTINGS = 'SETTINGS'
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard />;
      case View.OPTIMIZER:
        return <AIOptimizer />;
      case View.SETTINGS:
        return (
          <div className="flex flex-col items-center justify-center h-96 text-slate-400">
            <Settings className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg">Settings panel under construction</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside 
        className={`hidden lg:flex flex-col bg-slate-900 text-white fixed h-full z-10 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className={`h-16 flex items-center border-b border-slate-800 transition-all duration-300 ${
          isCollapsed ? 'justify-center px-0' : 'justify-start px-6'
        }`}>
          <div className="flex items-center space-x-3 overflow-hidden">
             <img src="https://raw.githubusercontent.com/johnwesleyquintero/alerion/main/public/logo.svg" className="w-8 h-8 bg-white rounded-md p-1 min-w-[2rem]" alt="Logo" onError={(e) => { e.currentTarget.src = 'https://picsum.photos/32/32?grayscale' }} />
             <span className={`text-xl font-bold tracking-tight whitespace-nowrap transition-opacity duration-300 ${
               isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'
             }`}>
               Alerion
             </span>
          </div>
        </div>
        
        <nav className="flex-1 py-6 space-y-2 px-3">
          <NavItem 
            active={currentView === View.DASHBOARD} 
            onClick={() => setCurrentView(View.DASHBOARD)}
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            collapsed={isCollapsed}
          />
          <NavItem 
            active={currentView === View.OPTIMIZER} 
            onClick={() => setCurrentView(View.OPTIMIZER)}
            icon={<Zap size={20} />}
            label="AI Optimizer"
            collapsed={isCollapsed}
          />
           <NavItem 
            active={false}
            onClick={() => {}}
            icon={<BarChart3 size={20} />}
            label="Reporting"
            collapsed={isCollapsed}
          />
        </nav>

        <div className="p-3 border-t border-slate-800 space-y-2">
           <NavItem 
            active={currentView === View.SETTINGS} 
            onClick={() => setCurrentView(View.SETTINGS)}
            icon={<Settings size={20} />}
            label="Settings"
            collapsed={isCollapsed}
          />
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white transition-colors mt-2"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}>
           <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"></div>
        </div>
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-50 transform transition-transform duration-300 lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <span className="text-xl font-bold">Alerion</span>
          <button onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
        </div>
        <nav className="p-4 space-y-2">
          <NavItem active={currentView === View.DASHBOARD} onClick={() => { setCurrentView(View.DASHBOARD); setIsSidebarOpen(false); }} icon={<LayoutDashboard />} label="Dashboard" collapsed={false} />
          <NavItem active={currentView === View.OPTIMIZER} onClick={() => { setCurrentView(View.OPTIMIZER); setIsSidebarOpen(false); }} icon={<Zap />} label="AI Optimizer" collapsed={false} />
          <NavItem active={currentView === View.SETTINGS} onClick={() => { setCurrentView(View.SETTINGS); setIsSidebarOpen(false); }} icon={<Settings />} label="Settings" collapsed={false} />
        </nav>
      </div>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
        isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      }`}>
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button className="lg:hidden text-slate-500" onClick={() => setIsSidebarOpen(true)}>
               <Menu size={24} />
             </button>
             <h1 className="text-xl font-semibold text-slate-800 hidden md:block">
                {currentView === View.DASHBOARD ? 'Overview' : currentView === View.OPTIMIZER ? 'Bid Optimization' : 'Settings'}
             </h1>
          </div>

          <div className="flex items-center gap-4">
             <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>
             <div className="h-8 w-px bg-slate-200 mx-1"></div>
             <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                   <div className="text-sm font-medium text-slate-900">John Wesley</div>
                   <div className="text-xs text-slate-500">Admin</div>
                </div>
                <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700">
                   <User size={18} />
                </div>
             </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

interface NavItemProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ active, onClick, icon, label, collapsed }) => (
  <button 
    onClick={onClick}
    title={collapsed ? label : undefined}
    className={`w-full flex items-center transition-colors rounded-lg ${
      collapsed 
        ? 'justify-center px-2 py-3' 
        : 'space-x-3 px-4 py-3'
    } ${
      active 
        ? 'bg-indigo-600 text-white' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <span className="flex-shrink-0">{icon}</span>
    <span className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${
      collapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'
    }`}>
      {label}
    </span>
  </button>
);

export default App;