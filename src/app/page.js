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

  // Series Symbols State
  const [isSeriesVisible, setIsSeriesVisible] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [isDistorting, setIsDistorting] = useState(false);
  const [activeSymbolId, setActiveSymbolId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const series = [
    {
      id: 'chronon',
      title: t('series_chronon_title'),
      desc: t('series_chronon_desc'),
      image: '/symbole/Chronon Fields Series_Symbole.png',
      angle: -67.5,
      delay: 'delay-0'
    },
    {
      id: 'entanglement',
      title: t('series_entanglement_title'),
      desc: t('series_entanglement_desc'),
      image: '/symbole/Entanglement Dynamics Series_Symbole.png',
      angle: -22.5,
      delay: 'delay-75'
    },
    {
      id: 'phi',
      title: t('series_phi_title'),
      desc: t('series_phi_desc'),
      image: '/symbole/The Φ System Series_symbole.png',
      angle: 22.5,
      delay: 'delay-150'
    },
    {
      id: 'three_laws',
      title: t('series_three_laws_title'),
      image: '/symbole/Three Laws_Symbole.png',
      angle: 67.5,
      delay: 'delay-225',
      isDistortion: true
    }
  ];

  const handleLogoClick = () => {
    setIsSeriesVisible(!isSeriesVisible);
    if (isSeriesVisible) {
      setActiveSymbolId(null);
      setSelectedSeries(null);
    }
  };

  const handleSeriesClick = (s) => {
    if (s.isDistortion) {
      setIsDistorting(true);
      setActiveSymbolId(s.id);
      setTimeout(() => {
        setIsDistorting(false);
        setActiveSymbolId(null);
      }, 800);
    } else {
      setActiveSymbolId(s.id);
      // Wait for slide animation before showing overlay
      setTimeout(() => {
        setSelectedSeries(s);
      }, 600);
    }
  };

  const getSymbolPosition = (angle, sId) => {
    const s = series.find(ser => ser.id === sId);
    if (activeSymbolId === sId && !s?.isDistortion) return { x: 0, y: 0 };
    // Responsive radius: smaller on mobile to prevent edge touching
    const radius = isMobile ? 140 : 240;
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: Math.cos(rad) * radius,
      y: Math.sin(rad) * radius
    };
  };

  return (
    <div className="relative h-[calc(100vh-80px)] md:h-screen flex flex-col items-center justify-center overflow-hidden">
      <ParticleBackground />

      <div className={`text-center px-4 max-w-4xl flex flex-col items-center justify-center h-full pb-20 md:pb-0 transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isSeriesVisible ? 'z-[60] translate-y-32' : 'z-10 translate-y-0'}`}>
        <div className="flex-grow flex flex-col items-center justify-center relative">

          {/* Central Logo with Series Symbols */}
          <div className="relative mb-6 md:mb-8 group">
            {/* Symbols circling the logo */}
            {series.map((s) => {
              const pos = getSymbolPosition(s.angle, s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => handleSeriesClick(s)}
                  className={`absolute inset-0 m-auto w-24 h-24 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-20 hover:scale-110 hover:brightness-125 hover:drop-shadow-[0_0_20px_rgba(159,179,200,0.5)] ${isSeriesVisible
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-0 pointer-events-none'
                    } ${s.delay}`}
                  style={{
                    transform: isSeriesVisible
                      ? `translate(${pos.x}px, ${pos.y}px) scale(${activeSymbolId === s.id && !s.isDistortion ? 1.5 : 1})`
                      : 'translate(0, 0) scale(0)',
                  }}
                  title={s.title}
                >
                  <img
                    src={s.image}
                    alt={s.title}
                    className={`w-full h-full object-contain drop-shadow-xl ${activeSymbolId === s.id && s.isDistortion ? 'distortion-active' : ''}`}
                  />
                </button>
              );
            })}

            <div
              className={`cursor-pointer transition-all duration-500 relative z-10 ${isSeriesVisible ? 'scale-110' : 'hover:scale-105'}`}
              onClick={handleLogoClick}
            >
              {/* Blurred Logo Background */}
              <div className={`transition-all duration-500 ${isSeriesVisible ? 'blur-sm opacity-30 shadow-[0_0_30px_rgba(159,179,200,0.1)]' : 'opacity-80'}`}>
                <Logo className="w-32 h-32 md:w-48 md:h-48 text-accent animate-fade-in" />
              </div>

              {/* Back Arrow Indicator - Now clear and centered */}
              <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all ${isSeriesVisible
                ? 'opacity-100 translate-y-0 duration-700 delay-700'
                : 'opacity-0 translate-y-4 pointer-events-none duration-[350ms] delay-0'}`}>
                <div className="bg-background/20 backdrop-blur-md p-3 rounded-full border border-accent/20 shadow-2xl">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent animate-bounce">
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-accent mt-3 font-bold drop-shadow-md">{t('back')}</span>
              </div>
            </div>
          </div>

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

        {/* Series Explanation Overlay */}
        {selectedSeries && (
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-background/60 backdrop-blur-2xl p-6 md:p-8 animate-fade-in overflow-y-auto"
            onClick={() => {
              setSelectedSeries(null);
              setActiveSymbolId(null);
            }}
          >
            <div
              className="max-w-xl w-full text-center space-y-4 md:space-y-6 animate-scale-up py-12 md:py-8 relative"
              style={{ marginTop: '-7cm' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto relative mb-4 md:mb-8">
                <img src={selectedSeries.image} alt="" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-2xl md:text-4xl font-serif font-bold text-foreground">
                {selectedSeries.title}
              </h2>
              <p className="text-base md:text-xl text-foreground/80 leading-relaxed font-light">
                {selectedSeries.desc}
              </p>
              <button
                onClick={() => {
                  setSelectedSeries(null);
                  setActiveSymbolId(null);
                }}
                className="mt-4 text-accent border-b border-accent/30 hover:border-accent pb-1 transition-all uppercase tracking-widest text-sm font-bold"
              >
                {t('close')}
              </button>
            </div>
          </div>
        )}

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
