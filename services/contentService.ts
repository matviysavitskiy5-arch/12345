import { GradeLevel, Topic } from '../types';
import { CURRICULUM_DATA } from '../constants';

const CUSTOM_TOPICS_KEY = 'eznannya_custom_topics';

interface CustomTopicRecord {
  grade: number;
  subjectId: string;
  topic: Topic;
}

export const contentService = {
  getCurriculum: (userGrade: number): GradeLevel | undefined => {
    // 1. Get base data
    const baseData = CURRICULUM_DATA.find(g => g.grade === userGrade);
    if (!baseData) return undefined;

    // 2. Clone to avoid mutating constant
    const gradeData: GradeLevel = JSON.parse(JSON.stringify(baseData));

    // 3. Get custom topics
    const customJson = localStorage.getItem(CUSTOM_TOPICS_KEY);
    const customTopics: CustomTopicRecord[] = customJson ? JSON.parse(customJson) : [];

    // 4. Merge
    customTopics.forEach(record => {
      if (record.grade === userGrade) {
        const subject = gradeData.subjects.find(s => s.id === record.subjectId);
        if (subject) {
          subject.topics.push(record.topic);
        }
      }
    });

    return gradeData;
  },

  addTopic: (grade: number, subjectId: string, title: string, description: string) => {
    const newTopic: Topic = {
      id: `custom-${Date.now()}`,
      title,
      description,
      content: `### ${title}\n\nЦя тема була створена користувачем.\nВикористовуйте АІ-чат, щоб згенерувати повне пояснення або розв'язати задачі по цій темі.`,
      quizQuestions: [] // Custom topics start without quizzes
    };

    const record: CustomTopicRecord = { grade, subjectId, topic: newTopic };
    
    const customJson = localStorage.getItem(CUSTOM_TOPICS_KEY);
    const customTopics: CustomTopicRecord[] = customJson ? JSON.parse(customJson) : [];
    customTopics.push(record);
    localStorage.setItem(CUSTOM_TOPICS_KEY, JSON.stringify(customTopics));

    return newTopic;
  }
};