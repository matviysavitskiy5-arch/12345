import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { Layout } from './components/Layout';
import { TopicView } from './components/TopicView';
import { QuizView } from './components/QuizView';
import { Leaderboard } from './components/Leaderboard';
import { ProfileView } from './components/ProfileView';
import { FriendsView } from './components/FriendsView'; 
import { LaboratoryView } from './components/LaboratoryView';
import { HomeworkView } from './components/HomeworkView'; // Import
import { Breadcrumbs, BreadcrumbItem } from './components/Breadcrumbs';
import { authService } from './services/authService';
import { User } from './types';
import { CURRICULUM_DATA } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPath, setCurrentPath] = useState('/dashboard');
  
  // Navigation State
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [activeHomeworkId, setActiveHomeworkId] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<'dashboard' | 'topic' | 'quiz' | 'leaderboard' | 'profile' | 'friends' | 'laboratory' | 'homework'>('dashboard');

  useEffect(() => {
    const loadedUser = authService.getCurrentUser();
    if (loadedUser) setUser(loadedUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setViewMode('dashboard');
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    if (path === '/dashboard') setViewMode('dashboard');
    if (path === '/leaderboard') setViewMode('leaderboard');
    if (path === '/profile') setViewMode('profile');
    if (path === '/friends') setViewMode('friends');
    if (path === '/laboratory') setViewMode('laboratory');
    
    // Reset selection
    setActiveSubjectId(null);
    setActiveTopicId(null);
    setActiveHomeworkId(null);
  };

  const handleSelectTopic = (subjectId: string, topicId: string) => {
    setActiveSubjectId(subjectId);
    setActiveTopicId(topicId);
    setViewMode('topic');
  };

  const handleDoHomework = (homeworkId: string) => {
      setActiveHomeworkId(homeworkId);
      setViewMode('homework');
  };

  const updateUserData = () => {
      const u = authService.getCurrentUser();
      if(u) setUser(u);
  }

  if (!user) {
    return <Auth onAuthSuccess={setUser} />;
  }

  // Helper to find data
  const gradeData = CURRICULUM_DATA.find(g => g.grade === user.grade);
  const activeSubject = gradeData?.subjects.find(s => s.id === activeSubjectId);
  const activeTopic = activeSubject?.topics.find(t => t.id === activeTopicId);

  // Breadcrumb Logic
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { label: 'Головна', onClick: () => handleNavigate('/dashboard') }
    ];

    if (viewMode === 'profile') {
      items.push({ label: 'Профіль', active: true });
    } else if (viewMode === 'leaderboard') {
      items.push({ label: 'Рейтинг', active: true });
    } else if (viewMode === 'friends') {
      items.push({ label: 'Друзі', active: true });
    } else if (viewMode === 'laboratory') {
      items.push({ label: 'Лабораторія', active: true });
    } else if (viewMode === 'homework') {
      items.push({ label: 'Домашнє завдання', active: true });
    } else if (activeSubject) {
      // Subject Level
      items.push({ 
        label: activeSubject.name, 
        onClick: () => {
           setViewMode('dashboard');
           setActiveTopicId(null);
        }
      });

      if (activeTopic) {
        // Topic Level
        items.push({ 
          label: activeTopic.title, 
          onClick: viewMode !== 'topic' ? () => setViewMode('topic') : undefined,
          active: viewMode === 'topic'
        });

        // Quiz Level
        if (viewMode === 'quiz') {
          items.push({ label: 'Тестування', active: true });
        }
      }
    }
    return items;
  };

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      currentPath={currentPath}
      onNavigate={handleNavigate}
    >
      <Breadcrumbs items={getBreadcrumbs()} />

      {viewMode === 'dashboard' && (
        <Dashboard 
            user={user} 
            onSelectTopic={handleSelectTopic} 
            onDoHomework={handleDoHomework}
        />
      )}

      {viewMode === 'leaderboard' && (
        <Leaderboard />
      )}

      {viewMode === 'friends' && (
        <FriendsView />
      )}

      {viewMode === 'laboratory' && (
        <LaboratoryView grade={user.grade} />
      )}
      
      {viewMode === 'profile' && (
         <ProfileView user={user} onUpdate={setUser} />
      )}

      {viewMode === 'homework' && activeHomeworkId && (
          <HomeworkView 
            homeworkId={activeHomeworkId} 
            onBack={() => {
                setViewMode('dashboard');
                setActiveHomeworkId(null);
            }}
            onComplete={() => {
                updateUserData();
            }}
          />
      )}

      {viewMode === 'topic' && activeTopic && activeSubject && (
        <TopicView 
          topic={activeTopic}
          subjectName={activeSubject.name}
          grade={user.grade}
          preferredStyle={user.preferredStyle}
          onBack={() => {
              setViewMode('dashboard');
              setActiveTopicId(null);
          }}
          onStartQuiz={() => setViewMode('quiz')}
        />
      )}

      {viewMode === 'quiz' && activeTopic && activeSubject && (
        <QuizView 
          topic={activeTopic}
          subjectId={activeSubject.id}
          grade={user.grade}
          onComplete={() => {
            updateUserData(); 
            setViewMode('dashboard'); 
            setActiveTopicId(null);
          }}
          onCancel={() => setViewMode('topic')}
        />
      )}
    </Layout>
  );
};

export default App;