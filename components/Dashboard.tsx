import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, DollarSign, ShoppingCart, Percent, Activity, Sparkles, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { MOCK_CAMPAIGNS, MOCK_CHART_DATA } from '../constants';
import { CampaignTable } from './CampaignTable';
import { generateMarketInsights } from '../services/geminiService';
import { MarketInsight } from '../types';

export const Dashboard: React.FC = () => {
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(true);

  // Aggregate mock totals
  const totalSpend = MOCK_CAMPAIGNS.reduce((acc, c) => acc + c.spend, 0);
  const totalSales = MOCK_CAMPAIGNS.reduce((acc, c) => acc + c.sales, 0);
  const totalImpressions = MOCK_CAMPAIGNS.reduce((acc, c) => acc + c.impressions, 0);
  const avgAcos = (totalSpend / totalSales) * 100;

  useEffect(() => {
    const fetchInsights = async () => {
      const data = await generateMarketInsights(MOCK_CAMPAIGNS);
      setInsights(data);
      setLoadingInsights(false);
    };
    fetchInsights();
  }, []);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
        case 'POSITIVE': return <CheckCircle className="text-emerald-500 w-4 h-4" />;
        case 'NEGATIVE': return <AlertTriangle className="text-amber-500 w-4 h-4" />;
        default: return <Activity className="text-blue-500 w-4 h-4" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
        case 'POSITIVE': return 'text-emerald-600';
        case 'NEGATIVE': return 'text-amber-600';
        default: return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Total Sales" 
          value={`$${totalSales.toLocaleString()}`} 
          trend="+12.5%" 
          icon={<ShoppingCart className="text-blue-600" />} 
        />
        <KPICard 
          title="Ad Spend" 
          value={`$${totalSpend.toLocaleString()}`} 
          trend="-2.1%" 
          trendGood={true}
          icon={<DollarSign className="text-indigo-600" />} 
        />
        <KPICard 
          title="ACOS" 
          value={`${avgAcos.toFixed(2)}%`} 
          trend="-1.5%" 
          trendGood={true}
          icon={<Percent className="text-emerald-600" />} 
        />
        <KPICard 
          title="Impressions" 
          value={totalImpressions.toLocaleString()} 
          trend="+5.4%" 
          icon={<Activity className="text-purple-600" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Added min-w-0 to prevent grid item blowout which confuses Recharts */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-w-0">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Performance Trends</h3>
          {/* Added min-w-0 to the immediate parent of ResponsiveContainer */}
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSales)" name="Sales" />
                <Area type="monotone" dataKey="spend" stroke="#6366f1" fillOpacity={1} fill="url(#colorSpend)" name="Spend" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col min-w-0">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    Market Insights
                </h3>
                {loadingInsights && <span className="text-xs text-slate-400 animate-pulse">Analzying...</span>}
            </div>
            
            <div className="space-y-4 flex-1">
                {loadingInsights ? (
                    // Skeleton Loading
                    [1, 2, 3].map((i) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-100 animate-pulse">
                            <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                            <div className="h-3 bg-slate-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                        </div>
                    ))
                ) : (
                    insights.map((insight, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-100 transition-all hover:shadow-sm">
                            <div className="flex justify-between items-start mb-1">
                                <div className="text-sm text-slate-500 font-medium">{insight.title}</div>
                                {getSentimentIcon(insight.sentiment)}
                            </div>
                            <div className="font-medium text-slate-900 text-sm mb-1">{insight.description}</div>
                            {insight.metric && (
                                <div className={`text-xs ${getSentimentColor(insight.sentiment)} mt-1 flex items-center font-medium`}>
                                    <ArrowRight size={10} className="mr-1"/> {insight.metric}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Active Campaigns</h3>
         </div>
         <CampaignTable campaigns={MOCK_CAMPAIGNS} />
      </div>
    </div>
  );
};

const KPICard = ({ title, value, trend, icon, trendGood = false }: { title: string, value: string, trend: string, icon: React.ReactNode, trendGood?: boolean }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      <span className={`text-sm font-medium ${trendGood || trend.startsWith('+') && !trendGood ? 'text-emerald-600' : 'text-slate-500'}`}>
        {trend}
      </span>
    </div>
    <div className="text-slate-500 text-sm">{title}</div>
    <div className="text-2xl font-bold text-slate-900 mt-1">{value}</div>
  </div>
);