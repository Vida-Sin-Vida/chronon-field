'use client';

import { useState, useRef, useEffect } from 'react';
import ParticleBackground from '../components/ParticleBackground';
import SocialIcons from '../components/SocialIcons';
import Logo from '../components/Logo';

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

  return (
    <div className="relative h-[calc(100vh-80px)] md:h-screen flex flex-col items-center justify-center overflow-hidden">
      <ParticleBackground />

      <div className="z-10 text-center px-4 max-w-4xl flex flex-col items-center justify-center h-full pb-20 md:pb-0">
        <div className="flex-grow flex flex-col items-center justify-center">
          <Logo className="w-32 h-32 md:w-48 md:h-48 text-accent mb-6 md:mb-8 animate-fade-in opacity-80" />

          <p className="text-sm md:text-base uppercase tracking-widest text-secondary mb-4 animate-fade-in-up">
            Institut de recherche non homologué
          </p>
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
            aria-label="Activer l'ambiance sonore — battement du monde"
          >
            "Le temps n'est pas une ligne, c'est un champ de possibles."
          </blockquote>
        </div>

        {/* Spacer to push content up slightly from bottom icons */}
        <div className="h-24 md:h-32"></div>
      </div>

      <SocialIcons />
    </div>
  );
}
