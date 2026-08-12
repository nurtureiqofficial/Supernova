export interface ThinkingDrill {
  id: string;
  type: 'rapid-description' | 'tri-word' | 'instant-reaction';
  title: string;
  titleRegional: string;
  promptText: string;
  promptContext: string;
  visualEmoji: string;
  keywords?: string[];
  timeLimitSeconds: number; // 5 to 10 seconds
  sampleIdealResponse: string;
  sampleIdealResponseHindi: string;
}

export const THINKING_DRILLS: ThinkingDrill[] = [
  {
    id: 'drill-1',
    type: 'rapid-description',
    title: 'Rapid Photo Description',
    titleRegional: 'तस्वीर देखकर तुरंत अंग्रेजी में बोलें (बिना ट्रांसलेशन)',
    promptText: 'A steaming cup of coffee next to a laptop on a rainy morning.',
    promptContext: 'Describe what you see or feel in ONE English sentence within 5 seconds!',
    visualEmoji: '☕💻🌧️',
    timeLimitSeconds: 5,
    sampleIdealResponse: 'I love drinking hot coffee while working on my laptop on rainy mornings.',
    sampleIdealResponseHindi: 'बिना हिंदी सोचे तुरंत बोलें: I love drinking hot coffee while working on my laptop.'
  },
  {
    id: 'drill-2',
    type: 'tri-word',
    title: '3-Word Instant Sentence Challenge',
    titleRegional: '3 शब्द -> 1 तुरंत इंग्लिश वाक्य (10 सेकेंड)',
    promptText: 'Words: Airport • Passport • Urgent',
    promptContext: 'Combine all 3 words into ONE natural English sentence before time runs out!',
    visualEmoji: '✈️🛂⏱️',
    keywords: ['Airport', 'Passport', 'Urgent'],
    timeLimitSeconds: 10,
    sampleIdealResponse: 'I urgently need my passport before my flight at the airport.',
    sampleIdealResponseHindi: 'हिंदी में अनुवाद न करें, शब्दों को सीधे वाक्य में पिरोएं!'
  },
  {
    id: 'drill-3',
    type: 'instant-reaction',
    title: 'High-Pressure Situation Reaction',
    titleRegional: 'अचानक परिस्थिति में तुरंत अंग्रेजी प्रतिक्रिया',
    promptText: 'Someone accidentally spills tea on your shirt at work!',
    promptContext: 'React politely but firmly in English within 5 seconds.',
    visualEmoji: '☕👕⚠️',
    timeLimitSeconds: 5,
    sampleIdealResponse: 'Oh no! It is okay, but please be a bit careful next time.',
    sampleIdealResponseHindi: 'घबराएं नहीं, दिमाग में ट्रांसलेशन न करें, सीधे इंग्लिश में रिएक्ट करें!'
  },
  {
    id: 'drill-4',
    type: 'rapid-description',
    title: 'Traffic Jam Reflex',
    titleRegional: 'ट्रैफिक जाम की स्थिति पर त्वरित विचार',
    promptText: 'Stuck in a noisy city traffic jam on a hot afternoon.',
    promptContext: 'Express your frustration or plan in 1 English sentence.',
    visualEmoji: '🚗🚕☀️',
    timeLimitSeconds: 5,
    sampleIdealResponse: 'The traffic is heavy today so I might reach office fifteen minutes late.',
    sampleIdealResponseHindi: 'तुरंत रिएक्शन: The traffic is heavy today.'
  },
  {
    id: 'drill-5',
    type: 'tri-word',
    title: '3-Word Instant Sentence Challenge',
    titleRegional: '3 शब्द -> 1 तुरंत इंग्लिश वाक्य (10 सेकेंड)',
    promptText: 'Words: Doctor • Appointment • Cancel',
    promptContext: 'Combine Doctor, Appointment, and Cancel into one smooth English sentence.',
    visualEmoji: '🩺📅❌',
    keywords: ['Doctor', 'Appointment', 'Cancel'],
    timeLimitSeconds: 10,
    sampleIdealResponse: 'I called the hospital to cancel my doctor appointment for today.',
    sampleIdealResponseHindi: 'अंग्रेजी में सीधे सोचकर उत्तर दें!'
  },
  {
    id: 'drill-6',
    type: 'instant-reaction',
    title: 'Forgotten Wallet at Cash Counter',
    titleRegional: 'बिलिंग काउंटर पर पर्स भूल जाने पर तुरंत प्रतिक्रिया',
    promptText: 'You reach the cashier and realize you forgot your wallet at home!',
    promptContext: 'Tell the cashier politely in English to hold your items for 10 minutes.',
    visualEmoji: '🛒💳😱',
    timeLimitSeconds: 7,
    sampleIdealResponse: 'I am so sorry, I forgot my wallet at home. Could you please hold these items for 10 minutes while I pay online?',
    sampleIdealResponseHindi: 'बिना अटके सीधे बोलें!'
  }
];
