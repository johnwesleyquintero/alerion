import React, { useState, useRef } from 'react';
import { LayoutDashboard, BarChart3, Settings, Zap, Menu, X, Bell, User, ChevronLeft, ChevronRight, LogOut, Save, Link as LinkIcon, CheckCircle2, RefreshCw, AlertCircle, ExternalLink, FileSpreadsheet, UploadCloud, Sparkles, Database, FileText, ArrowRight, Layers, ShieldCheck, Microscope } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { AIOptimizer } from './components/AIOptimizer';
import { AppSettings, Campaign } from './types';
import { MOCK_CAMPAIGNS, generateNewCampaignData } from './constants';

enum View {
  DASHBOARD = 'DASHBOARD',
  OPTIMIZER = 'OPTIMIZER',
  SETTINGS = 'SETTINGS'
}

// Inline Logo Component to ensure it renders correctly without relying on external file loading
const AlerionLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="48" height="48" rx="12" fill="#F8FAFC" />
    <g transform="translate(1 1)">
      <path d="M16 8L2 40H14L24 18L16 8Z" fill="#4F46E5"/>
      <path d="M26 2L18 20L28 40H40L46 26L26 2Z" fill="#818CF8"/>
      <path d="M18 20L14 40H28L18 20Z" fill="#1E293B" fillOpacity="0.2"/>
    </g>
  </svg>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // App State Configuration
  const [settings, setSettings] = useState<AppSettings>({
    targetAcos: 30,
    monthlyBudget: 5000,
    brandName: 'My Amazon Brand'
  });
  const [hasSavedSettings, setHasSavedSettings] = useState(false);
  
  // Data State (Lifted Up)
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Manual Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<'IDLE' | 'UPLOADING' | 'SUCCESS'>('IDLE');
  const [lastUploadedFile, setLastUploadedFile] = useState<string | null>(null);
  const [uploadStats, setUploadStats] = useState<{count: number; totalSpend: number} | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSavedSettings(true);
    setTimeout(() => setHasSavedSettings(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setUploadState('UPLOADING');
        setUploadStats(null);
        
        // Simulate processing delay and parsing logic
        setTimeout(() => {
            // Generate fresh data to simulate parsing the CSV/XLSX
            const newData = generateNewCampaignData();
            const totalSpend = newData.reduce((acc, curr) => acc + curr.spend, 0);

            setCampaigns(newData);
            setLastUpdated(new Date());
            setUploadStats({ count: newData.length, totalSpend });
            
            setUploadState('SUCCESS');
            setLastUploadedFile(file.name);
            
            // Reset back to idle visual after a few seconds, but keep the "Last uploaded" text
            setTimeout(() => {
                setUploadState('IDLE');
                // Automatically switch to dashboard to show results
                setCurrentView(View.DASHBOARD);
            }, 2500);
        }, 2000);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return (
          <Dashboard 
            campaigns={campaigns} 
            onCampaignUpdate={setCampaigns} 
            lastUpdated={lastUpdated}
          />
        );
      case View.OPTIMIZER:
        return <AIOptimizer settings={settings} campaigns={campaigns} />;
      case View.SETTINGS:
        return (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
             
             {/* Workflow Blueprint Visualization */}
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Microscope size={20} className="text-indigo-600"/> The PPC Lab Workflow
                    </h2>
                </div>
                <div className="p-8">
                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                            {/* Step 1 */}
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-12 h-12 bg-white border-2 border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm mb-3 group-hover:border-indigo-500 group-hover:scale-110 transition-all">
                                    <FileSpreadsheet size={24} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">1. Ingestion</h3>
                                <p className="text-xs text-slate-500 mt-1 max-w-[140px]">Upload raw bulk files. System validates data integrity.</p>
                            </div>

                             {/* Step 2 */}
                             <div className="flex flex-col items-center text-center group">
                                <div className="w-12 h-12 bg-white border-2 border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm mb-3 group-hover:border-indigo-500 group-hover:scale-110 transition-all">
                                    <Sparkles size={24} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">2. AI Analysis</h3>
                                <p className="text-xs text-slate-500 mt-1 max-w-[140px]">Gemini normalizes data & audits vs. Target ACOS.</p>
                            </div>

                             {/* Step 3 */}
                             <div className="flex flex-col items-center text-center group">
                                <div className="w-12 h-12 bg-white border-2 border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm mb-3 group-hover:border-indigo-500 group-hover:scale-110 transition-all">
                                    <ShieldCheck size={24} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">3. Operator Review</h3>
                                <p className="text-xs text-slate-500 mt-1 max-w-[140px]">Review queued actions. Nothing applies without you.</p>
                            </div>

                             {/* Step 4 */}
                             <div className="flex flex-col items-center text-center group">
                                <div className="w-12 h-12 bg-white border-2 border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm mb-3 group-hover:border-indigo-500 group-hover:scale-110 transition-all">
                                    <Layers size={24} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">4. Execution</h3>
                                <p className="text-xs text-slate-500 mt-1 max-w-[140px]">Apply changes & log history for future learning.</p>
                            </div>
                        </div>
                    </div>
                </div>
             </div>

             {/* Data Ingestion Card */}
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Database size={20} className="text-indigo-600"/> Data Ingestion
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                          Upload your Amazon Ads <strong>Bulk Operations File</strong> to begin the cycle.
                        </p>
                    </div>
                </div>
                <div className="p-8 space-y-8">
                    
                    {/* Manual File Upload - Primary Action */}
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 space-y-4">
                             <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                                    <UploadCloud className="text-indigo-600 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Manual Upload</h3>
                                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                                        The preferred method for professional operators. Upload raw .xlsx or .csv files to maintain full control over bid changes.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Supported Formats</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-sm text-slate-600">
                                        <FileText size={14} className="text-slate-400" /> Bulk Operations File (.xlsx)
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-slate-600">
                                        <FileText size={14} className="text-slate-400" /> Search Term Report (.csv)
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex-1">
                            <div 
                                className={`h-full min-h-[220px] border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group relative overflow-hidden ${
                                    uploadState === 'UPLOADING' ? 'border-indigo-300 bg-indigo-50/30' : 
                                    uploadState === 'SUCCESS' ? 'border-emerald-300 bg-emerald-50/30' : 
                                    'border-indigo-200 bg-indigo-50/10 hover:border-indigo-400 hover:bg-indigo-50/30'
                                }`}
                                onClick={() => uploadState === 'IDLE' && fileInputRef.current?.click()}
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept=".csv,.xlsx"
                                    onChange={handleFileChange}
                                    disabled={uploadState !== 'IDLE'}
                                />
                                
                                {uploadState === 'UPLOADING' ? (
                                    <div className="py-2 animate-in fade-in zoom-in">
                                        <RefreshCw className="animate-spin text-indigo-600 w-10 h-10 mb-3 mx-auto" />
                                        <span className="text-indigo-700 font-bold text-base block">Processing Dataset...</span>
                                        <span className="text-indigo-400 text-sm">Normalizing columns & checking integrity</span>
                                    </div>
                                ) : uploadState === 'SUCCESS' ? (
                                    <div className="py-2 animate-in fade-in zoom-in w-full">
                                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <CheckCircle2 className="w-7 h-7" />
                                        </div>
                                        <span className="text-emerald-700 font-bold text-base block mb-4">Ingestion Successful</span>
                                        
                                        {/* Data Health Check Card */}
                                        {uploadStats && (
                                            <div className="bg-white/60 backdrop-blur rounded-lg border border-emerald-200 p-3 mx-auto max-w-[240px] text-left space-y-2 mb-2">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-500">Campaigns:</span>
                                                    <span className="font-bold text-slate-800">{uploadStats.count}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-500">Total Spend:</span>
                                                    <span className="font-bold text-slate-800">${uploadStats.totalSpend.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-500">Status:</span>
                                                    <span className="font-bold text-emerald-600">Clean</span>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <span className="text-emerald-600 text-xs font-medium animate-pulse">Redirecting to Dashboard...</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-14 h-14 bg-white rounded-full shadow-lg shadow-indigo-100 border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:border-indigo-200">
                                            <UploadCloud className="text-indigo-500 w-7 h-7" />
                                        </div>
                                        <p className="text-base font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">Click to Upload Bulk File</p>
                                        <p className="text-sm text-slate-400 mt-2">or drag and drop file here</p>
                                        
                                        {lastUploadedFile && (
                                            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-emerald-100 shadow-sm">
                                                    <CheckCircle2 size={12} />
                                                    Last: {lastUploadedFile}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
             </div>

             {/* Configuration Card */}
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8 border-b border-slate-200 bg-slate-50">
                    <h2 className="text-xl font-bold text-slate-900">Strategic Parameters</h2>
                    <p className="text-slate-500 text-sm mt-1">Define the constraints for the AI Optimizer.</p>
                </div>
                
                <form onSubmit={handleSaveSettings} className="p-8 space-y-8">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-4 flex items-center gap-2">
                            <Zap size={16} /> Benchmarks
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Target ACOS (%)</label>
                                <p className="text-xs text-slate-500 mb-2">The AI will flag campaigns exceeding this profitability threshold.</p>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        value={settings.targetAcos}
                                        onChange={(e) => setSettings({...settings, targetAcos: Number(e.target.value)})}
                                        className="block w-full pl-4 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 font-bold">%</div>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Monthly Budget Cap</label>
                                <p className="text-xs text-slate-500 mb-2">Used for projection modeling and spend alerts.</p>
                                <div className="relative">
                                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold">$</div>
                                    <input 
                                        type="number" 
                                        value={settings.monthlyBudget}
                                        onChange={(e) => setSettings({...settings, monthlyBudget: Number(e.target.value)})}
                                        className="block w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-8">
                        <div className="flex items-center justify-end gap-3">
                             {hasSavedSettings && (
                                 <span className="text-emerald-600 font-medium text-sm flex items-center gap-1 animate-in fade-in">
                                     Settings Saved <Save size={14} />
                                 </span>
                             )}
                            <button 
                                type="submit" 
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>

                </form>
             </div>
          </div>
        );
      default:
        return (
          <Dashboard 
            campaigns={campaigns} 
            onCampaignUpdate={setCampaigns} 
            lastUpdated={lastUpdated}
          />
        );
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
             <div className="relative w-9 h-9 shrink-0">
                <AlerionLogo />
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
            icon={<Sparkles size={20} />}
            label="AI Optimizer"
            collapsed={isCollapsed}
          />
           <NavItem 
            active={currentView === View.SETTINGS} 
            onClick={() => setCurrentView(View.SETTINGS)}
            icon={<Database size={20} />}
            label="Data Source"
            collapsed={isCollapsed}
          />
        </nav>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-800/50 space-y-1 bg-slate-900/50">
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
             <div className="w-8 h-8 shrink-0">
                <AlerionLogo />
             </div>
             <span className="text-xl font-bold">Alerion</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
        </div>
        <nav className="p-4 space-y-2">
          <NavItem active={currentView === View.DASHBOARD} onClick={() => { setCurrentView(View.DASHBOARD); setIsSidebarOpen(false); }} icon={<LayoutDashboard />} label="Dashboard" collapsed={false} />
          <NavItem active={currentView === View.OPTIMIZER} onClick={() => { setCurrentView(View.OPTIMIZER); setIsSidebarOpen(false); }} icon={<Sparkles />} label="AI Optimizer" collapsed={false} />
          <NavItem active={currentView === View.SETTINGS} onClick={() => { setCurrentView(View.SETTINGS); setIsSidebarOpen(false); }} icon={<Database />} label="Data Source" collapsed={false} />
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
                    {currentView === View.DASHBOARD ? 'Dashboard Overview' : currentView === View.OPTIMIZER ? 'Strategic Optimizer' : 'System Configuration'}
                </h1>
                <p className="text-xs text-slate-500 hidden md:block mt-0.5">
                    {currentView === View.DASHBOARD ? 'Real-time performance metrics' : currentView === View.SETTINGS ? 'Manage data ingestion & parameters' : 'AI-driven campaign management'}
                </p>
             </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-xs font-semibold text-slate-600">Manual Mode Active</span>
             </div>

             <button className="relative group">
                <Bell size={20} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
             
             <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                <div className="text-right hidden md:block leading-tight">
                   <div className="text-sm font-bold text-slate-900">Wesley Q</div>
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