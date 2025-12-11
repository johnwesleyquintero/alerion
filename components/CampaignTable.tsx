import React from 'react';
import { Campaign, CampaignStatus } from '../types';
import { ArrowUpRight, ArrowDownRight, PauseCircle, PlayCircle, AlertCircle } from 'lucide-react';

interface CampaignTableProps {
  campaigns: Campaign[];
}

export const CampaignTable: React.FC<CampaignTableProps> = ({ campaigns }) => {
  
  const getStatusColor = (status: CampaignStatus) => {
    switch (status) {
      case CampaignStatus.ACTIVE: return 'bg-emerald-100 text-emerald-800';
      case CampaignStatus.PAUSED: return 'bg-gray-100 text-gray-800';
      case CampaignStatus.OUT_OF_BUDGET: return 'bg-red-100 text-red-800';
      case CampaignStatus.ARCHIVED: return 'bg-slate-100 text-slate-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: CampaignStatus) => {
    switch (status) {
      case CampaignStatus.ACTIVE: return <PlayCircle className="w-4 h-4 mr-1" />;
      case CampaignStatus.PAUSED: return <PauseCircle className="w-4 h-4 mr-1" />;
      case CampaignStatus.OUT_OF_BUDGET: return <AlertCircle className="w-4 h-4 mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Campaign Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Spend</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Sales</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">ACOS</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">ROAS</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {campaigns.map((campaign) => (
            <tr key={campaign.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-slate-900">{campaign.name}</div>
                <div className="text-xs text-slate-500">ID: {campaign.id}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                  {getStatusIcon(campaign.status)}
                  {campaign.status.replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-600">
                ${campaign.spend.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-900 font-semibold">
                ${campaign.sales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                 <div className={`flex items-center justify-end ${campaign.acos > 30 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {campaign.acos}%
                    {campaign.acos > 30 ? <ArrowUpRight className="w-3 h-3 ml-1" /> : <ArrowDownRight className="w-3 h-3 ml-1" />}
                 </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-600">
                {campaign.roas.toFixed(2)}x
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
