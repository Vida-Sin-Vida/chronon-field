'use client';

import { useState, useRef, useEffect } from 'react';
import ParticleBackground from '../components/ParticleBackground';
import SocialIcons from '../components/SocialIcons';
import Logo from '../components/Logo';
import { useGlobal } from '../context/GlobalContext';

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);

  const startHeartbeat = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    // Heartbeat synthesis
    const osc = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(50, audioContextRef.current.currentTime); // Low thud

    // Pulse LFO
    const lfo = audioContextRef.current.createOscillator();
    lfo.type = 'triangle';
    lfo.frequency.setValueAtTime(1.2, audioContextRef.current.currentTime); // ~72 BPM
    const lfoGain = audioContextRef.current.createGain();
    lfoGain.gain.setValueAtTime(0.5, audioContextRef.current.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(gainNode.gain);
    lfo.start();

    // Fade in
    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.25, audioContextRef.current.currentTime + 1.5);

    osc.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    osc.start();

    oscillatorRef.current = osc;
    gainNodeRef.current = gainNode;
    setIsPlaying(true);
  };

  const stopHeartbeat = () => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 1.0); // Fade out
      setTimeout(() => {
        if (oscillatorRef.current) {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
        }
        setIsPlaying(false);
      }, 1000);
    }
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopHeartbeat();
    } else {
      startHeartbeat();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleAudio();
    }
  };

  useEffect(() => {
    return () => {
      stopHeartbeat();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const { isModalOpen, setIsModalOpen, t } = useGlobal();

  return (
    <div className="relative h-[calc(100vh-80px)] md:h-screen flex flex-col items-center justify-center overflow-hidden">
      <ParticleBackground />

      <div className="z-10 text-center px-4 max-w-4xl flex flex-col items-center justify-center h-full pb-20 md:pb-0">
        <div className="flex-grow flex flex-col items-center justify-center">
          <Logo className="w-32 h-32 md:w-48 md:h-48 text-accent mb-6 md:mb-8 animate-fade-in opacity-80" />

          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm md:text-base uppercase tracking-widest text-secondary mb-4 animate-fade-in-up hover:text-accent transition-colors duration-300 outline-none focus:text-accent relative group"
            aria-label={t('institute_label')}
          >
            {t('institute_name')}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-500 ease-out group-hover:w-1/2 opacity-50"></span>
            <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-accent transition-all duration-500 ease-out group-hover:w-1/2 opacity-50"></span>
          </button>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif font-bold text-foreground mb-6 animate-fade-in-up delay-100">
            Chronon Field
          </h1>
          <blockquote
            className={`text-lg md:text-xl font-light italic text-secondary/80 animate-fade-in-up delay-200 transition-all duration-1000 cursor-pointer max-w-2xl mx-auto p-4 rounded-lg select-none outline-none focus:ring-1 focus:ring-accent/50 ${isPlaying ? 'text-accent text-shadow-glow scale-105' : 'hover:text-accent hover:text-shadow-glow'}`}
            onClick={toggleAudio}
            onKeyDown={handleKeyDown}
            tabIndex="0"
            role="button"
            aria-pressed={isPlaying}
            aria-label={t('audio_label')}
          >
            {t('quote')}
          </blockquote>
        </div>

        {/* Spacer to push content up slightly from bottom icons */}
        <div className="h-24 md:h-32"></div>
      </div>

      <SocialIcons />

      {/* Info Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative animate-scale-up border border-gray-100 overflow-hidden">
            <ParticleBackground className="absolute inset-0 w-full h-full z-0 pointer-events-none" color={[159, 179, 200]} />
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-accent transition-colors p-2 z-20"
              aria-label={t('close')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center space-y-4 relative z-10">
              <div className="w-24 h-24 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Logo className="w-16 h-16 text-accent" />
              </div>

              <h2 className="text-xl font-serif font-bold text-foreground">
                {t('institute_name')}
              </h2>

              <div className="space-y-1">
                <p className="text-secondary font-medium">
                  {t('association_type')}
                </p>
                <p className="text-sm text-secondary/80 italic">
                  {t('law_ref')}
                </p>
              </div>

              <div className="py-4 border-t border-b border-gray-100 my-4 space-y-2 text-sm text-secondary">
                <p className="flex justify-between">
                  <span>{t('rna')}</span>
                  <span className="font-mono font-bold text-foreground">W442031361</span>
                </p>
                <p className="flex justify-between">
                  <span>{t('declared_on')}</span>
                  <span className="font-medium text-foreground">{t('date_value')}</span>
                </p>
                <p className="flex justify-between">
                  <span>{t('location')}</span>
                  <span className="font-medium text-foreground">{t('location_value')}</span>
                </p>
              </div>

              <p className="text-xs text-secondary/60 pt-2">
                {t('dedicated_to')}
              </p>
            </div>
          </div>

          {/* Backdrop click to close */}
          <div className="absolute inset-0 -z-10" onClick={() => setIsModalOpen(false)}></div>
        </div>
      )}
    </div>
  );
}

/*
( ~ ~ ~ Φ(x) ~ ~ ~
Benjamin Brécheteau | Chronon Field 2025
~ ~ ~ ~ ~ ~ ~ ~ ~)
*/
