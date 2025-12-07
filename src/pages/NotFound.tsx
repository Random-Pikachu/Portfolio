import { Link } from 'react-router-dom';
import RegularGridBackground from '../components/RegularGridBackground';

export default function NotFound() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#080808] flex flex-col items-center justify-center">
        <div className='absolute inset-0 opacity-40'>
          <RegularGridBackground />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 max-w-xl px-6 w-full">
           
            <div className="w-full bg-[#080808] border-2 border-white rounded-md p-1 shadow-[0_0_0_4px_#080808,0_0_0_6px_#ffffff]">
                <div className="bg-[#080808] p-6 relative min-h-[140px] flex flex-col justify-between">
                    
                    <p className="mono text-[#e0e0e0] text-lg md:text-xl leading-relaxed tracking-wide font-medium">
                        <span className="text-[#3b82f6] font-bold">GUARD:</span> Halt! <br/>
                        You can't pass here, kiddo! <br/>
                        I don't see <span className="text-[#F7D02C]">8 BADGES</span> on you.
                    </p>

                    <div className="self-end w-0 h-0 border-l-[8px] border-l-transparent border-t-[12px] border-t-[#F7D02C] border-r-[8px] border-r-transparent animate-bounce mt-2"></div>
                </div>
            </div>

            <Link 
                to="/"
                className="mono text-sm text-[#888888] hover:text-[#f7d02c] transition-colors duration-300 flex items-center gap-2 group mt-4"
            >
                <span className="opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">▶</span>
                [ return_to_pallet_town ]
            </Link>

        </div>
    </div>
  )
}