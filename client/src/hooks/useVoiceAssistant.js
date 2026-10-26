import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';

export function useVoiceAssistant({ onTranscript } = {}) {
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef(null);
  const currentUtteranceRef = useRef(null);

  // Map app language code to BCP 47 speech locale
  const getSpeechLocale = useCallback((langCode) => {
    switch (langCode) {
      case 'te':
        return 'te-IN'; // Telugu (India)
      case 'hi':
        return 'hi-IN'; // Hindi (India)
      case 'ta':
        return 'ta-IN'; // Tamil (India)
      case 'en':
      default:
        return 'en-IN'; // English (India)
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = getSpeechLocale(language);

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentText = finalTranscript || interimTranscript;
        setTranscript(currentText);

        if (finalTranscript && onTranscript) {
          onTranscript(finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setError(event.error);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Failed to initialize speech recognition:', err);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, getSpeechLocale, onTranscript]);

  // Start Voice Command Input
  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      // Stop any ongoing speech output before listening
      stopSpeaking();
      setTranscript('');
      setError(null);
      recognitionRef.current.lang = getSpeechLocale(language);
      recognitionRef.current.start();
    } catch (err) {
      console.warn('Error starting voice recognition:', err);
      setIsListening(false);
    }
  }, [language, getSpeechLocale]);

  // Stop Listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  // Toggle Listening
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Text-To-Speech (Read Aloud in Telugu, Hindi, or English)
  const speak = useCallback((rawText) => {
    if (!window.speechSynthesis) return;

    // Cancel any previous speech
    window.speechSynthesis.cancel();

    if (!rawText || rawText.trim() === '') {
      setIsSpeaking(false);
      return;
    }

    // Clean markdown symbols for natural speech
    const cleanText = rawText
      .replace(/[#*`_~[\]()]/g, '')
      .replace(/>/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .slice(0, 1200); // Read first chunk for responsiveness

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const locale = getSpeechLocale(language);
    utterance.lang = locale;
    utterance.rate = 0.95; // Slightly slower for clear legal pronunciation
    utterance.pitch = 1.0;

    // Pick best available voice for language if available
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.toLowerCase().startsWith(language) || v.lang.toLowerCase().includes(locale.toLowerCase()));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    currentUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [language, getSpeechLocale]);

  // Stop Text-to-Speech
  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
    speak,
    stopSpeaking,
    language
  };
}
