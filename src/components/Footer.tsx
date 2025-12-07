import { Mail, Linkedin, Github } from "lucide-react";

const Footer = () => {
  return (
    <>
      <footer className="realtive border-t border-[#222222] py-24 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-8" style={{ zIndex: 1 }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
            <div>
              <p className="mono text-[#888888] mb-6">[ Get in touch ]</p>
              <div className="flex gap-6">
                <a
                  href="mailto:sangampratapsingh21012006@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#888888] hover:text-[#F7D02C] transition-colors duration-300"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com/in/sangam21"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#888888] hover:text-[#F7D02C] transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                
                <a
                  href="https://github.com/Random-Pikachu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#888888] hover:text-[#F7D02C] transition-colors duration-300"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>


            <div className="text-right">
              <p className="mono text-[#444444] mb-1">© 2025 Random-Pikachu</p>
              <p className="mono text-[#333333] text-sm">
                [ Pokedex Entry #025 ]
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
