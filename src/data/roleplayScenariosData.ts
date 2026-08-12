export interface RoleplayPersona {
  id: string;
  name: string;
  title: string;
  organization: string;
  avatarEmoji: string;
  accent: string;
  pressureLevel: 'Low' | 'Medium' | 'High';
  pressureColor: string;
  scenarioTitle: string;
  scenarioDescription: string;
  openingLine: string;
  suggestedHints: string[];
  evaluationCriteria: string[];
  regionalTutorAdvice: string;
  xpReward: number;
}

export const ROLEPLAY_PERSONAS: RoleplayPersona[] = [
  {
    id: 'marcus-tech',
    name: 'Mr. Marcus Vance',
    title: 'Senior Engineering Director',
    organization: 'Silicon Valley BigTech',
    avatarEmoji: '👨‍💼',
    accent: 'American Corporate (Fast & Direct)',
    pressureLevel: 'High',
    pressureColor: 'rose',
    scenarioTitle: 'High-Pressure Tech Failure & Conflict Interview',
    scenarioDescription: 'Face a tough technical director questioning a past project failure under pressure. Prove your engineering maturity and calm crisis management in English.',
    openingLine: 'Welcome to round 2. Let us skip the pleasantries. Tell me about a time a critical production server crashed under your watch, and why should I trust your engineering judgment today?',
    suggestedHints: [
      'Use the STAR Method (Situation, Task, Action, Result)',
      'Avoid filler words: "basically", "actually", "um"',
      'Acknowledge responsibility calmly and highlight the permanent fix implemented'
    ],
    evaluationCriteria: [
      'Poise & Stress Control under pressure',
      'Use of STAR Framework in spoken English',
      'Elimination of Hindi-English hesitation pauses'
    ],
    regionalTutorAdvice: 'Hindi Tip: घबराएं नहीं! "Basically" या "Actually" का प्रयोग बार-बार न करें। सीधे "The situation was..." से बोलना शुरू करें।',
    xpReward: 100
  },
  {
    id: 'sarah-client',
    name: 'Sarah Jenkins',
    title: 'VP of Product',
    organization: 'FinTech Global Solutions',
    avatarEmoji: '👩‍💻',
    accent: 'Fast-Paced US Client',
    pressureLevel: 'Medium',
    pressureColor: 'amber',
    scenarioTitle: 'Handling Demanding Client & Scope Creep Pushback',
    scenarioDescription: 'A demanding US client is upset about delayed sprint deliverables. Handle her pushback professionally without sounding defensive.',
    openingLine: 'Hi there! I just checked the release dashboard and half of our critical payment gateway deliverables are missing. Why was not this escalated earlier, and how are we fixing this by Friday?',
    suggestedHints: [
      'Acknowledge the client concern immediately ("I completely understand your urgency...")',
      'Provide a clear mitigation roadmap instead of making excuses',
      'Maintain an empathetic but assertive tone'
    ],
    evaluationCriteria: [
      'Professional Diplomacy & Empathy',
      'Action-Oriented Corporate Vocabulary',
      'Fluid Rhythm without long silence'
    ],
    regionalTutorAdvice: 'Hindi Tip: Client के सामने अधिक माफी न मांगें (Don\'t apologize excessively). समाधान पर ध्यान केंद्रित करें: "Here is our exact recovery plan..."',
    xpReward: 80
  },
  {
    id: 'vikram-border',
    name: 'Captain Vikram Malhotra',
    title: 'Chief Immigration Officer',
    organization: 'Heathrow Airport, London',
    avatarEmoji: '👮‍♂️',
    accent: 'Official British English',
    pressureLevel: 'High',
    pressureColor: 'rose',
    scenarioTitle: 'Airport Passport Control & Visa Verification',
    scenarioDescription: 'Pass through UK Border Control under probing questions. State your trip purpose, stay duration, and financial proof concisely.',
    openingLine: 'Good morning. Passports and landing cards, please. What is the exact purpose of your visit to the UK today, and where is your hotel booking confirmation?',
    suggestedHints: [
      'Give short, direct, 1-2 sentence answers',
      'State exact dates and company names clearly',
      'Avoid fidgeting or looking uncertain in speech'
    ],
    evaluationCriteria: [
      'Clarity of Direct Answers',
      'Formal Travel & Document Vocabulary',
      'Confidence Score'
    ],
    regionalTutorAdvice: 'Hindi Tip: एयरपोर्ट पर लंबी-चौड़ी कहानियां न सुनाएं। सटीक उत्तर दें: "I am visiting London for a 5-day business conference at..."',
    xpReward: 90
  },
  {
    id: 'ananya-hr',
    name: 'Ananya Roy',
    title: 'Global Talent Acquisition Lead',
    organization: 'McKinsey & Partner Group',
    avatarEmoji: '👩‍💼',
    accent: 'Indian Corporate Professional',
    pressureLevel: 'Medium',
    pressureColor: 'amber',
    scenarioTitle: 'Salary Offer Negotiation & CTC Counter-Offer',
    scenarioDescription: 'Negotiate your compensation package with a firm HR manager. Justify why your expertise warrants a higher CTC bracket.',
    openingLine: 'We are thrilled to extend an offer for the Senior Manager role! Our standard budget cap is 14 LPA. However, you requested 18 LPA. Can you justify why your experience commands a 30% premium above our grade limit?',
    suggestedHints: [
      'Anchor your value on quantifiable business outcomes (e.g. revenue boosted, team scaled)',
      'Use polite negotiation phrases: "Based on my market benchmark and proven track record in..."',
      'Express genuine enthusiasm for the role while holding firm on value'
    ],
    evaluationCriteria: [
      'Value-Based Spoken Persuasion',
      'Professional Negotiation Collocations',
      'Tone Balance (Polite yet Firm)'
    ],
    regionalTutorAdvice: 'Hindi Tip: Salary बातचीत में "I want more money" कहने के बजाय "Based on my specialized domain expertise and past ROI..." बोलें।',
    xpReward: 85
  },
  {
    id: 'evelyn-ielts',
    name: 'Dr. Evelyn Reed',
    title: 'Master IELTS / TOEFL Examiner',
    organization: 'British Academic Council',
    avatarEmoji: '👩‍🏫',
    accent: 'Received Pronunciation (RP British)',
    pressureLevel: 'Medium',
    pressureColor: 'amber',
    scenarioTitle: 'Official IELTS Speaking Test (Band 8+ Target)',
    scenarioDescription: 'Simulate a formal IELTS Speaking interview. Demonstrate advanced vocabulary, complex sentence structures, and zero hesitation.',
    openingLine: 'Good afternoon. Welcome to Part 2 of the IELTS Speaking Test. I will give you a cue card topic: "Describe an obstacle you overcame in your professional or academic life." You may begin speaking now.',
    suggestedHints: [
      'Use discourse markers: "To begin with", "Furthermore", "In hindsight", "Consequently"',
      'Vary your sentence structure (Mix simple, compound, and complex sentences)',
      'Keep speaking fluently for 90 to 120 seconds'
    ],
    evaluationCriteria: [
      'Fluency & Coherence (IELTS Band Criteria)',
      'Lexical Resource & Advanced Idioms',
      'Grammatical Range & Accuracy'
    ],
    regionalTutorAdvice: 'Hindi Tip: IELTS में छोटे वाक्यों के स्थान पर Connectors ("Not only... but also", "Whereas", "In spite of") का प्रयोग करें।',
    xpReward: 95
  },
  {
    id: 'nova-friendly',
    name: 'Ms. Nova AI',
    title: 'Lead ESL Conversation Coach',
    organization: 'Supernova AI Academy',
    avatarEmoji: '🌟',
    accent: 'Warm & Adaptive International English',
    pressureLevel: 'Low',
    pressureColor: 'emerald',
    scenarioTitle: 'Casual Coffee Chat & Daily Fluency Warmup',
    scenarioDescription: 'Enjoy a friendly, zero-judgment conversation with Nova. Practice natural expressions, hobbies, and weekend stories.',
    openingLine: 'Hey there! It is wonderful to see you today. How has your week been so far? Tell me about something fun or interesting that happened recently!',
    suggestedHints: [
      'Speak naturally and express your feelings freely',
      'Try using new vocabulary words you learned today',
      'Ask Nova a question back to keep the conversation flowing'
    ],
    evaluationCriteria: [
      'Natural Conversational Flow',
      'Expressive Intonation',
      'Confidence & Enjoyment'
    ],
    regionalTutorAdvice: 'Hindi Tip: यह मोड पूरी तरह से तनावमुक्त है! जो भी मन में आए बिना झिझक के खुलकर बोलें।',
    xpReward: 50
  }
];
