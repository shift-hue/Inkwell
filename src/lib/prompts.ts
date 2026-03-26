export const DAILY_PROMPTS = [
  "What made you smile today?",
  "Describe a challenge you faced and how you handled it.",
  "What are three things you're grateful for right now?",
  "If today had a theme song, what would it be and why?",
  "Write about someone who influenced you recently.",
  "What's a goal you're working toward? How did today serve it?",
  "Describe your perfect moment from today, even if small.",
  "What's something you learned today — big or small?",
  "If you could redo one moment from today, what would it be?",
  "What emotions did you feel most intensely today?",
  "Write about a conversation that stayed with you.",
  "What are you looking forward to tomorrow?",
  "Describe today's weather and how it matched your mood.",
  "What's a decision you made today that you're proud of?",
  "If today were a chapter in a book, what would it be titled?",
  "What drained your energy today? What filled it back up?",
  "Write about something unexpected that happened.",
  "Who did you think about today and why?",
  "What habit are you building, and how did today go?",
  "Describe where you are right now in three vivid details.",
  "What's something you want to remember about today?",
  "If you could send a message to your future self, what would it say?",
  "What made today different from yesterday?",
  "Write about a fear you faced, or one you're still carrying.",
  "What's one thing you'd tell a friend who was having your kind of day?",
  "Describe a texture, smell, or sound that defined today.",
  "What are you holding onto that you might need to let go of?",
  "Who are you becoming? What evidence did today give you?",
  "What's the most honest thing you could say right now?",
  "Finish this sentence: 'Today I realized…'",
];

export function getTodayPrompt(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return DAILY_PROMPTS[dayOfYear % DAILY_PROMPTS.length];
}
