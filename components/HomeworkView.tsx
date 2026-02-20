import React, { useState } from 'react';
import { HomeworkAssignment, HomeworkStatus } from '../types';
import { geminiService } from '../services/geminiService';
import { homeworkService } from '../services/homeworkService';
import { authService } from '../services/authService';
import { 
  ArrowLeft, Send, CheckCircle2, Clock, 
  AlertCircle, Sparkles, BookOpen, Star 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface HomeworkViewProps {
  homeworkId: string;
  onBack: () => void;
  onComplete: () => void;
}

export const HomeworkView: React.FC<HomeworkViewProps> = ({ homeworkId, onBack, onComplete }) => {
  const [assignment, setAssignment] = useState<HomeworkAssignment | undefined>(
    homeworkService.getAssignmentById(homeworkId)
  );
  const [answer, setAnswer] = useState(assignment?.studentAnswer || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ grade: number; feedback: string } | null>(
      assignment?.status === HomeworkStatus.COMPLETED 
      ? { grade: assignment.grade || 0, feedback: assignment.teacherFeedback || '' } 
      : null
  );

  if (!assignment) return <div>Завдання не знайдено</div>;

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setIsSubmitting(true);

    const check = await geminiService.checkHomework(
        assignment.subjectName,
        assignment.topicTitle,
        assignment.description || '',
        answer
    );

    homeworkService.saveSubmission(assignment.id, answer, check.grade, check.feedback);
    
    // Add XP if grade is good
    if (check.grade >= 6) {
        authService.addXp(assignment.xpReward + (check.grade * 5));
    }

    setResult({ grade: check.grade, feedback: check.feedback });
    setIsSubmitting(false);
    onComplete(); // Triggers global user update if needed
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <button onClick={onBack} className="flex items-center text-gray-500 hover:text-blue-600 font-bold transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Назад до завдань
      </button>

      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
        {/* Task Info */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative overflow-hidden">
           <div className="relative z-10">
               <div className="flex justify-between items-start mb-4">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md">
                      {assignment.subjectName}
                  </span>
                  <div className="flex items-center gap-2">
                     <span className="bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded text-xs font-bold flex items-center">
                        <Star className="w-3 h-3 mr-1 fill-yellow-900" /> +{assignment.xpReward} XP
                     </span>
                  </div>
               </div>
               <h1 className="text-2xl md:text-3xl font-black mb-2">{assignment.topicTitle}</h1>
               <p className="text-blue-100 font-medium opacity-90">{assignment.description}</p>
           </div>
           <BookOpen className="absolute -right-6 -bottom-6 w-40 h-40 text-white opacity-10 rotate-12" />
        </div>

        <div className="p-8">
            {/* Grading Result */}
            {result ? (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                    <div className={`p-6 rounded-2xl border-2 mb-8 ${result.grade >= 10 ? 'bg-green-50 border-green-200' : result.grade >= 7 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-black text-gray-800 flex items-center">
                                <CheckCircle2 className="w-6 h-6 mr-2 text-green-600" />
                                Оцінка: <span className="ml-2 text-3xl">{result.grade}/12</span>
                            </h3>
                            <span className="text-xs font-bold uppercase text-gray-400">Перевірено ШІ-Вчителем</span>
                        </div>
                        <div className="prose prose-sm max-w-none text-gray-700">
                            <ReactMarkdown>{result.feedback}</ReactMarkdown>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Твоя відповідь</label>
                        <p className="text-gray-800 whitespace-pre-wrap font-medium">{answer}</p>
                    </div>
                </div>
            ) : (
                /* Submission Form */
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-bold text-gray-700 flex items-center mb-2">
                            <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                            Твоя відповідь
                        </label>
                        <textarea 
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="w-full h-64 p-5 rounded-2xl border-2 border-gray-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all resize-none text-gray-700 leading-relaxed"
                            placeholder="Напиши свою відповідь тут... Ти можеш використовувати формули або просто текст."
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-400 font-medium">
                           <Clock className="w-4 h-4 mr-1" />
                           Термін: {assignment.dueDate}
                        </div>
                        <button 
                            onClick={handleSubmit}
                            disabled={!answer.trim() || isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:bg-gray-300 disabled:shadow-none flex items-center"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center"><Sparkles className="w-4 h-4 mr-2 animate-spin"/> Перевіряю...</span>
                            ) : (
                                <span className="flex items-center"><Send className="w-4 h-4 mr-2"/> Здати роботу</span>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};