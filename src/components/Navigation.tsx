import { Link, useLocation } from 'react-router-dom'

export default function Navigation() {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;
    return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/80 backdrop-blur-md border-b border-[#222222] text-[12px]">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-center items-center">
        
        {/* Center - Navigation */}
        <div className="flex gap-8">
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
        </div>
        
        
      </div>
    </nav>
    )
}