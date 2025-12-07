export default function RegularGridBackground() {
    return (
        <div className="absolute inset-0 pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern
                            id="grid"
                            width="20"
                            height="20"
                            patternUnits="userSpaceOnUse"
                        >
                            <path
                                d="M 20 0 L 0 0 0 20"
                                fill="none"
                                stroke="#222222"
                                strokeWidth="1"
                                opacity="0.3" 
                            />
                        </pattern>
                    </defs>

                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>
    )
}