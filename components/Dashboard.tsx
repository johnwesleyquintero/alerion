import React, { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingCart, Percent, Activity, Sparkles, AlertTriangle, CheckCircle, ArrowRight, TrendingUp, Zap } from 'lucide-react';
import { MOCK_CAMPAIGNS, MOCK_CHART_DATA } from '../constants';
import { CampaignTable } from './CampaignTable';
import { CampaignDetailModal } from './CampaignDetailModal';
import { generateMarketInsights, generateExecutiveBriefing } from '../services/geminiService';
import { MarketInsight, ExecutiveBriefing, Campaign, CampaignStatus } from '../types';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

// Custom Tooltip Component for Recharts
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const sales = payload.find((p: any) => p.dataKey === 'sales')?.value || 0;
    const spend = payload.find((p: any) => p.dataKey === 'spend')?.value || 0;
    const acos = sales > 0 ? (spend / sales) * 100 : 0;

    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-2xl text-white min-w-[180px]">
        <p className="text-slate-400 text-xs font-semibold uppercase mb-2 tracking-wider">{label}</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center gap-4">
            <span className="text-sm font-medium text-blue-400 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div> Sales
            </span>
            <span className="font-mono font-bold">${sales.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
             <span className="text-sm font-medium text-indigo-400 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div> Spend
            </span>
            <span className="font-mono font-bold">${spend.toLocaleString()}</span>
          </div>
          <div className="border-t border-slate-700 pt-2 mt-2 flex justify-between items-center">
             <span className="text-xs font-medium text-slate-400">Daily ACOS</span>
             <span className={`font-mono font-bold text-sm ${acos > 30 ? 'text-red-400' : 'text-emerald-400'}`}>
               {acos.toFixed(1)}%
             </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const Dashboard: React.FC = () => {
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [briefing, setBriefing] = useState<ExecutiveBriefing | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  
  // State for Campaigns to allow mutations (Optimistic UI)
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);

  // Aggregates based on CURRENT state (so they update when you change table data)
  const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalSales = campaigns.reduce((acc, c) => acc + c.sales, 0);
  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0);
  const avgAcos = totalSales > 0 ? (totalSpend / totalSales) * 100 : 0;

  useEffect(() => {
    setIsMounted(true);
    const fetchAI = async () => {
      // In a real app, we would pass the dynamic 'campaigns' state here, 
      // but for initial load speed we use the constant or cached data
      const [data, briefingData] = await Promise.all([
          generateMarketInsights(MOCK_CAMPAIGNS),
          generateExecutiveBriefing(MOCK_CAMPAIGNS)
      ]);
      setInsights(data);
      setBriefing(briefingData);
      setLoadingInsights(false);
    };
    fetchAI();
  }, []);

  const handleCampaignUpdate = (updatedCampaigns: Campaign[]) => {
      setCampaigns(updatedCampaigns);
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
        case 'POSITIVE': return <CheckCircle className="text-emerald-500 w-4 h-4" />;
        case 'NEGATIVE': return <AlertTriangle className="text-amber-500 w-4 h-4" />;
        default: return <Activity className="text-blue-500 w-4 h-4" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
        case 'POSITIVE': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
        case 'NEGATIVE': return 'text-amber-600 bg-amber-50 border-amber-100';
        default: return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* AI Executive Briefing - Morning Protocol */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-1 shadow-lg shadow-indigo-500/10">
        <div className="bg-slate-900/50 backdrop-blur-md rounded-xl p-6 md:p-8 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-start">
                <div className="bg-indigo-500/20 p-3 rounded-xl border border-indigo-500/30 w-fit h-fit">
                    <Sparkles className="text-indigo-400 w-6 h-6" />
                </div>
                <div className="space-y-3 flex-1">
                    {loadingInsights || !briefing ? (
                         <div className="space-y-3 animate-pulse">
                            <div className="h-6 bg-slate-700 rounded w-1/3"></div>
                            <div className="h-4 bg-slate-800 rounded w-full"></div>
                            <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                         </div>
                    ) : (
                        <>
                            <h2 className="text-white text-2xl font-bold tracking-tight">{briefing.headline}</h2>
                            <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
                                {briefing.summary}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-indigo-300 text-sm font-semibold bg-indigo-950/50 px-3 py-1.5 rounded-lg w-fit border border-indigo-500/20">
                                <Zap size={14} className="fill-indigo-300" />
                                Strategic Focus: {briefing.actionItem}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Total Sales" 
          value={`$${totalSales.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} 
          trend="+12.5%" 
          icon={<ShoppingCart className="text-white w-5 h-5" />}
          gradient="from-blue-500 to-blue-600"
          subtext="vs. last 30 days"
        />
        <KPICard 
          title="Ad Spend" 
          value={`$${totalSpend.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} 
          trend="-2.1%" 
          trendGood={true}
          icon={<DollarSign className="text-white w-5 h-5" />}
          gradient="from-indigo-500 to-indigo-600"
           subtext="Budget utilization: 84%"
        />
        <KPICard 
          title="ACOS" 
          value={`${avgAcos.toFixed(2)}%`} 
          trend="-1.5%" 
          trendGood={true}
          icon={<Percent className="text-white w-5 h-5" />}
          gradient="from-emerald-500 to-emerald-600"
           subtext="Target: 30.00%"
        />
        <KPICard 
          title="Impressions" 
          value={totalImpressions.toLocaleString()} 
          trend="+5.4%" 
          icon={<Activity className="text-white w-5 h-5" />}
          gradient="from-violet-500 to-violet-600"
          subtext="CTR: 2.85%"
        />
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Charts Column */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Timeline Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-w-0">
            <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Performance Trends</h3>
                  <p className="text-sm text-slate-500">Sales vs. Spend over time</p>
                </div>
                <div className="flex gap-2">
                    <span className="flex items-center text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div> Sales
                    </span>
                    <span className="flex items-center text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 mr-1"></div> Spend
                    </span>
                </div>
            </div>
            <div className="h-72 w-full min-w-0 relative">
              {isMounted ? (
                <div className="absolute inset-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                      <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }} />
                      <Area type="monotone" dataKey="spend" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                 <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-xl animate-pulse">
                    <Activity className="text-slate-300 w-8 h-8" />
                 </div>
              )}
            </div>
          </div>

          {/* Campaign Efficiency Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-w-0">
            <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Campaign Efficiency</h3>
                  <p className="text-sm text-slate-500">Top campaigns by volume</p>
                </div>
            </div>
            <div className="h-60 w-full min-w-0 relative">
               {isMounted && (
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={campaigns} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                      <YAxis dataKey="name" type="category" width={100} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => val.length > 15 ? val.substring(0, 15) + '...' : val} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="sales" name="Sales Revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={12} />
                      <Bar dataKey="spend" name="Ad Spend" fill="#cbd5e1" radius={[0, 4, 4, 0]} barSize={12} />
                   </BarChart>
                 </ResponsiveContainer>
               )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Insights & Actions */}
        <div className="flex flex-col gap-6">
            
            {/* Insights Panel */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col min-w-0 h-full">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-500" />
                        Market Pulse
                    </h3>
                </div>
                
                <div className="space-y-4 flex-1">
                    {loadingInsights ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 animate-pulse">
                                <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                                <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                            </div>
                        ))
                    ) : (
                        insights.map((insight, idx) => (
                            <div key={idx} className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${getSentimentColor(insight.sentiment)}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">{insight.title}</span>
                                    {getSentimentIcon(insight.sentiment)}
                                </div>
                                <p className="text-sm font-medium text-slate-700 leading-snug mb-3">
                                    {insight.description}
                                </p>
                                {insight.metric && (
                                    <div className="flex items-center text-xs font-bold opacity-90">
                                        <Activity size={12} className="mr-1" />
                                        {insight.metric}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Tables Section - Passing state and handler for updates */}
      <CampaignTable 
        campaigns={campaigns} 
        onCampaignClick={setSelectedCampaign} 
        onCampaignUpdate={handleCampaignUpdate}
      />

      {/* Modals */}
      {selectedCampaign && (
          <CampaignDetailModal campaign={selectedCampaign} onClose={() => setSelectedCampaign(null)} />
      )}
    </div>
  );
};

// Polished KPI Card with Gradient
const KPICard = ({ title, value, trend, icon, trendGood = false, gradient, subtext }: { 
    title: string, value: string, trend: string, icon: React.ReactNode, trendGood?: boolean, gradient: string, subtext?: string 
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-full ${trendGood || trend.startsWith('+') && !trendGood ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
         {trend.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
         {trend}
      </div>
    </div>
    <div className="relative z-10">
        <div className="text-slate-500 text-sm font-medium mb-1">{title}</div>
        <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</div>
        {subtext && <div className="text-xs text-slate-400 mt-2 font-medium">{subtext}</div>}
    </div>
    {/* Decorative Background Blob */}
    <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-5 bg-gradient-to-br ${gradient} group-hover:scale-150 transition-transform duration-500 ease-out`}></div>
  </div>
);