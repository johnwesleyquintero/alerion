import React from 'react';
import { Campaign, CampaignStatus } from '../types';
import { ArrowUpRight, ArrowDownRight, PauseCircle, PlayCircle, AlertCircle, ChevronRight } from 'lucide-react';

interface CampaignTableProps {
  campaigns: Campaign[];
  onCampaignClick?: (campaign: Campaign) => void;
}

export const CampaignTable: React.FC<CampaignTableProps> = ({ campaigns, onCampaignClick }) => {
  
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
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider bg-slate-50">Campaign Name</th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider bg-slate-50">Status</th>
            <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider bg-slate-50">Spend</th>
            <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider bg-slate-50">Sales</th>
            <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider bg-slate-50">ACOS</th>
            <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider bg-slate-50">ROAS</th>
            <th scope="col" className="px-4 py-4 w-10 bg-slate-50"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {campaigns.map((campaign) => (
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