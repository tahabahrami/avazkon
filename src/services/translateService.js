/**
 * Translation service using LibreTranslate API
 * Automatically detects Persian text and translates to English for AI processing
 */

// Translation API configuration
// Using MyMemory API as a free alternative to LibreTranslate
const TRANSLATE_API_URL = 'https://api.mymemory.translated.net/get';
const DETECT_API_URL = 'https://ws.detectlanguage.com/0.2/detect';

/**
 * Detect the language of the given text
 * @param {string} text - Text to detect language for
 * @returns {Promise<string>} - Detected language code (e.g., 'fa', 'en')
 */
export const detectLanguage = async (text) => {
  try {
    if (!text || !text.trim()) {
      return 'en'; // Default to English for empty text
    }

    // Simple Persian detection using character ranges
    const hasPersian = containsPersian(text.trim());
    
    if (hasPersian) {
      return 'fa'; // Persian detected
    }
    
    return 'en'; // Default to English
  } catch (error) {
    console.warn('Language detection failed, defaulting to English:', error);
    return 'en';
  }
};

/**
 * Translate text from source language to target language
 * @param {string} text - Text to translate
 * @param {string} sourceLang - Source language code (e.g., 'fa')
 * @param {string} targetLang - Target language code (e.g., 'en')
 * @returns {Promise<string>} - Translated text
 */
export const translateText = async (text, sourceLang = 'auto', targetLang = 'en') => {
  try {
    if (!text || !text.trim()) {
      return text;
    }

    // If source and target are the same, return original text
    if (sourceLang === targetLang) {
      return text;
    }

    // Convert language codes for MyMemory API
    const langPair = `${sourceLang === 'auto' ? 'fa' : sourceLang}|${targetLang}`;
    
    const response = await fetch(`${TRANSLATE_API_URL}?q=${encodeURIComponent(text.trim())}&langpair=${langPair}`);

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.status}`);
    }

    const result = await response.json();
    
    if (result && result.responseData && result.responseData.translatedText) {
      return result.responseData.translatedText;
    }
    
    return text; // Return original text if translation fails
  } catch (error) {
    console.warn('Translation failed, using original text:', error);
    return text; // Return original text if translation fails
  }
};

/**
 * Check if text contains Persian characters
 * @param {string} text - Text to check
 * @returns {boolean} - True if text contains Persian characters
 */
export const containsPersian = (text) => {
  if (!text) return false;
  
  // Persian Unicode ranges
  const persianRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return persianRegex.test(text);
};

/**
 * Smart translation function that automatically detects Persian and translates to English
 * @param {string} prompt - The prompt text to potentially translate
 * @returns {Promise<{originalPrompt: string, translatedPrompt: string, wasTranslated: boolean, detectedLanguage: string}>}
 */
export const smartTranslatePrompt = async (prompt) => {
  try {
    if (!prompt || !prompt.trim()) {
      return {
        originalPrompt: prompt,
        translatedPrompt: prompt,
        wasTranslated: false,
        detectedLanguage: 'en'
      };
    }

    const trimmedPrompt = prompt.trim();
    
    // First, check if text contains Persian characters
    const hasPersian = containsPersian(trimmedPrompt);
    
    if (!hasPersian) {
      // If no Persian characters, assume it's already in English
      return {
        originalPrompt: prompt,
        translatedPrompt: prompt,
        wasTranslated: false,
        detectedLanguage: 'en'
      };
    }

    // Detect language to confirm
    const detectedLang = await detectLanguage(trimmedPrompt);
    
    // If detected language is Persian (fa), translate to English
    if (detectedLang === 'fa' || hasPersian) {
      const translatedText = await translateText(trimmedPrompt, 'fa', 'en');
      
      return {
        originalPrompt: prompt,
        translatedPrompt: translatedText,
        wasTranslated: true,
        detectedLanguage: detectedLang
      };
    }

    // If not Persian, return original
    return {
      originalPrompt: prompt,
      translatedPrompt: prompt,
      wasTranslated: false,
      detectedLanguage: detectedLang
    };

  } catch (error) {
    console.warn('Smart translation failed, using original prompt:', error);
    return {
      originalPrompt: prompt,
      translatedPrompt: prompt,
      wasTranslated: false,
      detectedLanguage: 'unknown',
      error: error.message
    };
  }
};

/**
 * Batch translate multiple prompts
 * @param {string[]} prompts - Array of prompts to translate
 * @returns {Promise<Array>} - Array of translation results
 */
export const batchTranslatePrompts = async (prompts) => {
  try {
    const results = await Promise.all(
      prompts.map(prompt => smartTranslatePrompt(prompt))
    );
    return results;
  } catch (error) {
    console.error('Batch translation failed:', error);
    return prompts.map(prompt => ({
      originalPrompt: prompt,
      translatedPrompt: prompt,
      wasTranslated: false,
      detectedLanguage: 'unknown',
      error: error.message
    }));
  }
};

// All functions are already exported individually above