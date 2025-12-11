import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, DollarSign, ShoppingCart, Percent, Activity } from 'lucide-react';
import { MOCK_CAMPAIGNS, MOCK_CHART_DATA } from '../constants';
import { CampaignTable } from './CampaignTable';

export const Dashboard: React.FC = () => {
  // Aggregate mock totals
  const totalSpend = MOCK_CAMPAIGNS.reduce((acc, c) => acc + c.spend, 0);
  const totalSales = MOCK_CAMPAIGNS.reduce((acc, c) => acc + c.sales, 0);
  const totalImpressions = MOCK_CAMPAIGNS.reduce((acc, c) => acc + c.impressions, 0);
  const avgAcos = (totalSpend / totalSales) * 100;

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
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Performance Trends</h3>
          <div className="h-72 w-full">
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

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Market Insights</h3>
            <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-sm text-slate-500 mb-1">Top Search Term</div>
                    <div className="font-medium text-slate-900">"ergonomic office chair"</div>
                    <div className="text-xs text-emerald-600 mt-1 flex items-center">
                        <ArrowUpRight size={12} className="mr-1"/> 15% conversion rate
                    </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-sm text-slate-500 mb-1">Competitor Alert</div>
                    <div className="font-medium text-slate-900">Brand X increased bids</div>
                    <div className="text-xs text-amber-600 mt-1 flex items-center">
                        Affecting 3 active campaigns
                    </div>
                </div>
                 <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="text-sm text-slate-500 mb-1">Inventory Health</div>
                    <div className="font-medium text-slate-900">98% In Stock</div>
                    <div className="text-xs text-blue-600 mt-1">
                        Ready for scale
                    </div>
                </div>
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
