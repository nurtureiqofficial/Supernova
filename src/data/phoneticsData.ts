export interface PhoneticSoundChallenge {
  id: string;
  category: 'v-vs-w' | 's-vs-sh' | 'th-sounds' | 'silent-letters' | 'syllable-stress' | 'p-vs-f';
  categoryTitle: string;
  categoryTitleRegional: string;
  targetWord: string;
  contrastWord?: string;
  ipa: string;
  phoneticRespelling: string;
  regionalRespelling: string;
  mouthGuide: string;
  mouthGuideRegional: string;
  exampleSentence: string;
  shadowingPhrases: {
    phrase: string;
    ipa: string;
    stressedWords: string[];
    linkingTips: string;
  }[];
}

export const PHONETICS_CHALLENGES: PhoneticSoundChallenge[] = [
  {
    id: 'ph-1',
    category: 'v-vs-w',
    categoryTitle: 'V vs W Sounds (वेक्टर्स बनाम वाटर)',
    categoryTitleRegional: 'V और W के उच्चारण का अंतर (दांत-होठ vs गोल-होठ)',
    targetWord: 'Victory',
    contrastWord: 'Window',
    ipa: '/ˈvɪk.tər.i/ vs /ˈwɪn.doʊ/',
    phoneticRespelling: 'VIK-tuh-ree vs WIN-doh',
    regionalRespelling: 'विक्-ट्री (V) vs विन्-डो (W)',
    mouthGuide: 'For V: Gently touch upper teeth to lower lip. For W: Round lips into a tight O shape like whistling.',
    mouthGuideRegional: 'V बोलते समय ऊपर के दांतों को निचले होंठ पर छुएं। W बोलते समय होंठों को गोल O बनाएं।',
    exampleSentence: 'Victor watched the white window on Wednesday.',
    shadowingPhrases: [
      {
        phrase: 'Victor achieved a glorious victory in winter.',
        ipa: '/ˈvɪk.tər əˈtʃiːvd ə ˈɡlɔː.ri.əs ˈvɪk.tər.i ɪn ˈwɪn.tər/',
        stressedWords: ['Vic-tor', 'glo-ri-ous', 'vic-to-ry', 'win-ter'],
        linkingTips: 'Link "achieved a" -> /əˈtʃiːv-də/'
      },
      {
        phrase: 'We want clean water and fresh vegetables.',
        ipa: '/wiː wɒnt kliːn ˈwɔː.tər ænd freʃ ˈvedʒ.tə.bəlz/',
        stressedWords: ['want', 'wa-ter', 'fresh', 'veg-e-ta-bles'],
        linkingTips: 'Pronounce "vegetables" as 3 syllables: /VEJ-tuh-bulz/'
      }
    ]
  },
  {
    id: 'ph-2',
    category: 's-vs-sh',
    categoryTitle: 'S vs SH Sounds (स बनाम श)',
    categoryTitleRegional: 'S (स) और SH (श) के उच्चारण का सटीक अभ्यास',
    targetWord: 'Sea',
    contrastWord: 'She',
    ipa: '/siː/ vs /ʃiː/',
    phoneticRespelling: 'SEE vs SHEE',
    regionalRespelling: 'सी (S) vs शी (SH)',
    mouthGuide: 'For S: Keep tongue tip behind front lower teeth with flat lips. For SH: Push lips forward slightly with air rushing over tongue.',
    mouthGuideRegional: 'S के लिए जीभ को निचले दांतों के पीछे रखें। SH के लिए होंठों को थोड़ा बाहर निकालकर श्श्श् की आवाज निकालें।',
    exampleSentence: 'She sells sea shells on the sea shore.',
    shadowingPhrases: [
      {
        phrase: 'She sells sea shells on the seashore.',
        ipa: '/ʃiː selz siː ʃelz ɒn ðə ˈsiː.ʃɔːr/',
        stressedWords: ['sells', 'sea', 'shells', 'sea-shore'],
        linkingTips: 'Practice smooth rhythm without mixing S and SH sounds.'
      },
      {
        phrase: 'Simple steps create shiny success.',
        ipa: '/ˈsɪm.pəl steps kriːˈeɪt ˈʃaɪ.ni səkˈses/',
        stressedWords: ['Sim-ple', 'steps', 'shi-ny', 'suc-cess'],
        linkingTips: 'Accent stress is on "-CESS" in success.'
      }
    ]
  },
  {
    id: 'ph-3',
    category: 'th-sounds',
    categoryTitle: 'TH Sounds (/θ/ & /ð/ - थ vs द)',
    categoryTitleRegional: 'TH का सही उच्चारण (जीभ को दांतों के बीच रखें)',
    targetWord: 'Think',
    contrastWord: 'This',
    ipa: '/θɪŋk/ (unvoiced) vs /ðɪs/ (voiced)',
    phoneticRespelling: 'THINK vs THIS',
    regionalRespelling: 'थिंक (Soft TH) vs दिस (Hard TH)',
    mouthGuide: 'Place tongue tip lightly between upper & lower front teeth. Blow air softly.',
    mouthGuideRegional: 'जीभ की नोक को ऊपर-नीचे के दांतों के बीच थोड़ा बाहर निकालकर हवा छोड़ें।',
    exampleSentence: 'I think that this weather is healthy.',
    shadowingPhrases: [
      {
        phrase: 'I think three thousand thoughts every day.',
        ipa: '/aɪ θɪŋk θriː ˈθaʊ.zənd θɔːts ˈev.ri deɪ/',
        stressedWords: ['think', 'three', 'thou-sand', 'thoughts'],
        linkingTips: 'Slight pause before "thousand" to maintain clear tongue tip placement.'
      },
      {
        phrase: 'This brother and that mother are together.',
        ipa: '/ðɪs ˈbrʌð.ər ænd ðæt ˈmʌð.ər ɑːr təˈɡeð.ər/',
        stressedWords: ['bro-ther', 'mo-ther', 'to-ge-ther'],
        linkingTips: 'Vibrate vocal cords softly for voiced TH in "brother" and "together".'
      }
    ]
  },
  {
    id: 'ph-4',
    category: 'silent-letters',
    categoryTitle: 'Silent Letters Masterclass (साइलेंट लेटर्स)',
    categoryTitleRegional: 'अंग्रेजी के छुपारुस्तम अक्षर (B, D, K, P, T)',
    targetWord: 'Wednesday',
    contrastWord: 'Subtle',
    ipa: '/ˈwenz.deɪ/ & /ˈsʌt.əl/',
    phoneticRespelling: 'WENZ-day & SUT-tl',
    regionalRespelling: 'वेन्ज़-डे (D silent) & सट-ल (B silent)',
    mouthGuide: 'Do not pronounce D in Wednesday, B in Subtle/Debt/Doubt, or P in Receipt!',
    mouthGuideRegional: 'Wednesday में D, Subtle में B, और Receipt में P को बिल्कुल मत बोलें।',
    exampleSentence: 'On Wednesday, he cleared his debt subtly.',
    shadowingPhrases: [
      {
        phrase: 'On Wednesday I paid my debt and got a receipt.',
        ipa: '/ɒn ˈwenz.deɪ aɪ peɪd maɪ det ænd ɡɒt ə rɪˈsiːt/',
        stressedWords: ['Wednes-day', 'paid', 'debt', 're-ceipt'],
        linkingTips: 'Receipt rhymes with "seat" - P is completely silent!'
      },
      {
        phrase: 'Honest people know subtle knowledge.',
        ipa: '/ˈɒn.ɪst ˈpiː.pəl noʊ ˈsʌt.əl ˈnɒl.ɪdʒ/',
        stressedWords: ['Hon-est', 'sub-tle', 'know-ledge'],
        linkingTips: 'H in Honest is silent, B in Subtle is silent, K in Knowledge is silent.'
      }
    ]
  },
  {
    id: 'ph-5',
    category: 'syllable-stress',
    categoryTitle: 'Syllable Stress & Intonation (शब्द-बल व सुर)',
    categoryTitleRegional: 'सही शब्द पर जोर देकर बोलना (Professional Rhythm)',
    targetWord: 'COMMUNICATION',
    contrastWord: 'PHOTOGRAPHY',
    ipa: '/kəˌmjuː.nɪˈkeɪ.ʃən/ & /fəˈtɒɡ.rə.fi/',
    phoneticRespelling: 'kuh-mew-nih-KAY-shun',
    regionalRespelling: 'कम्यु-नि-केशन (KAY पर ज़ोर)',
    mouthGuide: 'English is stress-timed! Pitch goes UP on the capital stressed syllable.',
    mouthGuideRegional: 'अंग्रेजी में मुख्य भाग (Stressed Syllable) पर आवाज ऊंची और स्पष्ट रखें।',
    exampleSentence: 'Effective communication builds professional relationships.',
    shadowingPhrases: [
      {
        phrase: 'Good communication creates incredible opportunities.',
        ipa: '/ɡʊd kəˌmjuː.nɪˈkeɪ.ʃən kriːˈeɪts ɪnˈkred.ə.bəl ˌɒp.əˈtʃuː.nə.tiz/',
        stressedWords: ['com-mu-ni-CA-tion', 'in-CRED-i-ble', 'op-por-TU-ni-ties'],
        linkingTips: 'Primary stress is on -CA- in communication and -CRED- in incredible.'
      }
    ]
  }
];
