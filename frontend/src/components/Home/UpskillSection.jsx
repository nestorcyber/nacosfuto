import React from "react";
import ScrollToTopLink from "../ScrollToTopLink";

// UPSKILL course data (shared with overlays/nav)
const UPSKILL_COURSES = [
  {
    name: "Web Development",
    slug: "web-development",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
    description: "Learn to build modern, responsive websites and web apps.",
  },
  {
    name: "AI & Automation",
    slug: "ai-automation",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    description: "Explore artificial intelligence and automation tools.",
  },
  {
    name: "Vibe Coding",
    slug: "vibe-coding",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
    description: "Sharpen your coding skills with fun, practical challenges.",
  },
  {
    name: "Social Media",
    slug: "social-media",
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
    description: "Master social media for personal and professional growth.",
  },
  {
    name: "View all courses",
    slug: "all",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    description: "Browse our full catalog of upskilling courses.",
  },
];

const UpskillSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 text-center">
          <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            UPSKILL
          </span>{" "}
          with Practical Courses
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 text-center max-w-2xl mx-auto">
          Level up your skills with hands-on, industry-relevant courses. Start
          learning today!
        </p>
        <div className="grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {UPSKILL_COURSES.map((course, idx) => (
            <ScrollToTopLink
              key={course.slug}
              to={`/upskill/${course.slug}`}
              className="group block rounded-2xl bg-gray-50 dark:bg-gray-900 overflow-hidden border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              {/* Image Container with Hover Zoom & Badge */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 right-3 bg-green-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                  Skill Track
                </div>
              </div>

              {/* Card Body - Content Flow */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 line-clamp-2">
                    {course.description}
                  </p>
                </div>

                {/* Button CTA */}
                <div className="mt-4 w-full py-2.5 bg-green-600 group-hover:bg-green-700 text-white text-center font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow hover:shadow-green-500/20">
                  Explore Course
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
