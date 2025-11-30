export default function SocialIcons() {
    const icons = [
        {
            name: "GitHub",
            href: "https://github.com/Vida-Sin-Vida",
            path: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        },
        {
            name: "Zenodo",
            href: "https://zenodo.org/search?q=metadata.creators.person_or_org.name%3A%22Br%C3%A9cheteau%2C%20Benjamin%22&l=list&p=1&s=10&sort=bestmatch",
            // Simplified Zenodo-like icon (Z shape or similar generic research icon if specific SVG unavailable, using a generic document/archive shape here for representation)
            path: "M4 4h16v16H4z M6 6v12h12V6H6z M8 8h8v2H8z M8 12h8v2H8z"
        },
        {
            name: "LinkedIn",
            href: "https://www.linkedin.com/in/benjamin-brécheteau-45233b193",
            path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
        },
        {
            name: "Gmail",
            href: "mailto:brecheteaub@gmail.com",
            path: "M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
        },
        {
            name: "ORCID",
            href: "https://orcid.org/0009-0003-5621-2950",
            path: "M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.948.948 0 0 1-.947-.947c0-.516.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.3 0 4.054 1.148 4.054 3.309 0 2.951-2.2 3.489-4.381 3.489h-1.216v-3.006h1.054c1.047 0 1.443-.344 1.443-1.078 0-.731-.456-1.222-1.622-1.222h-1.689v6.818h-1.543V7.416z"
        }
    ];

    return (
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center items-center space-x-8 animate-fade-in-up delay-300">
            {icons.map((icon) => (
                <a
                    key={icon.name}
                    href={icon.href}
                    target={icon.name === "Gmail" ? "_self" : "_blank"}
                    rel={icon.name === "Gmail" ? "" : "noopener noreferrer"}
                    className="text-secondary/70 hover:text-accent transition-all duration-300 transform hover:scale-110 hover:drop-shadow-glow"
                    aria-label={icon.name}
                >
                    <svg
                        className="w-6 h-6 md:w-8 md:h-8"
                        fill="currentColor"
                        viewBox={icon.name === "Gmail" ? "0 0 24 24" : "0 0 24 24"} // Adjust viewBox if needed per icon
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d={icon.path} />
                    </svg>
                </a>
            ))}
        </div>
    );
}
