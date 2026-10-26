import React from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles } from 'lucide-react';

export default function VoiceCommandButton({
  isListening,
  onToggle,
  language = 'en',
  disabled = false,
  className = ''
}) {
  const getLangTitle = () => {
    switch (language) {
      case 'te':
        return isListening ? 'వినడం ఆపండి (తెలుగు)' : 'వాయిస్ కమాండ్ ద్వారా మాట్లాడండి (తెలుగు)';
      case 'hi':
        return isListening ? 'सुनना बंद करें (हिन्दी)' : 'आवाज द्वारा प्रश्न पूछें (हिन्दी)';
      case 'en':
      default:
        return isListening ? 'Stop Listening (English)' : 'Click to Speak (English)';
    }
  };

  return (
    <div className="relative inline-flex items-center">
      {isListening && (
        <span className="absolute -inset-1 rounded-full bg-amber-400 opacity-75 animate-ping pointer-events-none"></span>
      )}
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`relative p-2.5 rounded-xl flex items-center justify-center transition-all ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg ring-2 ring-red-400 ring-offset-2'
            : 'bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 border border-slate-300 hover:border-amber-400'
        } ${className}`}
        title={getLangTitle()}
        aria-label="Voice Command"
      >
        {isListening ? (
          <div className="flex items-center gap-1.5">
            <Mic className="w-4 h-4 animate-bounce" />
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Listening</span>
          </div>
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

export function AudioSpeakerButton({
  text,
  isSpeaking,
  onSpeak,
  onStop,
  className = ''
}) {
  return (
    <button
      type="button"
      onClick={isSpeaking ? onStop : onSpeak}
      className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs ${
        isSpeaking
          ? 'bg-amber-100 text-amber-800 font-bold border border-amber-300'
          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
      } ${className}`}
      title={isSpeaking ? "Stop Audio" : "Listen (Read Aloud)"}
      aria-label="Read Aloud"
    >
      {isSpeaking ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
          <span className="text-[10px] hidden md:inline">Playing</span>
        </>
      ) : (
        <Volume2 className="w-3.5 h-3.5" />
      )}
    </button>
  );
}
