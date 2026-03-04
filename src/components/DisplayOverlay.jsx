'use client';

import { useGlobal } from '../context/GlobalContext';

export default function DisplayOverlay() {
    const { brightness, blueLight, mounted } = useGlobal();

    if (!mounted) return null;

    const darknessOpacity = 1 - (brightness / 100);
    // Max 40% opacity for blue light filter
    const blueLightOpacity = (blueLight / 100) * 0.4;

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none transition-all duration-300" style={{ mixBlendMode: 'normal' }}>
            {/* Brightness dimming filter */}
            <div
                className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300"
                style={{ opacity: darknessOpacity }}
            />
            {/* Blue light warming filter */}
            <div
                className="absolute inset-0 bg-[#ff9900] pointer-events-none mix-blend-multiply transition-opacity duration-300"
                style={{ opacity: blueLightOpacity }}
            />
        </div>
    );
}
