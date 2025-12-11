import React, { useState } from 'react';
import { analyzeCampaigns } from '../services/geminiService';
import { MOCK_CAMPAIGNS } from '../constants';
import { OptimizationSuggestion } from '../types';
import { Bot, Sparkles, Check, ChevronRight, Loader2 } from 'lucide-react';

export const AIOptimizer: React.FC = () => {
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const results = await analyzeCampaigns(MOCK_CAMPAIGNS);
      setSuggestions(results);
      setAnalyzed(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
          <Bot className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Alerion AI Optimizer</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Leverage the power of Gemini 2.5 Flash to analyze your campaign metrics, identify waste, and uncover scaling opportunities instantly.
        </p>
        
        {!analyzed && (
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Analyzing Performance...
              </>
            ) : (
              <>
                <Sparkles className="-ml-1 mr-3 h-5 w-5" />
                Run AI Analysis
              </>
            )}
          </button>
        )}
      </div>

      {loading && (
        <div className="space-y-4 animate-pulse max-w-2xl mx-auto">
           <div className="h-4 bg-slate-200 rounded w-3/4"></div>
           <div className="h-4 bg-slate-200 rounded w-full"></div>
           <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        </div>
      )}

      {analyzed && (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 pb-4">
            <h3 className="text-xl font-semibold text-slate-800">Optimization Recommendations</h3>
            <span className="text-sm text-slate-500">{suggestions.length} suggestions found</span>
          </div>

          <div className="grid gap-4">
            {suggestions.map((item, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.suggestedAction.includes('INCREASE') ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {item.campaignName}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${item.suggestedAction.includes('INCREASE') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {item.suggestedAction.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="text-lg font-medium text-slate-900">{item.suggestion}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.reasoning}</p>
                  </div>
                  
                  <div className="flex items-center md:flex-col gap-2 shrink-0">
                    <button className="flex-1 md:w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Apply <ChevronRight className="ml-1.5 w-4 h-4" />
                    </button>
                    <button className="text-slate-400 hover:text-slate-600 p-2">
                       Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center pt-6">
             <button 
                onClick={() => { setAnalyzed(false); setSuggestions([]); }}
                className="text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors"
             >
                Reset Analysis
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
