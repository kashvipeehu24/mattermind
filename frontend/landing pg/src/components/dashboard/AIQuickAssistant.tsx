import React, { useState } from 'react';
import { Bot, X, Sparkles, Send, RefreshCw, CheckCircle2, ShieldCheck, ArrowRight, Zap, Layers } from 'lucide-react';

interface AIQuickAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIQuickAssistant: React.FC<AIQuickAssistantProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; codeSnippet?: string }>>([
    {
      sender: 'ai',
      text: 'Hello Dr. Vance! I am your MatterMind Neural Material Copilot. I can run multi-alloy thermal shock simulations, predict micro-grain dislocation rates, or verify EU Digital Product Passport compliance.'
    }
  ]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Predict RUL for Inconel-718 at 850°C continuous load',
    'Calculate galvanic corrosion risk for Titanium + CFRP interface',
    'Generate EU DPP ISO 14040 carbon footprint summary',
    'Find bio-sourced PEEK alloy alternatives'
  ];

  const handleSend = (textToSend?: string) => {
    const messageText = textToSend || query;
    if (!messageText.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text: messageText }]);
    if (!textToSend) setQuery('');
    setIsSimulating(true);

    setTimeout(() => {
      let aiResponse = "Based on MatterMind's neural database, the material spec shows exceptional lattice stability with <0.02% dislocation density up to 10,000 thermal cycles.";
      let snippet: string | undefined = undefined;

      if (messageText.toLowerCase().includes('inconel') || messageText.toLowerCase().includes('rul')) {
        aiResponse = "Prognosis analysis for Inconel-718-AM at 850°C: Remaining Useful Life is projected at 12.3 years. Grain boundary creep rate remains within ISO 12111 safe thresholds.";
        snippet = "SPECS: Tensile Strength: 1375 MPa | Thermal Expansion: 13.0 μm/m·K | Creep Fatigue Margin: +18.4%";
      } else if (messageText.toLowerCase().includes('corrosion') || messageText.toLowerCase().includes('titanium')) {
        aiResponse = "Galvanic Galvanometer Assessment: Titanium Grade 23 paired with Toray T1100G Carbon Fiber matrix shows LOW galvanic corrosion risk due to the 0.5μm anodized oxide passivation layer.";
        snippet = "COMPATIBILITY SCORE: 98/100 (Optimal Combination) | Recommended interface: Epoxy barrier film.";
      } else if (messageText.toLowerCase().includes('dpp') || messageText.toLowerCase().includes('carbon')) {
        aiResponse = "EU Digital Product Passport (DPP-EU-2026-88192) verified. Embodied carbon footprint is 12.4 kg CO2e/kg (-34% vs virgin titanium baseline). Cryptographic block hash: 0x7f8a...e2f3.";
      } else if (messageText.toLowerCase().includes('peek') || messageText.toLowerCase().includes('bio')) {
        aiResponse = "Bio-Sourced PEEK Hybrid Polymer (EVK-BIO-9022) is recommended as a 100% recyclable replacement for petro-derived composites in aerospace cabin housing.";
        snippet = "DENSITY: 1.31 g/cm³ | CO2 SAVINGS: 2,890 kg / batch | Recyclability Grade: A+";
      }

      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: aiResponse, codeSnippet: snippet }
      ]);
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col h-[600px] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-white shrink-0 shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">MatterMind Copilot AI</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  Gemini 2.5 Flash
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Multi-physics material simulator & compliance engine</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-secondary text-white flex items-center justify-center shrink-0 text-xs font-bold mt-1 shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-xl p-3.5 text-xs ${
                m.sender === 'user'
                  ? 'bg-slate-900 text-white font-medium rounded-br-xs'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-bl-xs space-y-2'
              }`}>
                <p className="leading-relaxed">{m.text}</p>

                {m.codeSnippet && (
                  <div className="p-2.5 rounded-lg bg-slate-900 text-emerald-400 font-mono text-[11px] border border-slate-800">
                    {m.codeSnippet}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isSimulating && (
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium p-2 bg-white rounded-lg border border-slate-200 w-fit animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-secondary" />
              Simulating lattice micro-structure physics...
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-white border-t border-slate-200 overflow-x-auto flex gap-1.5 text-xs">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-secondary/10 hover:text-secondary text-slate-600 font-medium whitespace-nowrap transition-colors text-[11px]"
            >
              + {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI material copilot (e.g., 'Simulate thermal expansion match for titanium and carbon fiber')..."
            className="flex-1 h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
          />
          <button
            onClick={() => handleSend()}
            disabled={!query.trim() || isSimulating}
            className="h-11 px-4 bg-slate-900 hover:bg-secondary text-white rounded-xl text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 transition-colors shrink-0"
          >
            <span>Analyze</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
