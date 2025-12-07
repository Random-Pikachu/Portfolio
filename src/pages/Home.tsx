import Marquee from "react-fast-marquee";
import HomeGridBackground from '../components/HomeGridBackground'
import Footer from "../components/Footer";
export default function Home() {
  return (
    <>
      <div className = 'relative h-screen w-screen overflow-hidden'>
        <div className='absolute inset-0 -z-10'>
          <HomeGridBackground/>
        </div>

        <div className='absolute inset-0 flex flex-col justify-center items-center z-10'>
          <h1 className="text-[#C0C0C0] tracking-tight text-center leading-tight mb-1">
            Sangam
          </h1>

          <div className='w-70 h-10 bg-none border border-white/20 rounded-3xl overflow-hidden mb-4'>
          <Marquee pauseOnHover={true} speed={50} className="h-full flex items-center">
            <div className="mono text-[#888888] tracking-wider text-sm mr-2">
              Developer ✦ Designer ✦ Cultured
            </div>
          </Marquee>
          </div>
          <p className="mono text-[#888888] tracking-wider">Currently looking for work &lt;3. </p>
        </div>
      </div>
    </>
  )
}