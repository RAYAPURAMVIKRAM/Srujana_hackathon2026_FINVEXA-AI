// src/i18n/translations.ts
export type Language = 'en' | 'hi' | 'kn' | 'te' | 'ta' | 'ml' | 'mr'

export interface LanguageOption {
  code: Language
  label: string
  nativeName: string
  flag: string
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
]

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    // Top Bar
    'topbar.brandSubtitle': 'Smart Money Decisions Before You Spend',
    'topbar.bankSynced': 'Bank Synced',
    'topbar.connectBank': 'Connect RBI AA Bank',
    'topbar.hiddenMoney': 'Hidden Money',
    'topbar.cloud': 'Cloud',
    'topbar.themeLight': '☀️ Light Mode',
    'topbar.themeDark': '🌙 Dark Mode',
    'topbar.resetDemo': 'Reset Demo (For Judges)',
    'topbar.signOut': 'Sign Out',
    'topbar.profile': 'My Profile & Bank Security',

    // Nav
    'nav.dashboard': 'Home Overview',
    'nav.simulator': 'Before-You-Spend',
    'nav.riskMatrix': '6 Safety Checks',
    'nav.goalStrategy': 'My Goal & Strategy',
    'nav.leaks': 'Hidden Money Finder',
    'nav.scanner': 'AI Bill & Screenshot',
    'nav.rescue': '3 Easy Fixes',
    'nav.profile': 'Profile & Security',

    // Hero / Common
    'hero.badge': 'Universal Financial Digital Twin · Zero Jargon Edition',
    'hero.subtitle': 'Universal Financial Digital Twin & Multi-Risk Decision Engine',
    'hero.desc': 'Test any big purchase, client invoice, or shop order in ₹ Rupees before you spend a single Rupee. We simulate the next 90 days of your real life so you never get trapped by late payments or sneaky fees.',
    'hero.launchSim': 'Launch 90-Day Money Simulator',
    'hero.seeFixes': 'See 3 Easy Ways to Fix This',
    'hero.bannerPrompt': 'Want to see what happens before spending ₹{cost}?',
    'hero.bannerSub': 'Move sliders for price, payment delay days, down payment, and batch splitting to see your exact 90-day bank balance graph live.',
    'hero.runSimBtn': 'Run 90-Day Simulation',

    // KPIs
    'kpi.balance': 'Money Safe in Bank',
    'kpi.balanceSub': 'Untouchable: ₹{locked}',
    'kpi.locked': 'Untouchable Bills Locked (Rent/Salaries/Fees)',
    'kpi.lockedSub': 'Rent, college fees, salaries & emergency EMI',
    'kpi.planned': 'Planned Spending Outflow',
    'kpi.plannedSub': 'Active goal: {title}',
    'kpi.safeSpend': 'Safe to Spend Today',
    'kpi.safeSpendSub': 'After locking rent, bills & safety buffer',
    'kpi.shortageSub': 'Shortage of ₹{shortage} if purchase made',

    // 6 Core Pitch Checks
    'check1.title': 'Cash-Flow Prediction',
    'check1.question': 'Will you run out of money while doing the work?',
    'check1.desc': 'Shows exactly when and how much money could be short by comparing when you must spend vs. when money comes in.',

    'check2.title': 'Commitment Protection (Home Loan, Salaries & Rent)',
    'check2.question': 'Will money still be available for other needs?',
    'check2.desc': 'Protects upcoming commitments like Home Loan EMIs, Staff Salaries, House/Shop Rent, and fees before approving a new expense or order.',

    'check3.title': 'Customer & Incoming Payment Analysis',
    'check3.question': 'How reliable are your incoming payments?',
    'check3.desc': 'Checks past payment delays and upcoming money to tell you exact advance % to ask for.',

    'check4.title': 'Hidden-Cost Discovery',
    'check4.question': 'Did you forget any costs?',
    'check4.desc': 'Highlights overlooked expenses like delivery, packaging, late-night surge fees, or auto-debit subscriptions that reduce your money.',

    'check5.title': 'Suspicious-Record & Fraud Alerts',
    'check5.question': 'Does anything look suspicious?',
    'check5.desc': 'Flags unusual payments, repeated duplicate bills, unverified payment screenshots, or changed bank details for verification.',

    'check6.title': 'Risk & Scenario Comparison',
    'check6.question': "What if things don't go as planned?",
    'check6.desc': 'Tests late payments, rising costs, or multiple expenses arriving together and shows safe fixes.',

    // Simulator
    'sim.title': '90-Day Real-Life Money Simulator',
    'sim.adjustNumbers': 'Adjust Your Real-Life Numbers',
    'sim.liveSync': 'Live Sync with All Pages',
    'sim.expected': '🟢 What You Think Will Happen',
    'sim.reality': '🔴 What Actually Happens in Real Life',
    'sim.realitySafe': '🔵 Real-Life Balance Check',
    'sim.advanceSafe': '🛡️ How Much Advance You Need to Stay Safe',

    // Edge Cases / Rubric
    'rubric.panelTitle': '🧪 Judge Validation: Edge-Case Stress Tests, Assumptions & Limitations',
    'rubric.panelSubtitle': 'Srujana 2026 Evaluation Standard · Category: Robustness, Validation & Professional Boundaries (30 Points)',
    'rubric.test1Btn': 'Test Missing Payment History (New Customer/User)',
    'rubric.test2Btn': 'Test Contradictory / Unusual Input (Cost > 3x Balance)',
    'rubric.test3Btn': 'Test Simultaneous Multi-Order / Emergency Collision',
    'rubric.resetBtn': 'Reset to Standard Scenario',
    'rubric.assumptionsTitle': '📌 Explicit Model Assumptions',
    'rubric.assumptionsText': 'Projections assume locked commitments (Home Loan, Rent, Salaries) are fixed on scheduled dates and inflation/cost buffers remain within the user-selected range.',
    'rubric.limitationsTitle': '⚖️ Professional Boundaries & Limitations',
    'rubric.limitationsText': 'FINVEXA is a decision-support simulator, not a licensed financial advisor or guaranteed credit underwriter; OCR/AI receipt verification checks structural patterns (UTR/GST format) and must be reconciled against settled bank ledger rows before releasing goods.',
  },

  hi: {
    // Top Bar
    'topbar.brandSubtitle': 'खर्च करने से पहले समझदारी भरे पैसे के फैसले',
    'topbar.bankSynced': 'बैंक जुड़ा हुआ',
    'topbar.connectBank': 'आरबीआई एए बैंक जोड़ें',
    'topbar.hiddenMoney': 'छुपा पैसा',
    'topbar.cloud': 'क्लाउड',
    'topbar.themeLight': '☀️ लाइट मोड',
    'topbar.themeDark': '🌙 डार्क मोड',
    'topbar.resetDemo': 'डेमो रीसेट करें (जजों के लिए)',
    'topbar.signOut': 'साइन आउट',
    'topbar.profile': 'मेरी प्रोफ़ाइल और बैंक सुरक्षा',

    // Nav
    'nav.dashboard': 'होम ओवरव्यू',
    'nav.simulator': 'खर्च से पहले सिम्युलेटर',
    'nav.riskMatrix': '6 सुरक्षा जांचें',
    'nav.goalStrategy': 'मेरा लक्ष्य और रणनीति',
    'nav.leaks': 'छुपा पैसा खोजक',
    'nav.scanner': 'एआई बिल और स्क्रीनशॉट',
    'nav.rescue': '3 आसान समाधान',
    'nav.profile': 'प्रोफ़ाइल और सुरक्षा',

    // Hero / Common
    'hero.badge': 'यूनिवर्सल फाइनेंशियल डिजिटल ट्विन · शून्य जटिल शब्द संस्करण',
    'hero.subtitle': 'यूनिवर्सल फाइनेंशियल डिजिटल ट्विन और बहु-जोखिम निर्णय इंजन',
    'hero.desc': 'एक भी रुपया खर्च करने से पहले किसी भी बड़ी खरीदारी, ग्राहक इनवॉइस या दुकान ऑर्डर को ₹ रुपयों में टेस्ट करें। हम आपके अगले 90 दिनों का वास्तविक सिमुलेशन करते हैं ताकि आप कभी लेट पेमेंट या छुपे शुल्कों में न फंसें।',
    'hero.launchSim': '90-दिवसीय मनी सिम्युलेटर शुरू करें',
    'hero.seeFixes': '3 आसान उपाय देखें',
    'hero.bannerPrompt': 'क्या आप ₹{cost} खर्च करने से पहले देखना चाहते हैं कि क्या होगा?',
    'hero.bannerSub': 'कीमत, पेमेंट देरी दिन, डाउन पेमेंट और किस्तों के स्लाइडर हिलाकर अपना वास्तविक 90-दिन का बैंक बैलेंस ग्राफ लाइव देखें।',
    'hero.runSimBtn': '90-दिवसीय सिमुलेशन चलाएं',

    // KPIs
    'kpi.balance': 'बैंक में सुरक्षित पैसा',
    'kpi.balanceSub': 'अछूता आरक्षित: ₹{locked}',
    'kpi.locked': 'अछूता बिल सुरक्षित (किराया/वेतन/फीस)',
    'kpi.lockedSub': 'किराया, कॉलेज फीस, कर्मचारियों का वेतन और आपातकालीन ईएमआई',
    'kpi.planned': 'योजनाबद्ध खर्च आउटफ्लो',
    'kpi.plannedSub': 'सक्रिय लक्ष्य: {title}',
    'kpi.safeSpend': 'आज खर्च करने के लिए सुरक्षित',
    'kpi.safeSpendSub': 'किराया, बिल और बफर सुरक्षित करने के बाद',
    'kpi.shortageSub': 'खरीदने पर ₹{shortage} की कमी होगी',

    // 6 Core Pitch Checks
    'check1.title': 'कैश-फ्लो भविष्यवाणी (Cash-Flow Prediction)',
    'check1.question': 'क्या काम करते समय आपके पैसे खत्म हो जाएंगे?',
    'check1.desc': 'यह दिखाता है कि खर्च करने और पैसे आने के समय की तुलना करके कब और कितने पैसे कम पड़ सकते हैं।',

    'check2.title': 'प्रतिबद्धता सुरक्षा (होम लोन, वेतन और किराया)',
    'check2.question': 'क्या अन्य जरूरतों के लिए पैसा उपलब्ध रहेगा?',
    'check2.desc': 'नया खर्च या ऑर्डर स्वीकृत करने से पहले होम लोन ईएमआई, कर्मचारियों के वेतन, दुकान/घर के किराए और फीस जैसी प्रतिबद्धताओं की रक्षा करता है।',

    'check3.title': 'ग्राहक और आने वाले भुगतान का विश्लेषण',
    'check3.question': 'आपके आने वाले भुगतान कितने विश्वसनीय हैं?',
    'check3.desc': 'पिछले भुगतान में देरी और आने वाले पैसे की जांच करके बताता है कि कितना प्रतिशत एडवांस मांगना चाहिए।',

    'check4.title': 'छिपी हुई लागतों की खोज (Hidden-Cost Discovery)',
    'check4.question': 'क्या आप कोई लागत भूल गए हैं?',
    'check4.desc': 'डिलीवरी, पैकेजिंग, देर रात के सर्ज शुल्क या ऑटो-डेबिट सब्सक्रिप्शन जैसे अनदेखे खर्चों को उजागर करता है जो आपके पैसे कम करते हैं।',

    'check5.title': 'संदिग्ध रिकॉर्ड और धोखाधड़ी अलर्ट',
    'check5.question': 'क्या कुछ संदिग्ध लग रहा है?',
    'check5.desc': 'असामान्य भुगतान, दोहराए गए फर्जी बिल, असत्यापित भुगतान स्क्रीनशॉट या बदले हुए बैंक विवरण को सत्यापन के लिए चिह्नित करता है।',

    'check6.title': 'जोखिम और परिदृश्य तुलना (Risk & Scenario Comparison)',
    'check6.question': 'क्या होगा अगर योजना के अनुसार चीजें न हों?',
    'check6.desc': 'देर से भुगतान, बढ़ती लागत या एक साथ आने वाले कई खर्चों का परीक्षण करता है और सुरक्षित समाधान दिखाता है।',

    // Simulator
    'sim.title': '90-दिवसीय वास्तविक मनी सिम्युलेटर',
    'sim.adjustNumbers': 'अपने वास्तविक आंकड़े समायोजित करें',
    'sim.liveSync': 'सभी पृष्ठों के साथ लाइव सिंक',
    'sim.expected': '🟢 आप क्या सोचते हैं कि क्या होगा',
    'sim.reality': '🔴 वास्तविक जीवन में वास्तव में क्या होता है',
    'sim.realitySafe': '🔵 वास्तविक बैंक बैलेंस चेक',
    'sim.advanceSafe': '🛡️ सुरक्षित रहने के लिए आपको कितने एडवांस की जरूरत है',

    // Edge Cases / Rubric
    'rubric.panelTitle': '🧪 जज मूल्यांकन: एज-केस तनाव परीक्षण, धारणाएं और सीमाएं',
    'rubric.panelSubtitle': 'सृजना 2026 मूल्यांकन मानक · श्रेणी: मजबूती, सत्यापन और पेशेवर सीमाएं (30 अंक)',
    'rubric.test1Btn': 'भुगतान इतिहास न होने का टेस्ट (नया ग्राहक/उपयोगकर्ता)',
    'rubric.test2Btn': 'असामान्य इनपुट टेस्ट (लागत > बैंक बैलेंस का 3 गुना)',
    'rubric.test3Btn': 'एक साथ कई ऑर्डर/आपातकालीन टकराव टेस्ट',
    'rubric.resetBtn': 'सामान्य परिदृश्य पर रीसेट करें',
    'rubric.assumptionsTitle': '📌 स्पष्ट मॉडल धारणाएं',
    'rubric.assumptionsText': 'अनुमान मानते हैं कि लॉक की गई प्रतिबद्धताएं (होम लोन, किराया, वेतन) निर्धारित तिथियों पर स्थिर हैं और मुद्रास्फीति/लागत बफर सीमा के भीतर रहते हैं।',
    'rubric.limitationsTitle': '⚖️ पेशेवर सीमाएं और दायरा',
    'rubric.limitationsText': 'FINVEXA एक निर्णय-समर्थन सिम्युलेटर है, लाइसेंस प्राप्त वित्तीय सलाहकार या क्रेडिट अंडरराइटर नहीं; ओसीआर/एआई रसीद सत्यापन संरचनात्मक पैटर्न की जांच करता है और माल जारी करने से पहले बैंक खाता बही से मिलान होना आवश्यक है।',
  },

  kn: {
    // Top Bar
    'topbar.brandSubtitle': 'ಖರ್ಚು ಮಾಡುವ ಮುನ್ನ ಸ್ಮಾರ್ಟ್ ಆರ್ಥಿಕ ನಿರ್ಧಾರಗಳು',
    'topbar.bankSynced': 'ಬ್ಯಾಂಕ್ ಜೋಡಿಸಲಾಗಿದೆ',
    'topbar.connectBank': 'ಆರ್‌ಬಿಐ ಎಎ ಬ್ಯಾಂಕ್ ಜೋಡಿಸಿ',
    'topbar.hiddenMoney': 'ಅಡಗಿದ ಹಣ',
    'topbar.cloud': 'ಕ್ಲೌಡ್',
    'topbar.themeLight': '☀️ ಲೈಟ್ ಮೋಡ್',
    'topbar.themeDark': '🌙 ಡಾರ್ಕ್ ಮೋಡ್',
    'topbar.resetDemo': 'ಡೆಮೊ ಮರುಹೊಂದಿಸಿ (ತೀರ್ಪುಗಾರರಿಗೆ)',
    'topbar.signOut': 'ಸೈನ್ ಔಟ್',
    'topbar.profile': 'ನನ್ನ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಬ್ಯಾಂಕ್ ಭದ್ರತೆ',

    // Nav
    'nav.dashboard': 'ಮುಖಪುಟ ಅವಲೋಕನ',
    'nav.simulator': 'ಖರ್ಚು ಮಾಡುವ ಮುನ್ನ',
    'nav.riskMatrix': '6 ಸುರಕ್ಷತಾ ತಪಾಸಣೆಗಳು',
    'nav.goalStrategy': 'ನನ್ನ ಗುರಿ ಮತ್ತು ತಂತ್ರ',
    'nav.leaks': 'ಅಡಗಿದ ಹಣ ಶೋಧಕ',
    'nav.scanner': 'ಎಐ ಬಿಲ್ & ಸ್ಕ್ರೀನ್‌ಶಾಟ್',
    'nav.rescue': '3 ಸುಲಭ ಪರಿಹಾರಗಳು',
    'nav.profile': 'ಪ್ರೊಫೈಲ್ & ಭದ್ರತೆ',

    // Hero / Common
    'hero.badge': 'ಯೂನಿವರ್ಸಲ್ ಫೈನಾನ್ಷಿಯಲ್ ಡಿಜಿಟಲ್ ಟ್ವಿನ್ · ಶೂನ್ಯ ಕ್ಲಿಷ್ಟಕರ ಪದಗಳ ಆವೃತ್ತಿ',
    'hero.subtitle': 'ಯೂನಿವರ್ಸಲ್ ಫೈನಾನ್ಷಿಯಲ್ ಡಿಜಿಟಲ್ ಟ್ವಿನ್ & ಬಹು-ಅಪಾಯ ನಿರ್ಧಾರ ಎಂಜಿನ್',
    'hero.desc': 'ಒಂದು ರೂಪಾಯಿ ಖರ್ಚು ಮಾಡುವ ಮುನ್ನ ಯಾವುದೇ ದೊಡ್ಡ ಖರೀದಿ, ಗ್ರಾಹಕ ಇನ್‌ವಾಯ್ಸ್ ಅಥವಾ ಅಂಗಡಿ ಆರ್ಡರ್ ಅನ್ನು ₹ ರೂಪಾಯಿಗಳಲ್ಲಿ ಪರೀಕ್ಷಿಸಿ. ಮುಂದಿನ 90 ದಿನಗಳ ನೈಜ ಜೀವನದ ಹಣದ ಹರಿವನ್ನು ನಾವು ಸಿಮ್ಯುಲೇಟ್ ಮಾಡುತ್ತೇವೆ.',
    'hero.launchSim': '90-ದಿನಗಳ ಮನಿ ಸಿಮ್ಯುಲೇಟರ್ ಪ್ರಾರಂಭಿಸಿ',
    'hero.seeFixes': '3 ಸುಲಭ ಪರಿಹಾರಗಳನ್ನು ನೋಡಿ',
    'hero.bannerPrompt': '₹{cost} ಖರ್ಚು ಮಾಡುವ ಮೊದಲು ಏನಾಗುತ್ತದೆ ಎಂದು ನೋಡಲು ಬಯಸುವಿರಾ?',
    'hero.bannerSub': 'ಬೆಲೆ, ಪಾವತಿ ವಿಳಂಬದ ದಿನಗಳು, ಮುಂಗಡ ಪಾವತಿ ಮತ್ತು ಕಂತುಗಳ ಸ್ಲೈಡರ್‌ಗಳನ್ನು ಸರಿಸಿ ನಿಮ್ಮ 90 ದಿನಗಳ ನೈಜ ಬ್ಯಾಂಕ್ ಬ್ಯಾಲೆನ್ಸ್ ಗ್ರಾಫ್ ಅನ್ನು ಲೈವ್ ಆಗಿ ನೋಡಿ.',
    'hero.runSimBtn': '90-ದಿನಗಳ ಸಿಮ್ಯುಲೇಶನ್ ರನ್ ಮಾಡಿ',

    // KPIs
    'kpi.balance': 'ಬ್ಯಾಂಕ್‌ನಲ್ಲಿ ಸುರಕ್ಷಿತ ಹಣ',
    'kpi.balanceSub': 'ಮುಟ್ಟಲಾಗದ ಮೊತ್ತ: ₹{locked}',
    'kpi.locked': 'ಮುಟ್ಟಲಾಗದ ಬಿಲ್‌ಗಳು ಲಾಕ್ (ಬಾಡಿಗೆ/ವೇತನ)',
    'kpi.lockedSub': 'ಬಾಡಿಗೆ, ಕಾಲೇಜು ಶುಲ್ಕ, ಸಿಬ್ಬಂದಿ ವೇತನ & ಎಮರ್ಜೆನ್ಸಿ ಇಎಂಐ',
    'kpi.planned': 'ಯೋಜಿತ ಖರ್ಚು ಹೊರಹರಿವು',
    'kpi.plannedSub': 'ಸಕ್ರಿಯ ಗುರಿ: {title}',
    'kpi.safeSpend': 'ಇಂದು ಖರ್ಚು ಮಾಡಲು ಸುರಕ್ಷಿತ',
    'kpi.safeSpendSub': 'ಬಾಡಿಗೆ ಮತ್ತು ಬಫರ್ ಉಳಿಸಿದ ನಂತರ',
    'kpi.shortageSub': 'ಖರೀದಿಸಿದರೆ ₹{shortage} ಕೊರತೆಯಾಗಲಿದೆ',

    // 6 Core Pitch Checks
    'check1.title': 'ಹಣದ ಹರಿವಿನ ಮುನ್ಸೂಚನೆ (Cash-Flow Prediction)',
    'check1.question': 'ಕೆಲಸ ಮಾಡುವಾಗ ನಿಮ್ಮ ಬಳಿ ಹಣ ಖಾಲಿಯಾಗುತ್ತದೆಯೇ?',
    'check1.desc': 'ನೀವು ಯಾವಾಗ ಖರ್ಚು ಮಾಡಬೇಕು ಮತ್ತು ಹಣ ಯಾವಾಗ ಬರುತ್ತದೆ ಎಂಬುದನ್ನು ಹೋಲಿಸಿ ಹಣ ಯಾವಾಗ ಮತ್ತು ಎಷ್ಟು ಕಡಿಮೆಯಾಗಬಹುದು ಎಂದು ನಿಖರವಾಗಿ ತೋರಿಸುತ್ತದೆ.',

    'check2.title': 'ಬದ್ಧತೆಯ ರಕ್ಷಣೆ (ಗೃಹ ಸಾಲ, ವೇತನ ಮತ್ತು ಬಾಡಿಗೆ)',
    'check2.question': 'ಇತರ ಅಗತ್ಯಗಳಿಗೆ ಹಣ ಇನ್ನೂ ಲಭ್ಯವಿರುತ್ತದೆಯೇ?',
    'check2.desc': 'ಹೊಸ ಖರ್ಚು ಅಥವಾ ಆದೇಶವನ್ನು ಅನುಮೋದಿಸುವ ಮೊದಲು ಗೃಹ ಸಾಲದ ಇಎಂಐ, ಸಿಬ್ಬಂದಿ ವೇತನ, ಮನೆ/ಅಂಗಡಿ ಬಾಡಿಗೆ ಮುಂತಾದ ಮುಂಬರುವ ಬದ್ಧತೆಗಳನ್ನು ರಕ್ಷಿಸುತ್ತದೆ.',

    'check3.title': 'ಗ್ರಾಹಕ ಮತ್ತು ಒಳಬರುವ ಪಾವತಿ ವಿಶ್ಲೇಷಣೆ',
    'check3.question': 'ನಿಮ್ಮ ಒಳಬರುವ ಪಾವತಿಗಳು ಎಷ್ಟು ವಿಶ್ವಾಸಾರ್ಹವಾಗಿವೆ?',
    'check3.desc': 'ಹಿಂದಿನ ಪಾವತಿ ವಿಳಂಬಗಳು ಮತ್ತು ಮುಂಬರುವ ಹಣವನ್ನು ಪರಿಶೀಲಿಸಿ ಎಷ್ಟು ಮುಂಗಡ % ಕೇಳಬೇಕೆಂದು ನಿಖರವಾಗಿ ತಿಳಿಸುತ್ತದೆ.',

    'check4.title': 'ಅಡಗಿದ ವೆಚ್ಚಗಳ ಪತ್ತೆ (Hidden-Cost Discovery)',
    'check4.question': 'ನೀವು ಯಾವುದೇ ವೆಚ್ಚವನ್ನು ಮರೆತಿದ್ದೀರಾ?',
    'check4.desc': 'ಡೆಲಿವರಿ, ಪ್ಯಾಕೇಜಿಂಗ್, ತಡರಾತ್ರಿ ಸರ್ಜ್ ಶುಲ್ಕಗಳು ಅಥವಾ ಆಟೋ-ಡೆಬಿಟ್ ಚಂದಾದಾರಿಕೆಗಳಂತಹ ನಿರ್ಲಕ್ಷಿಸಿದ ವೆಚ್ಚಗಳನ್ನು ಎತ್ತಿ ತೋರಿಸುತ್ತದೆ.',

    'check5.title': 'ಅನುಮಾನಾಸ್ಪದ ದಾಖಲೆ ಮತ್ತು ವಂಚನೆ ಎಚ್ಚರಿಕೆಗಳು',
    'check5.question': 'ಏನಾದರೂ ಅನುಮಾನಾಸ್ಪದವಾಗಿ ಕಾಣುತ್ತಿದೆಯೇ?',
    'check5.desc': 'ಅಸಾಮಾನ್ಯ ಪಾವತಿಗಳು, ಪುನರಾವರ್ತಿತ ನಕಲಿ ಬಿಲ್‌ಗಳು, ಪರಿಶೀಲಿಸದ ಪಾವತಿ ಸ್ಕ್ರೀನ್‌ಶಾಟ್‌ಗಳು ಅಥವಾ ಬದಲಾದ ಬ್ಯಾಂಕ್ ವಿವರಗಳನ್ನು ಪರಿಶೀಲನೆಗಾಗಿ ಫ್ಲ್ಯಾಗ್ ಮಾಡುತ್ತದೆ.',

    'check6.title': 'ಅಪಾಯ ಮತ್ತು ಸನ್ನಿವೇಶದ ಹೋಲಿಕೆ (Risk & Scenario Comparison)',
    'check6.question': 'ಯೋಜನೆಯಂತೆ ಕೆಲಸಗಳು ನಡೆಯದಿದ್ದರೆ ಏನು ಮಾಡುವುದು?',
    'check6.desc': 'ತಡವಾದ ಪಾವತಿಗಳು, ಹೆಚ್ಚುತ್ತಿರುವ ವೆಚ್ಚಗಳು ಅಥವಾ ಒಟ್ಟಿಗೆ ಬರುವ ಬಹು ಖರ್ಚುಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ ಸುರಕ್ಷಿತ ಪರಿಹಾರಗಳನ್ನು ತೋರಿಸುತ್ತದೆ.',

    // Simulator
    'sim.title': '90-ದಿನಗಳ ನೈಜ ಹಣದ ಸಿಮ್ಯುಲೇಟರ್',
    'sim.adjustNumbers': 'ನಿಮ್ಮ ನೈಜ ಸಂಖ್ಯೆಗಳನ್ನು ಹೊಂದಿಸಿ',
    'sim.liveSync': 'ಎಲ್ಲಾ ಪುಟಗಳೊಂದಿಗೆ ಲೈವ್ ಸಿಂಕ್',
    'sim.expected': '🟢 ನೀವು ಏನಾಗುತ್ತದೆ ಎಂದು ಭಾವಿಸುತ್ತೀರಿ',
    'sim.reality': '🔴 ನೈಜ ಜೀವನದಲ್ಲಿ ವಾಸ್ತವವಾಗಿ ಏನಾಗುತ್ತದೆ',
    'sim.realitySafe': '🔵 ನೈಜ ಬ್ಯಾಂಕ್ ಬ್ಯಾಲೆನ್ಸ್ ಪರಿಶೀಲನೆ',
    'sim.advanceSafe': '🛡️ ಸುರಕ್ಷಿತವಾಗಿರಲು ನಿಮಗೆ ಎಷ್ಟು ಮುಂಗಡ ಹಣ ಬೇಕು',

    // Edge Cases / Rubric
    'rubric.panelTitle': '🧪 ಜಡ್ಜ್ ಮೌಲ್ಯಮಾಪನ: ಎಡ್ಜ್-ಕೇಸ್ ಒತ್ತಡ ಪರೀಕ್ಷೆಗಳು, ಊಹೆಗಳು & ಮಿತಿಗಳು',
    'rubric.panelSubtitle': 'ಸೃಜನಾ 2026 ಮೌಲ್ಯಮಾಪನ ಮಾನದಂಡ · ವರ್ಗ: ದೃಢತೆ, ಮೌಲ್ಯಮಾಪನ ಮತ್ತು ವೃತ್ತಿಪರ ಮಿತಿಗಳು (30 ಅಂಕಗಳು)',
    'rubric.test1Btn': 'ಪಾವತಿ ಇತಿಹಾಸವಿಲ್ಲದ ಪರೀಕ್ಷೆ (ಹೊಸ ಗ್ರಾಹಕ/ಬಳಕೆದಾರ)',
    'rubric.test2Btn': 'ಅಸಾಮಾನ್ಯ ಇನ್‌ಪುಟ್ ಪರೀಕ್ಷೆ (ವೆಚ್ಚ > ಬ್ಯಾಂಕ್ ಬ್ಯಾಲೆನ್ಸ್‌ಗಿಂತ 3 ಪಟ್ಟು)',
    'rubric.test3Btn': 'ಏಕಕಾಲಿಕ ಬಹು-ಆದೇಶ / ತುರ್ತು ಘರ್ಷಣೆ ಪರೀಕ್ಷೆ',
    'rubric.resetBtn': 'ಸಾಮಾನ್ಯ ಸ್ಥಿತಿಗೆ ಮರುಹೊಂದಿಸಿ',
    'rubric.assumptionsTitle': '📌 ಮಾದರಿಯ ಸ್ಪಷ್ಟ ಊಹೆಗಳು',
    'rubric.assumptionsText': 'ಲಾಕ್ ಮಾಡಲಾದ ಬದ್ಧತೆಗಳು (ಗೃಹ ಸಾಲ, ಬಾಡಿಗೆ, ವೇತನಗಳು) ನಿಗದಿತ ದಿನಾಂಕಗಳಲ್ಲಿ ಸ್ಥಿರವಾಗಿವೆ ಮತ್ತು ಹಣದುಬ್ಬರ/ವೆಚ್ಚದ ಬಫರ್‌ಗಳು ಬಳಕೆದಾರರು ಆಯ್ಕೆಮಾಡಿದ ವ್ಯಾಪ್ತಿಯಲ್ಲಿರುತ್ತವೆ ಎಂದು ಮುನ್ಸೂಚನೆಗಳು ಭಾವಿಸುತ್ತವೆ.',
    'rubric.limitationsTitle': '⚖️ ವೃತ್ತಿಪರ ಗಡಿಗಳು & ಮಿತಿಗಳು',
    'rubric.limitationsText': 'FINVEXA ಒಂದು ನಿರ್ಧಾರ-ಬೆಂಬಲ ಸಿಮ್ಯುಲೇಟರ್ ಆಗಿದೆ, ಪರವಾನಗಿ ಪಡೆದ ಆರ್ಥಿಕ ಸಲಹೆಗಾರ ಅಥವಾ ಸಾಲ ನೀಡುವ ಸಂಸ್ಥೆಯಲ್ಲ; ಒಸಿಆರ್/ಎಐ ರಶೀದಿ ಪರಿಶೀಲನೆಯು ರಚನಾತ್ಮಕ ಮಾದರಿಗಳನ್ನು ಪರೀಕ್ಷಿಸುತ್ತದೆ ಮತ್ತು ಸರಕುಗಳನ್ನು ಬಿಡುಗಡೆ ಮಾಡುವ ಮೊದಲು ಬ್ಯಾಂಕ್ ಲೆಡ್ಜರ್‌ನೊಂದಿಗೆ ಹೊಂದಾಣಿಕೆ ಮಾಡಿಕೊಳ್ಳಬೇಕು.',
  },

  te: {
    // Top Bar
    'topbar.brandSubtitle': 'ఖర్చు చేయడానికి ముందే సరైన ఆర్థిక నిర్ణయాలు',
    'topbar.bankSynced': 'బ్యాంక్ లింక్ చేయబడింది',
    'topbar.connectBank': 'ఆర్బీఐ ఏఏ బ్యాంక్ కనెక్ట్ చేయండి',
    'topbar.hiddenMoney': 'దాగిన ధనం',
    'topbar.cloud': 'క్లౌడ్',
    'topbar.themeLight': '☀️ లైట్ మోడ్',
    'topbar.themeDark': '🌙 డార్క్ మోడ్',
    'topbar.resetDemo': 'డెమో రీసెట్ చేయండి (జడ్జిల కోసం)',
    'topbar.signOut': 'సైన్ అవుట్',
    'topbar.profile': 'నా ప్రొఫైల్ & బ్యాంక్ భద్రత',

    // Nav
    'nav.dashboard': 'హోమ్ అవలోకనం',
    'nav.simulator': 'ఖర్చుకు ముందు సిమ్యులేటర్',
    'nav.riskMatrix': '6 రక్షణ తనిఖీలు',
    'nav.goalStrategy': 'నా లక్ష్యం & వ్యూహం',
    'nav.leaks': 'దాగివున్న ధనం గుర్తింపు',
    'nav.scanner': 'ఏఐ బిల్ & స్క్రీన్ షాట్',
    'nav.rescue': '3 సులభ పరిష్కారాలు',
    'nav.profile': 'ప్రొఫైల్ & భద్రత',

    // Hero / Common
    'hero.badge': 'యూనివర్సల్ ఫైనాన్షియల్ డిజిటల్ ట్విన్ · సులభమైన పదాల ఎడిషన్',
    'hero.subtitle': 'యూనివర్సల్ ఫైనాన్షియల్ డిజిటల్ ట్విన్ & మల్టీ-రిస్క్ డెసిషన్ ఇంజిన్',
    'hero.desc': 'ఒక్క రూపాయి ఖర్చు చేయడానికి ముందే ఏదైనా పెద్ద కొనుగోలు, క్లయింట్ ఇన్‌వాయిస్ లేదా షాప్ ఆర్డర్‌ను ₹ రూపాయలలో పరీక్షించండి. ఆలస్యమైన చెల్లింపులు లేదా దాచిన రుసుములలో మీరు ఎప్పటికీ చిక్కుకోకుండా రాబోయే 90 రోజుల నిజ జీవితాన్ని మేము అనుకరిస్తాము.',
    'hero.launchSim': '90-రోజుల మనీ సిమ్యులేటర్ ప్రారంభించండి',
    'hero.seeFixes': '3 సులభ మార్గాలను చూడండి',
    'hero.bannerPrompt': '₹{cost} ఖర్చు చేయడానికి ముందు ఏమి జరుగుతుందో చూడాలనుకుంటున్నారా?',
    'hero.bannerSub': 'ధర, చెల్లింపు ఆలస్యమయ్యే రోజులు, ముందస్తు చెల్లింపు మరియు వాయిదాల స్లైడర్‌లను సర్దుబాటు చేయడం ద్వారా మీ 90 రోజుల బ్యాంక్ బ్యాలెన్స్ గ్రాఫ్‌ను ప్రత్యక్షంగా చూడండి.',
    'hero.runSimBtn': '90-రోజుల అనుకరణను ప్రారంభించండి',

    // KPIs
    'kpi.balance': 'బ్యాంకులో సురక్షిత ధనం',
    'kpi.balanceSub': 'తాకకూడని మొత్తం: ₹{locked}',
    'kpi.locked': 'తాకకూడని బిల్లులు లాక్ (అద్దె/జీతాలు/ఫీజులు)',
    'kpi.lockedSub': 'అద్దె, కళాశాల ఫీజులు, సిబ్బంది జీతాలు మరియు అత్యవసర ఈఎంఐ',
    'kpi.planned': 'ప్లాన్ చేసిన ఖర్చు మొత్తం',
    'kpi.plannedSub': 'లక్ష్యం: {title}',
    'kpi.safeSpend': 'ఈ రోజు ఖర్చు చేయదగిన మొత్తం',
    'kpi.safeSpendSub': 'అద్దె, బిల్లులు మరియు అత్యవసర నిధి దాచిన తర్వాత',
    'kpi.shortageSub': 'కొనుగోలు చేస్తే ₹{shortage} నగదు కొరత వస్తుంది',

    // 6 Core Pitch Checks
    'check1.title': 'నగదు ప్రవాహ అంచనా (Cash-Flow Prediction)',
    'check1.question': 'పని చేస్తున్నప్పుడు మీ డబ్బులు అయిపోతాయా?',
    'check1.desc': 'మీరు ఎప్పుడు ఖర్చు చేయాలి మరియు డబ్బు ఎప్పుడు వస్తుందో పోల్చి ఎప్పుడు ఎంత కొరత రావాలో ఖచ్చితంగా చూపుతుంది.',

    'check2.title': 'కమిట్మెంట్ రక్షణ (హోమ్ లోన్, జీతాలు & అద్దె)',
    'check2.question': 'ఇతర అవసరాలకు డబ్బు ఇంకా అందుబాటులో ఉంటుందా?',
    'check2.desc': 'కొత్త ఖర్చు లేదా ఆర్డర్‌ను ఆమోదించే ముందు హోమ్ లోన్ ఈఎంఐలు, సిబ్బంది జీతాలు, ఇల్లు/షాప్ అద్దె వంటి రాబోయే చెల్లింపులను రక్షిస్తుంది.',

    'check3.title': 'కస్టమర్ & ఇన్‌కమింగ్ చెల్లింపుల విశ్లేషణ',
    'check3.question': 'మీకు రావాల్సిన పేమెంట్లు ఎంత నమ్మకమైనవి?',
    'check3.desc': 'గత చెల్లింపు ఆలస్యాలు మరియు రాబోయే డబ్బును విశ్లేషించి కస్టమర్ నుండి ఎంత శాతం అడ్వాన్స్ అడగాలో ఖచ్చితంగా చెబుతుంది.',

    'check4.title': 'దాగివున్న ఖర్చుల శోధన (Hidden-Cost Discovery)',
    'check4.question': 'మీరు ఏవైనా ఖర్చులు మర్చిపోయారా?',
    'check4.desc': 'డెలివరీ, ప్యాకేజింగ్, రాత్రి సమయ సర్జ్ ఛార్జీలు లేదా ఆటో-డెబిట్ సబ్‌స్క్రిప్షన్ల వంటి మీరు గమనించని ఖర్చులను ఎత్తిచూపుతుంది.',

    'check5.title': 'అనుమానాస్పద లావాదేవీలు & ఫ్రాడ్ అలర్ట్‌లు',
    'check5.question': 'ఏదైనా అనుమానాస్పదంగా కనిపిస్తోందా?',
    'check5.desc': 'అసాధారణ చెల్లింపులు, నకిలీ బిల్లులు, ధృవీకరించని పేమెంట్ స్క్రీన్‌షాట్లు లేదా మారిన బ్యాంక్ వివరాలను తనిఖీ కోసం ఫ్లాగ్ చేస్తుంది.',

    'check6.title': 'రిస్క్ & పరిస్థితుల పోలిక (Risk & Scenario Comparison)',
    'check6.question': 'అనుకున్నట్లు జరగకపోతే ఏమిటి?',
    'check6.desc': 'ఆలస్యమైన చెల్లింపులు, పెరిగే ఖర్చులు లేదా ఒకేసారి వచ్చే ఖర్చులను పరీక్షించి సురక్షిత పరిష్కారాలను చూపుతుంది.',

    // Simulator
    'sim.title': '90-రోజుల రియల్ లైఫ్ మనీ సిమ్యులేటర్',
    'sim.adjustNumbers': 'మీ నిజ జీవిత సంఖ్యలను సర్దుబాటు చేయండి',
    'sim.liveSync': 'అన్ని పేజీలతో లైవ్ సింక్',
    'sim.expected': '🟢 మీరు ఏమి జరుగుతుందని అనుకుంటున్నారు',
    'sim.reality': '🔴 నిజ జీవితంలో అసలు ఏమి జరుగుతుంది',
    'sim.realitySafe': '🔵 రియల్ లైఫ్ బ్యాలెన్స్ తనిఖీ',
    'sim.advanceSafe': '🛡️ మీరు సురక్షితంగా ఉండటానికి ఎంత అడ్వాన్స్ అవసరం',

    // Edge Cases / Rubric
    'rubric.panelTitle': '🧪 జడ్జి ధృవీకరణ: ఎడ్జ్-కేస్ పరీక్షలు, అంచనాలు & పరిమితులు',
    'rubric.panelSubtitle': 'సృజనా 2026 మూల్యాంకన ప్రమాణం · విభాగం: రోబస్ట్‌నెస్, ధృవీకరణ మరియు వృత్తిపరమైన పరిమితులు (30 పాయింట్లు)',
    'rubric.test1Btn': 'పేమెంట్ హిస్టరీ లేని పరీక్ష (కొత్త కస్టమర్/యూజర్)',
    'rubric.test2Btn': 'అసాధారణ ఇన్‌పుట్ పరీక్ష (ఖర్చు > బ్యాలెన్స్ కంటే 3 రెట్లు)',
    'rubric.test3Btn': 'ఏకకాలంలో బహుళ ఆర్డర్‌లు / అత్యవసర తాకిడి పరీక్ష',
    'rubric.resetBtn': 'సాధారణ స్థితికి రీసెట్ చేయండి',
    'rubric.assumptionsTitle': '📌 మోడల్ స్పష్టమైన ఊహలు',
    'rubric.assumptionsText': 'లాక్ చేయబడిన చెల్లింపులు (హోమ్ లోన్, అద్దె, జీతాలు) నిర్ణీత తేదీలలో స్థిరంగా ఉంటాయని మరియు ద్రవ్యోల్బణం/ఖర్చు బఫర్లు ఎంచుకున్న పరిధిలోనే ఉంటాయని అంచనాలు భావిస్తాయి.',
    'rubric.limitationsTitle': '⚖️ వృత్తిపరమైన పరిమితులు & హద్దులు',
    'rubric.limitationsText': 'FINVEXA అనేది నిర్ణయ మద్దతు సిమ్యులేటర్ మాత్రమే, లైసెన్స్ పొందిన ఆర్థిక సలహాదారు లేదా క్రెడిట్ అండర్‌రైటర్ కాదు; OCR/AI రసీదు ధృవీకరణ నిర్మాణ విధానాలను పరీక్షిస్తుంది మరియు వస్తువులను విడుదల చేయడానికి ముందు బ్యాంక్ లెడ్జర్‌తో సరిపోల్చాలి.',
  },
}

export function translate(
  lang: Language,
  key: string,
  params?: Record<string, string | number>
): string {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en
  let text = dict[key] || TRANSLATIONS.en[key] || key

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
    })
  }

  return text
}
