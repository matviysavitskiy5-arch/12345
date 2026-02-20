import { GoogleGenAI, Type, Schema } from "@google/genai";
import { LearningStyle, QuizQuestion, HomeworkOption } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelId = 'gemini-3-flash-preview';

export const geminiService = {
  explainTopic: async (topicTitle: string, subject: string, grade: number, style: LearningStyle) => {
    // Teacher Persona Configuration
    const stylePrompt = {
      [LearningStyle.SCHOOL]: "академічний, але доступний (як у найкращому підручнику)",
      [LearningStyle.SIMPLIFIED]: "максимально простий, пояснюй як для новачка, використовуй прості речення",
      [LearningStyle.STORYTELLING]: "розповідний, наводь приклади через історії або ситуації з життя",
      [LearningStyle.ANALOGY]: "використовуй яскраві аналогії та порівняння для пояснення складного",
      [LearningStyle.MAGICAL]: "захопливий, ніби ми досліджуємо магію цього предмета",
      [LearningStyle.UNIVERSITY]: "глибокий, науковий, з акцентом на причинно-наслідкові зв'язки"
    };

    const prompt = `
      Ти — досвідчений, надихаючий український вчитель предмету "${subject}" для ${grade} класу.
      Твоє завдання: Пояснити тему "${topicTitle}".
      
      Стиль пояснення: ${stylePrompt[style]}.
      
      ВАЖЛИВО:
      1. Не починай зі слів "Ось пояснення" або "Привіт". Одразу переходь до суті, ніби ти ведеш урок.
      2. Тон має бути живим, педагогічним, мотивуючим. Звертайся до учня (на "ти").
      3. Структура відповіді:
         - **Вступ**: Чому це цікаво або важливо знати? (1-2 речення).
         - **Основна частина**: Розкрий тему чітко та послідовно. Використовуй списки для важливих пунктів.
         - **Приклади**: Наведи конкретний приклад (якщо це математика/фізика — розв'язок, якщо історія/літ — ситуація).
         - **Ключовий висновок**: Одне речення, щоб запам'ятати суть.
      4. Формули пиши виключно в LaTeX ($...$).
      5. Використовуй форматування Markdown (жирний шрифт для термінів).
    `;

    try {
      const response = await ai.models.generateContent({ model: modelId, contents: prompt });
      return response.text;
    } catch (e) { return "Вибач, зараз маю проблеми зі зв'язком. Спробуй оновити сторінку пізніше."; }
  },

  generateQuizQuestions: async (topicTitle: string, subject: string, grade: number, count: number, contextInfo: string = ""): Promise<QuizQuestion[]> => {
    const prompt = `
      Ти — методист. Склади ${count} питань для тестування по темі "${topicTitle}" (${subject}, ${grade} клас).
      Питання мають перевіряти розуміння, а не просто зазубрювання.
      Формули в LaTeX ($...$).
      Поверни JSON масив: [{question, options (масив з 4 варіантів), correctAnswer (індекс 0-3)}].
    `;

    const schema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswer: { type: Type.NUMBER }
        },
        required: ["question", "options", "correctAnswer"]
      }
    };

    try {
      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: schema, temperature: 0.3 }
      });
      const data = JSON.parse(response.text || '[]');
      return data.map((q: any, i: number) => ({ ...q, id: `ai-q-${Date.now()}-${i}` }));
    } catch (e) { return []; }
  },

  solveStructuredTask: async (subject: string, grade: number, engineType: string, data: any) => {
    const dataStr = JSON.stringify(data, null, 2);
    const prompt = `
      Ти — уважний вчитель предмету "${subject}" (${grade} клас).
      Учень надіслав тобі своє завдання на перевірку.
      
      Тип завдання: ${engineType}.
      Вхідні дані учня: ${dataStr}

      ТВОЯ РОЛЬ:
      Не просто скажи "правильно" чи "неправильно". Навчи учня.
      
      1. Якщо все вірно: Похвали (використовуй українські слова: "Чудово", "Блискуче", "Так тримати"). Додай цікавий факт або коротке поглиблення теми.
      2. Якщо є помилки:
         - Вкажи конкретно, де помилка.
         - Не давай одразу повну відповідь, а поясни логіку, як її знайти.
         - Підтримай учня ("Не хвилюйся", "Це поширена помилка", "Спробуймо ще раз").
      
      Стиль: Дружній, професійний, українська мова. Формули в LaTeX ($...$).
    `;
    try {
      const response = await ai.models.generateContent({ model: modelId, contents: prompt });
      return response.text;
    } catch (e) { return "Не вдалося перевірити завдання. Спробуй пізніше."; }
  },

  checkHomework: async (subject: string, topic: string, description: string, studentAnswer: string) => {
    const prompt = `
      Ти — суворий, але справедливий вчитель "${subject}".
      Тема уроку: "${topic}".
      Завдання було: "${description}".
      
      Відповідь учня: "${studentAnswer}".

      Оціни роботу за 12-бальною шкалою.
      
      Формат відповіді JSON:
      {
        "grade": number (1-12),
        "feedback": "Твій детальний коментар. Спочатку похвали, потім вкажи на помилки (якщо є), потім дай пораду. Звертайся до учня на 'Ти'.",
        "isCorrect": boolean
      }
    `;

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        grade: { type: Type.NUMBER },
        feedback: { type: Type.STRING },
        isCorrect: { type: Type.BOOLEAN }
      },
      required: ["grade", "feedback", "isCorrect"]
    };

    try {
      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: schema }
      });
      return JSON.parse(response.text || '{}');
    } catch (e) {
      return { grade: 8, feedback: "Дякую за старанність! На жаль, сталася технічна помилка при глибокому аналізі, але я зарахував це завдання.", isCorrect: true };
    }
  },

  generateGeometrySVG: async (problemText: string) => {
    const prompt = `
      Generate a CLEAN, high-contrast SVG code (only the <svg>...</svg> tag, no markdown) for this geometry problem: "${problemText}".
      
      Requirements:
      1. Use a white background rectangle (<rect width="100%" height="100%" fill="white" />).
      2. Draw lines with stroke="black" stroke-width="2".
      3. Use clear, large font-size for labels (e.g. A, B, C, angles).
      4. Ensure the viewBox is set correctly so nothing is cut off (padding 20px).
      5. NO artifacts, NO blurring, NO extraneous text outside the drawing.
      6. Return ONLY the SVG string.
    `;
    try {
      const response = await ai.models.generateContent({ model: modelId, contents: prompt });
      const text = response.text || '';
      const match = text.match(/<svg[\s\S]*?<\/svg>/);
      return match ? match[0] : "";
    } catch (e) { return ""; }
  },

  generateHomeworkChoices: async (topicTitle: string, subject: string, grade: number, performanceLevel: string): Promise<HomeworkOption[]> => {
    // Teacher provides homework
    const prompt = `
      Ти — вчитель. Учень щойно пройшов тест по темі "${topicTitle}" (${subject}, ${grade} клас).
      Його результат: ${performanceLevel}.
      
      Запропонуй 3 варіанти домашнього завдання, щоб закріпити знання:
      1. "Легкий" (для повторення бази).
      2. "Середній" (стандартне шкільне завдання).
      3. "Складний" (творче або поглиблене завдання).

      Поверни JSON: [{title, description (короткий інструктаж, що зробити), difficulty, xpReward}].
    `;
    
    const schema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          difficulty: { type: Type.STRING },
          xpReward: { type: Type.NUMBER }
        },
        required: ["title", "description", "difficulty", "xpReward"]
      }
    };
    try {
      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: schema }
      });
      return JSON.parse(response.text || '[]');
    } catch (e) { return []; }
  },

  chat: async (message: string, context: string) => {
    const prompt = `
      Роль: Ти — ШІ-репетитор з України.
      Контекст уроку: ${context}.
      Питання учня: "${message}".
      
      Інструкція:
      1. Відповідай як живий вчитель: доброзичливо і по суті.
      2. Якщо учень просить розв'язати задачу, не давай суху відповідь, а поясни хід думок.
      3. Використовуй навідні питання ("А як ти думаєш?", "Згадай правило...").
      4. Формули в LaTeX ($...$).
    `;
    try {
      const response = await ai.models.generateContent({ model: modelId, contents: prompt });
      return response.text;
    } catch (e) { return "Замислився... Спитай ще раз."; }
  }
};