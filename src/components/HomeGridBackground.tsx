interface GridProps {
    delay?: number;
}

export default function HomeGridBackground({ delay = 0 }: GridProps) {
    return (
        <div className="relative w-full h-screen overflow-hidden">
            
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

            <div className="relative z-10 h-full w-full flex items-center justify-center">
                
                <div 
                    className="w-[300px] md:w-[480px] h-[300px] md:h-[480px] rounded-full bg-none border border-white/10 z-10 opacity-0 animate-scale-in"
                    style={{ animationDelay: `${delay-100}ms` }}
                ></div>

                <div 
                    className="w-px h-full border-r border-white/10 absolute top-0 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in"
                    style={{ animationDelay: `${delay + 600}ms` }}
                ></div>
                
                <div 
                    className="absolute top-0 h-full w-px bg-white/5 left-1/2 -translate-x-[140px] md:-translate-x-[220px] opacity-0 animate-fade-in"
                    style={{ animationDelay: `${delay + 800}ms` }}
                ></div>
                <div 
                    className="hidden md:block absolute top-0 h-full w-px bg-white/5 left-1/2 -translate-x-[440px] opacity-0 animate-fade-in"
                    style={{ animationDelay: `${delay + 900}ms` }}
                ></div>

                <div 
                    className="absolute top-0 h-full w-px bg-white/5 left-1/2 translate-x-[140px] md:translate-x-[220px] opacity-0 animate-fade-in"
                    style={{ animationDelay: `${delay + 800}ms` }}
                ></div>
                <div 
                    className="hidden md:block absolute top-0 h-full w-px bg-white/5 left-1/2 translate-x-[440px] opacity-0 animate-fade-in"
                    style={{ animationDelay: `${delay + 900}ms` }}
                ></div>

                <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[150px] md:-translate-y-[180px] w-[280px] md:w-[380px] h-px bg-white/5 origin-center opacity-0 animate-line-grow"
                    style={{ animationDelay: `${delay + 400}ms` }}
                ></div>
                <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[150px] md:translate-y-[180px] w-[280px] md:w-[380px] h-px bg-white/5 origin-center opacity-0 animate-line-grow"
                    style={{ animationDelay: `${delay + 400}ms` }}
                ></div>
            </div>
        </div>
    )
}