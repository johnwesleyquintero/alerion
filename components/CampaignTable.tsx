import React, { useState, useMemo } from 'react';
import { Campaign, CampaignStatus } from '../types';
import { ArrowUpRight, ArrowDownRight, PauseCircle, PlayCircle, AlertCircle, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Search, Filter, Download, CheckSquare, Square, Minus, TrendingDown, TrendingUp, X } from 'lucide-react';

interface CampaignTableProps {
  campaigns: Campaign[];
  onCampaignClick?: (campaign: Campaign) => void;
  onCampaignUpdate?: (updatedCampaigns: Campaign[]) => void;
}

type SortConfig = {
  key: keyof Campaign;
  direction: 'asc' | 'desc';
} | null;

export const CampaignTable: React.FC<CampaignTableProps> = ({ campaigns, onCampaignClick, onCampaignUpdate }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'sales', direction: 'desc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'ALL'>('ALL');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            campaign.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || campaign.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [campaigns, searchQuery, statusFilter]);

  const sortedCampaigns = useMemo(() => {
    if (!sortConfig) return filteredCampaigns;
    
    return [...filteredCampaigns].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredCampaigns, sortConfig]);

  const requestSort = (key: keyof Campaign) => {
    let direction: 'asc' | 'desc' = 'desc'; // Default to desc for metrics usually
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Campaign) => {
    if (!sortConfig || sortConfig.key !== key) return <ArrowUpDown className="w-3 h-3 ml-1 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />;
    return sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 ml-1 text-indigo-500" /> : <ArrowDown className="w-3 h-3 ml-1 text-indigo-500" />;
  };

  const HeaderCell = ({ label, sortKey, align = 'left' }: { label: string, sortKey: keyof Campaign, align?: 'left' | 'right' }) => (
    <th 
      scope="col" 
      onClick={() => requestSort(sortKey)}
      className={`px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider bg-slate-50 cursor-pointer select-none group hover:bg-slate-100 transition-colors ${align === 'right' ? 'text-right' : 'text-left'}`}
    >
      <div className={`flex items-center ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
        {label}
        {getSortIcon(sortKey)}
      </div>
    </th>
  );
  
  const getStatusColor = (status: CampaignStatus) => {
    switch (status) {
      case CampaignStatus.ACTIVE: return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case CampaignStatus.PAUSED: return 'bg-gray-100 text-gray-800 border border-gray-200';
      case CampaignStatus.OUT_OF_BUDGET: return 'bg-red-100 text-red-800 border border-red-200';
      case CampaignStatus.ARCHIVED: return 'bg-slate-100 text-slate-800 border border-slate-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: CampaignStatus) => {
    switch (status) {
      case CampaignStatus.ACTIVE: return <PlayCircle className="w-3.5 h-3.5 mr-1.5" />;
      case CampaignStatus.PAUSED: return <PauseCircle className="w-3.5 h-3.5 mr-1.5" />;
      case CampaignStatus.OUT_OF_BUDGET: return <AlertCircle className="w-3.5 h-3.5 mr-1.5" />;
      default: return null;
    }
  };

  // Selection Logic
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredCampaigns.length && filteredCampaigns.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCampaigns.map(c => c.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBulkAction = (action: 'DECREASE_BID' | 'INCREASE_BID' | 'PAUSE') => {
      if (!onCampaignUpdate) return;

      const updatedCampaigns = campaigns.map(c => {
          if (selectedIds.has(c.id)) {
              if (action === 'PAUSE') {
                  return { ...c, status: CampaignStatus.PAUSED };
              }
              if (action === 'DECREASE_BID') {
                  // Simulate 10% spend reduction and recalculate ACOS
                  const newSpend = c.spend * 0.9;
                  const newAcos = (newSpend / c.sales) * 100;
                  return { ...c, spend: newSpend, acos: Number(newAcos.toFixed(2)) };
              }
              if (action === 'INCREASE_BID') {
                  // Simulate 10% spend increase
                   const newSpend = c.spend * 1.1;
                   const newAcos = (newSpend / c.sales) * 100;
                   return { ...c, spend: newSpend, acos: Number(newAcos.toFixed(2)) };
              }
          }
          return c;
      });

      onCampaignUpdate(updatedCampaigns);
      setSelectedIds(new Set());
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full relative">
      {/* Controls Bar */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3 justify-between items-center bg-white">
        <div className="relative w-full sm:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
            placeholder="Search campaigns by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
           <div className="relative flex-1 sm:flex-none">
             <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
             </div>
             <select 
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value as CampaignStatus | 'ALL')}
               className="block w-full pl-9 pr-8 py-2 border border-slate-200 rounded-lg leading-5 bg-white text-slate-700 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer appearance-none"
             >
               <option value="ALL">All Statuses</option>
               <option value={CampaignStatus.ACTIVE}>Active</option>
               <option value={CampaignStatus.PAUSED}>Paused</option>
               <option value={CampaignStatus.OUT_OF_BUDGET}>Out of Budget</option>
             </select>
           </div>
           
           <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg border border-transparent hover:border-indigo-100 transition-all">
             <Download size={18} />
           </button>
        </div>
      </div>

      <div className="overflow-auto flex-1 max-h-[500px]">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th scope="col" className="px-6 py-4 w-12 bg-slate-50 text-left">
                  <button 
                    onClick={toggleSelectAll}
                    className="flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {selectedIds.size === filteredCampaigns.length && filteredCampaigns.length > 0 ? (
                        <CheckSquare size={20} className="text-indigo-600" />
                    ) : selectedIds.size > 0 ? (
                        <Minus size={20} className="text-indigo-600" />
                    ) : (
                        <Square size={20} />
                    )}
                  </button>
              </th>
              <HeaderCell label="Campaign Name" sortKey="name" />
              <HeaderCell label="Status" sortKey="status" />
              <HeaderCell label="Spend" sortKey="spend" align="right" />
              <HeaderCell label="Sales" sortKey="sales" align="right" />
              <HeaderCell label="ACOS" sortKey="acos" align="right" />
              <HeaderCell label="ROAS" sortKey="roas" align="right" />
              <th scope="col" className="px-4 py-4 w-10 bg-slate-50"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {sortedCampaigns.length > 0 ? (
              sortedCampaigns.map((campaign) => (
                <tr 
                    key={campaign.id} 
                    onClick={() => onCampaignClick && onCampaignClick(campaign)}
                    className={`hover:bg-indigo-50/50 transition-colors group cursor-pointer border-l-4 ${selectedIds.has(campaign.id) ? 'bg-indigo-50/30 border-indigo-500' : 'border-transparent hover:border-indigo-500'}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap w-12">
                     <button 
                        onClick={(e) => { e.stopPropagation(); toggleSelectOne(campaign.id); }}
                        className="flex items-center justify-center text-slate-300 hover:text-indigo-500 transition-colors"
                     >
                        {selectedIds.has(campaign.id) ? (
                            <CheckSquare size={20} className="text-indigo-600" />
                        ) : (
                            <Square size={20} />
                        )}
                     </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900 group-hover:text-indigo-700 transition-colors">{campaign.name}</div>
                    <div className="text-xs text-slate-500">ID: {campaign.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {getStatusIcon(campaign.status)}
                      {campaign.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-600 font-mono">
                    ${campaign.spend.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-900 font-semibold font-mono">
                    ${campaign.sales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                     <div className={`flex items-center justify-end font-medium ${campaign.acos > 30 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {campaign.acos.toFixed(2)}%
                        {campaign.acos > 30 ? <ArrowUpRight className="w-3 h-3 ml-1" /> : <ArrowDownRight className="w-3 h-3 ml-1" />}
                     </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-600 font-mono">
                    {campaign.roas.toFixed(2)}x
                  </td>
                  <td className="px-4 py-4 text-right">
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                   <div className="flex flex-col items-center justify-center text-slate-400">
                      <Search className="w-8 h-8 mb-3 opacity-50" />
                      <p className="text-sm font-medium">No campaigns found matching "{searchQuery}"</p>
                      <button 
                        onClick={() => {setSearchQuery(''); setStatusFilter('ALL');}}
                        className="mt-2 text-indigo-600 hover:text-indigo-800 text-xs font-bold uppercase tracking-wide"
                      >
                        Clear Filters
                      </button>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Bulk Action Bar */}
      <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-[#0f172a] text-white px-2 py-2 rounded-2xl shadow-2xl flex items-center gap-2 transition-all duration-300 z-30 border border-slate-700 ${selectedIds.size > 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
           <div className="flex items-center gap-3 border-r border-slate-700 pl-4 pr-4">
               <div className="bg-indigo-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm shadow-indigo-500/50">{selectedIds.size}</div>
               <span className="font-semibold text-xs text-slate-300 uppercase tracking-wider">Selected</span>
           </div>
           
           <div className="flex items-center p-1 gap-1">
               <button 
                 onClick={() => handleBulkAction('DECREASE_BID')}
                 className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded-xl transition-all active:scale-95 group"
               >
                   <TrendingDown size={16} className="text-amber-400 group-hover:text-amber-300" />
                   <span className="text-xs font-semibold text-slate-300 group-hover:text-white">Decrease Bids</span>
               </button>
               
               <button 
                 onClick={() => handleBulkAction('PAUSE')}
                 className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded-xl transition-all active:scale-95 group"
               >
                   <PauseCircle size={16} className="text-red-400 group-hover:text-red-300" />
                   <span className="text-xs font-semibold text-slate-300 group-hover:text-white">Pause</span>
               </button>

                <button 
                 onClick={() => handleBulkAction('INCREASE_BID')}
                 className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded-xl transition-all active:scale-95 group"
               >
                   <TrendingUp size={16} className="text-emerald-400 group-hover:text-emerald-300" />
                   <span className="text-xs font-semibold text-slate-300 group-hover:text-white">Increase Bids</span>
               </button>
           </div>
           
           <button 
             onClick={() => setSelectedIds(new Set())} 
             className="ml-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-500 hover:text-white transition-colors"
           >
               <X size={16} />
           </button>
      </div>
    </div>
  );
};