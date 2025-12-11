import React, { useState } from 'react';
import { LayoutDashboard, BarChart3, Settings, Zap, Menu, X, Bell, User, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar - Desktop */}
      <aside 
        className={`hidden lg:flex flex-col bg-[#0f172a] text-white fixed h-full z-30 transition-all duration-300 ease-in-out border-r border-slate-800 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Area */}
        <div className={`h-20 flex items-center transition-all duration-300 ${
          isCollapsed ? 'justify-center px-0' : 'justify-start px-6'
        }`}>
          <div className="flex items-center gap-3 overflow-hidden">
             <div className="relative">
                <img src="https://raw.githubusercontent.com/johnwesleyquintero/alerion/main/public/logo.svg" className="w-9 h-9 bg-indigo-600 rounded-lg p-1.5 shadow-lg shadow-indigo-500/20" alt="Logo" onError={(e) => { e.currentTarget.src = 'https://picsum.photos/32/32?grayscale' }} />
             </div>
             <div className={`flex flex-col transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
                <span className="text-lg font-bold tracking-tight text-white leading-none">Alerion</span>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">Analytics</span>
             </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-8 space-y-1.5 px-3">
          <NavItem 
            active={currentView === View.DASHBOARD} 
            onClick={() => setCurrentView(View.DASHBOARD)}
            icon={<LayoutDashboard size={20} />}
            label="Overview"
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
            label="Reports"
            collapsed={isCollapsed}
          />
        </nav>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-800/50 space-y-1 bg-slate-900/50">
           <NavItem 
            active={currentView === View.SETTINGS} 
            onClick={() => setCurrentView(View.SETTINGS)}
            icon={<Settings size={20} />}
            label="Settings"
            collapsed={isCollapsed}
          />
           <NavItem 
            active={false} 
            onClick={() => {}}
            icon={<LogOut size={20} />}
            label="Sign Out"
            collapsed={isCollapsed}
          />
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white transition-colors mt-4 border border-transparent hover:border-slate-700"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}>
           <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
        </div>
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-[#0f172a] text-white z-50 transform transition-transform duration-300 lg:hidden shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
             <img src="https://raw.githubusercontent.com/johnwesleyquintero/alerion/main/public/logo.svg" className="w-8 h-8 bg-indigo-600 rounded-lg p-1.5" alt="Logo" />
             <span className="text-xl font-bold">Alerion</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
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
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
             <button className="lg:hidden text-slate-500 hover:text-slate-700" onClick={() => setIsSidebarOpen(true)}>
               <Menu size={24} />
             </button>
             <div>
                <h1 className="text-xl font-bold text-slate-900 hidden md:block">
                    {currentView === View.DASHBOARD ? 'Dashboard Overview' : currentView === View.OPTIMIZER ? 'Strategic Optimizer' : 'System Settings'}
                </h1>
                <p className="text-xs text-slate-500 hidden md:block mt-0.5">
                    {currentView === View.DASHBOARD ? 'Real-time performance metrics' : 'AI-driven campaign management'}
                </p>
             </div>
          </div>

          <div className="flex items-center gap-6">
             <button className="relative group">
                <Bell size={20} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
             
             <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                <div className="text-right hidden md:block leading-tight">
                   <div className="text-sm font-bold text-slate-900">John Wesley</div>
                   <div className="text-xs text-slate-500 font-medium">Administrator</div>
                </div>
                <button className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition-colors">
                   <User size={20} />
                </button>
             </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto w-full">
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
    className={`w-full flex items-center transition-all duration-200 rounded-lg group ${
      collapsed 
        ? 'justify-center px-2 py-3 mx-auto' 
        : 'space-x-3 px-4 py-3'
    } ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <span className={`flex-shrink-0 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</span>
    <span className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${
      collapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'
    }`}>
      {label}
    </span>
  </button>
);

export default App;