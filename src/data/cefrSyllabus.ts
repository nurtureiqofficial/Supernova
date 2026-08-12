import { CEFRLevelStage } from '../types';

export const CEFR_STAGES: CEFRLevelStage[] = [
  {
    code: 'A1',
    name: 'Breakthrough Beginner',
    description: 'Build confidence with greetings, travel, food ordering, market shopping, and fundamental grammar.',
    descriptionRegional: 'बुनियादी परिचय, यात्रा, ऑटो-कैब, रेस्टोरेंट में खाना आर्डर करना और ग्रामर मिस्टेक्स सुधारें।',
    color: 'from-emerald-500 to-teal-600',
    badgeIcon: '🌱',
    totalLessons: 11,
    completedLessons: 2,
    units: [
      {
        unitNumber: 1,
        unitTitle: 'Self-Introduction & Essential Greetings',
        unitTitleRegional: 'अपना परिचय और बधाई संदेश देना सीखें',
        description: 'Learn to speak smoothly when meeting new people or introducing yourself at work.',
        lessons: [
          {
            id: 'cefr-a1-u1-l1',
            title: 'Greeting & Introducing Yourself',
            titleRegional: 'नमस्ते और अपना नाम-काम बताना',
            speakingGoal: 'Confidently introduce your name, hometown, and profession in 3 sentences.',
            grammarFocus: 'Verb "To Be" (am, is, are) & Simple Present',
            vocabFocus: 'Greetings, professions, origin words',
            durationMins: 5,
            xpReward: 50,
            isCompleted: true,
            isCurrent: false,
            isLocked: false,
            targetPhrases: [
              'Hi, my name is Rajrup and I live in Patna.',
              'I work as a software professional.',
              'Nice to meet you!'
            ]
          },
          {
            id: 'cefr-a1-u1-l2',
            title: 'Talking About Family & Hobbies',
            titleRegional: 'परिवार और अपने शौक (Hobbies) के बारे में बोलें',
            speakingGoal: 'Describe your family members and what you like doing in free time.',
            grammarFocus: 'Possessive adjectives (my, his, her, our) & "like + -ing"',
            vocabFocus: 'Family ties, hobbies, sports, music',
            durationMins: 5,
            xpReward: 50,
            isCompleted: true,
            isCurrent: false,
            isLocked: false,
            targetPhrases: [
              'There are four members in my family.',
              'In my free time, I love listening to music.',
              'My brother works at a bank.'
            ]
          },
          {
            id: 'cefr-a1-u1-l3',
            title: 'Daily Routine & Time Expression',
            titleRegional: 'दिनचर्या और समय के बारे में बातचीत',
            speakingGoal: 'Explain your morning and evening daily routine clearly.',
            grammarFocus: 'Adverbs of frequency (always, usually, often, never)',
            vocabFocus: 'Clock time, morning habits, daily chores',
            durationMins: 6,
            xpReward: 60,
            isCompleted: false,
            isCurrent: true,
            isLocked: false,
            targetPhrases: [
              'I usually wake up at 7:00 AM.',
              'I always drink tea before starting work.',
              'I leave for office by 9:00 AM.'
            ]
          },
          {
            id: 'cefr-a1-u1-l4',
            title: 'Basic Phone Calls & Message Passing',
            titleRegional: 'फोन कॉल उठाना और मैसेज देना',
            speakingGoal: 'Answer phone calls politely, state who you are, and ask to speak to someone.',
            grammarFocus: 'Modal auxiliary "May I", "Can I speak with", "Who is calling"',
            vocabFocus: 'On line, hold on, leave a message, call back',
            durationMins: 6,
            xpReward: 60,
            isCompleted: false,
            isCurrent: false,
            isLocked: false,
            targetPhrases: [
              'Hello, may I speak with Mr. Sharma?',
              'Please hold on for a minute.',
              'Could you ask him to call me back?'
            ]
          }
        ]
      },
      {
        unitNumber: 2,
        unitTitle: 'Daily Life & Indian Context Scenarios',
        unitTitleRegional: 'रेस्टोरेंट, ऑटो-कैब, बाजार और यात्रा बातचीत',
        description: 'Order food, bargain with sellers, travel in autos/trains, and ask directions.',
        lessons: [
          {
            id: 'cefr-a1-u2-l1',
            title: 'Ordering Food & Drinks at a Cafe',
            titleRegional: 'कैफे/रेस्टोरेंट में ऑर्डर देना',
            speakingGoal: 'Order drinks or snacks politely and ask for the bill.',
            grammarFocus: 'Polite requests with "Would like" & "Could I have"',
            vocabFocus: 'Menu items, prices, dietary preferences',
            durationMins: 5,
            xpReward: 60,
            isCompleted: false,
            isCurrent: false,
            isLocked: false,
            targetPhrases: [
              'Could I have a cold coffee, please?',
              'Does this pizza contain mushrooms?',
              'How much is the total bill?'
            ]
          },
          {
            id: 'cefr-a1-u2-l2',
            title: 'Asking for Directions in a New City',
            titleRegional: 'रास्ता पूछना और बताना',
            speakingGoal: 'Ask passersby for street directions and understand location words.',
            grammarFocus: 'Prepositions of place (next to, opposite, near, turn left)',
            vocabFocus: 'Landmarks, directions, distance words',
            durationMins: 6,
            xpReward: 65,
            isCompleted: false,
            isCurrent: false,
            isLocked: false,
            targetPhrases: [
              'Excuse me, is there a metro station near here?',
              'Turn right after the traffic light.',
              'How far is the railway station from here?'
            ]
          },
          {
            id: 'cefr-a1-u2-l3',
            title: 'Talking About Yesterday (Simple Past)',
            titleRegional: 'बीते कल के बारे में बोलना',
            speakingGoal: 'Share 3 things you did yesterday or over the weekend.',
            grammarFocus: 'Regular & Irregular Past Tense verbs (went, bought, met)',
            vocabFocus: 'Past time indicators (yesterday, last night, ago)',
            durationMins: 6,
            xpReward: 70,
            isCompleted: false,
            isCurrent: false,
            isLocked: false,
            targetPhrases: [
              'Yesterday I met my school friend.',
              'We watched a movie together.',
              'I bought a new book from the market.'
            ]
          },
          {
            id: 'cefr-a1-u2-l4',
            title: 'Auto, Cab & Train Travel Conversations',
            titleRegional: 'ऑटो, कैब और ट्रेन में टिकट व किराया पूछना',
            speakingGoal: 'Book rides, state destinations, ask fare prices, and request stops.',
            grammarFocus: 'Question words (Where, How much, Can you) & imperatives',
            vocabFocus: 'Fare, meter, destination, platform, passenger, drop-off',
            durationMins: 6,
            xpReward: 70,
            isCompleted: false,
            isCurrent: false,
            isLocked: false,
            targetPhrases: [
              'How much will you charge to Connaught Place?',
              'Please turn on the meter.',
              'Please drop me near the main gate.'
            ]
          },
          {
            id: 'cefr-a1-u2-l5',
            title: 'Street Food & Restaurant Ordering (Indian Context)',
            titleRegional: 'ढाबे व स्ट्रीट फूड में तीखा/मीठा और पेमेंट की बात',
            speakingGoal: 'Order local dishes with custom spice levels, ask for extra plates, and pay via UPI.',
            grammarFocus: 'Polite imperatives with "please", "less/more", "can I get"',
            vocabFocus: 'Spicy, mild, mineral water, bill, takeaway, extra spoon, UPI',
            durationMins: 6,
            xpReward: 70,
            isCompleted: false,
            isCurrent: false,
            isLocked: false,
            targetPhrases: [
              'Please make it less spicy and bring two glasses.',
              'Could we get a bottle of packaged drinking water?',
              'Do you accept UPI or QR code payments here?'
            ]
          },
          {
            id: 'cefr-a1-u2-l6',
            title: 'Shopping & Bargaining with Market Vendors',
            titleRegional: 'सब्जी व कपड़े की दुकान में रेट कम कराना',
            speakingGoal: 'Inquire about prices, ask for discounts, and select items politely.',
            grammarFocus: 'Demonstratives (this, that, these, those) & price queries',
            vocabFocus: 'Discount, fixed price, quality, fresh, expensive, change',
            durationMins: 7,
            xpReward: 75,
            isCompleted: false,
            isCurrent: false,
            isLocked: false,
            targetPhrases: [
              'How much per kilo for these fresh apples?',
              'Can you give me a small discount on this shirt?',
              'I will take two pieces of this one, please.'
            ]
          }
        ]
      },
      {
        unitNumber: 3,
        unitTitle: 'Essential Grammar & Error Fixes',
        unitTitleRegional: 'भारतीय अंग्रेजी की आम गलतियों का सुधार',
        description: 'Fix prepositions, stop repeating useless words, and construct clean sentences.',
        lessons: [
          {
            id: 'cefr-a1-u3-l1',
            title: 'Prepositions & Common Indian English Mistakes Correction',
            titleRegional: 'Prepositions व भारतीय अंग्रेजी की गलतियों का सुधार',
            speakingGoal: 'Correct common preposition slips like "discuss about", "revert back", "on today".',
            grammarFocus: 'Correct prepositions of time & motion (in, at, on, to)',
            vocabFocus: 'Discuss, reply, attend, reach, today, yesterday',
            durationMins: 7,
            xpReward: 80,
            isCompleted: false,
            isCurrent: false,
            isLocked: false,
            targetPhrases: [
              'We will discuss the problem now (NOT "discuss about").',
              'I will reply to your message soon (NOT "revert back").',
              'I reached home at 8 PM yesterday.'
            ]
          }
        ]
      }
    ]
  },
  {
    code: 'A2',
    name: 'Elementary / Pre-Intermediate',
    description: 'Express past events, plans, describe symptoms at doctor, house rentals, and advice.',
    descriptionRegional: 'डॉक्टर से बीमारी की बात, किराए का घर ढूंढना, भविष्य की योजनाएं और सुझाव देना।',
    color: 'from-blue-500 to-indigo-600',
    badgeIcon: '🌿',
    totalLessons: 11,
    completedLessons: 0,
    units: [
      {
        unitNumber: 4,
        unitTitle: 'Expressing Future Plans & Wishes',
        unitTitleRegional: 'भविष्य के प्लान्स और इच्छाएं व्यक्त करना',
        description: 'Talk about weekend plans, vacation goals, and career intentions.',
        lessons: [
          {
            id: 'cefr-a2-u4-l1',
            title: 'Weekend Plans with "Going to"',
            titleRegional: 'वीकेंड की योजनाएं शेयर करना',
            speakingGoal: 'Tell a friend what you plan to do this coming weekend.',
            grammarFocus: 'Future intention with "be going to" & "planning to"',
            vocabFocus: 'Leisure activities, trips, social outings',
            durationMins: 6,
            xpReward: 70,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'This weekend I am going to visit my hometown.',
              'We are planning to cook dinner together.',
              'I hope to relax on Sunday afternoon.'
            ]
          },
          {
            id: 'cefr-a2-u4-l2',
            title: 'Describing Your Hometown & Weather',
            titleRegional: 'अपने शहर और मौसम का वर्णन',
            speakingGoal: 'Describe your favorite places in your town and current climate.',
            grammarFocus: 'Comparative adjectives (bigger, colder, more peaceful)',
            vocabFocus: 'Weather vocabulary, city features, tourism terms',
            durationMins: 6,
            xpReward: 75,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'My city is famous for its historical monuments.',
              'The winter weather here is pleasant and chilly.',
              'It is much quieter than metro cities.'
            ]
          },
          {
            id: 'cefr-a2-u4-l3',
            title: 'Handling Customer Support & Returns',
            titleRegional: 'ग्राहक सेवा से शिकायत व बात करना',
            speakingGoal: 'Explain an issue with a product or booking and request a solution.',
            grammarFocus: 'Polite modal verbs "Should", "Can", "Would"',
            vocabFocus: 'Refund, exchange, receipt, damage, defect',
            durationMins: 7,
            xpReward: 80,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'I received a damaged item in my package.',
              'Could you please arrange a replacement?',
              'Here is my order invoice number.'
            ]
          }
        ]
      },
      {
        unitNumber: 5,
        unitTitle: 'Doctor Visits, Health & Social Life',
        unitTitleRegional: 'डॉक्टर से बीमारी बताना, किराए का घर व पार्टियां',
        description: 'Explain symptoms to doctors, inquire about rental homes, and make small talk.',
        lessons: [
          {
            id: 'cefr-a2-u5-l1',
            title: 'Visiting a Doctor & Explaining Symptoms',
            titleRegional: 'डॉक्टर से बीमारी के लक्षण बताना',
            speakingGoal: 'Describe your physical symptoms clearly to a physician.',
            grammarFocus: 'Expressions with "I have a..." & "It hurts when..."',
            vocabFocus: 'Fever, headache, sore throat, prescription, medicine',
            durationMins: 6,
            xpReward: 75,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'I have had a mild fever since yesterday night.',
              'My throat aches when I swallow water.',
              'How many times a day should I take this pill?'
            ]
          },
          {
            id: 'cefr-a2-u5-l2',
            title: 'Doctor Visit & Detailed Health Explanations',
            titleRegional: 'डॉक्टर को रिपोर्ट, एलर्जी व परहेज की पूरी जानकारी देना',
            speakingGoal: 'Explain medical history, allergies, and lab reports confidently.',
            grammarFocus: 'Present Perfect for duration ("I have been suffering since...")',
            vocabFocus: 'Dosage, allergy, blood test, prescription, recovery, ache',
            durationMins: 7,
            xpReward: 80,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'I have been feeling dizzy since yesterday morning.',
              'I am allergic to penicillin antibiotics.',
              'How long will it take to get the blood test reports?'
            ]
          },
          {
            id: 'cefr-a2-u5-l3',
            title: 'Giving & Receiving Advice',
            titleRegional: 'सलाह देना और लेना (Should / Ought to)',
            speakingGoal: 'Suggest helpful solutions to a friend experiencing a problem.',
            grammarFocus: 'Advice structures "You should...", "If I were you..."',
            vocabFocus: 'Suggestions, options, stress management',
            durationMins: 7,
            xpReward: 80,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'You should take a short walk every evening.',
              'Why don\'t you try sleeping early tonight?',
              'If I were you, I would consult a professional.'
            ]
          },
          {
            id: 'cefr-a2-u5-l4',
            title: 'Making Small Talk at Parties',
            titleRegional: 'पार्टी और इवेंट्स में अनौपचारिक बात',
            speakingGoal: 'Break the ice with new colleagues or party guests.',
            grammarFocus: 'Question tags (isn\'t it?, don\'t you?) & open questions',
            vocabFocus: 'Small talk topics, compliments, hobbies',
            durationMins: 7,
            xpReward: 85,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'Great music here, isn\'t it?',
              'How do you know the host of the event?',
              'Have you tried the appetizers yet?'
            ]
          },
          {
            id: 'cefr-a2-u5-l5',
            title: 'Neighborhood & House Rental Inquiries',
            titleRegional: 'किराए का मकान ढूंढना व मकान मालिक से पूछताछ',
            speakingGoal: 'Ask house owners about rent, maintenance fees, water supply, and deposit.',
            grammarFocus: 'Wh-questions with "does it include", "how much is"',
            vocabFocus: 'Rent, deposit, furnished, maintenance, balcony, lease',
            durationMins: 7,
            xpReward: 85,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'Is the monthly maintenance included in the rent?',
              'Does the apartment have 24-hour water and power backup?',
              'When can I come to inspect the flat in person?'
            ]
          }
        ]
      },
      {
        unitNumber: 6,
        unitTitle: 'Social Life & Cultural Experiences',
        unitTitleRegional: 'त्योहार, तुलना करना और माफ़ी मांगना',
        description: 'Talk about festival celebrations, trip memories, comparisons, and apologies.',
        lessons: [
          {
            id: 'cefr-a2-u6-l1',
            title: 'Describing Past Vacations & Festival Celebrations',
            titleRegional: 'त्योहारों व यात्रा के सुखद अनुभवों का वर्णन',
            speakingGoal: 'Describe how you spent Diwali, Eid, or a hill-station trip with family.',
            grammarFocus: 'Past Continuous vs Simple Past ("While we were traveling, it rained")',
            vocabFocus: 'Festivities, decorations, traditional food, sightseeing, souvenirs',
            durationMins: 8,
            xpReward: 90,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'We celebrated Diwali with our entire extended family.',
              'While we were driving to Shimla, it started snowing.',
              'We tasted delicious local street food in Manali.'
            ]
          },
          {
            id: 'cefr-a2-u6-l2',
            title: 'Expressing Preferences & Making Comparisons',
            titleRegional: 'पसंद-नापसंद और तुलना करना (Prefer / Better than)',
            speakingGoal: 'Compare two products, habits, or places using clear comparative structures.',
            grammarFocus: 'Comparatives & Superlatives ("prefer X to Y", "much better than")',
            vocabFocus: 'Convenient, economical, spacious, reliable, comfortable',
            durationMins: 8,
            xpReward: 90,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'I prefer metro travel to driving in heavy traffic.',
              'Online shopping is much more convenient than visiting crowded malls.',
              'This laptop battery lasts much longer than my old one.'
            ]
          },
          {
            id: 'cefr-a2-u6-l3',
            title: 'Apologizing, Explaining Delays & Making Excuses',
            titleRegional: 'माफ़ी मांगना और देरी का कारण सलीके से बताना',
            speakingGoal: 'Apologize for being late or missing an event and provide a valid reason gracefully.',
            grammarFocus: 'Past continuous for background reason ("I got stuck in traffic")',
            vocabFocus: 'Apology, traffic jam, unavoidable delay, inconvenience, reschedule',
            durationMins: 8,
            xpReward: 90,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'I am extremely sorry for being late; there was heavy traffic.',
              'I got caught up in an urgent family matter.',
              'Thank you so much for your patience and understanding.'
            ]
          }
        ]
      }
    ]
  },
  {
    code: 'B1',
    name: 'Intermediate (Job & Workplace Ready)',
    description: 'Workplace meetings, job interviews, client calls, salary talks, email spoken vocab & active/passive voice.',
    descriptionRegional: 'इंटरव्यू, क्लाइंट मीटिंग, सैलरी नेगोशिएशन, ईमेल शब्दावली और Active/Passive voice।',
    color: 'from-amber-500 to-orange-600',
    badgeIcon: '🌳',
    totalLessons: 11,
    completedLessons: 0,
    units: [
      {
        unitNumber: 7,
        unitTitle: 'Professional Job Interview & Salary Mastery',
        unitTitleRegional: 'नौकरी के इंटरव्यू और सैलरी नेगोशिएशन की पूरी तैयारी',
        description: 'Pitch your experience, handle tricky interview questions, and negotiate salary offers.',
        lessons: [
          {
            id: 'cefr-b1-u7-l1',
            title: 'Tell Me About Yourself (Professional Elevator Pitch)',
            titleRegional: 'इंटरव्यू में अपना धमाकेदार परिचय दें',
            speakingGoal: 'Deliver a structured 60-second summary of your career background.',
            grammarFocus: 'Present Perfect vs Past Simple ("I have worked for 3 years")',
            vocabFocus: 'Skillsets, domain knowledge, achievements, strengths',
            durationMins: 8,
            xpReward: 100,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'I bring over 3 years of hands-on experience in software development.',
              'In my previous role, I successfully led a team project.',
              'I am eager to contribute my skills to your organization.'
            ]
          },
          {
            id: 'cefr-b1-u7-l2',
            title: 'Answering Strengths & Weaknesses',
            titleRegional: 'ताकत और कमियों को सलीके से बताएं',
            speakingGoal: 'Explain a weakness constructively and showcase continuous growth.',
            grammarFocus: 'Conjunctions of contrast (However, Although, On the other hand)',
            vocabFocus: 'Self-awareness, resilience, adaptability, learning curve',
            durationMins: 8,
            xpReward: 100,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'My core strength is analytical problem solving under pressure.',
              'Earlier I struggled with delegation, but now I use task trackers.',
              'I consistently strive to upgrade my technical skill set.'
            ]
          },
          {
            id: 'cefr-b1-u7-l3',
            title: 'Handling "Why Should We Hire You?"',
            titleRegional: 'कंपनी आपको क्यों चुने? सटीक जवाब',
            speakingGoal: 'Match your background directly with company goals.',
            grammarFocus: 'First Conditional ("If you hire me, I will...")',
            vocabFocus: 'Value addition, dedication, team synergy',
            durationMins: 8,
            xpReward: 110,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'My skill set directly aligns with your project requirements.',
              'I am self-motivated and thrive in fast-paced team settings.',
              'I am confident I can add immediate value to your team.'
            ]
          },
          {
            id: 'cefr-b1-u7-l4',
            title: 'Salary & Job Offer Negotiation Basics',
            titleRegional: 'सैलरी ऑफर और CTC पर प्रोफेशनल बातचीत',
            speakingGoal: 'Discuss compensation packages, notice periods, and joining dates professionally.',
            grammarFocus: 'Conditional expressions ("Based on my current CTC", "If we can align on...")',
            vocabFocus: 'CTC breakdown, variable pay, notice period, relocation, counter-offer',
            durationMins: 8,
            xpReward: 110,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'Thank you for extending this job offer.',
              'Considering my relevant industry experience, I was expecting a higher base pay.',
              'Could you clarify the fixed versus variable components of the CTC?'
            ]
          }
        ]
      },
      {
        unitNumber: 8,
        unitTitle: 'Workplace Meetings & Client Communication',
        unitTitleRegional: 'ऑफिस मीटिंग्स, क्लाइंट कॉल्स और ईमेल शब्दावली',
        description: 'Participate actively in meetings, lead client calls, and master Slack/email spoken vocab.',
        lessons: [
          {
            id: 'cefr-b1-u8-l1',
            title: 'Expressing Opinions & Disagreeing Politely',
            titleRegional: 'अपनी राय रखना व विनम्रता से असहमति',
            speakingGoal: 'State your perspective without sounding aggressive in workplace debates.',
            grammarFocus: 'Softening phrases ("In my opinion", "I see your point, but...")',
            vocabFocus: 'Perspective, viewpoint, alternative solution, trade-off',
            durationMins: 7,
            xpReward: 90,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'From my perspective, we should focus on quality first.',
              'I understand your point; however, the timeline might be tight.',
              'Could we consider an alternative approach?'
            ]
          },
          {
            id: 'cefr-b1-u8-l2',
            title: 'Giving Project Status Updates',
            titleRegional: 'प्रोजेक्ट का स्टेटस अपडेट देना',
            speakingGoal: 'Give a 2-minute status report on completed tasks and pending blockers.',
            grammarFocus: 'Present Continuous & Present Perfect Continuous',
            vocabFocus: 'Milestones, deliverables, roadblocks, ETA, sync-up',
            durationMins: 8,
            xpReward: 95,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'We have completed 80% of the initial module.',
              'Currently we are working on resolving the database latency.',
              'We expect to launch the build by Thursday afternoon.'
            ]
          },
          {
            id: 'cefr-b1-u8-l3',
            title: 'Asking Clarifying Questions in Call',
            titleRegional: 'मीटिंग में समझ न आने पर सवाल पूछना',
            speakingGoal: 'Ask colleagues or international clients to repeat or rephrase points.',
            grammarFocus: 'Polite clarification structures ("Would you mind repeating...", "Do you mean...")',
            vocabFocus: 'Clarification, elaboration, key takeaway, audio check',
            durationMins: 7,
            xpReward: 90,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'Could you please elaborate on that last point?',
              'Just to clarify, are we targeting next week\'s release?',
              'Sorry, you broke up for a second. Could you repeat that?'
            ]
          },
          {
            id: 'cefr-b1-u8-l4',
            title: 'Handling Client Meetings & Client Calls',
            titleRegional: 'क्लाइंट के साथ मीटिंग व फोन कॉल्स हैंडल करना',
            speakingGoal: 'Lead a professional introductory call with a corporate client and note requirements.',
            grammarFocus: 'Modal verbs of possibility & courtesy ("We would be happy to help", "May I confirm")',
            vocabFocus: 'Client requirements, scope of work, timeline, deliverables, touchpoint',
            durationMins: 8,
            xpReward: 100,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'Thank you for joining today\'s call.',
              'We would be delighted to partner with your team.',
              'Let me summarize the action points from today\'s call.'
            ]
          },
          {
            id: 'cefr-b1-u8-l5',
            title: 'Professional Email & Slack Spoken Vocabulary',
            titleRegional: 'ऑफिस चैट व ईमेल में बोले जाने वाले फॉर्मल शब्द',
            speakingGoal: 'Verbally discuss work tickets, Slack threads, and email follow-ups with colleagues.',
            grammarFocus: 'Passive reporting verbs ("It was brought to my attention", "As requested")',
            vocabFocus: 'Loop in, follow up, action item, priority, thread, sync up, heads up',
            durationMins: 8,
            xpReward: 100,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'I will loop in the tech lead on this email thread.',
              'Just giving you a quick heads-up about tomorrow\'s audit.',
              'Let us sync up after lunch to review the draft.'
            ]
          }
        ]
      },
      {
        unitNumber: 9,
        unitTitle: 'Workplace Grammar & Diplomacy',
        unitTitleRegional: 'ऑफिस में Active/Passive voice व फीडबैक देना',
        description: 'Master passive voice for diplomatic status reports and acknowledge mistakes constructively.',
        lessons: [
          {
            id: 'cefr-b1-u9-l1',
            title: 'Active vs Passive Voice in Daily Speaking',
            titleRegional: 'दैनिक बोलचाल में Active vs Passive Voice का सही प्रयोग',
            speakingGoal: 'Use passive voice appropriately for diplomacy and formal status reports.',
            grammarFocus: 'Passive constructions ("The bug has been fixed", "You will be notified")',
            vocabFocus: 'Resolved, dispatched, verified, processed, approved',
            durationMins: 8,
            xpReward: 100,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'The payment has been successfully processed by the gateway.',
              'All team members have been notified about the schedule shift.',
              'The report was submitted yesterday afternoon.'
            ]
          },
          {
            id: 'cefr-b1-u9-l2',
            title: 'Handling Mistakes & Giving Professional Feedback',
            titleRegional: 'काम में हुई गलती स्वीकारना व फीडबैक देना',
            speakingGoal: 'Acknowledge an operational oversight and propose immediate corrective measures.',
            grammarFocus: 'Modals of past regret/responsibility ("I should have double-checked")',
            vocabFocus: 'Oversight, corrective action, lesson learned, root cause, preventative measure',
            durationMins: 8,
            xpReward: 105,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'I take full responsibility for this oversight.',
              'We have already initiated corrective measures to prevent recurrences.',
              'Here is what we learned from this release.'
            ]
          }
        ]
      }
    ]
  },
  {
    code: 'B2',
    name: 'Upper-Intermediate (Fluency & Precision)',
    description: 'Complex discussions, storytelling, idioms & phrasal verbs, townhalls & conditional sentences.',
    descriptionRegional: 'मुहावरे (Idioms), प्रेजेंटेशन, टाउनहॉल टॉक्स और कंडीशनल सेंटेंसेस (If/Would/Had)।',
    color: 'from-purple-500 to-pink-600',
    badgeIcon: '🔥',
    totalLessons: 11,
    completedLessons: 0,
    units: [
      {
        unitNumber: 10,
        unitTitle: 'Idioms, Phrasal Verbs & Natural Expressions',
        unitTitleRegional: 'अंग्रेजी मुहावरे और फ्रेसल वर्ब्स का प्रयोग',
        description: 'Sound natural like native speakers using professional idioms and everyday phrasal verbs.',
        lessons: [
          {
            id: 'cefr-b2-u10-l1',
            title: 'Essential Corporate Idioms',
            titleRegional: 'ऑफिस में इस्तेमाल होने वाले मशहूर Idioms',
            speakingGoal: 'Incorporate idioms like "touch base", "ballpark figure", "hit the ground running".',
            grammarFocus: 'Idiomatic context & figurative language',
            vocabFocus: 'Idiomatic expressions, business slang',
            durationMins: 8,
            xpReward: 110,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'Let\'s touch base on this project tomorrow morning.',
              'Could you give me a ballpark figure for the budget?',
              'We need to think outside the box to solve this issue.'
            ]
          },
          {
            id: 'cefr-b2-u10-l2',
            title: 'Mastering Everyday Phrasal Verbs',
            titleRegional: 'Phrasal Verbs (Carry out, Figure out, Call off)',
            speakingGoal: 'Use phrasal verbs naturally instead of formal single verbs.',
            grammarFocus: 'Separable & Inseparable Phrasal Verbs',
            vocabFocus: 'Look into, figure out, come up with, run into',
            durationMins: 8,
            xpReward: 110,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'I need to figure out why the system crashed.',
              'She came up with a brilliant marketing strategy.',
              'We had to call off the outdoor meeting due to rain.'
            ]
          },
          {
            id: 'cefr-b2-u10-l3',
            title: 'Storytelling & Narrating Personal Experiences',
            titleRegional: 'कहानी या अनुभव को रोचक तरीके से सुनाना',
            speakingGoal: 'Tell an engaging story with dramatic pauses, connectors, and climax.',
            grammarFocus: 'Past Continuous & Past Perfect ("When I arrived, they had already left")',
            vocabFocus: 'Narrative transition words (Suddenly, To my surprise, In the end)',
            durationMins: 9,
            xpReward: 120,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'It was a stormy evening when my flight got delayed.',
              'To my surprise, the hotel manager upgraded our room for free.',
              'Looking back now, it was a truly unforgettable journey.'
            ]
          }
        ]
      },
      {
        unitNumber: 11,
        unitTitle: 'High-Impact Presentations & Townhalls',
        unitTitleRegional: 'प्रभावशाली प्रेजेंटेशन, टाउनहॉल और कंडीशनल सेंटेंस',
        description: 'Hook your audience, present charts and metrics, answer Q&A, and master conditionals.',
        lessons: [
          {
            id: 'cefr-b2-u11-l1',
            title: 'Opening a Presentation & Hooking the Audience',
            titleRegional: 'प्रेजेंटेशन की दमदार शुरुआत कैसे करें',
            speakingGoal: 'Deliver a compelling 30-second presentation intro that captures attention.',
            grammarFocus: 'Rhetorical questions & signposting language',
            vocabFocus: 'Audience engagement, topic overview, agenda setting',
            durationMins: 9,
            xpReward: 120,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'Good morning everyone, today I want to share three game-changing insights.',
              'Have you ever wondered why customer retention drops by 20%?',
              'By the end of this session, you will know exactly how to scale.'
            ]
          },
          {
            id: 'cefr-b2-u11-l2',
            title: 'Describing Data, Charts & Growth Trends',
            titleRegional: 'डाटा, चार्ट्स और आंकड़ों का वर्णन',
            speakingGoal: 'Describe graphs using precise verbs ("surged", "plunged", "stabilized").',
            grammarFocus: 'Adverbs of degree & trend verbs',
            vocabFocus: 'Sharp increase, gradual decline, peak, fluctuate, plateau',
            durationMins: 9,
            xpReward: 125,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'As you can see on this chart, sales surged by 35% in Q3.',
              'User engagement hit an all-time peak during the holiday season.',
              'Costs stabilized after we streamlined the logistics pipeline.'
            ]
          },
          {
            id: 'cefr-b2-u11-l3',
            title: 'Handling Tough Q&A & Challenging Questions',
            titleRegional: 'कठिन सवालों के निडरता से जवाब देना',
            speakingGoal: 'Buy time gracefully and address tough audience questions professionally.',
            grammarFocus: 'Hypothetical conditionals & stalling strategies',
            vocabFocus: 'Insightful question, off-line discussion, follow-up',
            durationMins: 10,
            xpReward: 130,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'That is a very insightful question. Let me break it down into two parts.',
              'While we don\'t have exact figures today, our preliminary data shows positive trends.',
              'I would be happy to discuss that specific case offline after the talk.'
            ]
          },
          {
            id: 'cefr-b2-u11-l4',
            title: 'Giving High-Impact Project Updates & Townhall Talks',
            titleRegional: 'कंपनी टाउनहॉल में प्रोजेक्ट अपडेट व उपलब्धियां बोलना',
            speakingGoal: 'Present quarterly business achievements to senior leaders with confidence.',
            grammarFocus: 'Emphatic structures ("What really drove our growth was...")',
            vocabFocus: 'Quarterly goals, key performance indicators (KPIs), bottleneck, scaling',
            durationMins: 9,
            xpReward: 130,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'What really accelerated our growth this quarter was customer satisfaction.',
              'We successfully eliminated two major operational bottlenecks.',
              'Our key priority for next quarter is expanding market reach.'
            ]
          },
          {
            id: 'cefr-b2-u11-l5',
            title: 'Mastering Conditional Sentences (If / Would / Had)',
            titleRegional: 'कंडीशनल सेंटेंस में महारत (If / Would / Had / Unreal Situations)',
            speakingGoal: 'Form 2nd and 3rd conditional sentences seamlessly during discussions.',
            grammarFocus: 'Second & Third Conditionals ("If we had known earlier, we would have avoided...")',
            vocabFocus: 'Hypothetical scenario, alternative outcome, contingency, foresight',
            durationMins: 9,
            xpReward: 135,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'If we had launched the campaign last month, we would have captured more leads.',
              'Had we tested the server thoroughly, this outage would not have occurred.',
              'If I were in your position, I would renegotiate the SLA.'
            ]
          }
        ]
      },
      {
        unitNumber: 12,
        unitTitle: 'Strategic Leadership & Brainstorming',
        unitTitleRegional: 'सीनियर नेगोशिएशन और टीम मतभेद सुलझाना',
        description: 'Negotiate senior leadership perks, resolve cross-functional friction, and lead pitch sessions.',
        lessons: [
          {
            id: 'cefr-b2-u12-l1',
            title: 'Advanced Job Offer & Senior Package Negotiation',
            titleRegional: 'सीनियर पद के लिए सैलरी, ESOPs व पर्क्स की नेगोशिएशन',
            speakingGoal: 'Negotiate equity, ESOPs, performance bonuses, and remote work flexibility.',
            grammarFocus: 'Complex indirect diplomatic requests',
            vocabFocus: 'ESOPs, joining bonus, performance appraisal, severance, flexibility',
            durationMins: 10,
            xpReward: 140,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'I am keen on joining, provided we can bridge the gap regarding stock options.',
              'Is there flexibility regarding remote work arrangements?',
              'I believe my track record justifies an adjustment in the fixed component.'
            ]
          },
          {
            id: 'cefr-b2-u12-l2',
            title: 'Handling Cross-Functional Conflicts & Team Friction',
            titleRegional: 'टीमों के बीच मतभेद व विवाद सुलझाना',
            speakingGoal: 'Mediate differences between product, engineering, and sales teams constructively.',
            grammarFocus: 'Diplomatic framing ("I appreciate your constraints, but our dependency...")',
            vocabFocus: 'Alignment, dependency, compromise, escalation, mutual consensus',
            durationMins: 10,
            xpReward: 140,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'I completely appreciate your bandwidth constraints; however, this blocker affects launch.',
              'Let us align our priorities to reach a workable consensus.',
              'How can we partner together to resolve this dependency?'
            ]
          },
          {
            id: 'cefr-b2-u12-l3',
            title: 'Pitching New Ideas & Brainstorming Facilitation',
            titleRegional: 'नए आइडियाज की पिचिंग और ब्रेनस्टॉर्मिंग सत्र',
            speakingGoal: 'Lead an interactive idea-generation session and pitch a new project proposal.',
            grammarFocus: 'Infinitive/Gerund intention phrases ("What if we tried...", "How about leveraging...")',
            vocabFocus: 'Brainstorming, paradigm shift, feasibility, pilot project, proof of concept',
            durationMins: 10,
            xpReward: 145,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'What if we piloted this feature with 5% of our user base first?',
              'How about leveraging automation to reduce manual entry?',
              'Let us run a feasibility study before committing resources.'
            ]
          }
        ]
      }
    ]
  },
  {
    code: 'C1',
    name: 'Advanced Mastery & Native Nuance',
    description: 'Master spontaneous debate, public speaking, accent polish, cross-cultural communication & metaphors.',
    descriptionRegional: 'डिबेट, पब्लिक स्पीकिंग, एक्सेंट पॉलिश (Accent Polish) और रूपक (Metaphors) में महारत।',
    color: 'from-red-500 to-rose-600',
    badgeIcon: '👑',
    totalLessons: 8,
    completedLessons: 0,
    units: [
      {
        unitNumber: 13,
        unitTitle: 'High-Stakes Debate, Nuance & Public Speaking',
        unitTitleRegional: 'हाई-स्टेक्स डिबेट, पब्लिक स्पीकिंग और एडवांस Idioms',
        description: 'Negotiate complex deals, win arguments politely, and speak persuasively on stage.',
        lessons: [
          {
            id: 'cefr-c1-u13-l1',
            title: 'Tactful Negotiation & Counter-Offers',
            titleRegional: 'डिस्कस और बिजनेस डील नेगोशिएशन',
            speakingGoal: 'Propose win-win compromises without sacrificing key objectives.',
            grammarFocus: 'Subjunctive & cautious language ("We would be open to...")',
            vocabFocus: 'Leverage, concession, non-negotiable, compromise, win-win',
            durationMins: 10,
            xpReward: 140,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'We would be willing to adjust the pricing provided you extend the contract tenure.',
              'That offer falls slightly short of our baseline expectations.',
              'If we can reach a consensus on item B, we have a deal.'
            ]
          },
          {
            id: 'cefr-c1-u13-l2',
            title: 'Spontaneous Debate & Defending Ideas',
            titleRegional: 'बिना तैयारी के बहस में मजबूत तर्क देना',
            speakingGoal: 'Refute an opponent\'s argument logically within 10 seconds of listening.',
            grammarFocus: 'Inversion for emphasis ("Not only did we succeed, but...")',
            vocabFocus: 'Counter-argument, fallacy, premise, substantiation, impact',
            durationMins: 10,
            xpReward: 150,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'While that premise sounds appealing initially, the underlying numbers contradict it.',
              'Not only does this approach reduce overhead, but it also boosts morale.',
              'Let us examine the long-term ramifications before deciding.'
            ]
          },
          {
            id: 'cefr-c1-u13-l3',
            title: 'Nuanced Expression & Humor in Speech',
            titleRegional: 'बातचीत में सूक्ष्मता, हास्य और व्यंग्य का प्रयोग',
            speakingGoal: 'Use understatement, mild irony, and cultural nuance naturally.',
            grammarFocus: 'Advanced idiom registers & cultural humor codes',
            vocabFocus: 'Understatement, sarcasm, irony, cultural context, banter',
            durationMins: 10,
            xpReward: 150,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'Well, saying the weather was unpleasant is a bit of an understatement!',
              'It was quite a chaotic morning, to say the least.',
              'I suppose we got slightly more than we bargained for!'
            ]
          },
          {
            id: 'cefr-c1-u13-l4',
            title: 'Advanced Idioms & Phrasal Verbs in Daily Talk',
            titleRegional: 'हाई-लेवल अंग्रेजी मुहावरे और नेटिव फ्रेज',
            speakingGoal: 'Seamlessly integrate sophisticated native idioms into fast-paced conversation.',
            grammarFocus: 'High-register figurative speech & idiomatic collocations',
            vocabFocus: 'Bite the bullet, burn the midnight oil, play devil\'s advocate, blessing in disguise',
            durationMins: 10,
            xpReward: 150,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'Let me play devil\'s advocate for a moment to stress-test this strategy.',
              'The initial delay turned out to be a blessing in disguise.',
              'We had to bite the bullet and rewrite the legacy codebase.'
            ]
          },
          {
            id: 'cefr-c1-u13-l5',
            title: 'Public Speaking, Debates & Expressing Strong Opinions',
            titleRegional: 'स्टेज स्पीकिंग, डिबेट और मजबूत राय रखना',
            speakingGoal: 'Deliver an inspiring keynote speech or debate stance using cadence and conviction.',
            grammarFocus: 'Anaphora, rule of three, and dramatic rhetorical pauses',
            vocabFocus: 'Conviction, paradigm, cornerstone, unprecedented, eloquence',
            durationMins: 10,
            xpReward: 155,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'The true cornerstone of innovation lies not in speed, but in adaptability.',
              'We stand at an unprecedented crossroads in our industry.',
              'Allow me to state unequivocally why this vision matters.'
            ]
          }
        ]
      },
      {
        unitNumber: 14,
        unitTitle: 'Global Executive Presence & Crisis Control',
        unitTitleRegional: 'विदेशी क्लाइंट्स एक्सेंट ट्यूनिंग व संकट में भाषण',
        description: 'Tune your accent for global partners, handle crisis communication, and use storytelling metaphors.',
        lessons: [
          {
            id: 'cefr-c1-u14-l1',
            title: 'Cross-Cultural Communication & Accent Polish',
            titleRegional: 'विदेशी क्लाइंट्स के साथ भाषा व टोन का तालमेल (Accent Polish)',
            speakingGoal: 'Adapt tone, pace, and pronunciation for US, UK, and European international partners.',
            grammarFocus: 'Intonation patterns, word stress, connected speech, and softening',
            vocabFocus: 'Cultural etiquette, connected speech, glottal stop, word stress, empathy',
            durationMins: 10,
            xpReward: 160,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'I appreciate you bringing this cultural nuance to my attention.',
              'Adjusting our communication cadence ensures seamless global collaboration.',
              'Let us adopt a consultative tone for our North American partners.'
            ]
          },
          {
            id: 'cefr-c1-u14-l2',
            title: 'Managing Crisis Communication & Press Releases',
            titleRegional: 'संकट के समय कंपनी का पक्ष रखना और मीडिया सवाल संभालना',
            speakingGoal: 'Speak authoritatively during system outages, security breaches, or organizational crises.',
            grammarFocus: 'Controlled, formal, reassuring structures',
            vocabFocus: 'Crisis management, transparency, mitigation, stakeholder confidence, breach',
            durationMins: 10,
            xpReward: 160,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'Our top priority is maintaining complete transparency with all stakeholders.',
              'Immediate containment protocols were activated within minutes.',
              'We deeply regret any disruption and are working around the clock.'
            ]
          },
          {
            id: 'cefr-c1-u14-l3',
            title: 'Mastering High-Level Persuasion & Metaphors',
            titleRegional: 'रूपक (Metaphors) और कहानियों से प्रभाव जमाना',
            speakingGoal: 'Use extended metaphors and evocative analogies to persuade senior stakeholders.',
            grammarFocus: 'Analogy structures ("Much like building a bridge...", "Consider it as...")',
            vocabFocus: 'Analogy, metaphor, resonance, evocative, narrative arc',
            durationMins: 10,
            xpReward: 165,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'Building this platform is much like constructing a skyscraper; foundation is everything.',
              'We are navigating uncharted waters, but our compass remains clear.',
              'Consider this initial investment as the catalyst for long-term compound growth.'
            ]
          }
        ]
      }
    ]
  },
  {
    code: 'C2',
    name: 'Executive Mastery & Native-Like Fluency',
    description: 'Humor, sarcasm, informal native slang, executive boardroom presence & effortless spontaneity.',
    descriptionRegional: 'हास्य, व्यंग्य, नेटिव Slang और बोर्डरूम-लेवल लीडरशिप स्पीकिंग में महारत।',
    color: 'from-purple-600 via-fuchsia-600 to-amber-500',
    badgeIcon: '💎',
    totalLessons: 5,
    completedLessons: 0,
    units: [
      {
        unitNumber: 15,
        unitTitle: 'Humor, Sarcasm, Native Slang & Executive Wit',
        unitTitleRegional: 'हास्य, व्यंग्य, नेटिव Slang और लीडरशिप का अंदाज',
        description: 'Command boardroom meetings, use native humor/slang, and de-escalate hostility with wit.',
        lessons: [
          {
            id: 'cefr-c2-u15-l1',
            title: 'Humor, Sarcasm & Informal Native Slang in Daily Talk',
            titleRegional: 'नेटिव दोस्तों व सहकर्मियों के साथ चुटकुले व Slang',
            speakingGoal: 'Understand and use witty banter, mild sarcasm, and contemporary colloquialisms appropriately.',
            grammarFocus: 'Subtle intonation shifts, deadpan delivery, and conversational rhythm',
            vocabFocus: 'Banter, deadpan, witty, off the cuff, colloquialism, tongue-in-cheek',
            durationMins: 10,
            xpReward: 170,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'Well, that went smooth as butter—if butter was made of sandpaper!',
              'Off the top of my head, I\'d say we survived another chaotic Monday.',
              'All jokes aside, that was a remarkably clever solution.'
            ]
          },
          {
            id: 'cefr-c2-u15-l2',
            title: 'Executive Boardroom Presence & Strategic Storytelling',
            titleRegional: 'बोर्डरूम और इन्वेस्टर्स के सामने लीडर की तरह बोलना',
            speakingGoal: 'Address board members and venture capitalists with commanding poise and clarity.',
            grammarFocus: 'Declarative cadence & high-impact brevity',
            vocabFocus: 'Fiduciary duty, unit economics, moat, strategic imperative, vision',
            durationMins: 10,
            xpReward: 175,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'Our strategic imperative is clear: capture market share while preserving gross margins.',
              'This product feature forms an unassailable competitive moat.',
              'I welcome your scrutiny on our financial projections.'
            ]
          },
          {
            id: 'cefr-c2-u15-l3',
            title: 'Fast Connected Speech & High-Speed Discussions',
            titleRegional: 'तेज़ रफ्तार नेटिव बातचीत बिना किसी रुकावट के समझना व बोलना',
            speakingGoal: 'Keep up with rapid multi-party debates and respond spontaneously without hesitation.',
            grammarFocus: 'Elision, assimilation, reduced vowels, and natural speed flow',
            vocabFocus: 'Interruption handling, floor holding, rapid fire, cadence',
            durationMins: 10,
            xpReward: 175,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'If I may jump in right there, that assumes static market conditions.',
              'Let us not lose sight of the primary objective amidst the detail.',
              'I completely concur with that assessment; let us execute immediately.'
            ]
          },
          {
            id: 'cefr-c2-u15-l4',
            title: 'Diplomatic De-escalation & Handling Hostile Interrogations',
            titleRegional: 'आक्रामक सवालों व तनावपूर्ण माहौल को शांति से संभालना',
            speakingGoal: 'Defuse hostile questions or angry clients with unflappable calm and executive grace.',
            grammarFocus: 'Neutralizing vocabulary & emotional detachment',
            vocabFocus: 'De-escalation, composure, empathy, reframing, neutral ground',
            durationMins: 10,
            xpReward: 180,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'I hear your frustration loud and clear, and I am personally committed to fixing this.',
              'Let us strip away the emotion and look directly at the facts on the table.',
              'Your feedback is entirely valid; here is how we will address it right now.'
            ]
          },
          {
            id: 'cefr-c2-u15-l5',
            title: 'Authentic Thought Leadership & Inspiring Keynote Addresses',
            titleRegional: 'विचार नेतृत्व (Thought Leadership) व प्रेरणादायक भाषण',
            speakingGoal: 'Deliver a memorable, emotionally resonant keynote address that inspires action.',
            grammarFocus: 'Mastery of cadence, pause, tone modulation, and rhetorical climax',
            vocabFocus: 'Inspiration, legacy, paradigm, transformation, call to action',
            durationMins: 10,
            xpReward: 185,
            isCompleted: false,
            isCurrent: false,
            isLocked: true,
            targetPhrases: [
              'True leadership is not measured by authority, but by the empowerment of others.',
              'We are not merely building software; we are shaping the future of communication.',
              'I invite each of you to join us on this transformative journey.'
            ]
          }
        ]
      }
    ]
  }
];
