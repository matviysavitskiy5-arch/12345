import React, { useState, useEffect } from 'react';
import { Topic, QuizQuestion, HomeworkOption } from '../types';
import { geminiService } from '../services/geminiService';
import { homeworkService } from '../services/homeworkService';
import { 
  Lightbulb, CheckCircle, XCircle, ArrowRight, RefreshCcw, 
  Sparkles, AlertCircle, Timer, Zap, ClipboardCheck, 
  BookOpen, BarChart2, Check, X, Clock, ArrowLeft, Trophy
} from 'lucide-react';
import { authService } from '../services/authService';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface QuizViewProps {
  topic: Topic;
  subjectId: string;
  grade: number;
  onComplete: () => void;
  onCancel: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ topic, subjectId, grade, onComplete, onCancel }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]); 
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  
  // New view modes: 'review' added
  const [viewMode, setViewMode] = useState<'quiz' | 'result' | 'review' | 'homework_choice'>('quiz');
  
  const [timer, setTimer] = useState(0);
  const [hwOptions, setHwOptions] = useState<HomeworkOption[]>([]);
  const [isLoadingHw, setIsLoadingHw] = useState(false);

  useEffect(() => {
    let interval: any;
    if (viewMode === 'quiz') {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [viewMode]);

  useEffect(() => {
    const initQuiz = async () => {
      setIsLoading(true);
      try {
        const gen = await geminiService.generateQuizQuestions(topic.title, subjectId, grade, 10, topic.description);
        setQuestions(gen.length > 0 ? gen : topic.quizQuestions);
      } catch (e) {
        setQuestions(topic.quizQuestions);
      }
      setIsLoading(false);
    };
    initQuiz();
  }, [topic, subjectId, grade]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const checkAnswer = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === questions[currentQuestionIdx].correctAnswer;
    
    // Save answer for current index
    const newAnswers = [...answers];
    newAnswers[currentQuestionIdx] = selectedOption;
    setAnswers(newAnswers);

    setIsAnswered(true);
    if (isCorrect) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setViewMode('result');
    const finalGrade = Math.ceil((score / (questions.length || 1)) * 12);
    authService.saveQuizResult({
      topicId: topic.id,
      subjectId,
      score,
      totalQuestions: questions.length,
      grade: finalGrade,
      date: new Date().toISOString(),
      timeSpent: timer
    });
    authService.addXp(finalGrade * 20 + (finalGrade === 12 ? 100 : 0), topic.id);
  };

  const generateHomework = async () => {
    setIsLoadingHw(true);
    setViewMode('homework_choice');
    const performance = score > (questions.length * 0.8) ? "Відмінно" : score > (questions.length * 0.5) ? "Добре" : "Потребує уваги";
    try {
      const choices = await geminiService.generateHomeworkChoices(topic.title, subjectId, grade, performance);
      setHwOptions(choices);
    } catch (e) {
      setHwOptions([
        { title: "Базові вправи", description: "Розв'яжи 5 задач по темі", difficulty: "Легкий", xpReward: 50 },
        { title: "Творчий звіт", description: "Склади короткий конспект", difficulty: "Середній", xpReward: 100 },
        { title: "Міні-проєкт", description: "Підготуй презентацію", difficulty: "Складний", xpReward: 200 }
      ]);
    }
    setIsLoadingHw(false);
  };

  const selectHw = (option: HomeworkOption) => {
    homeworkService.addAssignment(subjectId, subjectId.split('-')[0], topic.title, option);
    onComplete();
  };

  // --- RENDERS ---

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-pulse">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
           <Sparkles className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Готуємо запитання...</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">АІ підбирає найкращі завдання для тебе</p>
      </div>
    );
  }

  // --- HOMEWORK CHOICE MODE ---
  if (viewMode === 'homework_choice') {
    return (
      <div className="max-w-4xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-5">
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4">
             <ClipboardCheck className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-black text-gray-800 dark:text-white">Час для практики! 📚</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Обери завдання, щоб закріпити знання та отримати XP.</p>
        </div>

        {isLoadingHw ? (
          <div className="text-center py-20">
            <RefreshCcw className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-bold">Генеруємо персоналізовані варіанти...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hwOptions.map((opt, i) => (
              <div 
                key={i} 
                onClick={() => selectHw(opt)}
                className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-all group flex flex-col h-full transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${
                    opt.difficulty === 'Легкий' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 
                    opt.difficulty === 'Середній' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {opt.difficulty}
                  </span>
                  <div className="flex items-center text-yellow-600 dark:text-yellow-500 font-bold text-xs">
                    <Zap className="w-3 h-3 mr-1 fill-yellow-500" /> +{opt.xpReward} XP
                  </div>
                </div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">{opt.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-1">{opt.description}</p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-xs font-bold group-hover:translate-x-2 transition-transform">
                  ОБРАТИ <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- REVIEW MODE ---
  if (viewMode === 'review') {
    return (
      <div className="max-w-3xl mx-auto py-6 animate-in fade-in">
         <div className="flex items-center justify-between mb-6">
            <button onClick={() => setViewMode('result')} className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 font-bold bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
               <ArrowLeft className="w-4 h-4 mr-2" /> Назад до результатів
            </button>
            <h2 className="text-xl font-black text-gray-800 dark:text-white">Робота над помилками</h2>
         </div>

         <div className="space-y-6">
            {questions.map((q, qIdx) => {
               const userAnswer = answers[qIdx];
               const isCorrect = userAnswer === q.correctAnswer;
               
               return (
                  <div key={q.id} className={`bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 ${isCorrect ? 'border-gray-100 dark:border-gray-700' : 'border-red-100 dark:border-red-900 shadow-sm'} `}>
                     <div className="flex items-start mb-4">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3 ${isCorrect ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'}`}>
                           {qIdx + 1}
                        </div>
                        <div className="flex-1 font-medium text-gray-800 dark:text-gray-100">
                           <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} components={{p: ({node, ...props}) => <span {...props} />}}>
                              {q.question}
                           </ReactMarkdown>
                        </div>
                     </div>

                     <div className="space-y-2 pl-11">
                        {q.options.map((opt, oIdx) => {
                           const isSelected = userAnswer === oIdx;
                           const isTarget = q.correctAnswer === oIdx;
                           
                           let styleClass = "border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400";
                           let Icon = null;

                           if (isTarget) {
                              styleClass = "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 font-bold";
                              Icon = <Check className="w-4 h-4 text-green-600 dark:text-green-400 ml-auto" />;
                           } else if (isSelected && !isTarget) {
                              styleClass = "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 font-bold";
                              Icon = <X className="w-4 h-4 text-red-600 dark:text-red-400 ml-auto" />;
                           } else if (isSelected) {
                              styleClass = "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 font-bold";
                           }

                           return (
                              <div key={oIdx} className={`p-3 rounded-xl border text-sm flex items-center ${styleClass}`}>
                                 <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} components={{p: ({node, ...props}) => <span {...props} />}}>
                                    {opt}
                                 </ReactMarkdown>
                                 {Icon}
                              </div>
                           );
                        })}
                     </div>
                  </div>
               );
            })}
         </div>
         
         <div className="mt-8 flex justify-center">
            <button 
              onClick={generateHomework}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all active:scale-95"
            >
              Перейти до ДЗ
            </button>
         </div>
      </div>
    );
  }

  // --- RESULT MODE ---
  if (viewMode === 'result') {
    const finalGrade = Math.ceil((score / questions.length) * 12);
    const accuracy = Math.round((score / questions.length) * 100);
    const avgTime = Math.round(timer / questions.length);

    return (
      <div className="max-w-2xl mx-auto py-10 animate-in zoom-in-95 duration-300">
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden text-center p-8 md:p-12 relative">
          {/* Confetti / Decor */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
          
          <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-6 shadow-xl border-4 border-white dark:border-gray-700 ${finalGrade >= 10 ? 'bg-gradient-to-br from-yellow-300 to-yellow-500' : finalGrade >= 7 ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-red-400 to-red-600'}`}>
             <Trophy className="w-16 h-16 text-white drop-shadow-md" />
          </div>

          <h2 className="text-4xl font-black text-gray-800 dark:text-white mb-2">
             {finalGrade >= 10 ? "Чудово!" : finalGrade >= 7 ? "Добре!" : "Можна краще"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">Ти завершив тестування</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
             <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-2xl border border-gray-100 dark:border-gray-600">
                 <div className="text-gray-400 text-xs font-bold uppercase mb-1 flex justify-center items-center"><CheckCircle className="w-3 h-3 mr-1" /> Оцінка</div>
                 <div className="text-2xl font-black text-gray-800 dark:text-white">{finalGrade}<span className="text-sm text-gray-400">/12</span></div>
             </div>
             <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-2xl border border-gray-100 dark:border-gray-600">
                 <div className="text-gray-400 text-xs font-bold uppercase mb-1 flex justify-center items-center"><BarChart2 className="w-3 h-3 mr-1" /> Точність</div>
                 <div className="text-2xl font-black text-gray-800 dark:text-white">{accuracy}%</div>
             </div>
             <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-2xl border border-gray-100 dark:border-gray-600">
                 <div className="text-gray-400 text-xs font-bold uppercase mb-1 flex justify-center items-center"><Clock className="w-3 h-3 mr-1" /> Час</div>
                 <div className="text-2xl font-black text-gray-800 dark:text-white">{formatTime(timer)}</div>
             </div>
          </div>

          <div className="flex flex-col gap-3">
             <button 
                onClick={generateHomework}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95 flex items-center justify-center"
             >
                Отримати Домашнє Завдання <ArrowRight className="w-5 h-5 ml-2" />
             </button>
             
             <button 
                onClick={() => setViewMode('review')}
                className="w-full bg-white dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 text-gray-600 dark:text-gray-200 font-bold py-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-200 transition-all flex items-center justify-center"
             >
                <AlertCircle className="w-5 h-5 mr-2 text-orange-500" /> Переглянути помилки
             </button>
          </div>
        </div>
      </div>
    );
  }

  // --- QUIZ MODE (Default) ---
  const question = questions[currentQuestionIdx];
  const progress = ((currentQuestionIdx + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden relative">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 dark:bg-gray-700 z-10">
          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>

        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <span className="text-xs font-black text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg uppercase tracking-wider">
               Питання {currentQuestionIdx + 1} з {questions.length}
            </span>
            <div className="flex items-center text-gray-500 dark:text-gray-400 font-bold bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-600 tabular-nums">
              <Timer className="w-4 h-4 mr-2 text-gray-400" /> 
              {formatTime(timer)}
            </div>
          </div>

          {/* Question */}
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-10 leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} components={{p: ({node, ...props}) => <span {...props} />}}>
              {question.question}
            </ReactMarkdown>
          </h3>

          {/* Options */}
          <div className="grid grid-cols-1 gap-4">
            {question.options.map((opt, idx) => {
              let btnClass = "border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 hover:shadow-md text-gray-700 dark:text-gray-200";
              let indicatorClass = "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300";
              let Icon = null;

              if (selectedOption === idx) {
                 btnClass = "border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-100 dark:ring-blue-900 shadow-md transform scale-[1.01] text-gray-900 dark:text-white";
                 indicatorClass = "bg-blue-500 border-blue-500 text-white";
              }

              if (isAnswered) {
                if (idx === question.correctAnswer) {
                   btnClass = "border-green-500 bg-green-50 dark:bg-green-900/30 ring-2 ring-green-100 dark:ring-green-900 text-gray-900 dark:text-white";
                   indicatorClass = "bg-green-500 border-green-500 text-white";
                   Icon = <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 ml-auto animate-in zoom-in" />;
                } else if (selectedOption === idx) {
                   btnClass = "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 opacity-90";
                   indicatorClass = "bg-red-500 border-red-500 text-white";
                   Icon = <XCircle className="w-5 h-5 text-red-500 ml-auto animate-in zoom-in" />;
                } else {
                   btnClass = "border-gray-100 dark:border-gray-700 text-gray-300 dark:text-gray-600 opacity-50 grayscale";
                }
              }

              return (
                <button 
                  key={idx} 
                  onClick={() => handleOptionClick(idx)} 
                  disabled={isAnswered} 
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center group relative ${btnClass}`}
                >
                  <span className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-sm font-black mr-4 transition-colors ${indicatorClass}`}>
                    {['A', 'B', 'C', 'D'][idx]}
                  </span>
                  <div className="flex-1 text-lg font-medium">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} components={{p: ({node, ...props}) => <span {...props} />}}>
                      {opt}
                    </ReactMarkdown>
                  </div>
                  {Icon}
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="mt-10 pt-6 border-t border-gray-50 dark:border-gray-700 flex justify-between items-center">
             <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm font-bold px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                Скасувати
             </button>
             
             {!isAnswered ? (
               <button 
                 onClick={checkAnswer} 
                 disabled={selectedOption === null} 
                 className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:shadow-none text-white font-bold py-4 px-12 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95 flex items-center"
               >
                 Перевірити
               </button>
             ) : (
               <button 
                 onClick={nextQuestion} 
                 className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-12 rounded-2xl shadow-lg shadow-green-200 dark:shadow-none flex items-center transition-all animate-bounce"
               >
                 {currentQuestionIdx < questions.length - 1 ? "Наступне питання" : "Завершити"} 
                 <ArrowRight className="w-5 h-5 ml-2" />
               </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};