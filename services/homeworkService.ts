
import { HomeworkAssignment, HomeworkStatus, HomeworkOption } from '../types';
import { CURRICULUM_DATA } from '../constants';

const STORAGE_KEY = 'eznannya_homework';

export const homeworkService = {
  getAssignments: (userGrade: number): HomeworkAssignment[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const all: HomeworkAssignment[] = JSON.parse(stored);
        return all;
      } catch (e) {
        console.error("Failed to parse homework data", e);
      }
    }
    return [];
  },
  
  getAssignmentById: (id: string): HomeworkAssignment | undefined => {
    const assignments = homeworkService.getAssignments(0);
    return assignments.find(a => a.id === id);
  },
  
  addAssignment: (subjectId: string, subjectName: string, topicTitle: string, option: HomeworkOption) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let assignments: HomeworkAssignment[] = stored ? JSON.parse(stored) : [];
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const newHw: HomeworkAssignment = {
      id: `hw-${Date.now()}`,
      subjectId,
      subjectName,
      topicTitle: option.title,
      description: option.description,
      dueDate: tomorrow.toISOString().split('T')[0],
      status: HomeworkStatus.NOT_STARTED,
      difficulty: option.difficulty,
      xpReward: option.xpReward
    };

    assignments.unshift(newHw);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    return assignments;
  },

  updateStatus: (id: string, status: HomeworkStatus) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let assignments: HomeworkAssignment[] = stored ? JSON.parse(stored) : [];
    
    assignments = assignments.map(hw => hw.id === id ? { ...hw, status } : hw);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    return assignments;
  },

  saveSubmission: (id: string, answer: string, grade: number, feedback: string) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      let assignments: HomeworkAssignment[] = stored ? JSON.parse(stored) : [];
      
      assignments = assignments.map(hw => {
          if (hw.id === id) {
              return {
                  ...hw,
                  status: HomeworkStatus.COMPLETED,
                  studentAnswer: answer,
                  grade: grade,
                  teacherFeedback: feedback,
                  completedAt: new Date().toISOString()
              };
          }
          return hw;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
      return assignments;
  }
};