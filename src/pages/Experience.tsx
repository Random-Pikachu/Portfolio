import RegularGridBackground from "../components/RegularGridBackground";
export default function Experience() {
  const experiences = [
    {
      period: "Jul 2025 — Sep 2025",
      company: "OpenSphere",
      role: "Software Development Intern",
      description:
        "Focused on enhancing platform collaboration by building a real-time commenting system that allows users to discuss and resolve feedback directly inside the text editor, eliminating the need for external text editor. I also redesigned the drafting workflow to remove redundant manual steps and developed a comprehensive activity dashboard to improve operational visibility for admins.",
      stack: ["TypeScript", "AWS SES", "MongoDB", "Node.js", "Websockets", "React.js"],
      url: "https://opensphere.ai/"
    },
    {
      period: "Nov 2024 - Feb 2025",
      company: "Divyajeevan NGO",
      role: "Graphic Designer",
      description:
      "Designed the organization's 2024 Annual Magazine, crafting the full layout & visual storytelling. Additionally, conceptualized and delivered three strategic project pitch decks to aid in fundraising.",
    
      stack: ["Adobe Photoshop",  "PowerPoint", "Canva"],
      url: ""
    },
  ];

  return (
    <>
      <section className="relative py-20 md:py-32 min-h-screen pt-32">
      <div className='absolute inset-0 -z-10'>
          <RegularGridBackground/>
        </div>
        <div
          className="relative mx-auto w-full md:w-[70%]"
        >
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

                <p className="mono text-[#888888] mb-2 text-sm">
                  {exp.period}
                </p>

                <h3 className="text-[#E0E0E0] mb-1">
                  {exp.role}
                </h3>
                {exp.url ?  
                  <a className="text-[#888888] mb-4 block hover:text-[#F7D02C] transition-colors" href={exp.url} target="_blank">
                  {exp.company}
                </a>: <a className="text-[#888888] mb-4 block hover:text-[#F7D02C] transition-colors" >
                  {exp.company}
                </a>
                }
                

                <p className="text-[#888888] mb-6 leading-relaxed">
                  {exp.description}
                </p>
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
    </>
  );
}