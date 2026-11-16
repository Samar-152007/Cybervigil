/**
 * ScamGuard Pro - URL & Link Heuristic Engine
 * Evaluates phishing domains, typosquatting, TLD risk, and malicious payloads
 */

export function analyzeUrl(inputUrl, lang = 'en') {
  if (!inputUrl || typeof inputUrl !== 'string' || inputUrl.trim().length === 0) {
    return {
      score: 0,
      verdict: 'SAFE',
      category: 'clean',
      redFlags: [],
      psychologicalTriggers: [],
      mitigations: []
    };
  }

  let raw = inputUrl.trim();
  let baseScore = 0;
  const redFlags = [];
  const psychologicalTriggers = new Set();
  let detectedCategory = 'general_link';

  // Ensure protocol for parsing
  let parsedUrl = null;
  try {
    let urlToParse = raw;
    if (!/^https?:\/\//i.test(urlToParse)) {
      urlToParse = 'https://' + urlToParse;
    }
    parsedUrl = new URL(urlToParse);
  } catch (e) {
    // Malformed URL
    return {
      score: 85,
      verdict: 'HIGH',
      category: 'malformed_url',
      redFlags: [{
        id: 'flag_malformed_url',
        severity: 'HIGH',
        title: lang === 'hi' ? 'अमान्य अथवा संदिग्ध यूआरएल प्रारूप' : (lang === 'mr' ? 'अवैध किंवा संशयास्पद यूआरएल' : 'Malformed or Deceptive URL Syntax'),
        description: lang === 'hi' ? 'यूआरएल का प्रारूप मानक वेब मानकों के अनुरूप नहीं है और दुर्भावनापूर्ण हो सकता है।' : (lang === 'mr' ? 'हा यूआरएल इंटरनेट मानकांनुसार नाही आणि संशयास्पद वाटतो.' : 'Syntax does not adhere to standard RFC web structures, often used to bypass email security filters.'),
        trigger: 'Obfuscation'
      }],
      psychologicalTriggers: ['Obfuscation'],
      mitigations: [
        lang === 'hi' ? 'अमान्य अथवा टूटे हुए लिंक पर कभी भी क्लिक न करें।' : (lang === 'mr' ? 'अशा लिंकवर कधीही क्लिक करू नका.' : 'Never click on malformed or deceptive web links.')
      ]
    };
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  const pathname = parsedUrl.pathname.toLowerCase();
  const search = parsedUrl.search.toLowerCase();
  const fullHref = parsedUrl.href.toLowerCase();

  // 1. IP Address as Host Check
  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipPattern.test(hostname)) {
    baseScore = Math.max(baseScore, 90);
    detectedCategory = 'ip_hosted_phish';
    psychologicalTriggers.add('stealth');

    redFlags.push({
      id: 'flag_ip_host',
      severity: 'CRITICAL',
      title: lang === 'hi' ? 'कच्चा आईपी पता (Raw IP Address)' : (lang === 'mr' ? 'थेट आयपी ॲड्रेस होस्ट' : 'Direct IP Address Host Detected'),
      description: lang === 'hi'
        ? `वेबसाइट किसी वैध डोमेन नाम की जगह सीधे आईपी (${hostname}) पर होस्ट की गई है। यह 98% फ़िशिंग या मैलवेयर सर्वर का संकेत है।`
        : (lang === 'mr'
          ? `वेबसाइट कोणत्याही अधिकृत डोमेन ऐवजी थेट आयपी (${hostname}) वर चालवली जात आहे. हे सायबर हल्ल्याचे लक्षण आहे.`
          : `Host uses a raw numerical IP address (${hostname}) instead of a registered domain. Strong indicator of disposable phishing infrastructure.`),
      trigger: 'Technical Obfuscation'
    });
  }

  // 2. High-Risk Disposable TLDs
  const suspiciousTlds = [
    '.xyz', '.top', '.club', '.buzz', '.work', '.rest', '.icu', '.click',
    '.link', '.site', '.online', '.vip', '.gq', '.tk', '.ml', '.cf', '.cc',
    '.cfd', '.sbs', '.cam', '.skin', '.zip', '.mov'
  ];

  let matchedTld = null;
  for (const tld of suspiciousTlds) {
    if (hostname.endsWith(tld)) {
      matchedTld = tld;
      break;
    }
  }

  if (matchedTld) {
    baseScore = Math.max(baseScore, 65);
    redFlags.push({
      id: 'flag_high_risk_tld',
      severity: 'HIGH',
      title: lang === 'hi' ? `उच्च जोखिम वाला टॉप-लेवल डोमेन (${matchedTld})` : (lang === 'mr' ? `अत्यंत संशयास्पद डोमेन एक्स्टेंशन (${matchedTld})` : `High-Risk TLD (${matchedTld})`),
      description: lang === 'hi'
        ? `डोमेन '${matchedTld}' एक्सटेंशन का उपयोग कर रहा है, जो कम लागत और साइबर अपराधियों द्वारा थोक में फ़िशिंग के लिए कुख्यात है।`
        : (lang === 'mr'
          ? `'${matchedTld}' हे एक्स्टेंशन गुन्हेगारांद्वारे स्वस्त दरात फसव्या वेबसाइट्स बनवण्यासाठी मोठ्या प्रमाणावर वापरले जाते.`
          : `Domain uses '${matchedTld}', frequently abused by automated phishing campaigns due to low-cost bulk registrations.`),
      trigger: 'Disposable Phishing Domain'
    });
  }

  // 3. Known Trusted Brand Typosquatting / Spoofing
  const targetBrands = [
    'sbi', 'yono', 'hdfc', 'icici', 'axis', 'pnb', 'bob', 'paytm', 'phonepe',
    'gpay', 'incometax', 'uidai', 'aadhaar', 'epfindia', 'irctc', 'tatapower',
    'bses', 'mahadiscom', 'amazon', 'flipkart', 'netflix', 'paypal', 'apple'
  ];

  const legitimateDomains = [
    'onlinesbi.sbi', 'sbi.co.in', 'hdfcbank.com', 'icicibank.com', 'axisbank.com',
    'pnbindia.in', 'paytm.com', 'phonepe.com', 'incometax.gov.in', 'uidai.gov.in',
    'epfindia.gov.in', 'irctc.co.in', 'amazon.in', 'flipkart.com', 'google.com'
  ];

  let brandSpoofed = null;
  for (const brand of targetBrands) {
    if (hostname.includes(brand)) {
      // Check if it's actually the legitimate domain
      const isLegit = legitimateDomains.some(legit => hostname === legit || hostname.endsWith('.' + legit));
      if (!isLegit) {
        brandSpoofed = brand;
        break;
      }
    }
  }

  if (brandSpoofed) {
    baseScore = Math.max(baseScore, 94);
    detectedCategory = 'brand_typosquatting';
    psychologicalTriggers.add('false_brand_authority');

    redFlags.push({
      id: 'flag_brand_spoof',
      severity: 'CRITICAL',
      title: lang === 'hi' ? `नकली ब्रांड डोमेन (${brandSpoofed.toUpperCase()})` : (lang === 'mr' ? `बनावट ब्रँड डोमेन (${brandSpoofed.toUpperCase()})` : `Brand Impersonation / Typosquatting (${brandSpoofed.toUpperCase()})`),
      description: lang === 'hi'
        ? `यह डोमेन '${brandSpoofed.toUpperCase()}' का नाम चुराकर बनाया गया है, लेकिन यह उनका अधिकृत वेब पता नहीं है।`
        : (lang === 'mr'
          ? `हा डोमेन '${brandSpoofed.toUpperCase()}' चे नाव वापरत आहे, परंतु ही अधिकृत वेबसाईट नाही.`
          : `Domain name includes '${brandSpoofed.toUpperCase()}' but does not belong to the authentic organization. High probability of credential harvesting.`),
      trigger: 'Brand Deception'
    });
  }

  // 4. Subdomain Depth Tricks (e.g. sbi.com.verify-login.xyz)
  const parts = hostname.split('.');
  if (parts.length > 3) {
    baseScore = Math.max(baseScore, 50);
    redFlags.push({
      id: 'flag_subdomain_trick',
      severity: 'MEDIUM',
      title: lang === 'hi' ? 'अत्यधिक सबडोमेन गहराई' : (lang === 'mr' ? 'संशयास्पद सबडोमेन रचना' : 'Excessive Subdomain Depth'),
      description: lang === 'hi'
        ? 'यूआरएल में कई सबडोमेन का इस्तेमाल मोबाइल स्क्रीन पर असली डोमेन छुपाने के लिए किया गया है।'
        : (lang === 'mr'
          ? 'मोबाईल स्क्रीनवर मूळ पत्ता लपवण्यासाठी अनेक सबडोमेनचा वापर केला गेला आहे.'
          : 'High subdomain depth often disguises the actual apex domain on narrow mobile browser address bars.'),
      trigger: 'Visual Obfuscation'
    });
  }

  // 5. Insecure Protocol (HTTP) with Sensitive Actions
  const hasSensitiveKeywords = /login|signin|account|verify|update|kyc|pan|password|credential|otp|bank|payment|secure/i.test(fullHref);
  if (parsedUrl.protocol === 'http:' && hasSensitiveKeywords) {
    baseScore = Math.max(baseScore, 78);
    redFlags.push({
      id: 'flag_insecure_http',
      severity: 'HIGH',
      title: lang === 'hi' ? 'असुरक्षित कनेक्शन (बिना HTTPS)' : (lang === 'mr' ? 'असुरक्षित कनेक्शन (HTTPS नाही)' : 'Unencrypted Cleartext Channel (Plain HTTP)'),
      description: lang === 'hi'
        ? 'संवेदनशील बैंकिंग अथवा लॉगिन प्रक्रिया बिना SSL/TLS एन्क्रिप्शन (HTTP) के संचालित हो रही है।'
        : (lang === 'mr'
          ? 'संवेदनशील लॉगिन आणि बँक व्यवहार असुरक्षित (HTTP) वर चालत आहेत.'
          : 'Sensitive login or credential terms detected over unencrypted HTTP, vulnerable to MITM interception.'),
      trigger: 'Data Snooping'
    });
  }

  // 6. URL Shortener Masking
  const shorteners = ['bit.ly', 'tinyurl.com', 'is.gd', 'cutt.ly', 'rb.gy', 't.co', 'ow.ly', 'goo.gl'];
  if (shorteners.some(s => hostname === s || hostname.endsWith('.' + s))) {
    baseScore = Math.max(baseScore, 55);
    psychologicalTriggers.add('hidden_destination');

    redFlags.push({
      id: 'flag_shortened_url',
      severity: 'MEDIUM',
      title: lang === 'hi' ? 'यूआरएल शॉर्टनर द्वारा गंतव्य छिपाया गया' : (lang === 'mr' ? 'शॉर्ट यूआरएलद्वारे मूळ लिंक लपवली' : 'Masked Short URL'),
      description: lang === 'hi'
        ? `लिंक को '${hostname}' के पीछे छिपाया गया है। वास्तविक लैंडिंग पेज की पुष्टि के बिना इसे न खोलें।`
        : (lang === 'mr'
          ? `'${hostname}' चा वापर करून मूळ वेबसाईट लपवली आहे. मूळ पत्ता तपासल्याशिवाय उघडू नका.`
          : `Actual target is obscured by URL shortener '${hostname}'. Fraudsters utilize this to evade link scanners.`),
      trigger: 'Hidden Target'
    });
  }

  // 7. Malicious file extensions in path (.apk, .exe, .scr, .bat)
  if (/\.(apk|exe|scr|bat|vbs|iso|msi|dmg)(\?|$)/i.test(pathname)) {
    baseScore = Math.max(baseScore, 96);
    detectedCategory = 'malicious_download';
    psychologicalTriggers.add('payload_delivery');

    redFlags.push({
      id: 'flag_malicious_file',
      severity: 'CRITICAL',
      title: lang === 'hi' ? 'प्रत्यक्ष संदिग्ध ऐप/मैलवेयर फ़ाइल डाउनलोड' : (lang === 'mr' ? 'संशयास्पद ॲप/मैलवेअर थेट डाउनलोड' : 'Direct Executable/APK Payload Download'),
      description: lang === 'hi'
        ? 'यह लिंक सीधे एक निष्पादन योग्य फ़ाइल (.apk/.exe) डाउनलोड करता है जो फोन या कंप्यूटर को हैक कर सकती है।'
        : (lang === 'mr'
          ? 'ही लिंक थेट एपीके (.apk) किंवा प्रोग्राम फाइल डाउनलोड करते, जी फोन हॅक करू शकते.'
          : 'Direct link to an executable application file. Android APK sideloading is the #1 vector for banking trojans.'),
      trigger: 'Device Compromise'
    });
  }

  // 8. Punycode (IDN Homograph attack, e.g. xn--)
  if (hostname.includes('xn--')) {
    baseScore = Math.max(baseScore, 85);
    redFlags.push({
      id: 'flag_punycode',
      severity: 'CRITICAL',
      title: lang === 'hi' ? 'यूनिकोड / होमोग्राफ स्पूफिंग (Punycode)' : (lang === 'mr' ? 'युनिकोड स्पूफिंग फसवणूक (Punycode)' : 'IDN Homograph Attack (Punycode)'),
      description: lang === 'hi'
        ? 'डोमेन में अन्य भाषाओं के मिलते-जुलते अक्षरों का उपयोग करके अंग्रेजी अक्षरों की नकल की गई है।'
        : (lang === 'mr'
          ? 'बँकेसारखी दिसणारी बनावट अक्षरे वापरून डोमेनची हुबेहूब नक्कल केली आहे.'
          : 'Internationalized Domain Name (IDN) tricks using lookalike Cyrillic or Greek glyphs to mimic popular brands.'),
      trigger: 'Visual Spoofing'
    });
  }

  // Safe verdict if no red flags
  if (redFlags.length === 0) {
    baseScore = 8;
    detectedCategory = 'safe_link';
  }

  // Determine Verdict
  let verdict = 'SAFE';
  if (baseScore >= 70) {
    verdict = 'HIGH';
  } else if (baseScore >= 35) {
    verdict = 'CAUTION';
  }

  const mitigations = getUrlMitigations(detectedCategory, verdict, lang, hostname);

  return {
    score: Math.min(100, Math.max(0, baseScore)),
    verdict,
    category: detectedCategory,
    redFlags,
    psychologicalTriggers: Array.from(psychologicalTriggers),
    mitigations
  };
}

function getUrlMitigations(category, verdict, lang, hostname) {
  if (verdict === 'SAFE') {
    return [
      lang === 'hi' ? 'यह डोमेन ज्ञात फ़िशिंग संकेतकों से मुक्त प्रतीत होता है।' : (lang === 'mr' ? 'हा डोमेन सध्या तरी सुरक्षित वाटतो.' : 'No overt malicious indicators or brand spoofing detected for this host.'),
      lang === 'hi' ? 'लॉगिन करते समय हमेशा ब्राउज़र में पैडलॉक (लॉक आइकन) की जांच करें।' : (lang === 'mr' ? 'लॉगिन करताना नेहमी ब्राउझरमधील कुलूप चिन्ह (Padlock) तपासा.' : 'Always verify the full address bar before inputting any credentials.')
    ];
  }

  if (category === 'brand_typosquatting' || category === 'ip_hosted_phish') {
    return [
      lang === 'hi' ? 'इस वेबसाइट को तुरंत बंद करें और कोई भी पासवर्ड या ओटीपी न भरें।' : (lang === 'mr' ? 'ही वेबसाईट त्वरित बंद करा आणि कोणताही पासवर्ड भरू नका.' : 'DO NOT visit this website or enter credentials, OTPs, or credit card numbers.'),
      lang === 'hi' ? 'कंपनी की आधिकारिक वेबसाइट पर सीधे गूगल से या आधिकारिक ऐप से जाएं।' : (lang === 'mr' ? 'अधिकृत कंपनीच्या वेबसाइटवर नेहमी मूळ ॲप किंवा पत्ता टाईप करून जा.' : 'Navigate exclusively via official banking apps or by manually typing the genuine domain name.'),
      lang === 'hi' ? 'इस फर्जी लिंक को चक्षु (sancharsaathi.gov.in) पर रिपोर्ट करें।' : (lang === 'mr' ? 'या फसव्या लिंकची तक्रार चक्षू पोर्टलवर करा.' : 'Report the malicious URL to Google Safe Browsing and Chakshu portal.')
    ];
  }

  if (category === 'malicious_download') {
    return [
      lang === 'hi' ? 'यदि कोई फ़ाइल डाउनलोड हो गई है, तो उसे बिल्कुल न खोलें और तुरंत डिलीट करें।' : (lang === 'mr' ? 'फाइल डाउनलोड झाली असल्यास ती उघडू नका, तात्काळ डिलीट करा.' : 'If file was downloaded, DO NOT OPEN IT. Immediately delete from Downloads and clear trash.'),
      lang === 'hi' ? 'फोन की सेटिंग्स में जाकर "Unknown Sources" से ऐप इंस्टॉलेशन ब्लॉक रखें।' : (lang === 'mr' ? 'मोबाईल सेटिंग्समध्ये "Unknown Sources" कायम बंद ठेवा.' : 'Ensure "Install unknown apps" remains disabled in your Android security settings.')
    ];
  }

  return [
    lang === 'hi' ? 'इस लिंक पर क्लिक करने से बचें।' : (lang === 'mr' ? 'या लिंकवर क्लिक करणे टाळा.' : 'Avoid navigating to this unverified URL.'),
    lang === 'hi' ? 'संदेह होने पर राष्ट्रीय साइबर हेल्पलाइन 1930 पर संपर्क करें।' : (lang === 'mr' ? 'संशय असल्यास राष्ट्रीय सायबर हेल्पलाइन १९३० ला संपर्क करा.' : 'Consult official helpline 1930 if money or accounts are at risk.')
  ];
}
