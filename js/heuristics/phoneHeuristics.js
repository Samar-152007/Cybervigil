/**
 * ScamGuard Pro - Phone Number & Caller ID Heuristic Engine
 * Evaluates international fraud prefixes, TRAI telecom guidelines, VoIP spoofing, and sender headers
 */

export function analyzePhone(input, lang = 'en') {
  if (!input || typeof input !== 'string' || input.trim().length === 0) {
    return {
      score: 0,
      verdict: 'SAFE',
      category: 'clean',
      redFlags: [],
      psychologicalTriggers: [],
      mitigations: []
    };
  }

  const raw = input.trim();
  const cleanInput = raw.replace(/[\s\-\(\)]/g, '');
  let baseScore = 0;
  const redFlags = [];
  const psychologicalTriggers = new Set();
  let detectedCategory = 'phone_general';

  // 1. High-Risk Scam Country Codes (+92, +234, +880, +254, +62, +84, etc.)
  const highRiskPrefixes = [
    { prefix: '+92', code: '92', country: 'Pakistan', risk: 95, reason: 'High incidence of WhatsApp lottery, digital arrest, and military/police impersonation scams targeting Indian citizens.' },
    { prefix: '+234', code: '234', country: 'Nigeria', risk: 92, reason: 'High volume of international advance-fee 419, crypto romance, and job guarantee frauds.' },
    { prefix: '+880', code: '880', country: 'Bangladesh', risk: 85, reason: 'Cross-border SIM routing and unverified financial social-engineering calls.' },
    { prefix: '+254', code: '254', country: 'Kenya', risk: 82, reason: 'Syndicate mobile phishing and fake crypto investment calls.' },
    { prefix: '+84', code: '84', country: 'Vietnam', risk: 80, reason: 'Automated Telegram job task lure messages and robocalls.' },
    { prefix: '+62', code: '62', country: 'Indonesia', risk: 80, reason: 'Bulk WhatsApp spam and OTP interception scams.' }
  ];

  let matchedCountry = null;
  for (const item of highRiskPrefixes) {
    if (cleanInput.startsWith(item.prefix) || cleanInput.startsWith('00' + item.code) || (cleanInput.startsWith(item.code) && cleanInput.length >= 11)) {
      matchedCountry = item;
      break;
    }
  }

  if (matchedCountry) {
    baseScore = Math.max(baseScore, matchedCountry.risk);
    detectedCategory = 'international_scam_call';
    psychologicalTriggers.add('foreign_impersonation');

    redFlags.push({
      id: 'flag_high_risk_country',
      severity: 'CRITICAL',
      title: lang === 'hi' 
        ? `उच्च जोखिम वाला अंतर्राष्ट्रीय देश कोड (${matchedCountry.country} / ${matchedCountry.prefix})`
        : (lang === 'mr' 
          ? `अत्यंत संशयास्पद आंतरराष्ट्रीय देश कोड (${matchedCountry.country} / ${matchedCountry.prefix})`
          : `High-Risk International Origin (${matchedCountry.country} ${matchedCountry.prefix})`),
      description: lang === 'hi'
        ? `यह कॉल अथवा संदेश ${matchedCountry.country} (${matchedCountry.prefix}) से आ रहा है। ${matchedCountry.reason}`
        : (lang === 'mr'
          ? `हा कॉल किंवा व्हॉट्सॲप मेसेज ${matchedCountry.country} (${matchedCountry.prefix}) मधून येत आहे. ${matchedCountry.reason}`
          : `Originates from ${matchedCountry.country} (${matchedCountry.prefix}). ${matchedCountry.reason}`),
      trigger: 'International Syndicate Fraud'
    });
  }

  // 2. High-Tariff Satellite / Wangiri Callback Scams (+247, +269, +678, +882, etc.)
  const wangiriCodes = [
    { code: '+247', name: 'Ascension Island' },
    { code: '+269', name: 'Comoros' },
    { code: '+678', name: 'Vanuatu' },
    { code: '+688', name: 'Tuvalu' },
    { code: '+882', name: 'International Satellite' }
  ];

  let matchedWangiri = null;
  for (const w of wangiriCodes) {
    if (cleanInput.startsWith(w.code) || cleanInput.startsWith(w.code.replace('+', ''))) {
      matchedWangiri = w;
      break;
    }
  }

  if (matchedWangiri) {
    baseScore = Math.max(baseScore, 96);
    detectedCategory = 'wangiri_scam';
    psychologicalTriggers.add('curiosity_callback');

    redFlags.push({
      id: 'flag_wangiri',
      severity: 'CRITICAL',
      title: lang === 'hi' ? `वांगिरी (एक घंटी देकर कॉल बैक कराने वाला) स्कैम (${matchedWangiri.name})` : (lang === 'mr' ? `वांगिरी मिस्ड कॉल घोटाळा (${matchedWangiri.name})` : `Wangiri Callback Trap (${matchedWangiri.name})`),
      description: lang === 'hi'
        ? 'यह एक विदेशी प्रीमियम रेट नंबर है। कॉल बैक करने पर सैकड़ों रुपये प्रति मिनट का बिल लग सकता है।'
        : (lang === 'mr'
          ? 'हा अति-महाग आंतरराष्ट्रीय क्रमांक आहे. परत कॉल केल्यास प्रचंड पैसे कापले जातात.'
          : 'Premium rate satellite number intended to induce expensive victim callbacks ($10-$50/min).'),
      trigger: 'Callback Coercion'
    });
  }

  // 3. Indian Telecom Guidelines & Mobile Evaluation
  // Format check for Indian 10-digit mobile
  let indianDigits = cleanInput;
  if (indianDigits.startsWith('+91')) {
    indianDigits = indianDigits.slice(3);
  } else if (indianDigits.startsWith('91') && indianDigits.length === 12) {
    indianDigits = indianDigits.slice(2);
  } else if (indianDigits.startsWith('0') && indianDigits.length === 11) {
    indianDigits = indianDigits.slice(1);
  }

  const isTenDigitIndianMobile = /^[6-9]\d{9}$/.test(indianDigits);

  // 4. SMS Sender Header analysis (e.g. "VK-HDFCBK" vs "SBI-ALERT" vs random 10 digit)
  const isAlphaHeader = /^[A-Za-z]{2}-[A-Za-z0-9]{6}$/.test(raw);
  const isSuspiciousHeader = /^[A-Za-z0-9\-_]{3,12}$/.test(raw) && !isAlphaHeader && !/^\+?\d+$/.test(raw);

  if (isSuspiciousHeader) {
    baseScore = Math.max(baseScore, 75);
    redFlags.push({
      id: 'flag_unregistered_sender_id',
      severity: 'HIGH',
      title: lang === 'hi' ? 'अनधिकृत एसएमएस सेंडर आईडी' : (lang === 'mr' ? 'अनधिकृत एसएमएस सेंडर आयडी' : 'Unregistered SMS Sender Header'),
      description: lang === 'hi'
        ? `सेंडर आईडी '${raw}' ट्राई (TRAI DLT) के मानक 6-अक्षरीय फॉर्मेट (उदा. VK-HDFCBK) से मेल नहीं खाता है।`
        : (lang === 'mr'
          ? `'${raw}' हा आयडी ट्रायच्या (TRAI) अधिकृत नियमांनुसार नाही. हा बनावट असू शकतो.`
          : `Header '${raw}' fails TRAI standard format (e.g., VK-HDFCBK or VM-SBIINB). Indicates overseas bulk route or spoofed SIM box.`),
      trigger: 'Sender Header Spoofing'
    });
  }

  // 5. VoIP Virtual Spoofing (+44 / +1 Virtual UK/US Numbers)
  if ((cleanInput.startsWith('+447') && cleanInput.length >= 12) || (cleanInput.startsWith('+1') && cleanInput.length === 12)) {
    baseScore = Math.max(baseScore, 70);
    redFlags.push({
      id: 'flag_voip_virtual',
      severity: 'MEDIUM',
      title: lang === 'hi' ? 'संभावित वीओआईपी (VoIP) अथवा वर्चुअल फोन नंबर' : (lang === 'mr' ? 'संभाव्य व्हीओआयपी (VoIP) किंवा आभासी नंबर' : 'Suspected VoIP / Cloud Virtual Number'),
      description: lang === 'hi'
        ? 'यह नंबर अक्सर इंटरनेट आधारित वर्चुअल कॉलिंग ऐप्स (Skype, TextNow) द्वारा पहचान छिपाने के लिए लिया जाता है।'
        : (lang === 'mr'
          ? 'हा नंबर इंटरनेट आधारित कॉलिंग ॲप्सद्वारे मूळ ओळख लपवण्यासाठी वापरला जातो.'
          : 'UK/US cloud VoIP prefix commonly used by overseas scam operations to simulate legitimate corporate or police presence.'),
      trigger: 'Anonymity'
    });
  }

  // 6. Legitimate Indian Mobile Check
  if (isTenDigitIndianMobile && !matchedCountry && !matchedWangiri) {
    // A normal 10-digit Indian mobile. If used for personal calls, it's normal.
    // However, if sent by someone claiming to be SBI/Police/Electricity office, caution note.
    baseScore = Math.max(baseScore, 30);
    redFlags.push({
      id: 'flag_personal_sim_advisory',
      severity: 'LOW',
      title: lang === 'hi' ? 'व्यक्तिगत भारतीय मोबाइल नंबर (+91)' : (lang === 'mr' ? 'वैयक्तिक भारतीय मोबाईल क्रमांक (+91)' : 'Standard Indian Mobile Series (+91)'),
      description: lang === 'hi'
        ? `नंबर (+91 ${indianDigits}) एक सामान्य व्यक्तिगत सिम है। यदि इस नंबर से कोई बैंक अधिकारी, पुलिस या बिजली विभाग का प्रतिनिधि होने का दावा करे, तो यह 100% फर्जी है।`
        : (lang === 'mr'
          ? `हा (+91 ${indianDigits}) एक सामान्य वैयक्तिक नंबर आहे. या नंबरवरून कोणी बँक किंवा वीज अधिकारी असल्याचे भासवत असेल तर तो फसवणूक करत आहे.`
          : `Standard 10-digit subscriber number (+91 ${indianDigits}). Legitimate banks & utilities never conduct customer authentication from personal subscriber SIMs.`),
      trigger: 'Context Dependent'
    });
  }

  // Safe verdict fallback
  if (redFlags.length === 0) {
    baseScore = 5;
    detectedCategory = 'safe_number';
  }

  let verdict = 'SAFE';
  if (baseScore >= 70) {
    verdict = 'HIGH';
  } else if (baseScore >= 30) {
    verdict = 'CAUTION';
  }

  const mitigations = getPhoneMitigations(detectedCategory, verdict, lang, raw);

  return {
    score: Math.min(100, Math.max(0, baseScore)),
    verdict,
    category: detectedCategory,
    redFlags,
    psychologicalTriggers: Array.from(psychologicalTriggers),
    mitigations
  };
}

function getPhoneMitigations(category, verdict, lang, number) {
  if (verdict === 'SAFE') {
    return [
      lang === 'hi' ? 'इस नंबर में कोई अंतर्राष्ट्रीय या ब्लैकलिस्टेड प्रीफ़िक्स नहीं मिला है।' : (lang === 'mr' ? 'या क्रमांकात कोणताही थेट संशयास्पद आंतरराष्ट्रीय कोड आढळला नाही.' : 'No automated international risk prefixes detected for this number.'),
      lang === 'hi' ? 'फोन पर कभी भी अपना ओटीपी, एटीएम पिन या पासवर्ड न बताएं।' : (lang === 'mr' ? 'फोनवर कधीही कोणालाही आपला ओटीपी किंवा बँक पिन सांगू नका.' : 'Never reveal banking PINs, OTPs, or confidential details over voice calls.')
    ];
  }

  if (category === 'international_scam_call' || category === 'wangiri_scam') {
    return [
      lang === 'hi' ? 'इस नंबर को तुरंत फोन और व्हाट्सएप पर ब्लॉक और रिपोर्ट करें।' : (lang === 'mr' ? 'हा नंबर मोबाईल आणि व्हॉट्सॲपवर तात्काळ ब्लॉक व रिपोर्ट करा.' : 'Block and report this number immediately on WhatsApp and your phone dialer.'),
      lang === 'hi' ? 'इस नंबर पर कभी भी कॉल बैक न करें और न ही कोई संदेश भेजें।' : (lang === 'mr' ? 'या नंबरवर चुकूनही कॉल बॅक करू नका.' : 'Never return missed calls to avoid premium rate billing and cyber extortion.'),
      lang === 'hi' ? 'संचार साथी के चक्षु पोर्टल (sancharsaathi.gov.in) पर नंबर रिपोर्ट करें।' : (lang === 'mr' ? 'या नंबरची चक्षू पोर्टलवर तक्रार नोंदवून तो ब्लॉक करवून घ्या.' : 'File an impersonation report on the DoT Chakshu portal (sancharsaathi.gov.in).')
    ];
  }

  return [
    lang === 'hi' ? 'यदि यह कॉलर बैंक या सरकारी अधिकारी होने का दावा करता है, तो कॉल तुरंत काट दें।' : (lang === 'mr' ? 'कॉलर बँक किंवा सरकारी अधिकारी असल्याचे भासवत असेल तर कॉल ताबडतोब बंद करा.' : 'If caller claims to represent an institution, hang up and verify via official toll-free numbers.'),
    lang === 'hi' ? 'कॉल पर किसी के कहने से कोई रिमोट ऐप या यूपीआई पिन दर्ज न करें।' : (lang === 'mr' ? 'कॉलवर असताना कधीही यूपीआय पिन टाकू नका किंवा ॲप इन्स्टॉल करू नका.' : 'Never accept screen-sharing or enter UPI MPIN to receive any purported refund.')
  ];
}
