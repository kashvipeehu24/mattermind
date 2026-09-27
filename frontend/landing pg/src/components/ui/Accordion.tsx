import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQItem } from '../../types';

export interface AccordionProps {
  items: FAQItem[];
  defaultOpenId?: string;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenId,
  className = '',
}) => {
  const [openId, setOpenId] = useState<string | null>(
    defaultOpenId || items[0]?.id || null
  );

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden transition-all duration-200"
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="w-full flex justify-between items-center p-6 text-left cursor-pointer font-bold text-[#0f172a] hover:text-[#316bf3] transition-colors focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="text-base md:text-lg">{item.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-[#45464d] transition-transform duration-300 shrink-0 ml-4 ${
                  isOpen ? 'rotate-180 text-[#316bf3]' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-6 pb-6 text-[#45464d] text-sm md:text-base leading-relaxed border-t border-slate-100 pt-4">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
