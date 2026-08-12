export interface PeerLearner {
  id: string;
  name: string;
  location: string;
  cefrLevel: string;
  nativeLanguage: string;
  avatarEmoji: string;
  interests: string[];
  totalPracticeMins: number;
  streakDays: number;
}

export interface VoiceClubTopic {
  id: string;
  title: string;
  category: 'General' | 'Career & Business' | 'Debate' | 'Culture & Travel';
  icebreakerQuestions: string[];
  suggestedVocab: { word: string; meaningHindi: string }[];
}

export const PEER_LEARNERS: PeerLearner[] = [
  {
    id: 'peer-1',
    name: 'Rohan Sharma',
    location: 'Mumbai, India',
    cefrLevel: 'B1 Intermediate',
    nativeLanguage: 'Hindi',
    avatarEmoji: '👨‍💻',
    interests: ['Software Dev', 'Tech Trends', 'Cricket'],
    totalPracticeMins: 140,
    streakDays: 8,
  },
  {
    id: 'peer-2',
    name: 'Priya Patel',
    location: 'Ahmedabad, India',
    cefrLevel: 'B2 Upper-Int',
    nativeLanguage: 'Gujarati / Hindi',
    avatarEmoji: '👩‍💼',
    interests: ['Digital Marketing', 'Startup Culture', 'Travel'],
    totalPracticeMins: 210,
    streakDays: 14,
  },
  {
    id: 'peer-3',
    name: 'Aarav Verma',
    location: 'Delhi NCR, India',
    cefrLevel: 'B1 Intermediate',
    nativeLanguage: 'Hindi',
    avatarEmoji: '👨‍🎓',
    interests: ['IELTS Exam Prep', 'World History', 'Movies'],
    totalPracticeMins: 95,
    streakDays: 5,
  },
  {
    id: 'peer-4',
    name: 'Kavya Nair',
    location: 'Bengaluru, India',
    cefrLevel: 'B2 Upper-Int',
    nativeLanguage: 'Malayalam / English',
    avatarEmoji: '👩‍🔬',
    interests: ['Biotech', 'Productivity Hacks', 'Podcasts'],
    totalPracticeMins: 320,
    streakDays: 21,
  },
  {
    id: 'peer-5',
    name: 'Siddharth Rao',
    location: 'Hyderabad, India',
    cefrLevel: 'B1 Intermediate',
    nativeLanguage: 'Telugu / Hindi',
    avatarEmoji: '🧑‍💼',
    interests: ['Finance & Stocks', 'Public Speaking', 'Fitness'],
    totalPracticeMins: 180,
    streakDays: 11,
  }
];

export const VOICE_CLUB_TOPICS: VoiceClubTopic[] = [
  {
    id: 'topic-1',
    title: 'Work-Life Balance vs Hustle Culture',
    category: 'Career & Business',
    icebreakerQuestions: [
      'Do you believe working 60+ hours a week is required for success?',
      'How do you relax and disconnect after a busy workday or study session?'
    ],
    suggestedVocab: [
      { word: 'Burnout', meaningHindi: 'अत्यधिक मानसिक या शारीरिक थकान' },
      { word: 'Prioritize', meaningHindi: 'प्राथमिकता देना' },
      { word: 'Boundary', meaningHindi: 'सीमा या दायरा निर्धारित करना' }
    ]
  },
  {
    id: 'topic-2',
    title: 'Favorite Travel Memory & Dream Destination',
    category: 'Culture & Travel',
    icebreakerQuestions: [
      'What is the most beautiful place you have visited in India or abroad?',
      'If you got a free ticket anywhere today, where would you fly?'
    ],
    suggestedVocab: [
      { word: 'Breathtaking', meaningHindi: 'अत्यंत खूबसूरत / लुभावना' },
      { word: 'Itinerary', meaningHindi: 'यात्रा का कार्यक्रम या योजना' },
      { word: 'Hospitable', meaningHindi: 'सत्कारशील / मेहमाननवाज़' }
    ]
  },
  {
    id: 'topic-3',
    title: 'AI & Automation: Future or Threat?',
    category: 'Debate',
    icebreakerQuestions: [
      'Will AI replace human jobs, or will it make us more creative?',
      'Which daily task would you love AI to handle for you?'
    ],
    suggestedVocab: [
      { word: 'Inevitable', meaningHindi: 'अपरिहार्य / जिसे टाला न जा सके' },
      { word: 'Revolutionize', meaningHindi: 'क्रांति ला देना' },
      { word: 'Productivity', meaningHindi: 'उत्पादकता' }
    ]
  },
  {
    id: 'topic-4',
    title: 'Childhood Nostalgia & Favorite Hobbies',
    category: 'General',
    icebreakerQuestions: [
      'What was your favorite outdoor game growing up as a child?',
      'If you could relive one year of your past, which year would it be?'
    ],
    suggestedVocab: [
      { word: 'Nostalgic', meaningHindi: 'पुरानी यादों में खोया हुआ' },
      { word: 'Carefree', meaningHindi: 'बेफिक्र / चिंतामुक्त' },
      { word: 'Cherish', meaningHindi: 'संजोकर रखना / महत्व देना' }
    ]
  }
];
