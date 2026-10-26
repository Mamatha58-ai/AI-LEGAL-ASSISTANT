/**
 * Voice Service providing Speech-to-Text (Voice Commands) and Text-to-Speech (Audio Read-Aloud)
 */

export class VoiceService {
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = SpeechRecognition ? new SpeechRecognition() : null;
    this.synthesis = window.speechSynthesis || null;

    if (this.recognition) {
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    }

    this.isListening = false;
    this.isSpeaking = false;
  }

  isSupported() {
    return !!(this.recognition && this.synthesis);
  }

  /**
   * Start listening for voice command / speech input.
   * @param {Object} callbacks - { onResult, onError, onEnd }
   */
  startListening({ onResult, onError, onEnd }) {
    if (!this.recognition) {
      if (onError) onError("Voice recognition is not supported in this browser.");
      return;
    }

    try {
      this.isListening = true;

      this.recognition.onresult = (event) => {
        let transcript = '';
        let isFinal = false;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinal = true;
          }
        }

        if (onResult) {
          onResult({ transcript, isFinal });
        }
      };

      this.recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        this.isListening = false;
        if (onError) onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
    } catch (e) {
      this.isListening = false;
      if (onError) onError(e.message);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Speak text out loud using Web Speech Synthesis.
   * @param {string} text 
   * @param {Object} options - { rate, pitch, onEnd }
   */
  speak(text, { rate = 1.0, pitch = 1.0, onEnd } = {}) {
    if (!this.synthesis) return;

    this.stopSpeaking(); // stop any ongoing audio

    // Clean markdown symbols for cleaner voice rendering
    const cleanText = text
      .replace(/[\#\*\_\`\>]/g, '')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate;
    utterance.pitch = pitch;

    // Pick a natural English voice if available
    const voices = this.synthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))) || voices[0];
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.error("TTS error:", e);
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    this.isSpeaking = true;
    this.synthesis.speak(utterance);
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }

  /**
   * Classifies voice command intent.
   * @param {string} text 
   * @returns {{ type: string, payload?: string }}
   */
  parseCommand(text) {
    const t = text.toLowerCase().trim();

    if (t.includes('analyze document') || t.includes('analyze contract') || t.includes('run analysis')) {
      return { type: 'ANALYZE_DOC' };
    }
    if (t.includes('what are the risks') || t.includes('show risks') || t.includes('red flags')) {
      return { type: 'SHOW_RISKS' };
    }
    if (t.includes('executive summary') || t.includes('summarize document')) {
      return { type: 'SHOW_SUMMARY' };
    }
    if (t.includes('stop reading') || t.includes('be quiet') || t.includes('stop audio')) {
      return { type: 'STOP_AUDIO' };
    }
    if (t.includes('read answer') || t.includes('read aloud') || t.includes('speak answer')) {
      return { type: 'READ_ALOUD' };
    }
    if (t.includes('clear document') || t.includes('reset document')) {
      return { type: 'CLEAR_DOC' };
    }

    // Default: treat as question for AI
    return { type: 'ASK_QUESTION', payload: text };
  }
}

export const voiceService = new VoiceService();
