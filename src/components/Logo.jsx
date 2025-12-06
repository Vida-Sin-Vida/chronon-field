export default function Logo({ className = "w-12 h-12" }) {
    return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" className="opacity-20" />
            <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1" className="opacity-40" />
            <path d="M50 20V80" stroke="currentColor" strokeWidth="1" className="opacity-60" />
            <path d="M20 50H80" stroke="currentColor" strokeWidth="1" className="opacity-60" />
            <circle cx="50" cy="50" r="5" fill="currentColor" className="animate-pulse" />
            {/* Orbital paths */}
            <ellipse cx="50" cy="50" rx="20" ry="40" stroke="currentColor" strokeWidth="1" className="opacity-30 rotate-45 origin-center" />
            <ellipse cx="50" cy="50" rx="20" ry="40" stroke="currentColor" strokeWidth="1" className="opacity-30 -rotate-45 origin-center" />
        </svg>
    );
}
