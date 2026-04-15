import { Mail, Linkedin, Github, ArrowUpRight } from "lucide-react";

const Footer = () => {
  return (
    <>
      <footer className="relative border-t border-border py-16 md:py-20 overflow-hidden bg-muted/30">
        <div className="relative max-w-7xl mx-auto px-6 md:px-8" style={{ zIndex: 1 }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 md:gap-8">
            {/* Left Section */}
            <div className="flex-1">
              <p className="text-sm text-secondary font-500 mb-6 uppercase tracking-wide">Connect</p>
              <div className="flex gap-4">
                <a
                  href="mailto:sangampratapsingh21012006@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-border hover:border-accent hover:bg-accent/10 text-secondary hover:text-accent transition-all duration-200 flex items-center justify-center"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com/in/sangam21"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-border hover:border-accent hover:bg-accent/10 text-secondary hover:text-accent transition-all duration-200 flex items-center justify-center"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com/Random-Pikachu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-border hover:border-accent hover:bg-accent/10 text-secondary hover:text-accent transition-all duration-200 flex items-center justify-center"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Section */}
            <div className="text-right">
              <a
                href="https://www.cal.com/random-pikachu/15min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-500 text-secondary hover:text-accent transition-colors duration-200 group"
              >
                Schedule a call
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </a>
              <p className="text-xs text-secondary/60 mt-6">
                © 2025. Random-Pikachu.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
