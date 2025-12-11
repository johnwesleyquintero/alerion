import React, { useState, useRef, useEffect } from 'react';
import { analyzeCampaigns, createCampaignChat } from '../services/geminiService';
import { MOCK_CAMPAIGNS } from '../constants';
import { OptimizationSuggestion, OptimizationStrategy } from '../types';
import { Bot, Sparkles, ChevronRight, Loader2, Send, Target, TrendingUp, DollarSign, MessageSquare, Check } from 'lucide-react';
import { Chat, GenerateContentResponse } from "@google/genai";

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const AIOptimizer: React.FC = () => {
  const [strategy, setStrategy] = useState<OptimizationStrategy>('BALANCED');
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [completedSuggestions, setCompletedSuggestions] = useState<string[]>([]);

  // Chat State
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleAnalyze = async () => {
    setLoading(true);
    setCompletedSuggestions([]);
    try {
      const results = await analyzeCampaigns(MOCK_CAMPAIGNS, strategy);
      setSuggestions(results);
      
      // Initialize chat session with the data AND strategy
      const chat = createCampaignChat(MOCK_CAMPAIGNS, strategy);
      setChatSession(chat);
      setMessages([{ role: 'model', text: `I've analyzed your ${MOCK_CAMPAIGNS.length} campaigns with a ${strategy.toLowerCase()} strategy. What specific details would you like to know?` }]);
      
      setAnalyzed(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !chatSession) return;

    const userText = inputMessage;
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsChatting(true);

    try {
      const response: GenerateContentResponse = await chatSession.sendMessage({ message: userText });
      const modelText = response.text || "I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'model', text: modelText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Error communicating with Alerion AI." }]);
    } finally {
      setIsChatting(false);
    }
  };

  const handleApplySuggestion = (index: number) => {
    // Optimistic UI update
    setCompletedSuggestions(prev => [...prev, index.toString()]);
    
    // In a real app, this would call an API to update the bid
    setTimeout(() => {
      // Simulate API delay
      setSuggestions(prev => prev.filter((_, i) => i !== index));
      setCompletedSuggestions(prev => prev.filter(id => id !== index.toString()));
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-6">
            <Bot className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Alerion Strategic Command</h2>
            <p className="text-slate-600 mb-8">
            Select your strategic objective and let Gemini 2.5 analyze your campaign data for actionable insights and real-time Q&A.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-slate-50 p-2 rounded-xl border border-slate-200 inline-flex">
                <button 
                    onClick={() => setStrategy('PROFITABILITY')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${strategy === 'PROFITABILITY' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <DollarSign size={16} /> Profitability
                </button>
                <button 
                    onClick={() => setStrategy('BALANCED')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${strategy === 'BALANCED' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Target size={16} /> Balanced
                </button>
                <button 
                    onClick={() => setStrategy('GROWTH')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${strategy === 'GROWTH' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <TrendingUp size={16} /> Growth
                </button>
            </div>

            <div className="mt-8">
                <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="inline-flex items-center px-8 py-3 rounded-xl shadow-lg shadow-indigo-200 text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all font-medium"
                >
                    {loading ? (
                    <>
                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                        Analyzing Data...
                    </>
                    ) : (
                    <>
                        <Sparkles className="-ml-1 mr-3 h-5 w-5" />
                        Execute Analysis
                    </>
                    )}
                </button>
            </div>
        </div>
      </div>

      {analyzed && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Suggestions Feed */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <Target className="text-indigo-600" size={20}/> 
                    Strategic Actions
                </h3>
                <span className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md uppercase">
                    {strategy} Mode
                </span>
            </div>
            
            <div className="space-y-4">
              {suggestions.length === 0 && (
                  <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-200 text-slate-500">
                      <Check className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                      <p>All optimization suggestions applied.</p>
                  </div>
              )}
              {suggestions.map((item, index) => {
                const isCompleted = completedSuggestions.includes(index.toString());
                return (
                    <div 
                    key={index} 
                    className={`bg-white rounded-xl border border-slate-200 p-5 shadow-sm transition-all duration-500 ease-in-out ${
                        isCompleted ? 'opacity-0 translate-x-10' : 'opacity-100'
                    }`}
                    >
                    <div className="flex items-start gap-4">
                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${item.suggestedAction.includes('INCREASE') ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start">
                                <h4 className="font-semibold text-slate-900">{item.suggestion}</h4>
                                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{item.campaignName}</span>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                                {item.reasoning}
                            </p>
                            <div className="pt-2 flex items-center justify-between">
                                <span className={`text-xs font-semibold px-2 py-1 rounded border ${item.suggestedAction.includes('INCREASE') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                    {item.suggestedAction.replace('_', ' ')}
                                </span>
                                <button 
                                    onClick={() => handleApplySuggestion(index)}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center hover:underline"
                                >
                                    Apply <ChevronRight size={14} className="ml-1"/>
                                </button>
                            </div>
                        </div>
                    </div>
                    </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Chat Interface */}
          <div className="flex flex-col h-[600px] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <MessageSquare className="text-indigo-600" size={18} />
                <h3 className="font-semibold text-slate-800">Analyst Assistant</h3>
             </div>
             
             {/* Messages Area */}
             <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            msg.role === 'user' 
                            ? 'bg-indigo-600 text-white rounded-br-none shadow-md' 
                            : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isChatting && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                           <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
             </div>

             {/* Input Area */}
             <div className="p-4 bg-white border-t border-slate-200">
                <form onSubmit={handleSendMessage} className="relative">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask about your campaign data..."
                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                    />
                    <button 
                        type="submit"
                        disabled={!inputMessage.trim() || isChatting}
                        className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={16} />
                    </button>
                </form>
             </div>
          </div>

        </div>
      )}
    </div>
  );
};