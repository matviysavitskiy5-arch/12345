import React, { useState } from 'react';
import { 
  Plus, Trash2, ArrowRight, Calculator, FlaskConical, Book, History, 
  Globe, Leaf, Code, Scale, Palette, Hammer, Languages, BookMarked, 
  Monitor, PenTool, BrainCircuit, Mic, Check
} from 'lucide-react';

export interface EngineProps {
  onSubmit: (data: any, engineType: string) => void;
  isAnalyzing: boolean;
}

// --- MATHEMATICS / ALGEBRA ENGINE ---
export const MathEngine: React.FC<EngineProps> = ({ onSubmit, isAnalyzing }) => {
  const [condition, setCondition] = useState('');
  const [steps, setSteps] = useState<string[]>(['']);
  const [answer, setAnswer] = useState('');

  const addStep = () => setSteps([...steps, '']);
  const updateStep = (idx: number, val: string) => {
    const newSteps = [...steps];
    newSteps[idx] = val;
    setSteps(newSteps);
  };
  const removeStep = (idx: number) => setSteps(steps.filter((_, i) => i !== idx));

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
        <label className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1 block">Умова / Рівняння</label>
        <input 
            value={condition} 
            onChange={e => setCondition(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-200 dark:border-blue-700 font-mono text-lg text-gray-800 dark:text-white" 
            placeholder="2x^2 + 5x - 3 = 0"
        />
      </div>

      <div className="space-y-3">
        <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Кроки розв'язання</label>
        {steps.map((step, idx) => (
          <div key={idx} className="flex gap-2">
            <span className="p-3 text-gray-400 font-mono text-sm select-none">{idx + 1}.</span>
            <input 
              value={step}
              onChange={e => updateStep(idx, e.target.value)}
              className="flex-1 p-3 rounded-lg border border-gray-200 dark:border-gray-700 font-mono focus:ring-2 focus:ring-blue-100 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
              placeholder="Математичне перетворення..."
            />
            {steps.length > 1 && (
                <button onClick={() => removeStep(idx)} className="text-gray-300 hover:text-red-500"><Trash2 className="w-5 h-5"/></button>
            )}
          </div>
        ))}
        <button onClick={addStep} className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
           <Plus className="w-4 h-4 mr-1"/> Додати крок
        </button>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
         <label className="text-xs font-black text-green-700 dark:text-green-400 uppercase tracking-widest mb-1 block">Відповідь</label>
         <input 
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 p-3 rounded-lg border border-green-200 dark:border-green-700 font-bold text-gray-800 dark:text-white"
            placeholder="x = ..."
         />
      </div>

      <button onClick={() => onSubmit({ condition, steps, answer }, 'MATH_ENGINE')} disabled={isAnalyzing} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none">
         {isAnalyzing ? 'Перевірка...' : 'Перевірити розв\'язання'}
      </button>
    </div>
  );
};

// --- GEOMETRY ENGINE ---
export const GeometryEngine: React.FC<EngineProps> = ({ onSubmit, isAnalyzing }) => {
    const [figure, setFigure] = useState('');
    const [given, setGiven] = useState('');
    const [theorems, setTheorems] = useState('');
    const [proof, setProof] = useState('');
    const [withDiagram, setWithDiagram] = useState(true);

    return (
        <div className="space-y-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
                 <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase block mb-1">Геометрична фігура</label>
                 <input value={figure} onChange={e => setFigure(e.target.value)} className="w-full p-2 bg-white dark:bg-gray-800 rounded-lg border border-indigo-200 dark:border-indigo-700 text-gray-800 dark:text-white" placeholder="Трикутник ABC..." />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                     <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Дано</label>
                     <textarea value={given} onChange={e => setGiven(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl h-32 font-mono" placeholder="AB = BC, кут B = 60..." />
                </div>
                <div>
                     <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Теореми / Аксіоми</label>
                     <textarea value={theorems} onChange={e => setTheorems(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl h-32" placeholder="Теорема косинусів..." />
                </div>
            </div>

            <div>
                 <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Доведення / Розв'язання</label>
                 <textarea value={proof} onChange={e => setProof(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl h-32" placeholder="Оскільки..." />
            </div>

            <div className="flex flex-col gap-3">
                <div 
                    className="flex items-center cursor-pointer group w-fit" 
                    onClick={() => setWithDiagram(!withDiagram)}
                >
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all mr-3 ${withDiagram ? 'bg-indigo-600 border-indigo-600' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 group-hover:border-indigo-400'}`}>
                        {withDiagram && <Check size={16} className="text-white" strokeWidth={4} />}
                    </div>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 select-none group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        З малюнком
                    </span>
                </div>

                <button onClick={() => onSubmit({ figure, given, theorems, proof, withDiagram }, 'GEOMETRY_ENGINE')} disabled={isAnalyzing} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none">
                    {isAnalyzing ? 'Аналіз...' : 'Перевірити задачу'}
                </button>
            </div>
        </div>
    );
};

// --- PHYSICS ENGINE ---
export const PhysicsEngine: React.FC<EngineProps> = ({ onSubmit, isAnalyzing }) => {
    const [given, setGiven] = useState('');
    const [find, setFind] = useState('');
    const [formulas, setFormulas] = useState('');
    const [calc, setCalc] = useState('');
    const [answerVal, setAnswerVal] = useState('');

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Дано</label>
                    <textarea value={given} onChange={e => setGiven(e.target.value)} className="w-full bg-transparent outline-none resize-none h-24 text-gray-800 dark:text-white" placeholder="m = 10 кг..."/>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Знайти</label>
                    <textarea value={find} onChange={e => setFind(e.target.value)} className="w-full bg-transparent outline-none resize-none h-24 text-gray-800 dark:text-white" placeholder="F - ?"/>
                </div>
            </div>

            <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1 ml-1">Закони та Формули</label>
                <input value={formulas} onChange={e => setFormulas(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl font-mono text-blue-800 dark:text-blue-300 bg-blue-50/50 dark:bg-blue-900/20" placeholder="F = ma" />
            </div>

            <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1 ml-1">Підстановка та обчислення</label>
                <textarea value={calc} onChange={e => setCalc(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl font-mono h-24" placeholder="10 * 9.8 = ..." />
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
                 <label className="text-xs font-bold text-green-700 dark:text-green-400 uppercase block mb-1">Відповідь (з одиницями)</label>
                 <input value={answerVal} onChange={e => setAnswerVal(e.target.value)} className="w-full p-2 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-700 text-gray-800 dark:text-white" placeholder="98 Н"/>
            </div>

            <button onClick={() => onSubmit({ given, find, formulas, calc, answer: answerVal }, 'PHYSICS_ENGINE')} disabled={isAnalyzing} className="w-full bg-blue-700 text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition-all">
                {isAnalyzing ? 'Аналіз...' : 'Перевірити задачу'}
            </button>
        </div>
    );
};

// --- CHEMISTRY ENGINE ---
export const ChemistryEngine: React.FC<EngineProps> = ({ onSubmit, isAnalyzing }) => {
    const [equation, setEquation] = useState('');
    const [balance, setBalance] = useState('');
    const [conditions, setConditions] = useState('');

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2 text-purple-600 dark:text-purple-400">
                <FlaskConical className="w-5 h-5"/>
                <span className="font-bold">Хімічна лабораторія</span>
            </div>

            <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Схема реакції</label>
                <input value={equation} onChange={e => setEquation(e.target.value)} className="w-full p-4 border-2 border-purple-100 dark:border-purple-900 rounded-2xl text-lg font-mono bg-white dark:bg-gray-800 text-gray-800 dark:text-white" placeholder="H2SO4 + NaOH -> ..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Рівняння з коефіцієнтами</label>
                    <textarea value={balance} onChange={e => setBalance(e.target.value)} className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-2xl font-mono h-32 bg-white dark:bg-gray-800 text-gray-800 dark:text-white" placeholder="H2SO4 + 2NaOH -> Na2SO4 + 2H2O" />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Умови / Обчислення (моль)</label>
                    <textarea value={conditions} onChange={e => setConditions(e.target.value)} className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-2xl font-mono h-32 bg-white dark:bg-gray-800 text-gray-800 dark:text-white" placeholder="t, kat..." />
                </div>
            </div>

            <button onClick={() => onSubmit({ equation, balance, conditions }, 'CHEMISTRY_ENGINE')} disabled={isAnalyzing} className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition-all">
                {isAnalyzing ? 'Аналіз...' : 'Перевірити реакцію'}
            </button>
        </div>
    );
};

// --- BIOLOGY ENGINE ---
export const BiologyEngine: React.FC<EngineProps> = ({ onSubmit, isAnalyzing }) => {
    const [objectName, setObjectName] = useState('');
    const [structure, setStructure] = useState('');
    const [functionDesc, setFunctionDesc] = useState('');

    return (
        <div className="space-y-4">
            <div>
                 <label className="text-xs font-bold text-green-600 dark:text-green-400 uppercase block mb-1">Біологічний об'єкт / Процес</label>
                 <input value={objectName} onChange={e => setObjectName(e.target.value)} className="w-full p-3 border-2 border-green-100 dark:border-green-800 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl" placeholder="Клітина, Фотосинтез..." />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Будова / Етапи</label>
                    <textarea value={structure} onChange={e => setStructure(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl h-40" placeholder="Опишіть складові..." />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Функції / Значення</label>
                    <textarea value={functionDesc} onChange={e => setFunctionDesc(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl h-40" placeholder="Яку роль виконує?" />
                </div>
            </div>

            <button onClick={() => onSubmit({ objectName, structure, functionDesc }, 'BIOLOGY_ENGINE')} disabled={isAnalyzing} className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all">
                {isAnalyzing ? 'Аналіз...' : 'Перевірити опис'}
            </button>
        </div>
    );
};

// --- GEOGRAPHY ENGINE ---
export const GeographyEngine: React.FC<EngineProps> = ({ onSubmit, isAnalyzing }) => {
    const [region, setRegion] = useState('');
    const [climate, setClimate] = useState('');
    const [resources, setResources] = useState('');
    const [population, setPopulation] = useState('');

    return (
        <div className="space-y-4">
             <div>
                 <label className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase block mb-1">Географічний об'єкт</label>
                 <input value={region} onChange={e => setRegion(e.target.value)} className="w-full p-3 border-2 border-cyan-100 dark:border-cyan-900 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl" placeholder="Країна, регіон..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Природні умови</label>
                    <textarea value={climate} onChange={e => setClimate(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl h-24" placeholder="Клімат, рельєф..." />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Ресурси</label>
                    <textarea value={resources} onChange={e => setResources(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl h-24" placeholder="Корисні копалини..." />
                </div>
            </div>
            <div>
                 <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Населення та господарство</label>
                 <textarea value={population} onChange={e => setPopulation(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl h-24" placeholder="Розміщення, галузі..." />
            </div>
            <button onClick={() => onSubmit({ region, climate, resources, population }, 'GEOGRAPHY_ENGINE')} disabled={isAnalyzing} className="w-full bg-cyan-600 text-white font-bold py-4 rounded-xl hover:bg-cyan-700 transition-all">
                {isAnalyzing ? 'Аналіз...' : 'Перевірити характеристику'}
            </button>
        </div>
    );
};

// --- HISTORY OF UKRAINE ENGINE ---
export const UkrHistoryEngine: React.FC<EngineProps> = ({ onSubmit, isAnalyzing }) => {
    const [event, setEvent] = useState('');
    const [date, setDate] = useState('');
    const [figure, setFigure] = useState('');
    const [significance, setSignificance] = useState('');

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="text-xs font-bold text-blue-400 uppercase block mb-1">Подія (Історія України)</label>
                    <input value={event} onChange={e => setEvent(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl" placeholder="Назва події" />
                </div>
                <div className="w-32">
                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Рік</label>
                    <input value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl" placeholder="РРРР" />
                </div>
            </div>
            <div>
                 <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Історична постать</label>
                 <input value={figure} onChange={e => setFigure(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl" placeholder="Хто очолював?" />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Значення для державотворення</label>
                <textarea value={significance} onChange={e => setSignificance(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl h-32" placeholder="Наслідки для України..." />
            </div>
            <button onClick={() => onSubmit({ event, date, figure, significance }, 'HISTORY_ENGINE')} disabled={isAnalyzing} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all">
                {isAnalyzing ? 'Аналіз...' : 'Перевірити подію'}
            </button>
        </div>
    );
};

// --- WORLD HISTORY ENGINE ---
export const WorldHistoryEngine: React.FC<EngineProps> = ({ onSubmit, isAnalyzing }) => {
    const [event, setEvent] = useState('');
    const [period, setPeriod] = useState('');
    const [globalContext, setGlobalContext] = useState('');
    const [consequences, setConsequences] = useState('');

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="text-xs font-bold text-orange-400 uppercase block mb-1">Подія (Всесвітня історія)</label>
                    <input value={event} onChange={e => setEvent(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl" placeholder="Назва події" />
                </div>
                <div className="w-40">
                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Період</label>
                    <input value={period} onChange={e => setPeriod(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl" placeholder="Епоха..." />
                </div>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Глобальний контекст</label>
                <textarea value={globalContext} onChange={e => setGlobalContext(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl h-24" placeholder="Що відбувалося у світі?" />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Геополітичні наслідки</label>
                <textarea value={consequences} onChange={e => setConsequences(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl h-24" placeholder="Як змінилася карта світу?" />
            </div>
            <button onClick={() => onSubmit({ event, period, globalContext, consequences }, 'HISTORY_ENGINE')} disabled={isAnalyzing} className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition-all">
                {isAnalyzing ? 'Аналіз...' : 'Перевірити контекст'}
            </button>
        </div>
    );
};

// --- UKRAINIAN LANGUAGE ENGINE ---
export const UkrLanguageEngine: React.FC<EngineProps> = ({ onSubmit, isAnalyzing }) => {
    const [text, setText] = useState('');
    const [orthogram, setOrthogram] = useState('');
    const [rule, setRule] = useState('');

    return (
        <div className="space-y-5">
             <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-2xl border border-yellow-100 dark:border-yellow-800">
                 <label className="text-xs font-bold text-yellow-700 dark:text-yellow-400 uppercase block mb-2">Текст / Диктант</label>
                 <textarea value={text} onChange={e => setText(e.target.value)} className="w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-xl border border-yellow-200 dark:border-yellow-700 h-24 outline-none" placeholder="Введіть текст..." />
             </div>
             <div>
                 <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Орфограма / Пунктограма</label>
                 <input value={orthogram} onChange={e => setOrthogram(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl" placeholder="Яке правило перевіряємо?" />
             </div>
             <div>
                 <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Пояснення правила</label>
                 <textarea value={rule} onChange={e => setRule(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl h-24" placeholder="Чому так пишеться?" />
             </div>
             <button onClick={() => onSubmit({ text, orthogram, rule }, 'LANGUAGE_ENGINE')} disabled={isAnalyzing} className="w-full bg-yellow-600 text-white font-bold py-4 rounded-xl hover:bg-yellow-700 transition-all">
                {isAnalyzing ? 'Перевірка...' : 'Перевірити правопис'}
            </button>
        </div>
    );
};

// --- ENGLISH ENGINE ---
export const EnglishEngine: React.FC<EngineProps> = ({ onSubmit, isAnalyzing }) => {
    const [text, setText] = useState('');
    const [vocab, setVocab] = useState('');
    const [grammar, setGrammar] = useState('');

    return (
        <div className="space-y-5">
             <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800">
                 <label className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase block mb-2">Reading / Context</label>
                 <textarea value={text} onChange={e => setText(e.target.value)} className="w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-xl border border-blue-200 dark:border-blue-700 h-24 outline-none" placeholder="Paste English text..." />
             </div>
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Vocabulary list</label>
                     <textarea value={vocab} onChange={e => setVocab(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl h-32" placeholder="Word - Translation..." />
                 </div>
                 <div>
                     <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Grammar usage</label>
                     <textarea value={grammar} onChange={e => setGrammar(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl h-32" placeholder="Explain tense or structure..." />
                 </div>
             </div>
             <button onClick={() => onSubmit({ text, vocab, grammar }, 'LANGUAGE_ENGINE')} disabled={isAnalyzing} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all">
                {isAnalyzing ? 'Check...' : 'Check English'}
            </button>
        </div>
    );
};

// --- UKRAINIAN LITERATURE ENGINE ---
export const UkrLitEngine: React.FC<EngineProps> = ({ onSubmit, isAnalyzing }) => {
    const [work, setWork] = useState('');
    const [theme, setTheme] = useState('');
    const [characters, setCharacters] = useState('');

    return (
        <div className="space-y-4">
             <div>
                 <label className="text-xs font-bold text-pink-600 uppercase block mb-1">Твір / Автор</label>
                 <input value={work} onChange={e => setWork(e.target.value)} className="w-full p-3 border-2 border-pink-100 dark:border-pink-900 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl" placeholder="Назва твору" />
             </div>
             <div>
                 <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Тема та Ідея</label>
                 <textarea value={theme} onChange={e => setTheme(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl h-24" placeholder="Головна думка..." />
             </div>
             <div>
                 <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Характеристика героїв</label>
                 <textarea value={characters} onChange={e => setCharacters(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl h-24" placeholder="Образи персонажів..." />
             </div>
             <button onClick={() => onSubmit({ work, theme, characters }, 'LIT_ENGINE')} disabled={isAnalyzing} className="w-full bg-pink-600 text-white font-bold py-4 rounded-xl hover:bg-pink-700 transition-all">
                {isAnalyzing ? 'Аналіз...' : 'Аналізувати твір'}
            </button>
        </div>
    );
};

// --- FOREIGN LITERATURE ENGINE ---
export const ForeignLitEngine: React.FC<EngineProps> = ({ onSubmit, isAnalyzing }) => {
    const [context, setContext] = useState('');
    const [comparison, setComparison] = useState('');
    const [quotes, setQuotes] = useState('');

    return (
        <div className="space-y-4">
             <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
                 <label className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase block mb-1">Історико-культурний контекст</label>
                 <textarea value={context} onChange={e => setContext(e.target.value)} className="w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-xl border border-purple-200 dark:border-purple-700 h-20" placeholder="Епоха, країна..." />
             </div>
             <div>
                 <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Компаративний аналіз (Порівняння)</label>
                 <textarea value={comparison} onChange={e => setComparison(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl h-24" placeholder="Порівняння з іншими творами..." />
             </div>
             <div>
                 <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Тлумачення цитат / Символів</label>
                 <textarea value={quotes} onChange={e => setQuotes(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl h-24" placeholder="Аналіз символіки..." />
             </div>
             <button onClick={() => onSubmit({ context, comparison, quotes }, 'LIT_ENGINE')} disabled={isAnalyzing} className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition-all">
                {isAnalyzing ? 'Аналіз...' : 'Аналізувати контекст'}
            </button>
        </div>
    );
};

// --- INFORMATICS ENGINE ---
export const InformaticsEngine: React.FC<EngineProps> = ({ onSubmit, isAnalyzing }) => {
    const [code, setCode] = useState('');
    const [algorithm, setAlgorithm] = useState('');
    const [output, setOutput] = useState('');

    return (
        <div className="space-y-4">
             <div className="bg-gray-900 p-4 rounded-xl text-white">
                 <div className="flex items-center justify-between mb-2 border-b border-gray-700 pb-2">
                    <span className="text-xs font-bold text-green-400 uppercase">Code Editor</span>
                    <Code className="w-4 h-4 text-gray-500" />
                 </div>
                 <textarea value={code} onChange={e => setCode(e.target.value)} className="w-full bg-transparent text-sm font-mono outline-none h-32 text-green-300" placeholder="print('Hello World')" />
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Алгоритм (Блок-схема)</label>
                     <textarea value={algorithm} onChange={e => setAlgorithm(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl h-32" placeholder="Опис кроків..." />
                 </div>
                 <div>
                     <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Очікуваний результат</label>
                     <textarea value={output} onChange={e => setOutput(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl h-32 font-mono bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white" placeholder="Output..." />
                 </div>
             </div>

             <button onClick={() => onSubmit({ code, algorithm, output }, 'CODE_ENGINE')} disabled={isAnalyzing} className="w-full bg-gray-800 text-white font-bold py-4 rounded-xl hover:bg-black transition-all">
                {isAnalyzing ? 'Running...' : 'Run & Check Code'}
            </button>
        </div>
    );
};

// --- CIVIC EDUCATION ENGINE ---
export const CivicEngine: React.FC<EngineProps> = ({ onSubmit, isAnalyzing }) => {
    const [situation, setSituation] = useState('');
    const [rights, setRights] = useState('');
    const [action, setAction] = useState('');

    return (
        <div className="space-y-4">
             <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800">
                 <label className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase block mb-1">Соціальна ситуація / Кейс</label>
                 <textarea value={situation} onChange={e => setSituation(e.target.value)} className="w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-xl border border-orange-200 dark:border-orange-700 h-24" placeholder="Опис конфлікту або проблеми..." />
             </div>
             <div>
                 <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Права та обов'язки</label>
                 <textarea value={rights} onChange={e => setRights(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl h-24" placeholder="Які права порушено?" />
             </div>
             <div>
                 <label className="text-xs font-bold text-gray-400 uppercase block mb-1">План дій / Вирішення</label>
                 <textarea value={action} onChange={e => setAction(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl h-24" placeholder="Як діяти правомірно?" />
             </div>
             <button onClick={() => onSubmit({ situation, rights, action }, 'CIVIC_ENGINE')} disabled={isAnalyzing} className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition-all">
                {isAnalyzing ? 'Аналіз...' : 'Аналізувати кейс'}
            </button>
        </div>
    );
};

// --- ART ENGINE ---
export const ArtEngine: React.FC<EngineProps> = ({ onSubmit, isAnalyzing }) => {
    const [workDesc, setWorkDesc] = useState('');
    const [style, setStyle] = useState('');
    const [impression, setImpression] = useState('');

    return (
        <div className="space-y-4">
             <div>
                 <label className="text-xs font-bold text-rose-500 uppercase block mb-1">Опис твору мистецтва</label>
                 <input value={workDesc} onChange={e => setWorkDesc(e.target.value)} className="w-full p-3 border-2 border-rose-100 dark:border-rose-900 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl" placeholder="Назва картини, скульптури..." />
             </div>
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Стиль / Епоха</label>
                     <input value={style} onChange={e => setStyle(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl" placeholder="Бароко, Імпресіонізм..." />
                 </div>
                 <div>
                     <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Емоційне враження</label>
                     <input value={impression} onChange={e => setImpression(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl" placeholder="Настрій твору..." />
                 </div>
             </div>
             <button onClick={() => onSubmit({ workDesc, style, impression }, 'ART_ENGINE')} disabled={isAnalyzing} className="w-full bg-rose-600 text-white font-bold py-4 rounded-xl hover:bg-rose-700 transition-all">
                {isAnalyzing ? 'Аналіз...' : 'Аналізувати мистецтво'}
            </button>
        </div>
    );
};

// --- TECHNOLOGY ENGINE ---
export const TechEngine: React.FC<EngineProps> = ({ onSubmit, isAnalyzing }) => {
    const [project, setProject] = useState('');
    const [materials, setMaterials] = useState('');
    const [steps, setSteps] = useState('');

    return (
        <div className="space-y-4">
             <div>
                 <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase block mb-1">Назва проєкту</label>
                 <input value={project} onChange={e => setProject(e.target.value)} className="w-full p-3 border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl" placeholder="Виріб з деревини..." />
             </div>
             <div>
                 <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Матеріали та Інструменти</label>
                 <textarea value={materials} onChange={e => setMaterials(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl h-24" placeholder="Список необхідного..." />
             </div>
             <div>
                 <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Технологічна послідовність</label>
                 <textarea value={steps} onChange={e => setSteps(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl h-32" placeholder="Крок 1, Крок 2..." />
             </div>
             <button onClick={() => onSubmit({ project, materials, steps }, 'TECH_ENGINE')} disabled={isAnalyzing} className="w-full bg-slate-600 text-white font-bold py-4 rounded-xl hover:bg-slate-700 transition-all">
                {isAnalyzing ? 'Аналіз...' : 'Перевірити проєкт'}
            </button>
        </div>
    );
};