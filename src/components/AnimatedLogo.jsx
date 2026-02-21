'use client';

import Link from 'next/link';

export default function AnimatedLogo() {
    return (
        <div className="relative inline-block z-10">
            <Link
                href="/"
                className="group relative inline-flex items-center justify-center p-3 transition-all duration-500 ease-out focus:outline-none focus:ring-0 outline-none"
            >
                <img
                    src="/logo_transparent.png"
                    alt="Chronon Field - Accueil"
                    className="h-12 md:h-16 w-auto object-contain cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.15] group-hover:-rotate-3 group-hover:-translate-y-1"
                />
            </Link>
        </div>
    );
}
