import React from "react";
import ScrollToTopLink from "../ScrollToTopLink";

// UPSKILL course data
const UPSKILL_COURSES = [
  {
    name: "Web Development",
    slug: "web-development",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
    description: "Learn to build modern, responsive web applications and full-stack platforms.",
  },
  {
    name: "AI & Automation",
    slug: "ai-automation",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    description: "Explore generative AI, LLM prompting, and intelligent workflow automation.",
  },
  {
    name: "Vibe Coding",
    slug: "vibe-coding",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
    description: "Master rapid AI-assisted development and full-stack software prototyping.",
  },
  {
    name: "Social Media & Tech Branding",
    slug: "social-media",
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
    description: "Master personal branding, audience engagement, and tech thought leadership.",
  },
  {
    name: "View all courses",
    slug: "all",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    description: "Browse our complete catalog of student upskilling tracks and masterclasses.",
  },
];

const UpskillSection = () => {
  return (
    <section className="py-24 bg-[#f4faf3] dark:bg-[#041801] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#083002] border border-[#138601]/30 text-[#138601] dark:text-[#4bd043] text-xs font-extrabold uppercase tracking-widest mb-4 shadow-sm">
            ACADEMY & BOOTCAMPS
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#083002] dark:text-white tracking-tight mb-4">
            <span className="bg-gradient-to-r from-[#138601] to-[#3db92c] bg-clip-text text-transparent">
              UPSKILL
            </span>{" "}
            with Practical Courses
          </h2>
          <p className="text-base sm:text-lg text-[#083002]/70 dark:text-green-100/70 leading-relaxed">
            Level up your skills with hands-on, industry-relevant courses designed to prepare you for global tech careers.
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {UPSKILL_COURSES.map((course) => (
            <ScrollToTopLink
              key={course.slug}
              to={`/upskill/${course.slug}`}
              className="group rounded-3xl bg-white dark:bg-[#083002] overflow-hidden border border-[#138601]/20 dark:border-[#138601]/30 shadow-md hover:shadow-2xl hover:border-[#138601] dark:hover:border-[#4bd043] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden bg-[#083002]">
                <img
                  src={course.image}
                  alt={course.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 right-3 bg-[#138601]/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                  Skill Track
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#083002] dark:text-white mb-2 group-hover:text-[#138601] dark:group-hover:text-[#4bd043] transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-sm text-[#083002]/75 dark:text-green-100/75 leading-relaxed mb-4 line-clamp-2">
                    {course.description}
                  </p>
                </div>

                <div className="mt-4 w-full py-2.5 bg-[#138601] group-hover:bg-[#0f6c01] text-white text-center font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md shadow-[#138601]/25">
                  Explore Track &rarr;
                </div>
              </div>
            </ScrollToTopLink>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpskillSection;
