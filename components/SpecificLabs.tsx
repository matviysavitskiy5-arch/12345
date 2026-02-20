import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Minus, X, Divide, MousePointer2, Layers, Map as MapIcon, Scale } from 'lucide-react';

export interface LabProps {
  onSubmit: (data: any) => void;
  isAnalyzing: boolean;
  initialData?: any;
}

// --- ALGEBRA: LINEAR EQUATION LAB (Theme: Linear Equations) ---
export const LinearEquationLab: React.FC<LabProps> = ({ onSubmit, isAnalyzing }) => {
  const [equation, setEquation] = useState('2x + 5 = 15');
  const [history, setHistory] = useState<string[]>([]);
  const [operation, setOperation] = useState<string>('');
  const [value, setValue] = useState<string>('');

  const applyOperation = () => {
    if (!operation || !value) return;
    const step = `${operation} ${value}`;
    setHistory([...history, `(${equation}) ${step}`]);
    // Note: In a real app, a CAS engine would compute the new state. 
    // Here we let the user manually update the resulting equation state in the next step or simulate it.
    // For this lab, we ask user to write the result.
    setEquation(''); 
    setOperation('');
    setValue('');
  };

  const [userResult, setUserResult] = useState('');

  const handleNextStep = () => {
      setHistory([...history, `Result: ${userResult}`]);
      setEquation(userResult);
      setUserResult('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 p-6 rounded-3xl border-2 border-indigo-100 text-center">
        <span className="text-sm font-black text-indigo-400 uppercase tracking-widest block mb-2">Поточне рівняння</span>
        <div className="text-3xl font-mono font-bold text-indigo-900">{equation || "?"}</div>
      </div>

      <div className="grid grid-cols-4 gap-2">
         {['+', '-', '*', '/'].map(op => (
             <button key={op} onClick={() => setOperation(op)} className={`p-4 rounded-xl font-black text-xl border-2 transition-all ${operation === op ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-gray-100 hover:border-indigo-200 text-gray-600'}`}>
                 {op}
             </button>
         ))}
      </div>

      <div className="flex gap-2">
         <input 
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Число..."
            className="flex-1 p-4 rounded-xl border-2 border-gray-100 font-bold outline-none focus:border-indigo-400"
         />
         <button onClick={applyOperation} className="bg-gray-800 text-white px-6 rounded-xl font-bold hover:bg-black">
            Застосувати
         </button>
      </div>

      {history.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase">Історія перетворень</span>
              {history.map((h, i) => (
                  <div key={i} className="font-mono text-sm text-gray-600">{h}</div>
              ))}
          </div>
      )}

      {!equation && (
          <div className="animate-in fade-in slide-in-from-top-4">
              <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Що вийшло?</label>
              <div className="flex gap-2">
                <input 
                    value={userResult}
                    onChange={e => setUserResult(e.target.value)}
                    placeholder="Нове рівняння..."
                    className="flex-1 p-4 rounded-xl border-2 border-indigo-200 font-mono font-bold outline-none"
                />
                <button onClick={handleNextStep} className="bg-indigo-500 text-white px-6 rounded-xl font-bold">ОК</button>
              </div>
          </div>
      )}

      <button onClick={() => onSubmit({ history, finalEquation: equation })} disabled={isAnalyzing} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-all">
         {isAnalyzing ? 'Аналіз...' : 'Перевірити розв\'язання'}
      </button>
    </div>
  );
};

// --- LANGUAGE: WORD STRUCTURE LAB (Theme: Morphology) ---
export const WordStructureLab: React.FC<LabProps> = ({ onSubmit, isAnalyzing }) => {
  const word = "ПРИШКІЛЬНИЙ";
  const [parts, setParts] = useState<{part: string, type: string}[]>([]);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  
  // Simple selection simulation
  const addPart = (type: string) => {
     // In a real implementation, this would use window.getSelection()
     // Here we simulate adding manual parts textually for MVP
     const partText = prompt(`Введіть частину слова для "${type}":`);
     if(partText) setParts([...parts, { part: partText, type }]);
  };

  return (
    <div className="space-y-6">
       <div className="text-center py-10">
          <h3 className="text-5xl font-black text-gray-800 tracking-widest">{word}</h3>
       </div>

       <div className="flex justify-center gap-2 flex-wrap">
          <button onClick={() => addPart('Префікс')} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-bold border-b-4 border-purple-200 hover:mt-1 hover:border-b-0 transition-all">¬ Префікс</button>
          <button onClick={() => addPart('Корінь')} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-bold border-b-4 border-blue-200 hover:mt-1 hover:border-b-0 transition-all">⏜ Корінь</button>
          <button onClick={() => addPart('Суфікс')} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-bold border-b-4 border-green-200 hover:mt-1 hover:border-b-0 transition-all">^ Суфікс</button>
          <button onClick={() => addPart('Закінчення')} className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-bold border-b-4 border-yellow-200 hover:mt-1 hover:border-b-0 transition-all">□ Закінчення</button>
       </div>

       <div className="bg-gray-50 p-6 rounded-2xl min-h-[100px]">
           <span className="text-xs font-bold text-gray-400 uppercase block mb-4">Зібрана схема</span>
           <div className="flex gap-2 justify-center">
               {parts.map((p, i) => (
                   <div key={i} className="flex flex-col items-center">
                       <span className="text-xs font-bold uppercase mb-1 text-gray-400">{p.type}</span>
                       <div className="bg-white px-4 py-2 rounded-lg border-2 border-gray-200 font-bold shadow-sm">{p.part}</div>
                   </div>
               ))}
           </div>
           {parts.length === 0 && <p className="text-center text-gray-400 italic">Виділіть частини слова кнопками вище</p>}
       </div>

       <div className="flex justify-end">
         <button onClick={() => setParts([])} className="mr-auto text-gray-400 font-bold hover:text-red-500">Очистити</button>
         <button onClick={() => onSubmit({ word, parts })} disabled={isAnalyzing} className="bg-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-purple-700 transition-all">
            {isAnalyzing ? 'Перевірка...' : 'Перевірити розбір'}
         </button>
       </div>
    </div>
  );
};

// --- PHYSICS: PRESSURE LAB (Theme: Pressure) ---
export const PressureLab: React.FC<LabProps> = ({ onSubmit, isAnalyzing }) => {
    const [mode, setMode] = useState<'P' | 'F' | 'S'>('P');
    const [F, setF] = useState('');
    const [S, setS] = useState('');
    const [P, setP] = useState('');

    return (
        <div className="space-y-6">
            <div className="flex bg-gray-100 p-1 rounded-xl">
                {['P', 'F', 'S'].map((m) => (
                    <button 
                        key={m}
                        onClick={() => setMode(m as any)}
                        className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${mode === m ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                    >
                        Знайти {m}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="aspect-square bg-blue-50 rounded-full flex items-center justify-center relative border-4 border-blue-100">
                    <div className="text-center">
                        <ArrowDown className="w-12 h-12 text-blue-400 mx-auto animate-bounce" />
                        <span className="font-black text-2xl text-blue-900 block mt-2">F</span>
                        <div className="w-32 h-1 bg-blue-900 mx-auto my-2"></div>
                        <span className="font-black text-2xl text-blue-900 block">S</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {mode !== 'F' && (
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Сила (F), Н</label>
                            <input value={F} onChange={e => setF(e.target.value)} className="w-full p-3 border-2 border-gray-100 rounded-xl font-mono text-lg outline-none focus:border-blue-400" placeholder="0" />
                        </div>
                    )}
                    {mode !== 'S' && (
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Площа (S), м²</label>
                            <input value={S} onChange={e => setS(e.target.value)} className="w-full p-3 border-2 border-gray-100 rounded-xl font-mono text-lg outline-none focus:border-blue-400" placeholder="0" />
                        </div>
                    )}
                    {mode !== 'P' && (
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Тиск (P), Па</label>
                            <input value={P} onChange={e => setP(e.target.value)} className="w-full p-3 border-2 border-gray-100 rounded-xl font-mono text-lg outline-none focus:border-blue-400" placeholder="0" />
                        </div>
                    )}
                </div>
            </div>

            <button onClick={() => onSubmit({ mode, F, S, P })} disabled={isAnalyzing} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all">
                {isAnalyzing ? 'Аналіз...' : 'Розрахувати та Перевірити'}
            </button>
        </div>
    );
};

// --- HISTORY: CHRONOLOGY LAB (Theme: Chronology) ---
export const HistoryChronologyLab: React.FC<LabProps> = ({ onSubmit, isAnalyzing }) => {
    const [events, setEvents] = useState([
        { id: 1, text: 'Хрещення Русі', date: '' },
        { id: 2, text: 'Правління Ярослава Мудрого', date: '' },
        { id: 3, text: 'Похід Олега на Царгород', date: '' }
    ]);

    const move = (idx: number, dir: number) => {
        if (idx + dir < 0 || idx + dir >= events.length) return;
        const newEvents = [...events];
        const temp = newEvents[idx];
        newEvents[idx] = newEvents[idx + dir];
        newEvents[idx + dir] = temp;
        setEvents(newEvents);
    };

    const updateDate = (idx: number, date: string) => {
        const newEvents = [...events];
        newEvents[idx].date = date;
        setEvents(newEvents);
    };

    return (
        <div className="space-y-6">
            <p className="text-sm text-gray-500 font-medium">Розстав події у правильній хронологічній послідовності та вкажи дати.</p>
            
            <div className="space-y-3">
                {events.map((ev, idx) => (
                    <div key={ev.id} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex flex-col gap-1">
                            <button onClick={() => move(idx, -1)} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600"><ArrowUp className="w-4 h-4"/></button>
                            <button onClick={() => move(idx, 1)} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600"><ArrowDown className="w-4 h-4"/></button>
                        </div>
                        <div className="flex-1 font-bold text-gray-700">{ev.text}</div>
                        <input 
                            value={ev.date}
                            onChange={(e) => updateDate(idx, e.target.value)}
                            placeholder="Рік..."
                            className="w-24 p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm font-mono"
                        />
                    </div>
                ))}
            </div>

            <button onClick={() => onSubmit({ sequence: events })} disabled={isAnalyzing} className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition-all">
                {isAnalyzing ? 'Перевірка...' : 'Перевірити хронологію'}
            </button>
        </div>
    );
};

// --- GEOGRAPHY: MAP SCALE LAB (Theme: Maps) ---
export const MapScaleLab: React.FC<LabProps> = ({ onSubmit, isAnalyzing }) => {
    const [mapDist, setMapDist] = useState('');
    const [realDist, setRealDist] = useState('');
    const [scale, setScale] = useState('1:');

    return (
        <div className="space-y-6">
             <div className="bg-blue-50 p-6 rounded-3xl flex items-center justify-center">
                 <MapIcon className="w-24 h-24 text-blue-200" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                     <label className="text-xs font-bold text-gray-400 uppercase">Відстань на карті (см)</label>
                     <div className="relative">
                        <input value={mapDist} onChange={e => setMapDist(e.target.value)} className="w-full pl-4 pr-10 py-3 border-2 border-gray-100 rounded-xl font-mono" placeholder="5" />
                        <span className="absolute right-4 top-3.5 text-gray-400 font-bold text-sm">см</span>
                     </div>
                 </div>
                 <div>
                     <label className="text-xs font-bold text-gray-400 uppercase">Відстань на місцевості (км)</label>
                     <div className="relative">
                        <input value={realDist} onChange={e => setRealDist(e.target.value)} className="w-full pl-4 pr-10 py-3 border-2 border-gray-100 rounded-xl font-mono" placeholder="25" />
                        <span className="absolute right-4 top-3.5 text-gray-400 font-bold text-sm">км</span>
                     </div>
                 </div>
             </div>

             <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                 <label className="text-xs font-bold text-yellow-700 uppercase block mb-2">Масштаб карти</label>
                 <div className="flex items-center gap-2">
                     <span className="font-black text-xl text-gray-600">1 :</span>
                     <input value={scale.replace('1:', '')} onChange={e => setScale(`1:${e.target.value}`)} className="flex-1 p-3 border-2 border-yellow-200 rounded-xl font-mono font-bold" placeholder="500000" />
                 </div>
             </div>

             <button onClick={() => onSubmit({ mapDist, realDist, scale })} disabled={isAnalyzing} className="w-full bg-cyan-600 text-white font-bold py-4 rounded-xl hover:bg-cyan-700 transition-all">
                {isAnalyzing ? 'Перевірка...' : 'Розрахувати масштаб'}
            </button>
        </div>
    );
};
