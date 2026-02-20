import React, { useState, useEffect, useRef } from 'react';
import { Topic, LearningStyle, ChatMessage } from '../types';
import { geminiService } from '../services/geminiService';
import { Bot, BookOpen, ArrowLeft, GraduationCap, Send, Sparkles, RefreshCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface TopicViewProps {
  topic: Topic;
  subjectName: string;
  grade: number;
  preferredStyle?: LearningStyle;
  onBack: () => void;
  onStartQuiz: () => void;
}

export const TopicView: React.FC<TopicViewProps> = ({ topic, subjectName, grade, preferredStyle, onBack, onStartQuiz }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'chat'>('content');
  const [learningStyle, setLearningStyle] = useState<LearningStyle>(preferredStyle || LearningStyle.SCHOOL);
  const [aiContent, setAiContent] = useState<string>('');
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeTab]);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoadingContent(true);
      const generated = await geminiService.explainTopic(topic.title, subjectName, grade, learningStyle);
      setAiContent(generated || topic.content);
      setIsLoadingContent(false);
    };
    fetchContent();
  }, [learningStyle, topic, subjectName, grade]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const response = await geminiService.chat(input, topic.content);
    
    const aiMsg: ChatMessage = { role: 'model', text: response || "Вибач, я задумався.", timestamp: Date.now() };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-100px)]">
      <div className="flex flex-col gap-3 mb-4">
        <button onClick={onBack} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white flex items-center text-sm font-bold self-start px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Назад до тем
        </button>
        
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl flex overflow-x-auto no-scrollbar md:self-start self-stretch w-fit shadow-inner">
          <button 
            onClick={() => setActiveTab('content')}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center justify-center whitespace-nowrap ${activeTab === 'content' ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-300' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
          >
            <BookOpen className="w-4 h-4 mr-2" /> ТЕОРІЯ
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center justify-center whitespace-nowrap ${activeTab === 'chat' ? 'bg-white dark:bg-gray-700 shadow-md text-purple-600 dark:text-purple-300' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
          >
            <Bot className="w-4 h-4 mr-2" /> РЕПЕТИТОР
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col relative">
        {activeTab === 'content' && (
          <div className="flex flex-col h-full">
            <div className="p-6 md:p-8 border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white leading-tight">{topic.title}</h1>
                <p className="text-blue-500 dark:text-blue-400 text-xs font-black uppercase tracking-widest mt-1">{subjectName}</p>
              </div>
              
              <div className="flex items-center bg-white dark:bg-gray-700 px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-sm w-full md:w-auto self-start hover:border-blue-400 transition-all">
                <Sparkles className="w-4 h-4 text-purple-500 mr-2" />
                <span className="text-[10px] text-gray-400 dark:text-gray-300 font-black uppercase tracking-tighter mr-3">Стиль пояснень:</span>
                <select 
                  value={learningStyle}
                  onChange={(e) => setLearningStyle(e.target.value as LearningStyle)}
                  className="bg-transparent text-sm font-bold text-blue-600 dark:text-blue-300 outline-none cursor-pointer pr-2 dark:bg-gray-700"
                >
                  {Object.values(LearningStyle).map((style) => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10">
              {isLoadingContent ? (
                <div className="flex flex-col items-center justify-center h-full text-blue-500 space-y-4 py-10">
                   <RefreshCcw className="w-12 h-12 animate-spin text-blue-200 dark:text-blue-700" />
                   <p className="font-bold text-gray-400">Формуємо конспект за твоїм стилем...</p>
                </div>
              ) : (
                <div className="prose prose-sm md:prose-base dark:prose-invert prose-blue max-w-none prose-headings:font-black prose-p:leading-relaxed prose-img:rounded-3xl prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:py-2 prose-blockquote:rounded-r-2xl">
                  <div className="[&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {aiContent}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-50 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800 flex justify-end">
              <button 
                onClick={onStartQuiz}
                className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-blue-100 dark:shadow-none transition-all flex items-center justify-center transform active:scale-95"
              >
                <GraduationCap className="w-6 h-6 mr-3" />
                ЗАКРІПИТИ ЗНАННЯ (ТЕСТ)
              </button>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
             <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center shadow-sm z-10">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2.5 rounded-2xl mr-4 shadow-inner">
                  <Bot className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-black text-gray-800 dark:text-white uppercase tracking-tighter">ШІ-Репетитор</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">В режимі реального часу</p>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
               {messages.length === 0 && (
                 <div className="text-center text-gray-300 dark:text-gray-600 mt-20 max-w-xs mx-auto">
                   <Sparkles className="w-16 h-16 mx-auto mb-6 opacity-10" />
                   <p className="font-bold text-sm">Привіт! Я твій персональний репетитор. Запитуй будь-що про цю тему.</p>
                 </div>
               )}
               {messages.map((msg, idx) => (
                 <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[85%] md:max-w-[75%] p-5 rounded-[2rem] shadow-sm text-sm md:text-base leading-relaxed ${
                     msg.role === 'user' 
                       ? 'bg-blue-600 text-white rounded-br-none' 
                       : 'bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-bl-none shadow-gray-200/50 dark:shadow-none'
                   }`}>
                     <div className="[&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {msg.text}
                        </ReactMarkdown>
                     </div>
                   </div>
                 </div>
               ))}
               {isTyping && (
                 <div className="flex justify-start animate-in fade-in slide-in-from-left-4">
                   <div className="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 p-5 rounded-[2rem] rounded-bl-none shadow-sm flex items-center space-x-2">
                     <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                     <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                     <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                   </div>
                 </div>
               )}
               <div ref={messagesEndRef} />
             </div>

             <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shadow-2xl">
               <div className="flex items-end space-x-3 bg-gray-50 dark:bg-gray-700 p-2 rounded-[2rem] border border-gray-100 dark:border-gray-600">
                 <textarea
                   rows={1}
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => {
                       if(e.key === 'Enter' && !e.shiftKey) {
                           e.preventDefault();
                           handleSendMessage();
                       }
                   }}
                   placeholder="Твоє питання..."
                   className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 outline-none resize-none text-sm md:text-base max-h-32 min-h-[44px] text-gray-800 dark:text-white placeholder-gray-400"
                 />
                 <button 
                   onClick={handleSendMessage}
                   disabled={!input.trim() || isTyping}
                   className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-200 dark:disabled:bg-gray-600 text-white p-4 rounded-2xl transition-all shadow-lg flex-shrink-0 active:scale-95"
                 >
                   <Send className="w-5 h-5" />
                 </button>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};