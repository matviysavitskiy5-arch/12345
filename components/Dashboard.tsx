import React, { useState, useEffect } from 'react';
import { User, GradeLevel, HomeworkAssignment, HomeworkStatus } from '../types';
import { contentService } from '../services/contentService';
import { homeworkService } from '../services/homeworkService';
import { 
  Calculator, Scroll, SquareFunction, BookOpen, Atom, Globe, 
  CheckCircle, Circle, Play, Triangle, FlaskConical, Plus, X, 
  Leaf, Trophy, ClipboardList, Calendar, CheckCircle2
} from 'lucide-react';

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Calculator': return <Calculator className="w-6 h-6" />;
    case 'Scroll': return <Scroll className="w-6 h-6" />;
    case 'FunctionSquare': return <SquareFunction className="w-6 h-6" />;
    case 'BookOpen': return <BookOpen className="w-6 h-6" />;
    case 'Triangle': return <Triangle className="w-6 h-6" />;
    case 'Flask': return <FlaskConical className="w-6 h-6" />;
    case 'Atom': return <Atom className="w-6 h-6" />;
    case 'Globe': return <Globe className="w-6 h-6" />;
    case 'Leaf': return <Leaf className="w-6 h-6" />;
    default: return <BookOpen className="w-6 h-6" />;
  }
};

interface DashboardProps {
  user: User;
  onSelectTopic: (subjectId: string, topicId: string) => void;
  onDoHomework: (homeworkId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onSelectTopic, onDoHomework }) => {
  const [curriculum, setCurriculum] = useState<GradeLevel | undefined>(contentService.getCurriculum(user.grade));
  const [homework, setHomework] = useState<HomeworkAssignment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetSubjectId, setTargetSubjectId] = useState<string | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicDesc, setNewTopicDesc] = useState('');

  useEffect(() => {
    setHomework(homeworkService.getAssignments(user.grade));
  }, [user.grade]);

  if (!curriculum) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">На жаль, програма для {user.grade} класу ще розробляється.</h2>
      </div>
    );
  }

  const openAddTopicModal = (subjectId: string) => {
    setTargetSubjectId(subjectId);
    setNewTopicTitle('');
    setNewTopicDesc('');
    setIsModalOpen(true);
  };

  const handleAddTopic = () => {
    if (targetSubjectId && newTopicTitle.trim()) {
      contentService.addTopic(user.grade, targetSubjectId, newTopicTitle, newTopicDesc);
      setCurriculum(contentService.getCurriculum(user.grade));
      setIsModalOpen(false);
    }
  };

  const getStatusColor = (status: HomeworkStatus) => {
    switch (status) {
      case HomeworkStatus.NOT_STARTED: return "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
      case HomeworkStatus.IN_PROGRESS: return "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
      case HomeworkStatus.COMPLETED: return "bg-green-50 text-green-600 border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
      default: return "bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500";
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 relative pb-20 md:pb-0">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Привіт, {user.username}! 👋</h1>
            <p className="text-blue-100 text-sm md:text-lg">Готовий до нових знань сьогодні? Твій АІ-помічник чекає.</p>
        </div>
        <Trophy className="absolute right-4 bottom-[-20px] w-24 h-24 md:w-32 md:h-32 text-white opacity-10 rotate-12" />
      </div>

      {/* Homework Assignments Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <span className="bg-blue-500 w-2 h-6 md:h-8 rounded mr-3"></span>
            Домашні завдання
          </h2>
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
            {homework.filter(h => h.status !== HomeworkStatus.COMPLETED).length} активних
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {homework.map((hw) => (
            <div key={hw.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all group relative">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusColor(hw.status)}`}>
                    {hw.status}
                  </span>
                  {hw.grade && <span className="text-[10px] font-black bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">Оцінка: {hw.grade}</span>}
                </div>
                <div className="flex items-center text-gray-400 text-xs font-medium">
                  <Calendar className="w-3 h-3 mr-1" />
                  {hw.dueDate}
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-xs font-bold text-blue-500 mb-1 uppercase tracking-wide">{hw.subjectName}</h4>
                <p className="text-gray-800 dark:text-gray-100 font-bold leading-tight line-clamp-2">{hw.topicTitle}</p>
              </div>

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50 dark:border-gray-700">
                <div className="flex space-x-1 w-full">
                  {hw.status !== HomeworkStatus.COMPLETED ? (
                      <button 
                        onClick={() => onDoHomework(hw.id)}
                        className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <Play className="w-4 h-4 mr-2" /> Виконати
                      </button>
                  ) : (
                    <button 
                        onClick={() => onDoHomework(hw.id)} // View result
                        className="w-full py-2 bg-gray-50 dark:bg-gray-700 text-green-600 dark:text-green-400 rounded-lg font-bold text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Переглянути результат
                      </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {homework.length === 0 && (
            <div className="col-span-full py-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400">
               <ClipboardList className="w-10 h-10 mb-2 opacity-20" />
               <p className="text-sm font-medium">Завдань поки немає. Пройди тест, щоб отримати ДЗ!</p>
            </div>
          )}
        </div>
      </section>

      <div>
        <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
          <span className="bg-yellow-400 w-2 h-6 md:h-8 rounded mr-3"></span>
          Предмети {user.grade}-го класу
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {curriculum.subjects?.map((subject) => {
             const totalTopics = subject.topics?.length || 0;
             const completedCount = subject.topics?.filter(t => user.completedTopics?.includes(t.id)).length || 0;
             const progressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
             
             return (
                <div key={subject.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all flex flex-col h-full">
                  <div className="p-5 md:p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg shadow-sm">
                        {getIcon(subject.icon)}
                      </div>
                      <span className="text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-full">
                          {completedCount}/{totalTopics} тем
                      </span>
                    </div>
                    
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-2">{subject.name}</h3>
                    
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mb-1">
                        <div 
                            className={`h-1.5 rounded-full transition-all duration-700 ease-out ${progressPercent === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-4">
                        <span>Прогрес</span>
                        <span>{progressPercent}%</span>
                    </div>
                    
                    <div className="space-y-2 md:space-y-3 mt-2 flex-1">
                      {subject.topics?.map((topic) => {
                        const isCompleted = user.completedTopics?.includes(topic.id) || false;
                        return (
                          <button
                            key={topic.id}
                            onClick={() => onSelectTopic(subject.id, topic.id)}
                            className={`w-full text-left p-2.5 md:p-3 rounded-lg text-sm flex items-center justify-between group transition-all border
                              ${isCompleted 
                                ? 'bg-green-50/50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-100 dark:border-green-800' 
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-100 dark:hover:border-gray-600 hover:text-blue-700 dark:hover:text-blue-400'
                              }`}
                          >
                            <div className="flex items-center overflow-hidden flex-1">
                               {isCompleted ? (
                                 <div className="min-w-[1.25rem] w-5 h-5 mr-3 flex items-center justify-center bg-green-100 dark:bg-green-800 rounded-full text-green-600 dark:text-green-200">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                 </div>
                               ) : (
                                 <div className="min-w-[1.25rem] w-5 h-5 mr-3 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600 rounded-full group-hover:border-blue-400">
                                   <div className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                 </div>
                               )}
                               <span className="truncate pr-2 font-medium">{topic.title}</span>
                            </div>
                            {isCompleted && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400 bg-white dark:bg-gray-900 px-1.5 py-0.5 rounded border border-green-200 dark:border-green-800 shadow-sm">
                                    OK
                                </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button 
                      onClick={() => openAddTopicModal(subject.id)}
                      className="mt-6 w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center text-sm font-medium"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Додати тему
                    </button>
                  </div>
                </div>
             );
          })}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Додати нову тему</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Назва теми</label>
                <input 
                  type="text" 
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="Наприклад: Теорема косинусів"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-white"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Опис (необов'язково)</label>
                <input 
                  type="text" 
                  value={newTopicDesc}
                  onChange={(e) => setNewTopicDesc(e.target.value)}
                  placeholder="Про що ця тема?"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="p-4 md:p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium"
              >
                Скасувати
              </button>
              <button 
                onClick={handleAddTopic}
                disabled={!newTopicTitle.trim()}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
              >
                Створити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};