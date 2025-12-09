import Marquee from "react-fast-marquee";
import HomeGridBackground from '../components/HomeGridBackground'

export default function Home() {
  const name = "/sangam".split("");
  const tagline = "Currently looking for work <3.".split("");
  return (
    <>
      <div className = 'relative h-screen w-full overflow-hidden'>
        <div className='absolute inset-0 -z-10'>
          <HomeGridBackground delay={1400}/>
        </div>

        <div className='absolute inset-0 flex flex-col justify-center items-center z-10 px-4'>
          <h1 className="text-[#C0C0C0] tracking-tight text-center leading-tight mb-1 flex overflow-hidden">
            {name.map((char, index) => (
              <span
                key={index}
                className="inline-block opacity-0 animate-letter-up"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {char}
              </span>
            ))}
          </h1>

          <div 
            className='w-64 md:w-72 h-8 md:h-10 bg-none border border-white/20 rounded-3xl overflow-hidden mb-4 opacity-0 animate-fade-in'
            style={{ animationDelay: '600ms' }}
          >
            <Marquee pauseOnHover={true} speed={50} className="h-full flex items-center">
              <div className="mono text-[#888888] tracking-wider text-xs md:text-sm mr-10">
                Developer ✦ Designer ✦ Cultured
              </div>
            </Marquee>
          </div>
          <p className="mono text-[#888888] tracking-wider text-xs md:text-base flex overflow-hidden text-center">
            {tagline.map((char, index) => (
              <span
                key={index}
                className="inline-block opacity-0 animate-letter-up"
                style={{ animationDelay: `${900 + index * 30}ms` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </p>
        </div>
      </div>
    </>
  )
}