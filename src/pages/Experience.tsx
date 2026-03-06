import RegularGridBackground from "../components/RegularGridBackground";
export default function Experience() {
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
      url: "https://kde.org/"
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
      url: "https://opensphere.ai/"
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
      url: ""
    },
  ];

  return (
    <>
      <section className="relative py-20 md:py-32 min-h-screen pt-32">
        <div className='absolute inset-0 -z-10'>
          <RegularGridBackground />
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
                  </a> : <a className="text-[#888888] mb-4 block hover:text-[#F7D02C] transition-colors" >
                    {exp.company}
                  </a>
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
    </>
  );
}