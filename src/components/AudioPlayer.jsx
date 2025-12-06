'use client';

import { useState, useRef, useEffect } from 'react';

export default function AudioPlayer({ src, title }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    const audioRef = useRef(null);
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
            cancelAnimationFrame(animationRef.current);
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const initializeAudioContext = () => {
        if (!audioContextRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContextRef.current = new AudioContext();
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;

            sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
            sourceRef.current.connect(analyserRef.current);
            analyserRef.current.connect(audioContextRef.current.destination);
        }
    };

    const draw = () => {
        if (!canvasRef.current || !analyserRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        analyserRef.current.getByteFrequencyData(dataArray);

        ctx.fillStyle = 'rgb(0, 0, 0)'; // Black background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;

            // Gradient or color based on amplitude
            ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`; // Reddish tint
            // Or use the accent color from the site theme if possible (e.g., #ff3e00 or similar)
            // Let's stick to a white/grey/accent mix for "Chronon" style
            ctx.fillStyle = `rgba(255, 255, 255, ${barHeight / 255})`;

            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }

        animationRef.current = requestAnimationFrame(draw);
    };

    const togglePlay = async () => {
        if (!audioContextRef.current) {
            initializeAudioContext();
        }

        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }

        if (isPlaying) {
            audioRef.current.pause();
            cancelAnimationFrame(animationRef.current);
        } else {
            audioRef.current.play();
            draw();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const percent = x / width;

        audioRef.current.currentTime = percent * duration;
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        audioRef.current.volume = newVolume;
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="w-full max-w-2xl bg-black/90 rounded-xl p-6 shadow-2xl border border-white/10">
            {title && <h3 className="text-white font-serif text-xl mb-4">{title}</h3>}

            <canvas
                ref={canvasRef}
                width={600}
                height={100}
                className="w-full h-32 bg-black rounded-lg mb-4 cursor-pointer border border-white/5 hover:border-white/20 transition-colors"
                onClick={handleSeek}
            />

            <div className="flex items-center justify-between gap-4">
                <button
                    onClick={togglePlay}
                    className="p-3 rounded-full bg-white text-black hover:scale-105 transition-transform"
                >
                    {isPlaying ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>

                <div className="flex-grow flex items-center gap-2 text-xs font-mono text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <div className="flex-grow h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-100 ease-linear"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                    </div>
                    <span>{formatTime(duration)}</span>
                </div>

                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-20 accent-white h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>

            <audio
                ref={audioRef}
                src={src}
                crossOrigin="anonymous"
                className="hidden"
            />
        </div>
    );
}
