import React, { useState, useRef, useEffect } from 'react';
import { analyzeCampaigns, createCampaignChat } from '../services/geminiService';
import { MOCK_CAMPAIGNS } from '../constants';
import { OptimizationSuggestion, OptimizationStrategy } from '../types';
import { Bot, Sparkles, ChevronRight, Loader2, Send, Target, TrendingUp, DollarSign, MessageSquare, Check, Square, CheckSquare, Zap, User, BarChart2 } from 'lucide-react';
import { Chat, GenerateContentResponse } from "@google/genai";

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const QUICK_PROMPTS = [
  { text: "📉 Reduce High ACOS", prompt: "Identify campaigns with ACOS above 30% and suggest immediate bid adjustments." },
  { text: "🚀 Scale Winners", prompt: "Which campaigns have a ROAS above 3.0? How can we scale them?" },
  { text: "💸 Audit Wasted Spend", prompt: "Find keywords with high spend but zero sales." },
];

export const AIOptimizer: React.FC = () => {
  const [strategy, setStrategy] = useState<OptimizationStrategy>('BALANCED');
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  
  // Track completed IDs
  const [completedSuggestions, setCompletedSuggestions] = useState<string[]>([]);
  
  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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
    setSelectedIds(new Set());
    try {
      const results = await analyzeCampaigns(MOCK_CAMPAIGNS, strategy);
      setSuggestions(results);
      
      const chat = createCampaignChat(MOCK_CAMPAIGNS, strategy);
      setChatSession(chat);
      setMessages([{ role: 'model', text: `Analysis Complete. I've reviewed ${MOCK_CAMPAIGNS.length} campaigns focusing on a ${strategy.toLowerCase()} strategy. I found ${results.length} optimization opportunities.` }]);
      
      setAnalyzed(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, manualText?: string) => {
    if (e) e.preventDefault();
    const textToSend = manualText || inputMessage;
    
    if (!textToSend.trim() || !chatSession) return;

    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setIsChatting(true);

    try {
      const response: GenerateContentResponse = await chatSession.sendMessage({ message: textToSend });
      const modelText = response.text || "I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'model', text: modelText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Error communicating with Alerion AI." }]);
    } finally {
      setIsChatting(false);
    }
  };

  const handleApplySuggestion = (campaignId: string) => {
    setCompletedSuggestions(prev => [...prev, campaignId]);
    setTimeout(() => {
      setSuggestions(prev => prev.filter(s => s.campaignId !== campaignId));
      setCompletedSuggestions(prev => prev.filter(id => id !== campaignId));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(campaignId);
        return next;
      });
    }, 800);
  };

  const toggleSelection = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === suggestions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(suggestions.map(s => s.campaignId)));
    }
  };

  const handleBulkApply = () => {
    const idsToApply = Array.from(selectedIds);
    setCompletedSuggestions(prev => [...prev, ...idsToApply]);

    setTimeout(() => {
        setSuggestions(prev => prev.filter(s => !selectedIds.has(s.campaignId)));
        setCompletedSuggestions(prev => prev.filter(id => !selectedIds.has(id)));
        setSelectedIds(new Set());
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden transition-all duration-500">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-50 via-white to-transparent rounded-full -mr-20 -mt-20 blur-3xl opacity-60"></div>
        
        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <Bot className="w-6 h-6 text-indigo-600" />
                    </div>
                    <span className="text-sm font-bold text-indigo-600 tracking-wide uppercase">Strategic Command</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Optimize Campaign Performance</h2>
                <p className="text-slate-600 text-lg">
                    Select your objective. Alerion will analyze your data, identifying inefficiencies and growth opportunities instantly.
                </p>
            </div>

            <div className="flex flex-col gap-4 min-w-[300px]">
                 <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                    {(['PROFITABILITY', 'BALANCED', 'GROWTH'] as OptimizationStrategy[]).map((s) => (
                        <button 
                            key={s}
                            onClick={() => setStrategy(s)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                strategy === s 
                                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                            }`}
                        >
                            {s === 'PROFITABILITY' && <DollarSign size={16} />}
                            {s === 'BALANCED' && <Target size={16} />}
                            {s === 'GROWTH' && <TrendingUp size={16} />}
                            <span className="capitalize">{s.toLowerCase()}</span>
                        </button>
                    ))}
                 </div>
                 
                 <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-200 text-white bg-indigo-600 hover:bg-indigo-700 hover:translate-y-[-1px] active:translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-base"
                >
                    {loading ? (
                    <>
                        <Loader2 className="animate-spin h-5 w-5" />
                        Running Analysis...
                    </>
                    ) : (
                    <>
                        <Sparkles className="h-5 w-5 fill-indigo-400" />
                        Execute Analysis
                    </>
                    )}
                </button>
            </div>
        </div>
      </div>

      {analyzed && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Left Column: Suggestions Feed */}
          <div className="lg:col-span-7 space-y-6 relative">
            <div className="flex items-center justify-between sticky top-0 bg-slate-50/95 backdrop-blur z-20 py-4 border-b border-slate-200/50">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={toggleSelectAll}
                        className="text-slate-400 hover:text-indigo-600 transition-colors p-1 hover:bg-indigo-50 rounded"
                        title={selectedIds.size === suggestions.length ? "Deselect All" : "Select All"}
                    >
                        {selectedIds.size > 0 && selectedIds.size === suggestions.length ? (
                            <CheckSquare size={22} className="text-indigo-600" />
                        ) : (
                            <Square size={22} />
                        )}
                    </button>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        Strategic Actions
                        <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">{suggestions.length}</span>
                    </h3>
                </div>
            </div>
            
            <div className="space-y-4 pb-24">
              {suggestions.length === 0 && (
                  <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 border-dashed text-slate-500">
                      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h4 className="text-lg font-semibold text-slate-900 mb-1">Optimization Complete</h4>
                      <p>All actionable insights have been applied.</p>
                  </div>
              )}
              {suggestions.map((item) => {
                const isCompleted = completedSuggestions.includes(item.campaignId);
                const isSelected = selectedIds.has(item.campaignId);
                const isIncrease = item.suggestedAction.includes('INCREASE');

                return (
                    <div 
                    key={item.campaignId} 
                    className={`bg-white rounded-xl border transition-all duration-300 ease-in-out group hover:shadow-md ${
                        isCompleted ? 'opacity-0 translate-x-full' : 'opacity-100'
                    } ${isSelected ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-md bg-indigo-50/10' : 'border-slate-200 shadow-sm'}`}
                    >
                    <div className="p-5 flex items-start gap-4">
                        <button 
                            onClick={() => toggleSelection(item.campaignId)}
                            className="mt-1 text-slate-300 hover:text-indigo-500 transition-colors"
                        >
                            {isSelected ? <CheckSquare size={20} className="text-indigo-600" /> : <Square size={20} />}
                        </button>

                        <div className="flex-1 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg leading-tight mb-1">{item.suggestion}</h4>
                                    <div className="flex items-center gap-2">
                                        <BarChart2 size={12} className="text-slate-400"/>
                                        <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">{item.campaignName}</span>
                                    </div>
                                </div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isIncrease ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                    {isIncrease ? <TrendingUp size={16} /> : <Target size={16} />}
                                </div>
                            </div>
                            
                            <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                                {item.reasoning}
                            </p>
                            
                            <div className="pt-2 flex items-center justify-between border-t border-slate-100 mt-2">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-md border uppercase tracking-wide ${isIncrease ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                    {item.suggestedAction.replace('_', ' ')}
                                </span>
                                <button 
                                    onClick={() => handleApplySuggestion(item.campaignId)}
                                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    Apply Action <ChevronRight size={14} className="ml-1"/>
                                </button>
                            </div>
                        </div>
                    </div>
                    </div>
                );
              })}
            </div>
            
            {/* Bulk Action Bar */}
            <div className={`fixed bottom-8 left-1/2 lg:left-[45%] transform -translate-x-1/2 z-30 transition-all duration-300 ${selectedIds.size > 0 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>
                <div className="bg-slate-900 text-white rounded-2xl shadow-2xl p-3 pl-4 pr-3 flex items-center gap-6 border border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-500 rounded-lg p-1.5 animate-pulse">
                            <Zap size={18} className="text-white" />
                        </div>
                        <div>
                            <div className="font-bold text-sm">{selectedIds.size} Changes Queued</div>
                        </div>
                    </div>
                    <button 
                        onClick={handleBulkApply}
                        className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors flex items-center gap-2"
                    >
                        Apply All
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>

          </div>

          {/* Right Column: Chat Interface */}
          <div className="lg:col-span-5 h-[calc(100vh-140px)] sticky top-8">
            <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-md">
                         <Bot size={18} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm">Alerion Assistant</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs text-slate-500 font-medium">Online</span>
                        </div>
                    </div>
                </div>
                
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/50">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && (
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center mt-1 border border-indigo-200">
                                    <Sparkles size={14} className="text-indigo-600" />
                                </div>
                            )}
                            
                            <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm ${
                                msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-br-none' 
                                : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                            }`}>
                                {msg.role === 'model' ? (
                                    <TypewriterText text={msg.text} />
                                ) : (
                                    msg.text
                                )}
                            </div>

                            {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center mt-1 border border-slate-300">
                                    <User size={14} className="text-slate-600" />
                                </div>
                            )}
                        </div>
                    ))}
                    {isChatting && (
                        <div className="flex justify-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center border border-indigo-200">
                                <Bot size={14} className="text-indigo-600" />
                            </div>
                            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-200 space-y-3">
                    {/* Quick Prompts */}
                    {!isChatting && (
                      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {QUICK_PROMPTS.map((prompt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(undefined, prompt.prompt)}
                            className="flex-shrink-0 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100 transition-colors whitespace-nowrap"
                          >
                            {prompt.text}
                          </button>
                        ))}
                      </div>
                    )}

                    <form onSubmit={(e) => handleSendMessage(e)} className="relative group">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Ask about ACOS, ROAS, or specific campaigns..."
                            className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-sm font-medium"
                        />
                        <button 
                            type="submit"
                            disabled={!inputMessage.trim() || isChatting}
                            className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

// Simple typewriter effect component for chat
const TypewriterText = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState('');
    
    useEffect(() => {
        setDisplayedText(''); // Reset on text change
        let i = 0;
        const speed = 15; // ms per char
        
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText((prev) => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text]);

    return <span>{displayedText}</span>;
};