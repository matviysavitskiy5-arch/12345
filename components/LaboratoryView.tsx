import React, { useState } from 'react';
import { 
  MathEngine, 
  GeometryEngine,
  PhysicsEngine, 
  ChemistryEngine, 
  UkrHistoryEngine,
  WorldHistoryEngine,
  UkrLanguageEngine, 
  EnglishEngine,
  UkrLitEngine,
  ForeignLitEngine,
  BiologyEngine, 
  GeographyEngine,
  InformaticsEngine,
  CivicEngine,
  ArtEngine,
  TechEngine
} from './TaskEngines';
import { geminiService } from '../services/geminiService';
import { 
  Calculator, Atom, FlaskConical, History, 
  Globe, BookOpen, Leaf, PenTool, Sparkles, 
  AlertCircle, ChevronRight, GraduationCap, FunctionSquare, Triangle,
  Languages, BookMarked, Monitor, Scale, Palette, Hammer
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { SubjectKeyboard } from './SubjectKeyboard';

interface LaboratoryViewProps {
  grade: number;
}

const SUBJECTS = [
  { id: 'math', name: 'Математика', icon: Calculator, engine: MathEngine, type: 'MATH_ENGINE' },
  { id: 'algebra', name: 'Алгебра', icon: FunctionSquare, engine: MathEngine, type: 'MATH_ENGINE' },
  { id: 'geometry', name: 'Геометрія', icon: Triangle, engine: GeometryEngine, type: 'MATH_ENGINE' },
  { id: 'physics', name: 'Фізика', icon: Atom, engine: PhysicsEngine, type: 'PHYSICS_ENGINE' },
  { id: 'chemistry', name: 'Хімія', icon: FlaskConical, engine: ChemistryEngine, type: 'CHEMISTRY_ENGINE' },
  { id: 'biology', name: 'Біологія', icon: Leaf, engine: BiologyEngine, type: 'BIOLOGY_ENGINE' },
  { id: 'geography', name: 'Географія', icon: Globe, engine: GeographyEngine, type: 'GEOGRAPHY_ENGINE' },
  { id: 'hist_ukr', name: 'Історія України', icon: History, engine: UkrHistoryEngine, type: 'HISTORY_ENGINE' },
  { id: 'hist_world', name: 'Всесвітня Історія', icon: Globe, engine: WorldHistoryEngine, type: 'HISTORY_ENGINE' },
  { id: 'ukr_lang', name: 'Укр. мова', icon: BookOpen, engine: UkrLanguageEngine, type: 'LANGUAGE_ENGINE' },
  { id: 'ukr_lit', name: 'Укр. література', icon: BookMarked, engine: UkrLitEngine, type: 'LIT_ENGINE' },
  { id: 'for_lit', name: 'Зарубіжна літ.', icon: BookMarked, engine: ForeignLitEngine, type: 'LIT_ENGINE' },
  { id: 'english', name: 'Англійська', icon: Languages, engine: EnglishEngine, type: 'ENGLISH_ENGINE' },
  { id: 'informatics', name: 'Інформатика', icon: Monitor, engine: InformaticsEngine, type: 'CODE_ENGINE' },
  { id: 'civics', name: 'Громадянська освіта', icon: Scale, engine: CivicEngine, type: 'CIVIC_ENGINE' },
  { id: 'art', name: 'Мистецтво', icon: Palette, engine: ArtEngine, type: 'ART_ENGINE' },
  { id: 'tech', name: 'Технології', icon: Hammer, engine: TechEngine, type: 'TECH_ENGINE' },
];

export const LaboratoryView: React.FC<LaboratoryViewProps> = ({ grade }) => {
  const [activeSubjectId, setActiveSubjectId] = useState(SUBJECTS[0].id);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [svg, setSvg] = useState<string | null>(null);

  const activeSubject = SUBJECTS.find(s => s.id === activeSubjectId) || SUBJECTS[0];
  const ActiveEngine = activeSubject.engine;

  const handleSubjectChange = (id: string) => {
    if (id === activeSubjectId) return;
    setActiveSubjectId(id);
    setFeedback(null);
    setSvg(null);
    setIsAnalyzing(false);
  };

  const handleSubmit = async (data: any, engineType: string) => {
    setIsAnalyzing(true);
    setFeedback(null);
    setSvg(null);

    // Geometry SVG generation attempt ONLY if diagram requested
    if ((activeSubject.id === 'geometry' || JSON.stringify(data).toLowerCase().includes('трикутник')) && data.withDiagram) {
        if (data.figure || data.condition || data.given) {
            geminiService.generateGeometrySVG(data.figure || data.condition || data.given).then(setSvg);
        }
    }

    const aiFeedback = await geminiService.solveStructuredTask(activeSubject.name, grade, engineType, data);
    setFeedback(aiFeedback);
    setIsAnalyzing(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] gap-6 animate-in fade-in duration-500 relative">
      
      {/* Left Sidebar - Subject Selection */}
      <div className="w-full md:w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col flex-shrink-0 z-10">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
           <h2 className="font-black text-gray-800 dark:text-white flex items-center">
             <PenTool className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
             Предмети
           </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {SUBJECTS.map((subject) => (
            <button
              key={subject.id}
              onClick={() => handleSubjectChange(subject.id)}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold transition-all ${
                activeSubjectId === subject.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <div className="flex items-center">
                <subject.icon className={`w-4 h-4 mr-3 ${activeSubjectId === subject.id ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                {subject.name}
              </div>
              {activeSubjectId === subject.id && <ChevronRight className="w-4 h-4 text-white/80" />}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Laboratory */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden pb-16 md:pb-24">
         {/* Lab Header */}
         <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/30 dark:bg-gray-900/30">
            <div>
              <h1 className="text-2xl font-black text-gray-800 dark:text-white flex items-center">
                <activeSubject.icon className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-400" />
                {activeSubject.name}
              </h1>
              <p className="text-sm text-gray-400 font-medium mt-1">Вільний режим • {grade} клас</p>
            </div>
            <div className="hidden md:flex items-center space-x-2">
                <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-lg text-xs font-bold border border-indigo-100 dark:border-indigo-800">
                   {activeSubject.type}
                </div>
            </div>
         </div>

         {/* Lab Body */}
         <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
              
              {/* Engine Container */}
              <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
                 {/* Key prop ensures full re-mount on subject change */}
                 <ActiveEngine key={activeSubjectId} onSubmit={handleSubmit} isAnalyzing={isAnalyzing} />
              </div>

              {/* Feedback Container */}
              <div className="space-y-6">
                 {!feedback && !svg && !isAnalyzing && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-300 dark:text-gray-600 p-8 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-3xl">
                       <GraduationCap className="w-16 h-16 mb-4 opacity-20" />
                       <p className="text-center font-bold">Обери задачу та надішли на перевірку.</p>
                    </div>
                 )}

                 {isAnalyzing && (
                    <div className="space-y-4 p-4">
                       <div className="flex items-center justify-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold animate-pulse mb-6">
                          <Sparkles className="w-5 h-5" />
                          <span>АІ-Вчитель аналізує...</span>
                       </div>
                       <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-3xl animate-pulse"></div>
                       <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-3xl animate-pulse"></div>
                    </div>
                 )}

                 {svg && (
                    <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-700 animate-in zoom-in-95">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                        <Sparkles className="w-3 h-3 mr-2 text-yellow-500" />
                        Візуалізація
                      </p>
                      <div className="flex justify-center p-4 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                        <div dangerouslySetInnerHTML={{ __html: svg }} className="w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto" />
                      </div>
                    </div>
                 )}

                 {feedback && (
                    <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 animate-in slide-in-from-right-8">
                       <div className="flex items-center mb-6">
                          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mr-4 text-indigo-600 dark:text-indigo-400">
                             <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                             <h4 className="font-black text-gray-800 dark:text-white">Результат аналізу</h4>
                             <p className="text-[10px] text-gray-400 uppercase font-bold">AI FEEDBACK</p>
                          </div>
                       </div>
                       
                       <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300 [&_strong]:text-gray-800 dark:[&_strong]:text-white">
                          <div className="[&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden">
                             <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                {feedback}
                             </ReactMarkdown>
                          </div>
                       </div>

                       <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-700 flex items-center text-xs text-indigo-500 dark:text-indigo-400 font-bold">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Спробуй виправити помилки та перевірити ще раз!
                       </div>
                    </div>
                 )}
              </div>

            </div>
         </div>
      </div>
      
      {/* Subject Smart Keyboard */}
      <SubjectKeyboard subjectId={activeSubjectId} engineType={activeSubject.type} />
    </div>
  );
};