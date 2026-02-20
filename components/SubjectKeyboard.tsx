import React, { useState, useEffect } from 'react';
import { Keyboard, ChevronDown, ChevronUp, GripHorizontal } from 'lucide-react';

interface SubjectKeyboardProps {
  subjectId: string;
  engineType: string;
}

type KeyboardLayout = {
  name: string;
  symbols: string[];
};

const KEYBOARD_CONFIGS: Record<string, KeyboardLayout[]> = {
  MATH_ENGINE: [
    { name: 'Алгебра', symbols: ['²', '³', '√', '∛', '±', '×', '÷', '≠', '≤', '≥', '∞', 'π', '°'] },
    { name: 'Змінні', symbols: ['x', 'y', 'z', 'a', 'b', 'c', 'α', 'β', 'Δ'] }
  ],
  GEOMETRY: [
    { name: 'Фігури', symbols: ['∠', '△', '⊥', '∥', '°', 'π', '≅', '≈', '●', '○'] },
    { name: 'Вектори', symbols: ['→', '←', '↑', '↓', '⃗'] }
  ],
  PHYSICS_ENGINE: [
    { name: 'Грецькі', symbols: ['Δ', 'λ', 'μ', 'ρ', 'θ', 'α', 'β', 'γ', 'ω', 'ε'] },
    { name: 'Одиниці', symbols: ['м/с', 'м/с²', 'Н', 'Дж', 'Вт', 'Па', 'кг', '°C'] },
    { name: 'Спец', symbols: ['→', 'F⃗', 'v⃗', '²', '³', '±'] }
  ],
  CHEMISTRY_ENGINE: [
    { name: 'Індекси', symbols: ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'] },
    { name: 'Символи', symbols: ['→', '⇌', '↑', '↓', '°', '+', 'e⁻'] },
    { name: 'Популярні', symbols: ['H₂', 'O₂', 'CO₂', 'H₂O'] }
  ],
  LANGUAGE_ENGINE_UKR: [
    { name: 'Пунктуація', symbols: ['—', '«', '»', '…', '’', '́'] }
  ],
  LANGUAGE_ENGINE_ENG: [
    { name: 'Symbols', symbols: ['—', '“', '”', '’', '...'] },
    { name: 'Phonetic', symbols: ['ə', 'ʃ', 'θ', 'ð', 'ŋ', 'æ', 'ɔ:', 'ɜ:'] }
  ],
  CODE_ENGINE: [
    { name: 'Дужки', symbols: ['{', '}', '[', ']', '(', ')', '<', '>'] },
    { name: 'Логіка', symbols: ['&&', '||', '!', '==', '!=', '=>'] },
    { name: 'Синтаксис', symbols: [';', ':', '"', "'", '`', '$', '#', '|'] }
  ],
  HISTORY_ENGINE: [
    { name: 'Час', symbols: ['ст.', 'р.', 'рр.', 'до н.е.', 'н.е.', '†'] },
    { name: 'Римські', symbols: ['I', 'II', 'III', 'IV', 'V', 'X', 'L', 'C'] }
  ]
};

const getLayout = (subjectId: string, engineType: string): KeyboardLayout[] => {
  if (subjectId.includes('geom')) return KEYBOARD_CONFIGS.GEOMETRY;
  if (subjectId.includes('ukr') || subjectId.includes('lit')) return KEYBOARD_CONFIGS.LANGUAGE_ENGINE_UKR;
  if (subjectId.includes('eng')) return KEYBOARD_CONFIGS.LANGUAGE_ENGINE_ENG;
  if (KEYBOARD_CONFIGS[engineType]) return KEYBOARD_CONFIGS[engineType];
  return [];
};

export const SubjectKeyboard: React.FC<SubjectKeyboardProps> = ({ subjectId, engineType }) => {
  const [isOpen, setIsOpen] = useState(true);
  const layout = getLayout(subjectId, engineType);

  if (!layout || layout.length === 0) return null;

  const handleInsert = (symbol: string) => {
    const activeEl = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
    
    // Check if the active element is an input or textarea
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
      const start = activeEl.selectionStart || 0;
      const end = activeEl.selectionEnd || 0;
      const val = activeEl.value;
      const newVal = val.substring(0, start) + symbol + val.substring(end);
      
      // Dispatch input event for React to detect change
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
      const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;

      if (activeEl.tagName === 'INPUT' && nativeInputValueSetter) {
          nativeInputValueSetter.call(activeEl, newVal);
      } else if (activeEl.tagName === 'TEXTAREA' && nativeTextAreaValueSetter) {
          nativeTextAreaValueSetter.call(activeEl, newVal);
      }

      activeEl.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Attempt to move cursor (might need timeout due to React re-render)
      setTimeout(() => {
          activeEl.focus();
          activeEl.setSelectionRange(start + symbol.length, start + symbol.length);
      }, 0);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 transition-all duration-300">
      {/* Header / Toggle */}
      <div 
        className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100 cursor-pointer hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
        onMouseDown={(e) => e.preventDefault()} // Prevent losing focus from input
      >
        <div className="flex items-center text-xs font-bold text-gray-500 uppercase tracking-wider">
          <Keyboard className="w-4 h-4 mr-2 text-indigo-500" />
          Smart Keyboard • {layout.map(l => l.name).join(' / ')}
        </div>
        <button className="text-gray-400">
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Keyboard Content */}
      {isOpen && (
        <div className="p-2 md:p-4 overflow-x-auto">
           <div className="flex flex-col gap-3">
              {layout.map((group, groupIdx) => (
                  <div key={groupIdx} className="flex flex-wrap gap-1 md:gap-2 items-center">
                      <span className="text-[10px] text-gray-400 font-bold uppercase w-16 text-right mr-2 flex-shrink-0 hidden md:block">
                          {group.name}
                      </span>
                      {group.symbols.map((symbol) => (
                          <button
                            key={symbol}
                            onMouseDown={(e) => {
                                e.preventDefault(); // Critical: prevents button from stealing focus
                                handleInsert(symbol);
                            }}
                            className="min-w-[36px] h-9 px-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 active:scale-95 transition-all text-sm font-medium text-gray-700 flex items-center justify-center select-none"
                          >
                            {symbol}
                          </button>
                      ))}
                  </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};
