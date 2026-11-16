/**
 * ScamGuard Pro - Localization Manager
 */
import { en } from './en.js';
import { hi } from './hi.js';
import { mr } from './mr.js';

const dictionaries = {
  en,
  hi,
  mr
};

class I18nManager {
  constructor() {
    let savedLang = 'en';
    if (typeof localStorage !== 'undefined') {
      savedLang = localStorage.getItem('scamguard_lang') || 'en';
    }
    this.currentLang = ['en', 'hi', 'mr'].includes(savedLang) ? savedLang : 'en';
    this.listeners = [];
  }

  getLanguage() {
    return this.currentLang;
  }

  setLanguage(lang) {
    if (!dictionaries[lang]) {
      console.warn(`Language ${lang} not found, defaulting to en`);
      lang = 'en';
    }
    this.currentLang = lang;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('scamguard_lang', lang);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
    this.updateDom();
    this.notify(lang);
  }

  t(path, fallback = '') {
    const keys = path.split('.');
    let value = dictionaries[this.currentLang];
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        // Fallback to English
        let fallbackVal = dictionaries['en'];
        for (const fbKey of keys) {
          if (fallbackVal && typeof fallbackVal === 'object' && fbKey in fallbackVal) {
            fallbackVal = fallbackVal[fbKey];
          } else {
            return fallback || path;
          }
        }
        return fallbackVal;
      }
    }
    return value !== undefined ? value : (fallback || path);
  }

  getTips() {
    const dict = dictionaries[this.currentLang] || dictionaries['en'];
    return dict.tipsList || dictionaries['en'].tipsList;
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify(lang) {
    for (const cb of this.listeners) {
      try {
        cb(lang);
      } catch (err) {
        console.error('Error in i18n subscriber:', err);
      }
    }
    // Also dispatch custom DOM event
    if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') {
      window.dispatchEvent(new CustomEvent('scamguard:langChange', { detail: { lang } }));
    }
  }

  updateDom() {
    if (typeof document === 'undefined') return;

    // Translate text content
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        const text = this.t(key);
        if (text) {
          el.textContent = text;
        }
      }
    });

    // Translate placeholders
    const placeholderEls = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderEls.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        const placeholder = this.t(key);
        if (placeholder) {
          el.setAttribute('placeholder', placeholder);
        }
      }
    });

    // Translate titles
    const titleEls = document.querySelectorAll('[data-i18n-title]');
    titleEls.forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key) {
        const title = this.t(key);
        if (title) {
          el.setAttribute('title', title);
        }
      }
    });
  }
}

export const i18n = new I18nManager();
