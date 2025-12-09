import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 border-b border-[#222222]
        ${isOpen ? 'bg-[#080808]' : 'bg-[#080808]/80 backdrop-blur-md'}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex justify-end md:justify-center items-center h-16 md:h-[73px]">
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8">
            <Link
              to="/"
              className={`mono transition-colors duration-300 ${
                isActive("/")
                  ? "text-[#F7D02C]"
                  : "text-[#888888] hover:text-[#F7D02C]"
              }`}
            >
              [ home ]
            </Link>
            <Link
              to="/projects"
              className={`mono transition-colors duration-300 ${
                isActive("/projects")
                  ? "text-[#F7D02C]"
                  : "text-[#888888] hover:text-[#F7D02C]"
              }`}
            >
              [ projects ]
            </Link>
            <Link
              to="/experience"
              className={`mono transition-colors duration-300 ${
                isActive("/experience")
                  ? "text-[#F7D02C]"
                  : "text-[#888888] hover:text-[#F7D02C]"
              }`}
            >
              [ experience ]
            </Link>
            
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mono text-[#888888] hover:text-[#F7D02C] transition-colors duration-300"
            >
              [ resume.pdf ]
            </a>
            <a
              href="https://www.cal.com/random-pikachu/15min"
              target="_blank"
              className="mono text-lg text-[#888888] hover:text-[#F7D02C] transition-colors duration-300"
            >
              [ schedule_call ]
            </a>
          </div>

          <button 
            className="md:hidden text-[#888888] hover:text-[#F7D02C] transition-colors p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span className="relative block w-6 h-6">
              <Menu
                size={24}
                className={`absolute inset-0 transition-all duration-300 ease-out
                  ${isOpen ? 'opacity-0 scale-75 rotate-90' : 'opacity-100 scale-100 rotate-0'}`}
              />
              <X
                size={24}
                className={`absolute inset-0 transition-all duration-300 ease-out
                  ${isOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-90'}`}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        className={`
          fixed inset-0 bg-[#080808] z-40 flex flex-col items-center justify-center gap-8 md:hidden
          transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        <Link
          to="/"
          className={`mono text-lg transition-colors duration-300 ${
            isActive("/")
              ? "text-[#F7D02C]"
              : "text-[#888888] hover:text-[#F7D02C]"
          }`}
        >
          [ home ]
        </Link>
        <Link
          to="/projects"
          className={`mono text-lg transition-colors duration-300 ${
            isActive("/projects")
              ? "text-[#F7D02C]"
              : "text-[#888888] hover:text-[#F7D02C]"
          }`}
        >
          [ projects ]
        </Link>
        <Link
          to="/experience"
          className={`mono text-lg transition-colors duration-300 ${
            isActive("/experience")
              ? "text-[#F7D02C]"
              : "text-[#888888] hover:text-[#F7D02C]"
          }`}
        >
          [ experience ]
        </Link>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="mono text-lg text-[#888888] hover:text-[#F7D02C] transition-colors duration-300"
        >
          [ resume.pdf ]
        </a>
        <a
          href="https://www.cal.com/random-pikachu/15min"
          target="_blank"
          className="mono text-lg text-[#888888] hover:text-[#F7D02C] transition-colors duration-300"
        >
          [ schedule_call ]
        </a>
      </div>
    </>
  );
}
