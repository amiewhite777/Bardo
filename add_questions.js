/**
 * Script to add new form-differentiation questions to quiz data
 */

import { readFileSync, writeFileSync } from 'fs';

// Read current quiz data
const quizData = JSON.parse(readFileSync('quiz_data_questions.json', 'utf-8'));

// Add new section to metadata
quizData.sections.push({
  "id": "formDifferentiation",
  "name": "Form Differentiation",
  "description": "Targeted questions to differentiate between specific forms",
  "weight": 1.0,
  "questionCount": 16
});

// Update metadata
quizData.metadata.totalQuestions = 66;
quizData.metadata.sections = 8;

// New questions with form-level scoring
const newQuestions = [
  {
    "id": "Q51",
    "section": "formDifferentiation",
    "text": "When you sense potential danger or conflict, your first instinct is to:",
    "type": "single",
    "options": [
      {"id": "a", "text": "Freeze completely and assess", "scoring": [{"target": "form", "form": "The Rabbit", "points": 3}]},
      {"id": "b", "text": "Stay alert but continue what you're doing", "scoring": [{"target": "form", "form": "The Deer", "points": 3}]},
      {"id": "c", "text": "Follow what others are doing", "scoring": [{"target": "form", "form": "The Sheep", "points": 3}]},
      {"id": "d", "text": "Strike first if needed", "scoring": [{"target": "form", "form": "The Shark", "points": 3}]},
      {"id": "e", "text": "Work with others to handle it", "scoring": [{"target": "form", "form": "The Wolf", "points": 3}]},
      {"id": "f", "text": "Slip away unnoticed", "scoring": [{"target": "form", "form": "The Snake", "points": 3}]}
    ]
  },
  {
    "id": "Q52",
    "section": "formDifferentiation",
    "text": "Your energy level throughout the day tends to be:",
    "type": "single",
    "options": [
      {"id": "a", "text": "Consistently very low, hard to get started", "scoring": [{"target": "form", "form": "The Sloth", "points": 3}]},
      {"id": "b", "text": "I save energy, do minimum necessary", "scoring": [{"target": "form", "form": "The Hibernator", "points": 3}]},
      {"id": "c", "text": "Peaks when there's routine/structure", "scoring": [{"target": "form", "form": "The Cattle", "points": 3}]},
      {"id": "d", "text": "Varies, I go with the group", "scoring": [{"target": "form", "form": "The Sheep", "points": 2}]},
      {"id": "e", "text": "High when hunting opportunities", "scoring": [{"target": "form", "form": "The Shark", "points": 2}]},
      {"id": "f", "text": "Anxious energy, always scanning", "scoring": [{"target": "form", "form": "The Rabbit", "points": 2}]}
    ]
  },
  {
    "id": "Q53",
    "section": "formDifferentiation",
    "text": "In social hierarchies, you tend to:",
    "type": "single",
    "options": [
      {"id": "a", "text": "Stay small, avoid being noticed", "scoring": [{"target": "form", "form": "The Mouse", "points": 3}]},
      {"id": "b", "text": "Follow the established pecking order", "scoring": [{"target": "form", "form": "The Cattle", "points": 2}]},
      {"id": "c", "text": "Circle around looking for openings", "scoring": [{"target": "form", "form": "The Shark", "points": 2}]},
      {"id": "d", "text": "Work within pack structure", "scoring": [{"target": "form", "form": "The Wolf", "points": 3}]},
      {"id": "e", "text": "Stay with the group, safety in numbers", "scoring": [{"target": "form", "form": "The Sheep", "points": 2}]},
      {"id": "f", "text": "Keep distance, observe carefully", "scoring": [{"target": "form", "form": "The Deer", "points": 2}]}
    ]
  },
  {
    "id": "Q54",
    "section": "formDifferentiation",
    "text": "Your relationship with learning and growth is:",
    "type": "single",
    "options": [
      {"id": "a", "text": "Active student, always taking courses", "scoring": [{"target": "form", "form": "The Student", "points": 3}]},
      {"id": "b", "text": "Deep questions drive me", "scoring": [{"target": "form", "form": "The Questioner", "points": 3}]},
      {"id": "c", "text": "Dedicated daily practice", "scoring": [{"target": "form", "form": "The Practitioner", "points": 3}]},
      {"id": "d", "text": "I build and create things", "scoring": [{"target": "form", "form": "The Creator", "points": 3}]},
      {"id": "e", "text": "I achieve concrete goals", "scoring": [{"target": "form", "form": "The Achiever", "points": 3}]},
      {"id": "f", "text": "I seek rich experiences", "scoring": [{"target": "form", "form": "The Experiencer", "points": 3}]}
    ]
  },
  {
    "id": "Q55",
    "section": "formDifferentiation",
    "text": "When you think about your current life situation:",
    "type": "single",
    "options": [
      {"id": "a", "text": "I'm healing from significant wounds", "scoring": [{"target": "form", "form": "The Wounded", "points": 3}]},
      {"id": "b", "text": "I'm trying but feeling stuck", "scoring": [{"target": "form", "form": "The Frustrated", "points": 3}]},
      {"id": "c", "text": "I'm in survival mode, desperate", "scoring": [{"target": "form", "form": "The Desperate", "points": 3}]},
      {"id": "d", "text": "I'm comfortable, not much pressure", "scoring": [{"target": "form", "form": "The Comfortable", "points": 3}]},
      {"id": "e", "text": "I'm distracted, going through motions", "scoring": [{"target": "form", "form": "The Distracted", "points": 3}]},
      {"id": "f", "text": "I'm growing and exploring", "scoring": [{"target": "form", "form": "The Student", "points": 2}, {"target": "form", "form": "The Creator", "points": 2}]}
    ]
  },
  {
    "id": "Q56",
    "section": "formDifferentiation",
    "text": "Your primary mode of engagement with life:",
    "type": "single",
    "options": [
      {"id": "a", "text": "Inquiry - I need to understand", "scoring": [{"target": "form", "form": "The Questioner", "points": 2}]},
      {"id": "b", "text": "Practice - I do the work daily", "scoring": [{"target": "form", "form": "The Practitioner", "points": 2}]},
      {"id": "c", "text": "Creation - I make things", "scoring": [{"target": "form", "form": "The Creator", "points": 2}]},
      {"id": "d", "text": "Achievement - I accomplish goals", "scoring": [{"target": "form", "form": "The Achiever", "points": 2}]},
      {"id": "e", "text": "Experience - I taste everything", "scoring": [{"target": "form", "form": "The Experiencer", "points": 2}]},
      {"id": "f", "text": "Study - I learn systematically", "scoring": [{"target": "form", "form": "The Student", "points": 2}]}
    ]
  },
  {
    "id": "Q57",
    "section": "formDifferentiation",
    "text": "When you encounter someone more successful than you:",
    "type": "single",
    "options": [
      {"id": "a", "text": "I want to conquer them", "scoring": [{"target": "form", "form": "The Conqueror", "points": 3}]},
      {"id": "b", "text": "I fight to prove myself", "scoring": [{"target": "form", "form": "The Fighter", "points": 3}]},
      {"id": "c", "text": "I subtly undermine them", "scoring": [{"target": "form", "form": "The Underminer", "points": 3}]},
      {"id": "d", "text": "I rank myself against them", "scoring": [{"target": "form", "form": "The Ranker", "points": 3}]},
      {"id": "e", "text": "I one-up in conversation", "scoring": [{"target": "form", "form": "The One-Upper", "points": 3}]},
      {"id": "f", "text": "I subtly brag about my achievements", "scoring": [{"target": "form", "form": "The Subtle Brag", "points": 3}]}
    ]
  },
  {
    "id": "Q58",
    "section": "formDifferentiation",
    "text": "Your internal narrative about your life often sounds like:",
    "type": "single",
    "options": [
      {"id": "a", "text": "I've been wronged/victimized", "scoring": [{"target": "form", "form": "The Victim", "points": 3}]},
      {"id": "b", "text": "I critically analyze what's wrong", "scoring": [{"target": "form", "form": "The Critic", "points": 3}]},
      {"id": "c", "text": "I must accumulate more", "scoring": [{"target": "form", "form": "The Accumulator", "points": 3}]},
      {"id": "d", "text": "Others' success ruins my joy", "scoring": [{"target": "form", "form": "The Thief of Joy", "points": 3}]},
      {"id": "e", "text": "I must win/conquer", "scoring": [{"target": "form", "form": "The Conqueror", "points": 2}]},
      {"id": "f", "text": "I must fight harder", "scoring": [{"target": "form", "form": "The Fighter", "points": 2}]}
    ]
  },
  {
    "id": "Q59",
    "section": "formDifferentiation",
    "text": "How you track your progress and worth:",
    "type": "single",
    "options": [
      {"id": "a", "text": "By defeating others", "scoring": [{"target": "form", "form": "The Conqueror", "points": 2}]},
      {"id": "b", "text": "By explicit rankings/metrics", "scoring": [{"target": "form", "form": "The Ranker", "points": 2}]},
      {"id": "c", "text": "By accumulating credentials/things", "scoring": [{"target": "form", "form": "The Accumulator", "points": 2}]},
      {"id": "d", "text": "By comparison to others", "scoring": [{"target": "form", "form": "The One-Upper", "points": 2}, {"target": "form", "form": "The Thief of Joy", "points": 2}]},
      {"id": "e", "text": "By finding flaws in the system", "scoring": [{"target": "form", "form": "The Critic", "points": 2}]},
      {"id": "f", "text": "By counting my victimhood", "scoring": [{"target": "form", "form": "The Victim", "points": 2}]}
    ]
  },
  {
    "id": "Q60",
    "section": "formDifferentiation",
    "text": "Your relationship with pleasure and comfort:",
    "type": "single",
    "options": [
      {"id": "a", "text": "I actively pursue maximum pleasure", "scoring": [{"target": "form", "form": "The Hedonist", "points": 3}]},
      {"id": "b", "text": "I've been protected from hardship", "scoring": [{"target": "form", "form": "The Protected", "points": 3}]},
      {"id": "c", "text": "I expect things to come easily", "scoring": [{"target": "form", "form": "The Entitled", "points": 2}]},
      {"id": "d", "text": "I've earned my comfortable life", "scoring": [{"target": "form", "form": "The Retired", "points": 3}]},
      {"id": "e", "text": "I'm an expert in my domain", "scoring": [{"target": "form", "form": "The Expert", "points": 3}]},
      {"id": "f", "text": "I mentor others from wisdom", "scoring": [{"target": "form", "form": "The Mentor", "points": 3}]}
    ]
  },
  {
    "id": "Q61",
    "section": "formDifferentiation",
    "text": "Your sense of spiritual/personal development:",
    "type": "single",
    "options": [
      {"id": "a", "text": "I'm beyond ordinary concerns", "scoring": [{"target": "form", "form": "The Guru", "points": 3}]},
      {"id": "b", "text": "I live in blissful states", "scoring": [{"target": "form", "form": "The Blissed", "points": 3}]},
      {"id": "c", "text": "I've transcended suffering", "scoring": [{"target": "form", "form": "The Transcender", "points": 2}]},
      {"id": "d", "text": "I'm comfortable, don't need more", "scoring": [{"target": "form", "form": "The Comfortable (Deva)", "points": 3}]},
      {"id": "e", "text": "I was fortunate, born blessed", "scoring": [{"target": "form", "form": "The Fortunate", "points": 3}]},
      {"id": "f", "text": "I enjoy refined pleasures", "scoring": [{"target": "form", "form": "The Hedonist", "points": 2}]}
    ]
  },
  {
    "id": "Q62",
    "section": "formDifferentiation",
    "text": "If someone suggested you have blind spots:",
    "type": "single",
    "options": [
      {"id": "a", "text": "I'd dismiss it, I'm beyond that", "scoring": [{"target": "form", "form": "The Guru", "points": 2}, {"target": "form", "form": "The Transcender", "points": 2}]},
      {"id": "b", "text": "Unnecessary, I'm already comfortable", "scoring": [{"target": "form", "form": "The Comfortable (Deva)", "points": 2}, {"target": "form", "form": "The Fortunate", "points": 2}]},
      {"id": "c", "text": "I have expertise, I know", "scoring": [{"target": "form", "form": "The Expert", "points": 2}]},
      {"id": "d", "text": "I've earned not having to work on that", "scoring": [{"target": "form", "form": "The Retired", "points": 2}]},
      {"id": "e", "text": "That's a harsh judgment", "scoring": [{"target": "form", "form": "The Protected", "points": 2}, {"target": "form", "form": "The Entitled", "points": 2}]},
      {"id": "f", "text": "I'd bliss past it", "scoring": [{"target": "form", "form": "The Blissed", "points": 2}]}
    ]
  },
  {
    "id": "Q63",
    "section": "formDifferentiation",
    "text": "When anger arises, the specific pattern is:",
    "type": "single",
    "options": [
      {"id": "a", "text": "Explosive, everything burns", "scoring": [{"target": "form", "form": "The Inferno", "points": 3}]},
      {"id": "b", "text": "Targeted, scorching precision", "scoring": [{"target": "form", "form": "The Scorcher", "points": 3}]},
      {"id": "c", "text": "I spread the fire to others", "scoring": [{"target": "form", "form": "The Spreader", "points": 3}]},
      {"id": "d", "text": "Cold shutdown, frozen rage", "scoring": [{"target": "form", "form": "The Glacier", "points": 2}]},
      {"id": "e", "text": "Bitter, calculated coldness", "scoring": [{"target": "form", "form": "The Bitter", "points": 3}]},
      {"id": "f", "text": "Numb, dissociated from anger", "scoring": [{"target": "form", "form": "The Numb", "points": 3}]}
    ]
  },
  {
    "id": "Q64",
    "section": "formDifferentiation",
    "text": "Your anger tends to:",
    "type": "single",
    "options": [
      {"id": "a", "text": "Judge and condemn", "scoring": [{"target": "form", "form": "The Judge", "points": 2}]},
      {"id": "b", "text": "Execute punishment", "scoring": [{"target": "form", "form": "The Executioner", "points": 3}]},
      {"id": "c", "text": "Loop endlessly in replay", "scoring": [{"target": "form", "form": "The Ruminant", "points": 2}]},
      {"id": "d", "text": "Turn inward against myself", "scoring": [{"target": "form", "form": "The Self-Flagellant", "points": 2}]},
      {"id": "e", "text": "Burn everything in sight", "scoring": [{"target": "form", "form": "The Inferno", "points": 2}]},
      {"id": "f", "text": "Freeze everything out", "scoring": [{"target": "form", "form": "The Glacier", "points": 2}]}
    ]
  },
  {
    "id": "Q65",
    "section": "formDifferentiation",
    "text": "Your pattern of wanting/craving specifically involves:",
    "type": "single",
    "options": [
      {"id": "a", "text": "Insatiable physical appetite", "scoring": [{"target": "form", "form": "The Glutton", "points": 2}]},
      {"id": "b", "text": "Refined, curated desires", "scoring": [{"target": "form", "form": "The Connoisseur", "points": 2}]},
      {"id": "c", "text": "Addictive, compulsive wanting", "scoring": [{"target": "form", "form": "The Addict", "points": 2}]},
      {"id": "d", "text": "Collecting status markers", "scoring": [{"target": "form", "form": "The Collector", "points": 3}]},
      {"id": "e", "text": "Climbing social ladders", "scoring": [{"target": "form", "form": "The Climber", "points": 3}]},
      {"id": "f", "text": "Building influence/following", "scoring": [{"target": "form", "form": "The Influencer", "points": 3}]}
    ]
  },
  {
    "id": "Q66",
    "section": "formDifferentiation",
    "text": "When desire is frustrated:",
    "type": "single",
    "options": [
      {"id": "a", "text": "I browse endlessly for the next thing", "scoring": [{"target": "form", "form": "The Browser", "points": 2}]},
      {"id": "b", "text": "I feel empty, can't name what I want", "scoring": [{"target": "form", "form": "The Emptiness", "points": 2}]},
      {"id": "c", "text": "I covet what others have", "scoring": [{"target": "form", "form": "The Coveter", "points": 3}]},
      {"id": "d", "text": "I take/steal energy from others", "scoring": [{"target": "form", "form": "The Taker", "points": 3}]},
      {"id": "e", "text": "I eat/consume more", "scoring": [{"target": "form", "form": "The Glutton", "points": 2}]},
      {"id": "f", "text": "I seek another refined hit", "scoring": [{"target": "form", "form": "The Connoisseur", "points": 2}]}
    ]
  }
];

// Add new questions to quiz data
quizData.questions.push(...newQuestions);

// Write updated data
writeFileSync('quiz_data_questions.json', JSON.stringify(quizData, null, 2));

console.log('✅ Successfully added 16 new form-differentiation questions!');
console.log(`Total questions now: ${quizData.questions.length}`);
console.log(`Sections: ${quizData.sections.length}`);
