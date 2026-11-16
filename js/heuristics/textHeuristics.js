/**
 * ScamGuard Pro - Text & SMS Heuristic Engine
 * Multilingual pattern matching (English, Hindi, Marathi, Hinglish)
 */

export function analyzeText(text, lang = 'en') {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return {
      score: 0,
      verdict: 'SAFE',
      category: 'clean',
      redFlags: [],
      psychologicalTriggers: [],
      mitigations: []
    };
  }

  const cleanText = text.toLowerCase();
  const redFlags = [];
  const psychologicalTriggers = new Set();
  let baseScore = 0;
  let detectedCategory = 'general';

  // 1. Digital Arrest / Law Enforcement Impersonation
  const digitalArrestPatterns = [
    /\b(digital arrest|cbi|central bureau|mumbai police|delhi police|cyber crime branch|ed|enforcement directorate|narcotics control bureau|ncb|customs clearance|supreme court of india|arrest warrant|fir registered|skype statement|video interrogation|confidential investigation)\b/i,
    /(डिजिटल अरेस्ट|सीबीआई|मुंबई पुलिस|दिल्ली पुलिस|नारकोटिक्स|अरेस्ट वारंट|गिरफ्तारी|कस्टम्स|सुप्रीम कोर्ट|सीबीआई जांच|स्काइप कॉल)/i,
    /(डिजिटल अरेस्ट|सीबीआय|मुंबई पोलीस|अटक वॉरंट|गुन्हे शाखा|अमली पदार्थ|कस्टम्स|अटक आदेश|व्हिडिओ कॉल चौकशी)/i
  ];

  let digitalArrestMatch = false;
  for (const pattern of digitalArrestPatterns) {
    if (pattern.test(cleanText)) {
      digitalArrestMatch = true;
      break;
    }
  }

  if (digitalArrestMatch) {
    baseScore = Math.max(baseScore, 92);
    detectedCategory = 'digital_arrest';
    psychologicalTriggers.add('authority_fear');
    psychologicalTriggers.add('isolation');

    redFlags.push({
      id: 'flag_digital_arrest',
      severity: 'CRITICAL',
      title: lang === 'hi' ? 'फर्जी कानूनी एजेंसी / डिजिटल अरेस्ट की धमकी' : (lang === 'mr' ? 'बनावट पोलीस / डिजिटल अरेस्टची धमकी' : 'Digital Arrest / Law Enforcement Impersonation'),
      description: lang === 'hi' 
        ? 'संदेश में सीबीआई/पुलिस/सुप्रीम कोर्ट का नाम लेकर गिरफ्तारी और ऑनलाइन वीडियो पूछताछ का झांसा दिया गया है।' 
        : (lang === 'mr' 
          ? 'संदेशात सीबीआय/पोलीस/न्यायालयाचे नाव वापरून बेकायदेशीर ऑनलाइन अटकेची भीती दाखवण्यात आली आहे.' 
          : 'Message impersonates law enforcement agencies (CBI, Police, Court) threatening online video interrogation or arrest.'),
      trigger: 'Fear of Authority & Isolation'
    });
  }

  // 2. Electricity / Utility Disconnection Threat
  const electricityPatterns = [
    /\b(electricity|power|bill|disconnected|tonight 9:30|update your bill|contact electricity officer|bses|tneb|mahadiscom|tata power|wbsetcl|dhbvn|previous month bill)\b/i,
    /(बिजली बिल|बिजली काट|आज रात|कनेक्शन काट दिया जाएगा|विद्युत अधिकारी|बिल अपडेट)/i,
    /(वीज बिल|वीज पुरवठा खंडित|आज रात्री|महावितरण|वीज अधिकारी संपर्क|बिल भरणा)/i
  ];

  let electricityMatch = 0;
  if (/disconnect|काट दिया जाएगा|खंडित/i.test(cleanText)) electricityMatch++;
  if (/electricity|power|बिजली|वीज|bill|बिल/i.test(cleanText)) electricityMatch++;
  if (/officer|contact|कॉल करें|संपर्क|9:30|8:30/i.test(cleanText)) electricityMatch++;

  if (electricityMatch >= 2) {
    baseScore = Math.max(baseScore, 90);
    detectedCategory = 'electricity_scam';
    psychologicalTriggers.add('urgency');
    psychologicalTriggers.add('panic_loss');

    redFlags.push({
      id: 'flag_electricity',
      severity: 'CRITICAL',
      title: lang === 'hi' ? 'बिजली कनेक्शन काटने की फर्जी धमकी' : (lang === 'mr' ? 'वीज पुरवठा खंडित करण्याची बनावट धमकी' : 'Urgent Utility / Electricity Disconnection Scam'),
      description: lang === 'hi'
        ? 'बिजली विभाग कभी भी निजी फोन नंबर देकर 2 घंटे में बिजली काटने का एसएमएस नहीं भेजता।'
        : (lang === 'mr'
          ? 'महावितरण किंवा वीज कंपनी कधीही वैयक्तिक मोबाईल नंबर देऊन वीज कापण्याचा संदेश पाठवत नाही.'
          : 'Power utilities never send instant disconnection threats with personal mobile numbers for clearance.'),
      trigger: 'Immediate Loss & Panic'
    });
  }

  // 3. Banking, PAN / Aadhaar KYC Freeze
  const kycPatterns = [
    /\b(sbi|yono|hdfc|icici|axis|pnb|bob|bank account|kyc|pan card|aadhaar|blocked|suspended|deactivated|expire|unblock|apk download)\b/i,
    /(खाता ब्लॉक|पैन कार्ड|केवायसी|बैंक खाता बंद|सस्पेंड|अपडेट करें|योनो)/i,
    /(खाते ब्लॉक|पॅन कार्ड लिंक|केवायसी अपडेट|बँक खाते बंद|अकाउंट सस्पेंड)/i
  ];

  let kycMatchCount = 0;
  if (/sbi|yono|hdfc|icici|bank|खाता|बँक/i.test(cleanText)) kycMatchCount++;
  if (/kyc|pan|aadhaar|blocked|suspended|deactivated|बंद|ब्लॉक/i.test(cleanText)) kycMatchCount++;
  if (/http|bit\.ly|link|click|डाउनलोड|अपडेट|update|apk/i.test(cleanText)) kycMatchCount++;

  if (kycMatchCount >= 2) {
    baseScore = Math.max(baseScore, 88);
    if (detectedCategory === 'general') detectedCategory = 'banking_kyc';
    psychologicalTriggers.add('financial_panic');
    psychologicalTriggers.add('urgency');

    redFlags.push({
      id: 'flag_kyc_phish',
      severity: 'CRITICAL',
      title: lang === 'hi' ? 'बैंक खाता / पैन-केवायसी फ्रीज का झांसा' : (lang === 'mr' ? 'बँक खाते / पॅन केवायसी ब्लॉकची फसवणूक' : 'Bank Account / KYC Deactivation Trap'),
      description: lang === 'hi'
        ? 'बैंक कभी भी एसएमएस में अनौपचारिक लिंक या ऐप डाउनलोड करने को नहीं कहते।'
        : (lang === 'mr'
          ? 'बँका कधीही अनधिकृत लिंक किंवा ॲप डाउनलोड करून केवायसी अपडेट करण्यास सांगत नाहीत.'
          : 'Banks never ask customers to update KYC via third-party web links or unofficial mobile numbers.'),
      trigger: 'Financial Deprivation Fear'
    });
  }

  // 4. Remote Control Apps (AnyDesk, TeamViewer, RustDesk, QuickSupport)
  if (/\b(anydesk|teamviewer|rustdesk|quicksupport|airdroid|screen share|screen mirroring)\b/i.test(cleanText)) {
    baseScore = Math.max(baseScore, 95);
    psychologicalTriggers.add('deception_assistance');

    redFlags.push({
      id: 'flag_remote_app',
      severity: 'CRITICAL',
      title: lang === 'hi' ? 'स्क्रीन शेयरिंग / रिमोट एक्सेस ऐप की मांग' : (lang === 'mr' ? 'स्क्रीन शेअरिंग / रिमोट ॲप इन्स्टॉलेशनचा प्रयत्न' : 'Dangerous Remote Access Tool Prompt'),
      description: lang === 'hi'
        ? 'AnyDesk या TeamViewer के जरिए जालसाज आपके पूरे फोन और बैंक ओटीपी पर नियंत्रण कर लेते हैं।'
        : (lang === 'mr'
          ? 'AnyDesk किंवा TeamViewer द्वारे भामटे तुमच्या मोबाईलचा ताबा घेऊन गुप्त ओटीपी चोरतात.'
          : 'Tool grants complete remote takeover of your mobile screen to silently read OTPs and credentials.'),
      trigger: 'Assistance Illusion'
    });
  }

  // 5. Part-time Job / YouTube Like / Telegram Prepaid Task
  const jobPatterns = [
    /\b(part time job|work from home|like youtube|review google|earn 3000|earn 5000|daily payment|telegram group|prepaid task|crypto task)\b/i,
    /(पार्ट टाइम जॉब|घर बैठे कमाई|यूट्यूब लाइक|टेलीग्राम टास्क|प्रतिदिन 3000|रोजाना कमाई)/i,
    /(पार्ट टाइम नोकरी|घरी बसून कमाई|व्हिडिओ लाईक करा|टेलिग्राम टास्क|दररोज ३००० रुपये)/i
  ];

  let jobMatch = false;
  for (const pattern of jobPatterns) {
    if (pattern.test(cleanText)) {
      jobMatch = true;
      break;
    }
  }

  if (jobMatch) {
    baseScore = Math.max(baseScore, 82);
    if (detectedCategory === 'general') detectedCategory = 'part_time_job';
    psychologicalTriggers.add('greed_easy_money');

    redFlags.push({
      id: 'flag_part_time_job',
      severity: 'HIGH',
      title: lang === 'hi' ? 'टेलीग्राम पार्ट-टाइम जॉब / यूट्यूब लाइक स्कैम' : (lang === 'mr' ? 'टेलिग्राम पार्ट-टाइम जॉब / प्रीपेड टास्क घोटाळा' : 'Part-Time Job / Video Like Ponzi Scheme'),
      description: lang === 'hi'
        ? 'छोटे काम के बदले बड़ा पैसा देने का लालच देकर बाद में क्रिप्टो/प्रीपेड टास्क में लाखों रुपये लूटे जाते हैं।'
        : (lang === 'mr'
          ? 'सुरुवातीला थोडे पैसे देऊन विश्वास संपादन केला जातो, नंतर प्रीपेड टास्कच्या नावाखाली मोठी रक्कम उकळली जाते.'
          : 'Lures victims with initial ₹150 payouts, then traps them in mandatory high-value prepaid crypto tasks.'),
      trigger: 'Easy Income Greed'
    });
  }

  // 6. Lottery / KBC / Prize / Lucky Draw
  if (/\b(lottery|kbc|kaun banega crorepati|lucky draw|25 lakh|winner|claim prize|cheque)\b/i.test(cleanText) ||
      /(लॉटरी|केबीसी|२५ लाख|25 लाख|इनाम|विजेता)/i.test(cleanText)) {
    baseScore = Math.max(baseScore, 86);
    if (detectedCategory === 'general') detectedCategory = 'lottery_fraud';
    psychologicalTriggers.add('unexpected_wealth');

    redFlags.push({
      id: 'flag_lottery',
      severity: 'HIGH',
      title: lang === 'hi' ? 'फर्जी लॉटरी / केबीसी पुरस्कार' : (lang === 'mr' ? 'बनावट लॉटरी / केबीसी बक्षीस फसवणूक' : 'Advance Fee / Fake Lottery Scam'),
      description: lang === 'hi'
        ? 'बिना टिकट खरीदे लॉटरी नहीं जीती जा सकती। इनाम का दावा करने के नाम पर टैक्स या प्रोसेसिंग फीस मांगी जाएगी।'
        : (lang === 'mr'
          ? 'कोणतीही लॉटरी न काढता बक्षीस लागत नाही. बक्षीस मिळवण्यासाठी अनामत रक्कम किंवा टॅक्स मागितला जातो.'
          : 'Advance fee fraud promising large windfalls while demanding upfront processing fees or taxes.'),
      trigger: 'Greed & Euphoria'
    });
  }

  // 7. Sextortion / Video Call Blackmail
  if (/\b(recorded your video|leak video|send to your contacts|facebook friends|ruin reputation|viral video)\b/i.test(cleanText) ||
      /(वीडियो वायरल|बदनामी|सारे कॉन्टैक्ट्स को भेज दूंगा|वीडियो लीक)/i.test(cleanText) ||
      /(व्हिडिओ व्हायरल|नातेवाईकांना पाठवेन|बदनामी करीन)/i.test(cleanText)) {
    baseScore = Math.max(baseScore, 96);
    detectedCategory = 'sextortion';
    psychologicalTriggers.add('shame_blackmail');

    redFlags.push({
      id: 'flag_sextortion',
      severity: 'CRITICAL',
      title: lang === 'hi' ? 'वीडियो ब्लैकमेलिंग एवं एक्सटॉर्शन' : (lang === 'mr' ? 'व्हिडिओ ब्लॅकमेलिंग आणि सायबर खंडणी' : 'Sextortion & Reputation Blackmail'),
      description: lang === 'hi'
        ? 'मॉर्फ्ड वीडियो या फर्जी पुलिस अधिकारी बनकर डराकर पैसे ऐंठने का अंतरराष्ट्रीय गिरोह।'
        : (lang === 'mr'
          ? 'मॉर्फ केलेल्या व्हिडिओची किंवा बदनामीची भीती दाखवून खंडणी उकळण्याचा प्रकार.'
          : 'Threatening to leak private or morphed recordings to social contacts unless ransom is paid.'),
      trigger: 'Severe Social Shame & Extortion'
    });
  }

  // 8. General Extreme Urgency Triggers
  const urgencyPatterns = [
    /\b(urgent|immediately|within 24 hours|within 2 hours|today only|last chance|final warning|penalty|action will be taken)\b/i,
    /(तुरंत|तात्काल|अंतिम चेतावनी|आज ही|जुर्माना|कार्रवाई होगी)/i,
    /(लगेच|तात्काळ|शेवटची संधी|अंतिम चेतावणी|दंड आकारला जाईल|कारवाई केली जाईल)/i
  ];

  let hasUrgency = false;
  for (const pattern of urgencyPatterns) {
    if (pattern.test(cleanText)) {
      hasUrgency = true;
      psychologicalTriggers.add('extreme_urgency');
      break;
    }
  }

  if (hasUrgency && baseScore > 0) {
    baseScore = Math.min(100, baseScore + 6);
  }

  // 9. Links present in text
  const linkMatches = cleanText.match(/(https?:\/\/[^\s]+|bit\.ly\/[^\s]+|tinyurl\.com\/[^\s]+|[a-z0-9-]+\.(xyz|top|club|icu|buzz)[^\s]*)/ig);
  if (linkMatches && linkMatches.length > 0) {
    baseScore = Math.max(baseScore, 45);
    redFlags.push({
      id: 'flag_suspicious_link',
      severity: 'HIGH',
      title: lang === 'hi' ? 'संदिग्ध वेब लिंक मौजूद' : (lang === 'mr' ? 'संशयास्पद वेब लिंक समाविष्ट' : 'Suspicious Embedded Hyperlink'),
      description: lang === 'hi' 
        ? `संदेश में अज्ञात या शॉर्ट लिंक (${linkMatches[0].slice(0, 35)}...) शामिल है।`
        : (lang === 'mr'
          ? `संदेशात अनोळखी अथवा संशयास्पद लिंक (${linkMatches[0].slice(0, 35)}...) आहे.`
          : `Message contains unverified or shortened link (${linkMatches[0].slice(0, 35)}...).`),
      trigger: 'Credential Harvesting Bait'
    });
  }

  // Clean / Safe verdict if score is low
  if (redFlags.length === 0) {
    baseScore = Math.min(15, cleanText.length > 20 ? 10 : 5);
    detectedCategory = 'safe_text';
  }

  // Determine Verdict
  let verdict = 'SAFE';
  if (baseScore >= 70) {
    verdict = 'HIGH';
  } else if (baseScore >= 35) {
    verdict = 'CAUTION';
  }

  // Mitigations
  const mitigations = getMitigations(detectedCategory, verdict, lang);

  return {
    score: Math.min(100, Math.max(0, baseScore)),
    verdict,
    category: detectedCategory,
    redFlags,
    psychologicalTriggers: Array.from(psychologicalTriggers),
    mitigations
  };
}

function getMitigations(category, verdict, lang) {
  if (verdict === 'SAFE') {
    return [
      lang === 'hi' ? 'संदेश में कोई सामान्य दुर्भावनापूर्ण संकेत नहीं मिले हैं।' : (lang === 'mr' ? 'मजकुरात कोणताही थेट धोका आढळलेला नाही.' : 'No active malicious triggers detected in this text.'),
      lang === 'hi' ? 'अपरिचित व्यक्तियों के साथ कभी भी ओटीपी या पासवर्ड साझा न करें।' : (lang === 'mr' ? 'अनोळखी व्यक्तींशी कधीही ओटीपी किंवा पासवर्ड शेअर करू नका.' : 'Never share bank OTPs or confidential credentials with anyone.')
    ];
  }

  if (category === 'digital_arrest') {
    return [
      lang === 'hi' ? 'कॉल या संदेश को तुरंत काट दें और ब्लॉक करें। असली पुलिस वीडियो कॉल पर कभी अरेस्ट नहीं करती।' : (lang === 'mr' ? 'कॉल किंवा मेसेज तात्काळ बंद करा. पोलीस कधीही व्हिडिओ कॉलवर अटक करत नाहीत.' : 'Disconnect and block immediately. Law enforcement never issues digital arrest warrants or Skype trials.'),
      lang === 'hi' ? 'राष्ट्रीय साइबर हेल्पलाइन 1930 पर कॉल करके सूचना दें।' : (lang === 'mr' ? 'राष्ट्रीय सायबर हेल्पलाइन १९३० वर त्वरित संपर्क साधा.' : 'Dial 1930 Cyber Helpline and register the number on the Chakshu portal.'),
      lang === 'hi' ? 'डरें नहीं और किसी भी अनजान बैंक खाते में पैसे ट्रांसफर न करें।' : (lang === 'mr' ? 'घाबरू नका आणि कोणत्याही खात्यात पैसे पाठवू नका.' : 'Do not succumb to fear or transfer any funds into purported "verification accounts".')
    ];
  }

  if (category === 'electricity_scam') {
    return [
      lang === 'hi' ? 'एसएमएस में दिए किसी भी नंबर पर फोन न करें।' : (lang === 'mr' ? 'मेसेजमधील कोणत्याही क्रमांकावर संपर्क करू नका.' : 'Do not call any phone numbers listed inside the SMS.'),
      lang === 'hi' ? 'बिजली बिल की स्थिति अपने आधिकारिक बिजली ऐप या बिल रसीद पर देखें।' : (lang === 'mr' ? 'आपल्या वीज बिलाची स्थिती अधिकृत ॲपवर तपासा.' : 'Verify your bill status directly via the official electricity provider portal/app.'),
      lang === 'hi' ? 'कोई भी APK ऐप डाउनलोड न करें।' : (lang === 'mr' ? 'कोणतेही अनोळखी एपीके ॲप इन्स्टॉल करू नका.' : 'Never install APK files sent by alleged power officials.')
    ];
  }

  if (category === 'banking_kyc') {
    return [
      lang === 'hi' ? 'दिए गए लिंक पर क्लिक न करें और न ही पैन/आधार विवरण भरें।' : (lang === 'mr' ? 'लिंकवर क्लिक करू नका आणि पॅन/आधार माहिती भरू नका.' : 'Do NOT click the link or enter banking login/PAN details.'),
      lang === 'hi' ? 'यदि पासवर्ड भर दिया है, तो तुरंत बैंक के आधिकारिक ऐप पर जाकर नेटबैंकिंग ब्लॉक करें।' : (lang === 'mr' ? 'माहिती भरली असल्यास बँकेच्या अधिकृत ॲपवरून नेटबँकिंग तातडीने ब्लॉक करा.' : 'If already submitted, contact your bank immediately to freeze netbanking access.'),
      lang === 'hi' ? 'हेल्पलाइन 1930 पर कॉल करें।' : (lang === 'mr' ? '१९३० हेल्पलाइनवर तक्रार नोंदवा.' : 'Report fraudulent SMS headers to Chakshu (Sanchar Saathi).')
    ];
  }

  return [
    lang === 'hi' ? 'किसी भी लिंक पर क्लिक न करें और अज्ञात सेंडर को ब्लॉक करें।' : (lang === 'mr' ? 'कोणत्याही लिंकवर क्लिक करू नका आणि नंबर ब्लॉक करा.' : 'Do not interact with the sender or click links.'),
    lang === 'hi' ? 'संदेह होने पर तुरंत राष्ट्रीय हेल्पलाइन 1930 पर कॉल करें।' : (lang === 'mr' ? 'संशय असल्यास १९३० वर संपर्क साधा.' : 'Dial national cybercrime helpline 1930 for guidance.')
  ];
}
