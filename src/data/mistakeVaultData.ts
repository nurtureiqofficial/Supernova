export interface MistakeItem {
  id: string;
  category: 'grammar' | 'pronunciation' | 'direct-translation' | 'vocabulary';
  categoryLabel: string;
  incorrectPhrase: string;
  correctPhrase: string;
  explanationHindi: string;
  srsLevel: number; // 0 (New), 1 (1 Day), 2 (3 Days), 3 (7 Days), 4 (14 Days), 5 (Mastered)
  nextReviewDate: string;
  masteryPercent: number;
  phoneticSpelling?: string;
}

export const INITIAL_MISTAKES: MistakeItem[] = [
  {
    id: 'mstk-1',
    category: 'grammar',
    categoryLabel: 'Grammar & Stative Verbs',
    incorrectPhrase: 'I am having two brothers and one sister.',
    correctPhrase: 'I have two brothers and one sister.',
    explanationHindi: 'Hindi mein "mere do bhai hain" bolte hain, lekin English mein rishte aur possession ke liye "have" bole, "having" nahi.',
    srsLevel: 1,
    nextReviewDate: 'Today',
    masteryPercent: 20,
    phoneticSpelling: '/aɪ hæv tuː ˈbrʌðəz/'
  },
  {
    id: 'mstk-2',
    category: 'grammar',
    categoryLabel: 'Preposition Redundancy',
    incorrectPhrase: 'We will discuss about the new project in the meeting.',
    correctPhrase: 'We will discuss the new project in the meeting.',
    explanationHindi: '"Discuss" ke sath "about" lagane ki zarurat nahi hoti. Direct object bole: "discuss the project".',
    srsLevel: 0,
    nextReviewDate: 'Today',
    masteryPercent: 0,
    phoneticSpelling: '/dɪˈskʌs ðə njuː ˈprɒʤɛkt/'
  },
  {
    id: 'mstk-3',
    category: 'direct-translation',
    categoryLabel: 'Direct Translation Glitch',
    incorrectPhrase: 'Myself Amit from Jaipur.',
    correctPhrase: 'My name is Amit / I am Amit from Jaipur.',
    explanationHindi: 'Reflexive pronoun "Myself" se sentence start karna grammatically galat hai. "My name is..." ya "I am..." kahein.',
    srsLevel: 2,
    nextReviewDate: 'In 2 days',
    masteryPercent: 40,
    phoneticSpelling: '/maɪ neɪm ɪz əˈmiːt/'
  },
  {
    id: 'mstk-4',
    category: 'vocabulary',
    categoryLabel: 'Professional Collocations',
    incorrectPhrase: 'Please revert back to my mail at the earliest.',
    correctPhrase: 'Please reply to my email at your earliest convenience.',
    explanationHindi: '"Revert" ka matlab wapas purani sthiti mein aana hota hai. Email ka jawab dene ke liye "reply" kahein.',
    srsLevel: 3,
    nextReviewDate: 'In 5 days',
    masteryPercent: 60,
    phoneticSpelling: '/pliːz rɪˈplaɪ tuː maɪ ˈiːmeɪl/'
  },
  {
    id: 'mstk-5',
    category: 'pronunciation',
    categoryLabel: 'Silent Letter Pronunciation',
    incorrectPhrase: 'I bought this on Wed-nes-day and got a re-ceipt.',
    correctPhrase: 'I bought this on Wednesday (/wɛnzdeɪ/) and got a receipt (/rɪˈsiːt/).',
    explanationHindi: 'Wednesday mein "d" silent hota hai (/wɛnzdeɪ/) aur Receipt mein "p" silent hota hai (/rɪˈsiːt/).',
    srsLevel: 1,
    nextReviewDate: 'Today',
    masteryPercent: 25,
    phoneticSpelling: '/ˈwɛnzdeɪ ænd rɪˈsiːt/'
  },
  {
    id: 'mstk-6',
    category: 'grammar',
    categoryLabel: 'Comparatives & Prepositions',
    incorrectPhrase: 'He is senior than me in the company.',
    correctPhrase: 'He is senior to me in the company.',
    explanationHindi: 'Latin words (Senior, Junior, Superior, Prefer) ke sath "than" nahi, "to" ka use karein.',
    srsLevel: 2,
    nextReviewDate: 'In 1 day',
    masteryPercent: 50,
    phoneticSpelling: '/hiː ɪz ˈsiːnjə tuː miː/'
  }
];
