import Marquee from "react-fast-marquee";
import HomeGridBackground from '../components/HomeGridBackground'
import RegularGridBackground from "../components/RegularGridBackground";
import ProjectCard from "../components/ProjectCard";

export default function Home() {
  const name = "/sangam".split("");
  const tagline = "Currently looking for work <3.".split("");

  const projects = [
    {
      index: "01",
      title: "Astra",
      description:
        "A desktop tool that scans your code for security risks. It checks your project dependencies against vulnerability databases and uses AI to automatically suggest fixes, saving you from manual patching.",
      techStack: [
        "Electron.js",
        "React.js",
        "Node.js",
        "MongoDB",
        "Gemini CLI",
        "Tree-Sitter"
      ],
      githubUrl: "https://github.com/Random-Pikachu/Astra",
      liveUrl: "",
      img_url: "/assets/astra_.png",
      youtubeUrl: "https://youtu.be/XFiMSWMZ4KU"
    },
    {
      index: "02",
      title: "SecurePDF",
      description:
        "An offline desktop tool that locks PDFs to a specific computer so they can't be shared. It uses hardware binding and time limits to control access, while completely disabling printing and copying to prevent leaks.",
      techStack: [
        "Python",
        "CustomTkinter",
        "Cryptography (Fernet)",
        "PyMuPDF",
      ],
      githubUrl: "https://github.com/Random-Pikachu/SecurePDF",
      liveUrl: "https://secure-pdf-five.vercel.app/",
      img_url: "/assets/securePDF_.png",
      youtubeUrl: ""
    },
    {
      index: "03",
      title: "Code-Sync",
      description:
        "A collaborative code editor that works like Google Docs for developers. It lets you write code with friends in real-time, see their cursor position in editor, and run code instantly in over 20 languages.",
      techStack: [
        "React.js",
        "Socket.io",
        "MongoDB",
        "Tailwind",
        "Node.js",
      ],
      githubUrl: "https://github.com/Random-Pikachu/Code-Sync",
      liveUrl: "https://codesync-v8bl.onrender.com/",
      img_url: "/assets/codeSync.png",
      youtubeUrl: ""
    },
    {
      index: "04",
      title: "Sorting Visualizer",
      description:
        "A interactive tool that visually demonstrates how sorting algorithms work. Users can generate arrays, and watch algorithms like Merge Sort or Quick Sort — helping beginners intuitively understand time complexity and algorithmic behavior.",
      techStack: [
        "React.js",
      ],
      githubUrl: "https://github.com/Random-Pikachu/Sorting-Visualizer-v2",
      liveUrl: "https://random-pikachu.github.io/Sorting-Visualizer-v2/",
      img_url: "/assets/sortingVisualizer.png",
      youtubeUrl: ""
    },
  ];

  const experiences = [
    {
      period: "Dec 2025 — Present",
      company: "KDE Linux",
      role: "Opensource Contributor",
      description: [
        <><a href="https://invent.kde.org/plasma/plasma-workspace/-/merge_requests/6103" target="_blank" className="text-[#F7D02C]/80 hover:underline"><strong>Improved Accessibility (MR 6103):</strong></a> Added "Enter" key support for calendar header elements in the KDE Plasma Digital Clock, aligning it with standard keyboard navigation patterns.</>,
        <><a href="https://invent.kde.org/plasma/plasma-workspace/-/merge_requests/6208" target="_blank" className="text-[#F7D02C]/80 hover:underline"><strong>Persist Wallpaper Path (MR 6208):</strong></a> Used KConfig to persist directory selection in the Plasma Wallpaper Picker across sessions, handling edge cases like unmounted drives and deleted or moved folders.</>,
        <><a href="https://invent.kde.org/plasma/plasma-workspace/-/merge_requests/6280" target="_blank" className="text-[#F7D02C]/80 hover:underline"><strong>Caching Wallpapers (MR 6280):</strong></a> Added local caching to the Plasma Wallpaper Gallery with SHA-256 content hashing for deduplication, keeping wallpapers intact even if source files are moved or deleted.</>,
        <><a href="https://invent.kde.org/office/marknote/-/merge_requests/172" target="_blank" className="text-[#F7D02C]/80 hover:underline"><strong>Fix Todo List Checkbox State (MR 172):</strong></a> Fixed a bug in KDE Marknote where pressing Enter at the start or end of a checked todo item caused the newly created item to inherit the checked state, ensuring new list items always initialize as unchecked.</>,
      ],
      stack: ["C++", "Qt/Qml"],
      url: "https://kde.org/",
      badge: "[ ✦ OSS ]"
    },
    {
      period: "Jul 2025 — Sep 2025",
      company: "OpenSphere",
      role: "Software Development Intern",
      description: [
        "Built a real-time commenting system integrated with the in-house text editor.",
        "Reworked the drafting workflow reducing manual intervention and improving operational efficiency across the platform.",
        "Streamlined task creation pipelines to accelerate client onboarding and cut down task configuration time.",
        "Added support for self-petitioning visa workflows.",
        "Built a user activity tracking dashboard with detailed action logs across the platform.",
      ],
      stack: ["TypeScript", "AWS SES", "MongoDB", "Node.js", "Websockets", "React.js"],
      url: "https://opensphere.ai/",
      badge: "[ ✦ Work ]"
    },
    {
      period: "Nov 2024 - Feb 2025",
      company: "Divyajeevan NGO",
      role: "Graphic Designer",
      description: [
        "Designed the organization's 2024 Annual Magazine.",
        "Conceptualized and delivered three strategic project pitch decks to aid in fundraising.",
      ],
      stack: ["Adobe Photoshop", "PowerPoint"],
      url: "",
      badge: "[ ✦ Design ]"
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section id="hero" className='relative h-screen w-full overflow-hidden'>
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
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative py-20 md:py-32 min-h-screen pt-32">
        <div className='absolute inset-0 -z-10'>
          <RegularGridBackground/>
        </div>
        <div className="relative mx-auto w-full md:w-[70%]">
          {/* borders */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-[#222222] hidden md:block" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-[#222222] hidden md:block" />

          <div className="mb-2 px-6 md:px-16">
            <h2 className="text-[#E0E0E0] mb-4">Projects</h2>
          </div>

          <div className="px-6 md:px-16 space-y-16">
            {
              projects.map((project, index) => (
                <ProjectCard 
                  key = {project.index}
                  index = {project.index}
                  title = {project.title}
                  description = {project.description}
                  techStack = {project.techStack}
                  imageLeft = {index%2 === 0 }
                  githubUrl = {project.githubUrl}
                  liveUrl = {project.liveUrl}
                  img_url = {project.img_url}
                  youtubeUrl = {project.youtubeUrl}
                />
              ))
            }
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="relative py-20 md:py-32 min-h-screen pt-32">
        <div className='absolute inset-0 -z-10'>
          <RegularGridBackground />
        </div>
        <div className="relative mx-auto w-full md:w-[70%]">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-[#222222] hidden md:block" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-[#222222] hidden md:block" />
          <div className="mb-12 md:mb-20 px-6 md:px-16">
            <h2 className="text-[#E0E0E0] mb-4">Experience</h2>
          </div>
          <div className="space-y-16 px-6 md:px-16">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="relative border-l border-[#222222] pl-6 md:pl-8 pb-16"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute left-0 top-0 w-2 h-2 -translate-x-[4.5px] bg-[#F7D02C] rounded-full" />

                <div className="flex items-center gap-3 mb-2">
                  <p className="mono text-[#888888] text-sm">
                    {exp.period}
                  </p>
                  {exp.badge && (
                    <span className="mono text-[#F7D02C] text-xs">
                      {exp.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-[#E0E0E0] mb-1">
                  {exp.role}
                </h3>
                {exp.url ?
                  <a className="text-[#888888] mb-4 block hover:text-[#F7D02C] transition-colors" href={exp.url} target="_blank" rel="noopener noreferrer">
                    {exp.company}
                  </a> : <p className="text-[#888888] mb-4 block">
                    {exp.company}
                  </p>
                }

                {Array.isArray(exp.description) ? (
                  <ul className="text-[#888888] mb-6 leading-relaxed list-disc pl-5 space-y-2">
                    {exp.description.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#888888] mb-6 leading-relaxed">
                    {exp.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-3">
                  {exp.stack.map((tech) => (
                    <span
                      key={tech}
                      className="mono px-3 py-1 bg-[#0A0A0A] border border-[#222222] text-[#888888] text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-20 md:py-32 min-h-screen pt-32">
        <div className='absolute inset-0 -z-10'>
          <RegularGridBackground />
        </div>
        <div className="relative mx-auto w-full md:w-[70%]">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-[#222222] hidden md:block" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-[#222222] hidden md:block" />
          
          <div className="mb-12 md:mb-20 px-6 md:px-16">
            <h2 className="text-[#E0E0E0] mb-4">About</h2>
          </div>

          <div className="px-6 md:px-16 space-y-8">
            <div className="space-y-6">
              <p className="text-[#888888] leading-relaxed text-base">
                I&apos;m Sangam, an IT student at IIIT Gwalior with a passion for building products that matter. I like to write code that solves real problems—whether that&apos;s security vulnerabilities in your dependencies, collaborative coding experiences, or tools that help engineers track their work.
              </p>

              <p className="text-[#888888] leading-relaxed text-base">
                Currently, I&apos;m working on <strong>devtrackr</strong>, an activity aggregator for software engineers. It tracks your progress across LeetCode, Codeforces, and GitHub, then sends you a nightly email digest showing exactly how much work you did that day. It&apos;s built for engineers who want real visibility into their growth without the noise.
              </p>

              <p className="text-[#888888] leading-relaxed text-base">
                Beyond code, I contribute to open source (especially KDE), design when the mood strikes, and I&apos;m an anime fan. I believe good design and clean code aren&apos;t luxuries—they&apos;re essentials. When I&apos;m not building or learning, you&apos;ll probably find me watching anime or experimenting with new ideas.
              </p>

              <p className="text-[#888888] leading-relaxed text-base">
                I&apos;m always open to interesting projects and conversations. If you want to talk about tech, design, anime, or just collaborate on something cool—let&apos;s connect.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
