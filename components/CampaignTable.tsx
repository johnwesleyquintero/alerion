import React, { useState, useMemo } from 'react';
import { Campaign, CampaignStatus } from '../types';
import { ArrowUpRight, ArrowDownRight, PauseCircle, PlayCircle, AlertCircle, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface CampaignTableProps {
  campaigns: Campaign[];
  onCampaignClick?: (campaign: Campaign) => void;
}

type SortConfig = {
  key: keyof Campaign;
  direction: 'asc' | 'desc';
} | null;

export const CampaignTable: React.FC<CampaignTableProps> = ({ campaigns, onCampaignClick }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'sales', direction: 'desc' });

  const sortedCampaigns = useMemo(() => {
    if (!sortConfig) return campaigns;
    
    return [...campaigns].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [campaigns, sortConfig]);

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

  return (
    <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-slate-200 max-h-[500px] overflow-y-auto relative">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
          <tr>
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
          {sortedCampaigns.map((campaign) => (
            <tr 
                key={campaign.id} 
                onClick={() => onCampaignClick && onCampaignClick(campaign)}
                className="hover:bg-indigo-50/50 transition-colors group cursor-pointer border-l-4 border-transparent hover:border-indigo-500"
            >
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
                    {campaign.acos}%
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
          ))}
        </tbody>
      </table>
    </div>
  );
};