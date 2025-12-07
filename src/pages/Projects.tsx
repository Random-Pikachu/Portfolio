import ProjectCard from "../components/ProjectCard";
import RegularGridBackground from "../components/RegularGridBackground";
export default function Projects() {
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
      img_url: "/assets/astra_.png"
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
      img_url: "/assets/securePDF_.png"
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
      img_url: "/assets/codeSync.png"
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
      img_url: "/assets/sortingVisualizer.png"
    },
  ];

  return (
    <>
      <section className="relative py-32 min-h-screen pt-32">
        <div className='absolute inset-0 -z-10'>
          <RegularGridBackground/>
        </div>
        <div className="relative mx-auto" style={{width:"70%"}}>
          {/* borders */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-[#222222]" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-[#222222]" />

          <div className="mb-2 px-16">
          <h2 className="text-[#E0E0E0] mb-4">Projects</h2>

          </div>

          <div className="px-16 space-y-16">
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
                />
              ))
            }
          </div>
        </div>
      </section>
    </>
  )
}