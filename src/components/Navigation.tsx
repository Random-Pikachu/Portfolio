import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
        className={`fixed top-0 left-0 right-0 z-50 border-b border-border transition-all duration-300
        ${isOpen ? 'bg-background' : 'bg-background/95 backdrop-blur-sm'}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex justify-between md:justify-center items-center h-16">
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-12">
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, 'hero')}
              className="text-secondary hover:text-foreground transition-colors duration-200 text-sm font-500"
            >
              home
            </a>
            <a
              href="#projects"
              onClick={(e) => handleNavClick(e, 'projects')}
              className="text-secondary hover:text-foreground transition-colors duration-200 text-sm font-500"
            >
              projects
            </a>
            <a
              href="#experience"
              onClick={(e) => handleNavClick(e, 'experience')}
              className="text-secondary hover:text-foreground transition-colors duration-200 text-sm font-500"
            >
              experience
            </a>
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, 'about')}
              className="text-secondary hover:text-foreground transition-colors duration-200 text-sm font-500"
            >
              about
            </a>
            
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-foreground transition-colors duration-200 text-sm font-500"
            >
              resume
            </a>
          </div>

          <button 
            className="md:hidden text-secondary hover:text-foreground transition-colors p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span className="relative block w-5 h-5">
              <Menu
                size={20}
                className={`absolute inset-0 transition-all duration-300 ease-out
                  ${isOpen ? 'opacity-0 scale-75 rotate-90' : 'opacity-100 scale-100 rotate-0'}`}
              />
              <X
                size={20}
                className={`absolute inset-0 transition-all duration-300 ease-out
                  ${isOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-90'}`}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        className={`
          fixed inset-0 bg-background z-40 flex flex-col items-center justify-center gap-6 md:hidden
          transition-opacity duration-300 pt-16
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, 'hero')}
          className="text-secondary hover:text-foreground transition-colors duration-200 text-sm font-500"
        >
          home
        </a>
        <a
          href="#projects"
          onClick={(e) => handleNavClick(e, 'projects')}
          className="text-secondary hover:text-foreground transition-colors duration-200 text-sm font-500"
        >
          projects
        </a>
        <a
          href="#experience"
          onClick={(e) => handleNavClick(e, 'experience')}
          className="text-secondary hover:text-foreground transition-colors duration-200 text-sm font-500"
        >
          experience
        </a>
        <a
          href="#about"
          onClick={(e) => handleNavClick(e, 'about')}
          className="text-secondary hover:text-foreground transition-colors duration-200 text-sm font-500"
        >
          about
        </a>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary hover:text-foreground transition-colors duration-200 text-sm font-500"
        >
          resume
        </a>
      </div>
    </>
  );
}
