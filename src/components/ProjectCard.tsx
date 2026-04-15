import { ExternalLink, Github } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ProjectCardProps {
  index: string;
  title: string;
  description: string;
  techStack: string[];
  imageLeft: boolean;
  githubUrl: string;
  liveUrl: string;
  img_url: string;
  youtubeUrl: string;
}

const ProjectCard = ({
  index,
  title,
  description,
  techStack,
  imageLeft,
  githubUrl,
  liveUrl,
  img_url,
  youtubeUrl
}: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    // Fade in card
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    // Image parallax effect
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        y: (i) => {
          return ScrollTrigger.getScrollY() * 0.3;
        },
        ease: 'none',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
          markers: false,
        },
      });
    }

    // Text reveal animations
    if (contentRef.current) {
      const titleEl = contentRef.current.querySelector('[data-reveal="title"]');
      const descEl = contentRef.current.querySelector('[data-reveal="description"]');
      const tagsEl = contentRef.current.querySelectorAll('[data-reveal="tag"]');
      const buttonsEl = contentRef.current.querySelector('[data-reveal="buttons"]');

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      if (titleEl) {
        timeline.fromTo(
          titleEl,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
          0
        );
      }

      if (descEl) {
        timeline.fromTo(
          descEl,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          0.1
        );
      }

      if (tagsEl.length) {
        timeline.fromTo(
          tagsEl,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'back.out' },
          0.2
        );
      }

      if (buttonsEl) {
        timeline.fromTo(
          buttonsEl,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          0.3
        );
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={cardRef} className="relative py-12 md:py-24 opacity-0">
      <div className="absolute top-[-2rem] md:top-0 left-0 right-0 flex justify-center pointer-events-none">
        <span className="mono text-[6rem] md:text-[10rem] text-[#111111] select-none">
          {index}
        </span>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        {/* Image Section */}
        <div className={`order-1 ${imageLeft ? 'md:order-1' : 'md:order-2'}`}>
          <div
            ref={imageRef}
            className="aspect-[4/3] bg-[#0A0A0A] border border-[#222222] rounded-sm overflow-hidden hover:border-[#333333] transition-colors duration-300"
          >
            <img src={img_url} className="w-full h-full object-cover" alt={title} />
          </div>
        </div>

        {/* Content Section */}
        <div ref={contentRef} className={`order-2 ${imageLeft ? 'md:order-2' : 'md:order-1'}`}>
          <h3 className="text-[#E0E0E0] mb-4" data-reveal="title">
            {title}
          </h3>
          <p className="text-[#888888] mb-6 leading-relaxed" data-reveal="description">
            {description}
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="mono px-3 py-1.5 bg-[#0A0A0A] border border-[#222222] text-[#888888] text-sm hover:border-[#444444] hover:text-[#E0E0E0] transition-all duration-300"
                data-reveal="tag"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4" data-reveal="buttons">
            <a
              className="mono px-4 py-2 border border-[#333333] text-[#888888] text-sm hover:border-[#F7D02C] hover:text-[#F7D02C] transition-all duration-300 flex items-center gap-2"
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-4 h-4" />
              [ GitHub ]
            </a>

            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mono px-4 py-2 border border-[#333333] text-[#888888] text-sm hover:border-[#F7D02C] hover:text-[#F7D02C] transition-all duration-300 flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                [ Live Demo ]
              </a>
            )}

            {youtubeUrl && (
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mono px-4 py-2 border border-[#333333] text-[#888888] text-sm hover:border-[#F7D02C] hover:text-[#F7D02C] transition-all duration-300 flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                [ Video Demo ]
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
