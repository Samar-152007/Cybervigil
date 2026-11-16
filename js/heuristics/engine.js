/**
 * ScamGuard Pro - Master Threat Engine
 * Integrates multi-vector heuristic evaluators and orchestrates risk scoring
 */
import { analyzeText } from './textHeuristics.js';
import { analyzeUrl } from './urlHeuristics.js';
import { analyzePhone } from './phoneHeuristics.js';
import { processImageOcr } from './ocrSimulator.js';

export class ThreatEngine {
  /**
   * Auto-detect vector and triage instant input from the Quick-Scan bar
   */
  static quickTriage(input, lang = 'en') {
    if (!input || !input.trim()) {
      return {
        type: 'text',
        result: analyzeText('', lang)
      };
    }

    const trimmed = input.trim();

    // Check if it's a URL
    if (/^(https?:\/\/|[a-z0-9-]+\.(com|org|net|in|co\.in|xyz|top|online|site|club|app|biz|link|click|gov\.in)\b)/i.test(trimmed)) {
      return {
        type: 'url',
        result: analyzeUrl(trimmed, lang)
      };
    }

    // Check if it's a phone number or SMS sender code
    if (/^(\+?\d{1,4}[- ]?)?\d{6,14}$/.test(trimmed) || /^[A-Za-z]{2}-[A-Za-z0-9]{6}$/.test(trimmed)) {
      return {
        type: 'phone',
        result: analyzePhone(trimmed, lang)
      };
    }

    // Default to text / SMS analyzer
    return {
      type: 'text',
      result: analyzeText(trimmed, lang)
    };
  }

  /**
   * Run targeted scan for a specific vector
   */
  static async scan(vector, data, lang = 'en') {
    let result = null;

    switch (vector) {
      case 'text':
        result = analyzeText(data, lang);
        break;
      case 'url':
        result = analyzeUrl(data, lang);
        break;
      case 'phone':
        result = analyzePhone(data, lang);
        break;
      case 'ocr':
        result = await processImageOcr(data, lang);
        break;
      default:
        result = analyzeText(data, lang);
    }

    // Standardize risk badge and coloring
    const score = Math.min(100, Math.max(0, result.score || 0));
    let verdictLevel = 'SAFE';
    let riskColor = '#10B981'; // Emerald Green
    let riskBg = 'rgba(16, 185, 129, 0.12)';
    let riskBorder = '#10B981';

    if (score >= 70) {
      verdictLevel = 'HIGH';
      riskColor = '#EF4444'; // Crimson Red
      riskBg = 'rgba(239, 68, 68, 0.12)';
      riskBorder = '#EF4444';
    } else if (score >= 31) {
      verdictLevel = 'CAUTION';
      riskColor = '#F59E0B'; // Amber Yellow
      riskBg = 'rgba(245, 158, 11, 0.12)';
      riskBorder = '#F59E0B';
    }

    return {
      ...result,
      score,
      verdict: verdictLevel,
      riskColor,
      riskBg,
      riskBorder,
      timestamp: new Date().toISOString(),
      vector
    };
  }
}
