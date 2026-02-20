import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { PenTool, CheckCircle, Sparkles, AlertCircle, RefreshCcw, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { getLabComponent } from './LabRegistry';
import { SubjectKeyboard } from './SubjectKeyboard';

interface TaskLaboratoryProps {
  subjectName: string;
  grade: number;
  topicId: string;
}

export const TaskLaboratory: React.FC<TaskLaboratoryProps> = ({ subjectName, grade, topicId }) => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [svg, setSvg] = useState<string | null>(null);

  // Helper to determine engine type for both Keyboard and AI Validation
  const getEngineType = () => {
      const s = subjectName.toLowerCase();
      if (s.includes('алгебра') || s.includes('математика')) return 'MATH_ENGINE';
      if (s.includes('геометрія')) return 'GEOMETRY_ENGINE';
      if (s.includes('фізика')) return 'PHYSICS_ENGINE';
      if (s.includes('хімія')) return 'CHEMISTRY_ENGINE';
      if (s.includes('біологія') || s.includes('природа')) return 'BIOLOGY_ENGINE';
      if (s.includes('географія')) return 'GEOGRAPHY_ENGINE';
      if (s.includes('історія')) return 'HISTORY_ENGINE';
      if (s.includes('література')) return 'LIT_ENGINE';
      if (s.includes('англійська')) return 'LANGUAGE_ENGINE_ENG';
      if (s.includes('мова')) return 'LANGUAGE_ENGINE_UKR';
      if (s.includes('інформатика')) return 'CODE_ENGINE';
      if (s.includes('громадянська')) return 'CIVIC_ENGINE';
      if (s.includes('мистецтво')) return 'ART_ENGINE';
      if (s.includes('технології')) return 'TECH_ENGINE';
      return 'DEFAULT_ENGINE';
  };

  const handleSubmit = async (data: any) => {
    setIsAnalyzing(true);
    setFeedback(null);
    setSvg(null);

    const engineType = getEngineType();

    // Geometry SVG generation attempt for relevant subjects
    if ((engineType === 'GEOMETRY_ENGINE' || JSON.stringify(data).toLowerCase().includes('трикутник')) && !topicId.includes('alg')) {
         if(data.condition || data.figure) {
             geminiService.generateGeometrySVG(data.condition || data.figure).then(setSvg);
         }
    }

    // Call AI with specific engine instruction
    const aiFeedback = await geminiService.solveStructuredTask(subjectName, grade, engineType, data);
    setFeedback(aiFeedback);
    setIsAnalyzing(false);
  };

  const LabComponent = getLabComponent(topicId, subjectName);
  const engineType = getEngineType();

  return (
    <div className="flex flex-col h-full bg-gray-50/50 relative">
      <div className="p-4 md:p-6 border-b border-gray-200 bg-white shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-800 flex items-center">
            <PenTool className="w-6 h-6 mr-3 text-blue-600" />
            Лабораторія Задач
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Модуль: <span className="font-bold text-gray-800">{subjectName}</span>
          </p>
        </div>
        <div className="hidden md:flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
           <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{engineType.replace('_ENGINE', '')} MODE</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Lab Side */}
          <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100 h-fit">
             <LabComponent onSubmit={handleSubmit} isAnalyzing={isAnalyzing} />
          </div>

          {/* Feedback Side */}
          <div className="space-y-6">
            {!feedback && !svg && !isAnalyzing && (
              <div className="h-full flex flex-col items-center justify-center text-gray-300 p-10 border-2 border-dashed border-gray-100 rounded-[2rem] min-h-[400px]">
                 <PenTool className="w-16 h-16 mb-4 opacity-20" />
                 <p className="text-center font-bold">Виконай завдання зліва,<br/>щоб отримати аналіз вчителя.</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="animate-pulse space-y-6">
                <div className="h-48 bg-gray-100 rounded-[2rem]"></div>
                <div className="h-64 bg-gray-100 rounded-[2rem]"></div>
              </div>
            )}

            {svg && (
              <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                  <Sparkles className="w-3 h-3 mr-2 text-yellow-500" />
                  Автоматичне креслення
                </p>
                <div className="flex justify-center p-4 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
                  <div dangerouslySetInnerHTML={{ __html: svg }} className="w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto" />
                </div>
              </div>
            )}

            {feedback && (
              <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl shadow-gray-200/40 border border-gray-100 animate-in slide-in-from-right-10 duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-800">Аналіз вчителя</h4>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">AI FEEDBACK SYSTEM</p>
                    </div>
                  </div>
                </div>

                <div className="prose prose-sm md:prose-base max-w-none text-gray-700">
                  <div className="[&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {feedback}
                    </ReactMarkdown>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center text-xs text-blue-500 font-bold bg-blue-50/50 -mx-6 -mb-6 px-6 py-4 rounded-b-[2rem]">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Перевір свої кроки та спробуй виправити помилки самостійно!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Dynamic Keyboard */}
      <SubjectKeyboard subjectId={topicId} engineType={engineType} />
    </div>
  );
};