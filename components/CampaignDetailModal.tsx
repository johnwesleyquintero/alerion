import React from 'react';
import { Campaign, CampaignStatus } from '../types';
import { X, TrendingUp, DollarSign, Target, MousePointer, Activity } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

interface CampaignDetailModalProps {
  campaign: Campaign;
  onClose: () => void;
}

// Mock sparkline data generator for the modal
const generateMockTrend = (baseValue: number) => {
    return Array.from({ length: 7 }, (_, i) => ({
        day: i,
        val: baseValue * (0.8 + Math.random() * 0.4)
    }));
};

export const CampaignDetailModal: React.FC<CampaignDetailModalProps> = ({ campaign, onClose }) => {
    if (!campaign) return null;

    const salesTrend = generateMockTrend(campaign.sales / 7);
    const spendTrend = generateMockTrend(campaign.spend / 7);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-bold text-slate-900">{campaign.name}</h2>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                campaign.status === CampaignStatus.ACTIVE 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                                {campaign.status.replace('_', ' ')}
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm font-mono">ID: {campaign.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-8">
                    
                    {/* Primary Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-2 text-blue-600 mb-2">
                                <DollarSign size={16} />
                                <span className="text-xs font-bold uppercase">Sales</span>
                            </div>
                            <div className="text-xl font-bold text-slate-900">${campaign.sales.toLocaleString()}</div>
                        </div>
                        <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                             <div className="flex items-center gap-2 text-indigo-600 mb-2">
                                <Activity size={16} />
                                <span className="text-xs font-bold uppercase">Spend</span>
                            </div>
                            <div className="text-xl font-bold text-slate-900">${campaign.spend.toLocaleString()}</div>
                        </div>
                        <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                             <div className="flex items-center gap-2 text-emerald-600 mb-2">
                                <Target size={16} />
                                <span className="text-xs font-bold uppercase">ROAS</span>
                            </div>
                            <div className="text-xl font-bold text-slate-900">{campaign.roas.toFixed(2)}x</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                             <div className="flex items-center gap-2 text-slate-500 mb-2">
                                <MousePointer size={16} />
                                <span className="text-xs font-bold uppercase">Clicks</span>
                            </div>
                            <div className="text-xl font-bold text-slate-900">{campaign.clicks.toLocaleString()}</div>
                        </div>
                    </div>

                    {/* Deep Dive & Trend */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <TrendingUp size={16} className="text-indigo-500" />
                                7-Day Performance Trend
                            </h3>
                            <div className="h-32 w-full bg-slate-50 rounded-lg border border-slate-100 overflow-hidden relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={salesTrend}>
                                        <defs>
                                            <linearGradient id="modalColorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <Area type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={2} fill="url(#modalColorSales)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Campaign Health Check</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600">ACOS Efficiency</span>
                                    <span className={`font-bold ${campaign.acos > 30 ? 'text-red-600' : 'text-emerald-600'}`}>{campaign.acos}%</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5">
                                    <div className={`h-1.5 rounded-full ${campaign.acos > 30 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(campaign.acos, 100)}%` }}></div>
                                </div>
                                
                                <div className="flex justify-between items-center text-sm mt-2">
                                    <span className="text-slate-600">Click Through Rate (CTR)</span>
                                    <span className="font-bold text-slate-800">{campaign.ctr}%</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5">
                                    <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${Math.min(campaign.ctr * 10, 100)}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-slate-50 border-t border-slate-100 p-4 flex justify-end gap-3">
                    <button className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                        Edit Settings
                    </button>
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-lg shadow-indigo-200">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};