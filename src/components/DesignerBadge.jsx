"use client";

import { useState, useCallback } from "react";

export default function DesignerBadge() {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = useCallback(() => {
        setIsAnimating(false);
        // Force a reflow to restart the animation if it was already playing
        setTimeout(() => {
            setIsAnimating(true);
        }, 10);
    }, []);

    return (
        <div
            onClick={handleClick}
            onAnimationEnd={() => setIsAnimating(false)}
            className={`fixed bottom-4 right-4 text-[12px] text-secondary z-50 font-sans cursor-pointer select-none ${isAnimating ? "decoherence-active" : ""
                }`}
            style={{ pointerEvents: "auto" }}
        >
            Designer : Brécheteau.B
        </div>
    );
}
