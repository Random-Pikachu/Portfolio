import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const ringRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName === 'A' ||
        target.tagName === 'BUTTON'
      );
    };

    window.addEventListener('mousemove', handleMouseMove);

    let rafId: number;
    
    const animateRing = () => {
      if (ringRef.current) {
        const delay = 0.15; 
        
        ringPos.current.x += (mousePos.x - ringPos.current.x) * delay;
        ringPos.current.y += (mousePos.y - ringPos.current.y) * delay;

        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }
      rafId = requestAnimationFrame(animateRing);
    };

    rafId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [mousePos.x, mousePos.y]); 

  return (
    <>
      <div 
        className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[100] mix-blend-difference"
        style={{ 
          transform: `translate(${mousePos.x - 6}px, ${mousePos.y - 6}px)` 
        }}
      />

      <div 
        ref={ringRef}
        className={`fixed top-0 left-0 border border-white rounded-full pointer-events-none z-[100] mix-blend-difference transition-[width,height] duration-300 ease-out
          ${isPointer ? 'w-10 h-10 -ml-5 -mt-5 bg-white/10' : 'w-8 h-8 -ml-4 -mt-4'}
        `}
      />
    </>
  );
}