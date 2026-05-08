// database.js

export const QUESTIONS = [

  // =========================
  // MATH (1–25)
  // =========================

  {
    id: 1,
    subject: "Math",
    q_en: "What is the value of sin 30°?",
    q_hi: "sin 30° का मान क्या है?",
    options_en: ["1", "1/2", "0", "√3/2"],
    options_hi: ["1", "1/2", "0", "√3/2"],
    answer: "1/2"
  },

  {
    id: 2,
    subject: "Math",
    q_en: "What is the area of a circle?",
    q_hi: "वृत्त का क्षेत्रफल क्या होता है?",
    options_en: ["πr²", "2πr", "πd", "r²"],
    options_hi: ["πr²", "2πr", "πd", "r²"],
    answer: "πr²"
  },

  {
    id: 3,
    subject: "Math",
    q_en: "What is the HCF of 135 and 225?",
    q_hi: "135 और 225 का HCF क्या है?",
    options_en: ["15", "45", "75", "135"],
    options_hi: ["15", "45", "75", "135"],
    answer: "45"
  },

  {
    id: 4,
    subject: "Math",
    q_en: "What is the degree of a linear equation?",
    q_hi: "रैखिक समीकरण की घात क्या होती है?",
    options_en: ["1", "2", "3", "0"],
    options_hi: ["1", "2", "3", "0"],
    answer: "1"
  },

  {
    id: 5,
    subject: "Math",
    q_en: "Pythagoras theorem is used in?",
    q_hi: "पाइथागोरस प्रमेय किसमें उपयोग होता है?",
    options_en: [
      "Circle",
      "Right Triangle",
      "Square",
      "Rectangle"
    ],
    options_hi: [
      "वृत्त",
      "समकोण त्रिभुज",
      "वर्ग",
      "आयत"
    ],
    answer: "Right Triangle"
  },

  {
    id: 6,
    subject: "Math",
    q_en: "What is the value of cos 0°?",
    q_hi: "cos 0° का मान क्या है?",
    options_en: ["0", "1", "1/2", "Not Defined"],
    options_hi: ["0", "1", "1/2", "परिभाषित नहीं"],
    answer: "1"
  },

  {
    id: 7,
    subject: "Math",
    q_en: "Probability of an impossible event is?",
    q_hi: "असंभव घटना की प्रायिकता क्या होती है?",
    options_en: ["1", "0", "0.5", "-1"],
    options_hi: ["1", "0", "0.5", "-1"],
    answer: "0"
  },

  {
    id: 8,
    subject: "Math",
    q_en: "Volume of a cube with side a?",
    q_hi: "भुजा a वाले घन का आयतन क्या होगा?",
    options_en: ["a²", "a³", "4a", "6a²"],
    options_hi: ["a²", "a³", "4a", "6a²"],
    answer: "a³"
  },

  {
    id: 9,
    subject: "Math",
    q_en: "Formula of discriminant?",
    q_hi: "विविक्तकर का सूत्र क्या है?",
    options_en: [
      "b² - 4ac",
      "b - 4ac",
      "b² + 4ac",
      "2b - ac"
    ],
    options_hi: [
      "b² - 4ac",
      "b - 4ac",
      "b² + 4ac",
      "2b - ac"
    ],
    answer: "b² - 4ac"
  },

  {
    id: 10,
    subject: "Math",
    q_en: "What is tan 45°?",
    q_hi: "tan 45° का मान क्या है?",
    options_en: ["0", "1", "√3", "1/√3"],
    options_hi: ["0", "1", "√3", "1/√3"],
    answer: "1"
  },

  // =========================
  // SCIENCE (11–20)
  // =========================

  {
    id: 11,
    subject: "Science",
    q_en: "Chemical formula of water?",
    q_hi: "पानी का रासायनिक सूत्र क्या है?",
    options_en: ["H2O", "CO2", "O2", "NaCl"],
    options_hi: ["H2O", "CO2", "O2", "NaCl"],
    answer: "H2O"
  },

  {
    id: 12,
    subject: "Science",
    q_en: "Powerhouse of the cell?",
    q_hi: "कोशिका का शक्तिगृह किसे कहते हैं?",
    options_en: [
      "Nucleus",
      "Mitochondria",
      "Ribosome",
      "Cell Wall"
    ],
    options_hi: [
      "केंद्रक",
      "माइटोकॉन्ड्रिया",
      "राइबोसोम",
      "कोशिका भित्ति"
    ],
    answer: "Mitochondria"
  },

  {
    id: 13,
    subject: "Science",
    q_en: "Which gas is released during photosynthesis?",
    q_hi: "प्रकाश संश्लेषण के दौरान कौन सी गैस निकलती है?",
    options_en: ["CO2", "Oxygen", "Nitrogen", "Hydrogen"],
    options_hi: [
      "कार्बन डाइऑक्साइड",
      "ऑक्सीजन",
      "नाइट्रोजन",
      "हाइड्रोजन"
    ],
    answer: "Oxygen"
  },

  {
    id: 14,
    subject: "Science",
    q_en: "Unit of electric current?",
    q_hi: "विद्युत धारा का मात्रक क्या है?",
    options_en: ["Volt", "Ampere", "Ohm", "Watt"],
    options_hi: ["वोल्ट", "एम्पीयर", "ओम", "वाट"],
    answer: "Ampere"
  },

  {
    id: 15,
    subject: "Science",
    q_en: "Which mirror is used in vehicles?",
    q_hi: "वाहनों में कौन सा दर्पण उपयोग होता है?",
    options_en: [
      "Concave",
      "Convex",
      "Plane",
      "None"
    ],
    options_hi: [
      "अवतल",
      "उत्तल",
      "समतल",
      "कोई नहीं"
    ],
    answer: "Convex"
  },

  {
    id: 16,
    subject: "Science",
    q_en: "Main component of natural gas?",
    q_hi: "प्राकृतिक गैस का मुख्य घटक क्या है?",
    options_en: [
      "Methane",
      "Ethane",
      "Propane",
      "Butane"
    ],
    options_hi: [
      "मीथेन",
      "ईथेन",
      "प्रोपेन",
      "ब्यूटेन"
    ],
    answer: "Methane"
  },

  {
    id: 17,
    subject: "Science",
    q_en: "Acid present in lemon?",
    q_hi: "नींबू में कौन सा अम्ल पाया जाता है?",
    options_en: [
      "Lactic",
      "Citric",
      "Acetic",
      "Oxalic"
    ],
    options_hi: [
      "लैक्टिक",
      "साइट्रिक",
      "एसिटिक",
      "ऑक्सेलिक"
    ],
    answer: "Citric"
  },

  {
    id: 18,
    subject: "Science",
    q_en: "Smallest unit of life?",
    q_hi: "जीवन की सबसे छोटी इकाई क्या है?",
    options_en: ["Tissue", "Organ", "Cell", "Atom"],
    options_hi: ["ऊतक", "अंग", "कोशिका", "परमाणु"],
    answer: "Cell"
  },

  {
    id: 19,
    subject: "Science",
    q_en: "Which gas is filled in chips packets?",
    q_hi: "चिप्स के पैकेट में कौन सी गैस भरी जाती है?",
    options_en: [
      "Oxygen",
      "Nitrogen",
      "Argon",
      "Helium"
    ],
    options_hi: [
      "ऑक्सीजन",
      "नाइट्रोजन",
      "आर्गन",
      "हीलियम"
    ],
    answer: "Nitrogen"
  },

  {
    id: 20,
    subject: "Science",
    q_en: "Normal human blood pressure?",
    q_hi: "सामान्य मानव रक्तचाप कितना होता है?",
    options_en: [
      "120/80",
      "100/60",
      "140/90",
      "110/70"
    ],
    options_hi: [
      "120/80",
      "100/60",
      "140/90",
      "110/70"
    ],
    answer: "120/80"
  },

  // =========================
  // ENGLISH (21–30)
  // =========================

  {
    id: 21,
    subject: "English",
    q_en: "Synonym of Happy?",
    q_hi: "Happy का समानार्थी शब्द क्या है?",
    options_en: ["Sad", "Joyful", "Angry", "Weak"],
    options_hi: ["दुखी", "खुश", "गुस्सा", "कमज़ोर"],
    answer: "Joyful"
  },

  {
    id: 22,
    subject: "English",
    q_en: "Antonym of Strong?",
    q_hi: "Strong का विलोम शब्द क्या है?",
    options_en: ["Weak", "Powerful", "Brave", "Tall"],
    options_hi: [
      "कमज़ोर",
      "शक्तिशाली",
      "बहादुर",
      "लंबा"
    ],
    answer: "Weak"
  },

  {
    id: 23,
    subject: "English",
    q_en: "Plural of Child?",
    q_hi: "Child का बहुवचन क्या है?",
    options_en: [
      "Childs",
      "Children",
      "Childrens",
      "Childes"
    ],
    options_hi: [
      "Childs",
      "Children",
      "Childrens",
      "Childes"
    ],
    answer: "Children"
  },

  {
    id: 24,
    subject: "English",
    q_en: "Correct spelling?",
    q_hi: "सही वर्तनी कौन सी है?",
    options_en: [
      "Receive",
      "Recieve",
      "Receve",
      "Recive"
    ],
    options_hi: [
      "Receive",
      "Recieve",
      "Receve",
      "Recive"
    ],
    answer: "Receive"
  },

  {
    id: 25,
    subject: "English",
    q_en: "Past tense of Go?",
    q_hi: "Go का भूतकाल क्या है?",
    options_en: ["Gone", "Went", "Going", "Goes"],
    options_hi: ["Gone", "Went", "Going", "Goes"],
    answer: "Went"
  },

  {
    id: 26,
    subject: "English",
    q_en: "Female of Lion?",
    q_hi: "Lion का स्त्रीलिंग क्या है?",
    options_en: [
      "Lioness",
      "Lions",
      "She-lion",
      "Liony"
    ],
    options_hi: [
      "Lioness",
      "Lions",
      "She-lion",
      "Liony"
    ],
    answer: "Lioness"
  },

  {
    id: 27,
    subject: "English",
    q_en: "Correct article: ___ Apple",
    q_hi: "सही article चुनें: ___ Apple",
    options_en: ["A", "An", "The", "No article"],
    options_hi: ["A", "An", "The", "No article"],
    answer: "An"
  },

  {
    id: 28,
    subject: "English",
    q_en: "Plural of Mouse?",
    q_hi: "Mouse का बहुवचन क्या है?",
    options_en: [
      "Mouses",
      "Mice",
      "Mices",
      "Mouse"
    ],
    options_hi: [
      "Mouses",
      "Mice",
      "Mices",
      "Mouse"
    ],
    answer: "Mice"
  },

  {
    id: 29,
    subject: "English",
    q_en: "Synonym of Large?",
    q_hi: "Large का समानार्थी शब्द क्या है?",
    options_en: ["Small", "Big", "Thin", "Short"],
    options_hi: ["छोटा", "बड़ा", "पतला", "छोटा"],
    answer: "Big"
  },

  {
    id: 30,
    subject: "English",
    q_en: "Opposite of Success?",
    q_hi: "Success का विलोम क्या है?",
    options_en: ["Failure", "Win", "Goal", "Pass"],
    options_hi: ["असफलता", "जीत", "लक्ष्य", "पास"],
    answer: "Failure"
  }

];
