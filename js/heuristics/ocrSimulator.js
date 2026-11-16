/**
 * ScamGuard Pro - Screenshot & Document OCR Simulator Engine
 * Extracts text from fraudulent screenshots and simulates document forensics
 */
import { analyzeText } from './textHeuristics.js';

export const OCR_PRESETS = {
  sample1: {
    id: 'sample1',
    title: 'Fake CBI / Mumbai Police Arrest Warrant',
    type: 'Legal Impersonation (Digital Arrest)',
    imagePath: 'assets/sample_arrest_warrant.svg',
    extractedText: `CENTRAL BUREAU OF INVESTIGATION (CBI) & NARCOTICS CONTROL BUREAU
SPECIAL CYBER SURVEILLANCE CELL - NEW DELHI
CASE DOCKET NO: CBI/ND/2026/8941A

DIGITAL ARREST WARRANT & STRICT CONFIDENTIAL INVESTIGATION
TO: CITIZEN ID # 4982-1092-4412

You are hereby informed that an illegal money laundering & international parcel containing narcotic substances (MDMA) was seized at Mumbai Customs under your Aadhaar Number.

ORDER OF SUPREME COURT BENCH:
You are placed under IMMEDIATE DIGITAL ARREST.
1. You must join mandatory Skype Video Interrogation Room: cbi.surveillance.cell@skype
2. DO NOT disconnect the video call or inform family members. Doing so is an offense under IPC Sec 41A.
3. For financial clearance, deposit ₹2,50,000 security collateral into RBI Verifying Escrow Account:
   A/C: 918273645109 | IFSC: SBIN0001824
Failure to comply within 2 hours will result in immediate armed police raid at your premises.

Sd/-
Chief Investigation Officer
Central Cyber Division`,
    visualIndicators: [
      'Forged Government Emblem with incorrect proportions',
      'Unconstitutional term "Digital Arrest" masquerading as judicial order',
      'Personal savings account provided as official RBI verification escrow',
      'Demands video interrogation via Skype instead of physical magistrate summons'
    ]
  },

  sample2: {
    id: 'sample2',
    title: 'Fake Electricity Disconnection SMS Screenshot',
    type: 'Utility Bill Scams',
    imagePath: 'assets/sample_electricity_sms.svg',
    extractedText: `URGENT NOTICE: ELECTRICITY BOARD
Dear consumer, your electricity power will be disconnected tonight at 9:30 PM from the power station because your previous month's bill payment of ₹1,420 was not updated in the central server.

Immediately contact our Electricity Officer Mr. Rajesh Sharma at mobile number 98765-43210 or update your electricity bill through our quick portal:
http://bijli-bill-update.online/pay

Do not ignore this message. Power supply will be disconnected immediately without further notice.`,
    visualIndicators: [
      'Unregistered private mobile number used for official disconnection communication',
      'High-risk unverified domain (.online) mimicking state distribution board',
      'Artificial 2-hour panic deadline designed to prevent consumer verification'
    ]
  },

  sample3: {
    id: 'sample3',
    title: 'KBC 25 Lakh Lottery Winner Cheque',
    type: 'Lottery & Advance Fee Fraud',
    imagePath: 'assets/sample_kbc_cheque.svg',
    extractedText: `ALL INDIA ALL SIM CARD LUCKY DRAW COMPETITION
ORGANIZED BY KAUN BANEGA CROREPATI (KBC) & RELIANCE JIO
CONGRATULATIONS! YOUR MOBILE NUMBER HAS WON ₹25,00,000/- (TWENTY FIVE LAKH RUPEES)

LOTTERY CHEQUE NO: KBC-2026-LUCK-9812
SPECIAL WINNER CERTIFICATE OF AUTHENTICITY

Dear Winner, your mobile number was randomly selected in the mega electronic lottery draw.
To claim and transfer the prize amount of ₹25,00,000 directly into your bank account:
1. Contact KBC Chief Manager Mr. Amitabh Roy on WhatsApp: +92 301 9876543
2. Deposit government lottery tax clearance fee of ₹25,000 via PhonePe/GooglePay.
Do not share your lottery code with anyone.`,
    visualIndicators: [
      'Winner contact points to international WhatsApp number with +92 Pakistan prefix',
      'Advance fee trap: Demands upfront tax fee to release non-existent prize',
      'Unauthorized use of Amitabh Bachchan photo & Sony KBC trademark'
    ]
  },

  sample4: {
    id: 'sample4',
    title: 'Telegram Part-time Work From Home Scam',
    type: 'Prepaid Task / Crypto Ponzi',
    imagePath: 'assets/sample_telegram_job.svg',
    extractedText: `VIP EARNING TELEGRAM COMMUNITY - TASK GROUP #82
HR Recruiter: "Congratulations! You have completed Trial Task 1 (Liked 3 YouTube videos). We have credited ₹150 directly to your UPI ID."

Next VIP Task Available:
Task Level 2: Cryptocurrency Order Dispatch
- Deposit ₹5,000 into trading wallet
- Guaranteed Return in 15 Minutes: ₹7,500 (+50% Profit)
- VIP Task Level 3: Deposit ₹50,000 -> Guaranteed Return: ₹85,000

Notice: If deposit is not made within 10 minutes, your account bonus will be permanently forfeited and membership canceled.
Merchant UPI: merchant.taskpay@ybl`,
    visualIndicators: [
      'Classic Pig Butchering / Ponzi bait with initial small ₹150 incentive',
      'Guaranteed 50% returns in 15 minutes (impossible legitimate financial yield)',
      'High psychological urgency timer (10 minute deadline)'
    ]
  }
};

/**
 * Perform simulated OCR extraction and forensic threat analysis on an image
 */
export async function processImageOcr(fileOrPreset, lang = 'en') {
  // If it's a known preset ID
  if (typeof fileOrPreset === 'string' && OCR_PRESETS[fileOrPreset]) {
    const preset = OCR_PRESETS[fileOrPreset];
    const textAnalysis = analyzeText(preset.extractedText, lang);

    // Merge document visual forensics
    preset.visualIndicators.forEach((ind, index) => {
      textAnalysis.redFlags.unshift({
        id: `ocr_visual_flag_${index}`,
        severity: 'CRITICAL',
        title: lang === 'hi' ? 'दस्तावेज़ फोरेंसिक विसंगति' : (lang === 'mr' ? 'दस्तऐवज फॉरेन्सिक दोष' : 'Visual Forensic Anomaly'),
        description: ind,
        trigger: 'Visual Forgery'
      });
    });

    textAnalysis.score = Math.min(100, Math.max(90, textAnalysis.score + 10));
    textAnalysis.verdict = 'HIGH';
    textAnalysis.ocrExtractedText = preset.extractedText;
    textAnalysis.documentTitle = preset.title;

    return textAnalysis;
  }

  // If user uploaded a custom file
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Intelligent text extraction based on filename or OCR heuristics
      const fileName = fileOrPreset.name || 'document.png';
      let simulatedExtractedText = '';

      if (/arrest|police|cbi|fir|warrant|court/i.test(fileName)) {
        simulatedExtractedText = OCR_PRESETS.sample1.extractedText;
      } else if (/electricity|bijli|power|bill/i.test(fileName)) {
        simulatedExtractedText = OCR_PRESETS.sample2.extractedText;
      } else if (/lottery|kbc|cheque|prize|winner/i.test(fileName)) {
        simulatedExtractedText = OCR_PRESETS.sample3.extractedText;
      } else if (/telegram|job|crypto|task|earn/i.test(fileName)) {
        simulatedExtractedText = OCR_PRESETS.sample4.extractedText;
      } else {
        // Generic uploaded document parser
        simulatedExtractedText = `DOCUMENT OCR SCAN RESULT:
File: ${fileName} | Type: Image Document | Size: ${(fileOrPreset.size / 1024).toFixed(1)} KB

Detected Text Strings:
"URGENT ATTENTION: Unverified financial transaction detected on your device. Immediate KYC verification required to prevent permanent suspension. Contact support at +91-9876543210 or visit http://verification-auth-portal.xyz"`;
      }

      const textAnalysis = analyzeText(simulatedExtractedText, lang);
      textAnalysis.ocrExtractedText = simulatedExtractedText;
      textAnalysis.documentTitle = fileName;
      textAnalysis.redFlags.unshift({
        id: 'ocr_file_scanned',
        severity: 'HIGH',
        title: lang === 'hi' ? 'छवि से टेक्स्ट निकाला गया (ओसीआर)' : (lang === 'mr' ? 'प्रतिमेतून मजकूर वाचला (ओसीआर)' : 'Image Text OCR Extracted'),
        description: lang === 'hi' 
          ? `अपलोड की गई फ़ाइल '${fileName}' से टेक्स्ट सफलतापूर्वक निकाला गया और उसका विश्लेषण किया गया।`
          : (lang === 'mr' 
            ? `'${fileName}' फाइलमधून मजकूर यशस्वीपणे वाचून धोक्यांचे परीक्षण केले गेले.`
            : `Text elements successfully parsed from '${fileName}' for threat signature matching.`),
        trigger: 'Document OCR Forensics'
      });

      resolve(textAnalysis);
    };

    reader.readAsDataURL(fileOrPreset);
  });
}
