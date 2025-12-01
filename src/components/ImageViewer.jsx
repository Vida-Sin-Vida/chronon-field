'use client';

import { useState, useRef, useEffect } from 'react';

export default function ImageViewer({ src, alt }) {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const containerRef = useRef(null);
    const imageRef = useRef(null);

    const MIN_SCALE = 1; // Start at 1 (fit) and don't go below
    const MAX_SCALE = 8; // Allow deeper zoom

    // Reset position when scale goes back to 1
    useEffect(() => {
        if (scale <= 1) {
            setPosition({ x: 0, y: 0 });
        }
    }, [scale]);

    const handleWheel = (e) => {
        e.preventDefault();
        e.stopPropagation(); // Stop event from bubbling up to page scroll

        const delta = -e.deltaY * 0.002;
        const newScale = Math.min(Math.max(scale + delta, MIN_SCALE), MAX_SCALE);
        setScale(newScale);
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        if (scale > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleZoomIn = () => {
        setScale(Math.min(scale + 0.5, MAX_SCALE));
    };

    const handleZoomOut = () => {
        setScale(Math.max(scale - 0.5, MIN_SCALE));
    };

    const handleReset = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    // Touch support
    const handleTouchStart = (e) => {
        if (e.touches.length === 1 && scale > 1) {
            setIsDragging(true);
            setDragStart({
                x: e.touches[0].clientX - position.x,
                y: e.touches[0].clientY - position.y
            });
        }
    };

    const handleTouchMove = (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        // e.preventDefault(); 
        setPosition({
            x: e.touches[0].clientX - dragStart.x,
            y: e.touches[0].clientY - dragStart.y
        });
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    return (
        <div
            className="relative w-full h-full overflow-hidden bg-black/5 rounded-lg select-none flex items-center justify-center"
            ref={containerRef}
            onWheel={handleWheel}
        >
            {/* Controls */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border border-white/20 transition-opacity duration-300 hover:bg-white/90">
                <button
                    onClick={handleZoomOut}
                    disabled={scale <= MIN_SCALE}
                    className={`p-2 rounded-full transition-colors ${scale <= MIN_SCALE ? 'text-gray-300 cursor-not-allowed' : 'text-secondary hover:bg-black/5 hover:text-foreground active:scale-95'}`}
                    aria-label="Zoom out"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                </button>
                <span className="text-xs font-medium text-secondary min-w-[3rem] text-center tabular-nums">
                    {Math.round(scale * 100)}%
                </span>
                <button
                    onClick={handleZoomIn}
                    disabled={scale >= MAX_SCALE}
                    className={`p-2 rounded-full transition-colors ${scale >= MAX_SCALE ? 'text-gray-300 cursor-not-allowed' : 'text-secondary hover:bg-black/5 hover:text-foreground active:scale-95'}`}
                    aria-label="Zoom in"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
                <div className="w-px h-4 bg-gray-300 mx-1"></div>
                <button
                    onClick={handleReset}
                    className="px-2 text-xs font-medium text-secondary hover:text-accent transition-colors uppercase tracking-wider"
                >
                    Reset
                </button>
            </div>

            {/* Image Container */}
            <div
                className={`w-full h-full flex items-center justify-center ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <img
                    ref={imageRef}
                    src={src}
                    alt={alt}
                    className="max-w-full max-h-full object-contain transition-transform duration-100 ease-out will-change-transform"
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    }}
                    draggable={false}
                />
            </div>
        </div>
    );
}
