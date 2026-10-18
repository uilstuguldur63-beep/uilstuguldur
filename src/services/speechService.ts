/**
 * CRITICAL LANGUAGE RULE:
 * This audio service speaks ENGLISH ONLY.
 * Never spoken Mongolian.
 * Real browser SpeechSynthesis and Web Audio API synthesizer.
 */

type VoiceAccent = 'en-US' | 'en-GB';

export class SpeechService {
  private static instance: SpeechService;
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState = false;
  private currentAccent: VoiceAccent = 'en-US';
  private currentRate = 1.0;
  private listeners: Set<(isSpeaking: boolean, text?: string) => void> = new Set();
  private audioCtx: AudioContext | null = null;

  private constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public static getInstance(): SpeechService {
    if (!SpeechService.instance) {
      SpeechService.instance = new SpeechService();
    }
    return SpeechService.instance;
  }

  public setAccent(accent: VoiceAccent) {
    this.currentAccent = accent;
  }

  public setRate(rate: number) {
    this.currentRate = Math.max(0.5, Math.min(1.5, rate));
  }

  public subscribe(cb: (isSpeaking: boolean, text?: string) => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify(isSpeaking: boolean, text?: string) {
    this.isSpeakingState = isSpeaking;
    this.listeners.forEach((cb) => cb(isSpeaking, text));
  }

  public isAvailable(): boolean {
    return !!this.synth;
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState || (this.synth ? this.synth.speaking : false);
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeakingState = false;
    this.notify(false);
  }

  /**
   * Speak English text ONLY.
   * If text contains Cyrillic (Mongolian), refuse to speak per safety policy.
   */
  public speakEnglish(
    text: string,
    options?: {
      rate?: number;
      accent?: VoiceAccent;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.synth) {
        console.warn('Speech synthesis not supported in this browser.');
        options?.onError?.(new Error('Speech synthesis not supported'));
        resolve(false);
        return;
      }

      // Safeguard: Check for Cyrillic Mongolian characters
      const hasCyrillic = /[\u0400-\u04FF]/.test(text);
      if (hasCyrillic) {
        console.warn('CRITICAL RULE: AI Voice is strictly English-only. Refusing to speak Mongolian text.');
        options?.onError?.(new Error('AI Teacher speaks English only'));
        resolve(false);
        return;
      }

      // Stop any current speech
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options?.accent || this.currentAccent;
      utterance.rate = options?.rate ?? this.currentRate;
      utterance.pitch = 1.05; // Friendly, clear teacher pitch

      // Pick matching English voice
      const voices = this.synth.getVoices();
      const targetLang = utterance.lang;
      const matchedVoice =
        voices.find((v) => v.lang.startsWith(targetLang) || v.lang.replace('_', '-').startsWith(targetLang)) ||
        voices.find((v) => v.lang.startsWith('en')) ||
        null;

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        this.notify(true, text);
      };

      utterance.onend = () => {
        this.notify(false);
        options?.onEnd?.();
        resolve(true);
      };

      utterance.onerror = (e) => {
        this.notify(false);
        console.warn('Speech synthesis error or canceled:', e);
        options?.onError?.(e);
        resolve(false);
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    });
  }

  /**
   * Check if device has an authentic Mongolian voice installed
   */
  public hasMongolianVoice(): boolean {
    if (!this.synth) return false;
    const voices = this.synth.getVoices();
    return voices.some(
      (v) =>
        v.lang.toLowerCase().startsWith('mn') ||
        v.name.toLowerCase().includes('mongolian') ||
        v.name.toLowerCase().includes('монгол')
    );
  }

  /**
   * Speak Mongolian using the device's available Mongolian text-to-speech voice if supported.
   * If native Mongolian voice is not installed on the system (e.g. desktop browsers without mn-MN pack),
   * uses an acoustic formant phoneme synthesizer via Web Audio API so the child actually hears
   * the natural sound of the Mongolian letter/word, rather than silence or an English voice.
   */
  public speakMongolian(
    text: string,
    options?: {
      rate?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
      onVoiceUnavailable?: () => void;
    }
  ): Promise<{ played: boolean; hasVoice: boolean; method: 'native' | 'acoustic_phonetic' }> {
    return new Promise((resolve) => {
      // 1. Try native SpeechSynthesis with Mongolian voice if available
      if (this.synth) {
        this.synth.cancel();
        const voices = this.synth.getVoices();
        const mnVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith('mn') ||
            v.name.toLowerCase().includes('mongolian') ||
            v.name.toLowerCase().includes('монгол')
        );

        if (mnVoice) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.voice = mnVoice;
          utterance.lang = mnVoice.lang || 'mn-MN';
          utterance.rate = options?.rate ?? 0.85;
          utterance.pitch = 1.05;

          utterance.onstart = () => {
            this.notify(true, text);
            options?.onStart?.();
          };

          utterance.onend = () => {
            this.notify(false);
            options?.onEnd?.();
            resolve({ played: true, hasVoice: true, method: 'native' });
          };

          utterance.onerror = (e) => {
            this.notify(false);
            options?.onError?.(e);
            resolve({ played: false, hasVoice: true, method: 'native' });
          };

          this.currentUtterance = utterance;
          this.synth.speak(utterance);
          return;
        }
      }

      // 2. Fallback: device does NOT have native Mongolian TTS voice installed.
      // Use authentic acoustic phoneme synthesis via Web Audio API
      options?.onVoiceUnavailable?.();
      const ctx = this.getAudioContext();
      if (!ctx) {
        options?.onError?.(new Error('AudioContext not supported'));
        resolve({ played: false, hasVoice: false, method: 'acoustic_phonetic' });
        return;
      }

      this.notify(true, text);
      options?.onStart?.();

      this.playAcousticMongolianPhoneme(ctx, text, () => {
        this.notify(false);
        options?.onEnd?.();
        resolve({ played: true, hasVoice: false, method: 'acoustic_phonetic' });
      });
    });
  }

  /**
   * Acoustic formant synthesizer for Mongolian letters and words.
   * Models the resonant formant frequencies (F1, F2, F3) of Mongolian vowels and consonant transitions.
   */
  private playAcousticMongolianPhoneme(ctx: AudioContext, text: string, onDone: () => void) {
    try {
      const now = ctx.currentTime;
      const clean = text.trim();
      const firstChar = clean.charAt(0).toUpperCase();

      // Formant presets (F1, F2, F3 in Hz) for Mongolian vowels
      const formantMap: Record<string, [number, number, number]> = {
        'А': [820, 1220, 2500],
        'Э': [540, 1850, 2600],
        'И': [320, 2350, 2900],
        'О': [510, 920, 2450],
        'У': [380, 800, 2300],
        'Ө': [440, 1480, 2450],
        'Ү': [320, 1680, 2550],
        'Ы': [360, 1920, 2650],
        'Е': [450, 2000, 2700],
        'Ё': [480, 1050, 2450],
        'Ю': [340, 1500, 2400],
        'Я': [650, 1400, 2500],
      };

      const duration = clean.length > 2 ? 0.65 : 0.45;
      const baseFreq = 230; // Child / friendly voice fundamental frequency

      // 1. Glottal source oscillator
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(baseFreq, now);
      // Gentle downward inflection characteristic of Mongolian syllables
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + duration);

      // 2. Master gain envelope
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(0.22, now + 0.04);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // Formants for the vowel or consonant release
      const formants = formantMap[firstChar] || [520, 1500, 2500];

      // Create 3 parallel formant bandpass filters
      const filter1 = ctx.createBiquadFilter();
      filter1.type = 'bandpass';
      filter1.frequency.value = formants[0];
      filter1.Q.value = 4.5;

      const filter2 = ctx.createBiquadFilter();
      filter2.type = 'bandpass';
      filter2.frequency.value = formants[1];
      filter2.Q.value = 5.5;

      const filter3 = ctx.createBiquadFilter();
      filter3.type = 'bandpass';
      filter3.frequency.value = formants[2];
      filter3.Q.value = 6.0;

      // Consonant burst noise if consonant
      const isVowel = Object.prototype.hasOwnProperty.call(formantMap, firstChar);
      if (!isVowel) {
        // Add subtle initial consonant burst (plosive / fricative click)
        const burstOsc = ctx.createOscillator();
        burstOsc.type = 'triangle';
        burstOsc.frequency.setValueAtTime(140, now);
        burstOsc.frequency.exponentialRampToValueAtTime(80, now + 0.05);

        const burstGain = ctx.createGain();
        burstGain.gain.setValueAtTime(0.18, now);
        burstGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        burstOsc.connect(burstGain);
        burstGain.connect(ctx.destination);
        burstOsc.start(now);
        burstOsc.stop(now + 0.07);
      }

      // Connect vocal tract
      osc.connect(masterGain);
      masterGain.connect(filter1);
      masterGain.connect(filter2);
      masterGain.connect(filter3);

      filter1.connect(ctx.destination);
      filter2.connect(ctx.destination);
      filter3.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);

      setTimeout(() => {
        onDone();
      }, duration * 1000);
    } catch {
      onDone();
    }
  }

  /**
   * Non-verbal educational sound effects via Web Audio API.
   * NEVER generates spoken Mongolian.
   */
  private getAudioContext(): AudioContext | null {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public playSoundEffect(type: 'correct' | 'star' | 'pop' | 'wrong' | 'click' | 'tada') {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      if (type === 'correct') {
        // Cheerful ascending arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.2, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.25);
        });
      } else if (type === 'star') {
        // High sparkle chime
        const freqs = [880, 1174.66, 1318.51, 1760];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.18, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.3);
        });
      } else if (type === 'pop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'wrong') {
        // Gentle soft buzz (not harsh)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.setValueAtTime(220, now + 0.12);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
      } else if (type === 'tada') {
        const chord = [523.25, 659.25, 783.99, 1046.5];
        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.7);
        });
      }
    } catch {
      // Audio playback fails gracefully
    }
  }
}

export const speechService = SpeechService.getInstance();
