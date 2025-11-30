import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-background border-t border-gray-200 py-8 mt-auto">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                    <p className="text-sm text-secondary">
                        &copy; {new Date().getFullYear()} Chronon Field. All rights reserved.
                    </p>
                </div>

                <div className="flex items-center space-x-8">
                    {/* Icons removed as per request, now only on Homepage */}
                </div>
            </div>
        </footer>
    );
}
