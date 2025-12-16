/**
 * Add 7 targeted questions for unreachable forms (Q67-Q73)
 */

const fs = require('fs');
const path = require('path');

// Load existing quiz data
const dataPath = path.join(__dirname, 'quiz_data_questions.json');
const quizData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// New targeted questions for unreachable forms
const newQuestions = [
  {
    id: 'Q67',
    section: 'formDifferentiation',
    text: 'When you enter a new social or professional environment, you tend to:',
    type: 'single',
    options: [
      {
        id: 'a',
        text: 'Watch carefully to identify who has power and resources',
        scoring: [
          { target: 'form', form: 'The Wolf', points: 5 }
        ]
      },
      {
        id: 'b',
        text: 'Quickly assess who might be useful allies or threats',
        scoring: [
          { target: 'form', form: 'The Shark', points: 2 }
        ]
      },
      {
        id: 'c',
        text: 'Keep to yourself and avoid drawing attention',
        scoring: [
          { target: 'form', form: 'The Deer', points: 2 }
        ]
      },
      {
        id: 'd',
        text: 'Observe quietly to understand the social dynamics',
        scoring: [
          { target: 'form', form: 'The Snake', points: 2 }
        ]
      },
      {
        id: 'e',
        text: 'Gradually warm up once you feel comfortable',
        scoring: [
          { target: 'form', form: 'The Rabbit', points: 2 }
        ]
      },
      {
        id: 'f',
        text: 'Engage confidently and make your presence known',
        scoring: [
          { target: 'form', form: 'The Lion', points: 2 }
        ]
      }
    ]
  },
  {
    id: 'Q68',
    section: 'formDifferentiation',
    text: 'Your approach to dealing with conflicts or grudges is:',
    type: 'single',
    options: [
      {
        id: 'a',
        text: 'Wait for the perfect moment to address it on your terms',
        scoring: [
          { target: 'form', form: 'The Snake', points: 5 }
        ]
      },
      {
        id: 'b',
        text: 'Confront it immediately when emotions are high',
        scoring: [
          { target: 'form', form: 'The Bitter', points: 2 }
        ]
      },
      {
        id: 'c',
        text: 'Bottle it up and let resentment build over time',
        scoring: [
          { target: 'form', form: 'The Resentful', points: 2 }
        ]
      },
      {
        id: 'd',
        text: 'Try to forgive and move on quickly',
        scoring: [
          { target: 'form', form: 'The Forgiving', points: 2 }
        ]
      },
      {
        id: 'e',
        text: 'Obsess over it but never take action',
        scoring: [
          { target: 'form', form: 'The Self-Flagellant', points: 2 }
        ]
      },
      {
        id: 'f',
        text: 'Use it as motivation to prove yourself',
        scoring: [
          { target: 'form', form: 'The Underminer', points: 2 }
        ]
      }
    ]
  },
  {
    id: 'Q69',
    section: 'formDifferentiation',
    text: "When you think about your life's purpose, you focus on:",
    type: 'single',
    options: [
      {
        id: 'a',
        text: "Reaching specific goals and milestones I've set",
        scoring: [
          { target: 'form', form: 'The Achiever', points: 5 }
        ]
      },
      {
        id: 'b',
        text: 'Exploring different paths and possibilities',
        scoring: [
          { target: 'form', form: 'The Questioner', points: 2 }
        ]
      },
      {
        id: 'c',
        text: 'Learning and growing continuously',
        scoring: [
          { target: 'form', form: 'The Student', points: 2 }
        ]
      },
      {
        id: 'd',
        text: 'Finding meaning through spiritual practice',
        scoring: [
          { target: 'form', form: 'The Practitioner', points: 2 }
        ]
      },
      {
        id: 'e',
        text: 'Teaching and helping others develop',
        scoring: [
          { target: 'form', form: 'The Mentor', points: 2 }
        ]
      },
      {
        id: 'f',
        text: 'Being present and content with what is',
        scoring: [
          { target: 'form', form: 'The Comfortable', points: 2 }
        ]
      }
    ]
  },
  {
    id: 'Q70',
    section: 'formDifferentiation',
    text: 'Your relationship with possessions and wealth is:',
    type: 'single',
    options: [
      {
        id: 'a',
        text: 'I carefully acquire and organize things I might need',
        scoring: [
          { target: 'form', form: 'The Accumulator', points: 5 }
        ]
      },
      {
        id: 'b',
        text: 'I collect things that reflect my taste or status',
        scoring: [
          { target: 'form', form: 'The Collector', points: 2 }
        ]
      },
      {
        id: 'c',
        text: 'I constantly want more no matter what I have',
        scoring: [
          { target: 'form', form: 'The Glutton', points: 2 }
        ]
      },
      {
        id: 'd',
        text: "I browse and desire but don't always acquire",
        scoring: [
          { target: 'form', form: 'The Browser', points: 2 }
        ]
      },
      {
        id: 'e',
        text: "I'm content with what I have",
        scoring: [
          { target: 'form', form: 'The Comfortable', points: 2 }
        ]
      },
      {
        id: 'f',
        text: "Possessions don't particularly interest me",
        scoring: [
          { target: 'form', form: 'The Ascetic', points: 2 }
        ]
      }
    ]
  },
  {
    id: 'Q71',
    section: 'formDifferentiation',
    text: 'When someone else succeeds, your honest first reaction is:',
    type: 'single',
    options: [
      {
        id: 'a',
        text: 'Immediately comparing their success to my own situation',
        scoring: [
          { target: 'form', form: 'The Thief of Joy', points: 5 }
        ]
      },
      {
        id: 'b',
        text: 'Feeling competitive and wanting to do better',
        scoring: [
          { target: 'form', form: 'The Competitor', points: 2 }
        ]
      },
      {
        id: 'c',
        text: 'Pointing out subtle flaws in their achievement',
        scoring: [
          { target: 'form', form: 'The Underminer', points: 2 }
        ]
      },
      {
        id: 'd',
        text: 'Trying to find ways to surpass them',
        scoring: [
          { target: 'form', form: 'The One-Upper', points: 2 }
        ]
      },
      {
        id: 'e',
        text: 'Judging whether they truly deserved it',
        scoring: [
          { target: 'form', form: 'The Judge', points: 2 }
        ]
      },
      {
        id: 'f',
        text: 'Genuinely happy for them',
        scoring: [
          { target: 'form', form: 'The Mentor', points: 2 }
        ]
      }
    ]
  },
  {
    id: 'Q72',
    section: 'formDifferentiation',
    text: 'When someone comes to you with a problem or question:',
    type: 'single',
    options: [
      {
        id: 'a',
        text: 'I take time to guide them toward their own answers',
        scoring: [
          { target: 'form', form: 'The Mentor', points: 5 }
        ]
      },
      {
        id: 'b',
        text: 'I\'m eager to share what I know and have learned',
        scoring: [
          { target: 'form', form: 'The Teacher', points: 2 }
        ]
      },
      {
        id: 'c',
        text: 'I tell them exactly what they should do',
        scoring: [
          { target: 'form', form: 'The Expert', points: 2 }
        ]
      },
      {
        id: 'd',
        text: 'I point them to better resources or people',
        scoring: [
          { target: 'form', form: 'The Guide', points: 2 }
        ]
      },
      {
        id: 'e',
        text: 'I listen but avoid giving direct advice',
        scoring: [
          { target: 'form', form: 'The Listener', points: 2 }
        ]
      },
      {
        id: 'f',
        text: 'I feel uncomfortable being in an authority position',
        scoring: [
          { target: 'form', form: 'The Student', points: 2 }
        ]
      }
    ]
  },
  {
    id: 'Q73',
    section: 'formDifferentiation',
    text: 'Your general state of mind most days is:',
    type: 'single',
    options: [
      {
        id: 'a',
        text: 'Peaceful and genuinely content with life as it is',
        scoring: [
          { target: 'form', form: 'The Comfortable (Deva)', points: 5 }
        ]
      },
      {
        id: 'b',
        text: 'Maintaining comfort through careful routines',
        scoring: [
          { target: 'form', form: 'The Comfortable', points: 2 }
        ]
      },
      {
        id: 'c',
        text: 'Subtly proud of my spiritual development',
        scoring: [
          { target: 'form', form: 'The Subtle Brag', points: 2 }
        ]
      },
      {
        id: 'd',
        text: 'Blissfully unaware of deeper issues',
        scoring: [
          { target: 'form', form: 'The Blissful Ignorant', points: 2 }
        ]
      },
      {
        id: 'e',
        text: 'Content but always seeking more knowledge',
        scoring: [
          { target: 'form', form: 'The Student', points: 2 }
        ]
      },
      {
        id: 'f',
        text: 'At peace through dedicated practice',
        scoring: [
          { target: 'form', form: 'The Practitioner', points: 2 }
        ]
      }
    ]
  }
];

// Add new questions
quizData.questions.push(...newQuestions);

// Update metadata
quizData.metadata.totalQuestions = quizData.questions.length;

// Write back
fs.writeFileSync(dataPath, JSON.stringify(quizData, null, 2));

console.log('✅ Successfully added 7 targeted questions (Q67-Q73)');
console.log(`📊 Total questions: ${quizData.questions.length}`);
console.log(`📦 Total sections: ${quizData.metadata.sections.length}`);
