import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { MOCK_MATERIALS } from '../data/mockData';
import { MaterialItem } from '../types';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSelectMaterial?: (material: MaterialItem) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSelectMaterial,
  placeholder = "Search materials, passport IDs (e.g. DPP-EU-...), formulas, or suppliers...",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey listener for / or ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement !== inputRef.current) {
        // Only focus if user is not typing in another input
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes((document.activeElement?.tagName || ''))) return;
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const suggestions = value.trim().length >= 2
    ? MOCK_MATERIALS.filter(m =>
        m.name.toLowerCase().includes(value.toLowerCase()) ||
        m.code.toLowerCase().includes(value.toLowerCase()) ||
        m.passportId.toLowerCase().includes(value.toLowerCase()) ||
        m.supplier.toLowerCase().includes(value.toLowerCase()) ||
        m.category.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={placeholder}
          className="w-full h-11 pl-10 pr-20 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all shadow-xs"
        />
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {value ? (
            <button
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-mono font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded-md">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Auto-suggestion Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase flex items-center justify-between">
            <span>Material Suggestions ({suggestions.length})</span>
            <span className="flex items-center gap-1 text-secondary font-normal lowercase">
              <Sparkles className="w-3 h-3" /> AI Index Match
            </span>
          </div>
          
          <div className="divide-y divide-slate-100">
            {suggestions.map((m) => (
              <button
                key={m.id}
                onMouseDown={() => {
                  if (onSelectMaterial) onSelectMaterial(m);
                  onChange(m.name);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900 group-hover:text-secondary transition-colors">
                      {m.code}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {m.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                    <span>{m.category}</span>
                    <span>•</span>
                    <span>{m.passportId}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-medium">{m.healthIndex}% Health</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-secondary group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
