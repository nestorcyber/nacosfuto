import React, { useState } from 'react';
import Navbar from '../components/Nav/Navbar';
import Footer from '../components/Footer';
import { FiBook, FiFileText, FiVideo, FiExternalLink, FiSearch, FiRefreshCw } from 'react-icons/fi';

const Resources = () => {
  const [activeFilter, setActiveFilter] = useState('All Resources');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [selectedSemester, setSelectedSemester] = useState('All Semesters');
  const [searchQuery, setSearchQuery] = useState('');

  const resourcesData = [
    { 
      id: 1, 
      title: 'Introduction to Problem Solving & C Programming', 
      code: 'CSC 101', 
      level: '100 Level', 
      semester: 'First Semester', 
      type: 'Handout', 
      author: 'Dr. C. C. Nwokorie',
      description: 'Foundational programming concepts, flowcharting, pseudocode, and C syntax.'
    },
    { 
      id: 2, 
      title: 'Introduction to Computer Science & Computing Systems', 
      code: 'CSC 102', 
      level: '100 Level', 
      semester: 'Second Semester', 
      type: 'Book', 
      author: 'Prof. G. A. Chukwudebe',
      description: 'Evolution of computing systems, computer hardware, operating software, and internet basics.'
    },
    { 
      id: 3, 
      title: 'Data Structures and Algorithms in Python', 
      code: 'CSC 201', 
      level: '200 Level', 
      semester: 'First Semester', 
      type: 'Book', 
      author: 'Prof. J. E. Stanley',
      description: 'Arrays, linked lists, stacks, queues, trees, graphs, sorting, and asymptotic Big-O analysis.'
    },
    { 
      id: 4, 
      title: 'Object-Oriented Programming with C++ & Java', 
      code: 'CSC 202', 
      level: '200 Level', 
      semester: 'Second Semester', 
      type: 'Handout', 
      author: 'Dr. O. C. Aguboshim',
      description: 'Classes, inheritance, polymorphism, encapsulation, interfaces, and exception handling.'
    },
    { 
      id: 5, 
      title: 'Object-Oriented Programming Video Series', 
      code: 'CSC 203', 
      level: '200 Level', 
      semester: 'First Semester', 
      type: 'Video', 
      author: 'Prof. F. E. Onuodu',
      description: 'Comprehensive video walk-through of design patterns and object modeling.'
    },
    { 
      id: 6, 
      title: 'Operating Systems Principles & Concurrency', 
      code: 'CSC 301', 
      level: '300 Level', 
      semester: 'First Semester', 
      type: 'Handout', 
      author: 'Dr. M. I. Ezeh',
      description: 'Process management, synchronization, CPU scheduling algorithms, memory management, and file systems.'
    },
    { 
      id: 7, 
      title: 'Database Management Systems & SQL Fundamentals', 
      code: 'CSC 302', 
      level: '300 Level', 
      semester: 'Second Semester', 
      type: 'Book', 
      author: 'Dr. (Mrs) C. U. Osuagwu',
      description: 'Relational algebra, normal forms (1NF - BCNF), ER modeling, SQL queries, and transaction management.'
    },
    { 
      id: 8, 
      title: 'Web Application Development with Modern Stacks', 
      code: 'CSC 405', 
      level: '400 Level', 
      semester: 'First Semester', 
      type: 'Video', 
      author: 'Tech Director (NACOS)',
      description: 'Full-stack application architecture, RESTful API design, React, Node.js, and Supabase integration.'
    },
    { 
      id: 9, 
      title: 'Software Engineering Methodologies & Agile Practices', 
      code: 'CSC 401', 
      level: '400 Level', 
      semester: 'First Semester', 
      type: 'Handout', 
      author: 'Engr. Dr. K. C. Nwachukwu',
      description: 'SDLC, Agile Scrum sprint planning, UML diagrams, testing strategies, and CI/CD pipelines.'
    },
    { 
      id: 10, 
      title: 'Artificial Intelligence & Neural Architectures', 
      code: 'CSC 501', 
      level: '500 Level', 
      semester: 'First Semester', 
      type: 'Book', 
      author: 'Dr. (Mrs) N. C. Daniel',
      description: 'Heuristic search, expert systems, artificial neural networks, deep learning architectures, and LLMs.'
    },
    { 
      id: 11, 
      title: 'Computer Networks, Cryptography & Cybersecurity', 
      code: 'CSC 503', 
      level: '500 Level', 
      semester: 'First Semester', 
      type: 'Handout', 
      author: 'Prof. H. C. Inyiama',
      description: 'TCP/IP stack, network security protocols, public-key encryption, firewalls, and penetration testing.'
    },
    { 
      id: 12, 
      title: 'Cloud Computing & Distributed Systems Masterclass', 
      code: 'CSC 505', 
      level: '500 Level', 
      semester: 'Second Semester', 
      type: 'Video', 
      author: 'NACOS Alumni Guest Lecturer',
      description: 'Distributed consensus algorithms, microservices, containerization with Docker & Kubernetes, AWS & GCP.'
    }
  ];

  // Multi-facet filtering logic
  const filteredResources = resourcesData.filter((resource) => {
    // 1. Type filter
    const matchesType = activeFilter === 'All Resources' || 
      `${resource.type}s` === activeFilter || 
      resource.type === activeFilter;

    // 2. Level filter
    const matchesLevel = selectedLevel === 'All Levels' || resource.level === selectedLevel;

    // 3. Semester filter
    const matchesSemester = selectedSemester === 'All Semesters' || resource.semester === selectedSemester;

    // 4. Search query
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      resource.code.toLowerCase().includes(query) ||
      resource.title.toLowerCase().includes(query) ||
      resource.author.toLowerCase().includes(query);

    return matchesType && matchesLevel && matchesSemester && matchesSearch;
  });

  const handleResetFilters = () => {
    setActiveFilter('All Resources');
    setSelectedLevel('All Levels');
    setSelectedSemester('All Semesters');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedLevel !== 'All Levels' || selectedSemester !== 'All Semesters' || searchQuery.trim() !== '' || activeFilter !== 'All Resources';

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#041801] text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-grow site-container w-full py-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-[#138601]/20 dark:border-[#138601]/30">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#083002] dark:text-white">
              Academic Resources & Study Hub
            </h1>
            <p className="text-sm text-[#083002]/70 dark:text-green-100/70 mt-1">
              Curated department handouts, lecture notes, textbook references, and tutorial archives.
            </p>
          </div>
        </div>

        {/* Dedicated Filter Bar (All Levels, All Semesters, Search Input) */}
        <div className="bg-white dark:bg-[#083002] rounded-xl border border-gray-200 dark:border-[#138601]/30 p-3 sm:p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Level Selector */}
            <div className="md:w-48 flex-shrink-0">
              <select
                id="resource-level-filter"
                aria-label="Filter by academic level"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#041801] text-sm text-gray-700 dark:text-gray-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#138601]/40 transition-colors cursor-pointer"
              >
                <option value="All Levels">All Levels</option>
                <option value="100 Level">100 Level</option>
                <option value="200 Level">200 Level</option>
                <option value="300 Level">300 Level</option>
                <option value="400 Level">400 Level</option>
                <option value="500 Level">500 Level</option>
              </select>
            </div>

            {/* Semester Selector */}
            <div className="md:w-48 flex-shrink-0">
              <select
                id="resource-semester-filter"
                aria-label="Filter by semester"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#041801] text-sm text-gray-700 dark:text-gray-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#138601]/40 transition-colors cursor-pointer"
              >
                <option value="All Semesters">All Semesters</option>
                <option value="First Semester">First Semester</option>
                <option value="Second Semester">Second Semester</option>
              </select>
            </div>

            {/* Search by Course Code or Title */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                id="resource-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Course Code or Title"
                className="w-full pl-10 pr-9 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#041801] text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#138601]/40 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-bold p-1"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Resource Type Category Pills & Reset Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="flex flex-wrap gap-2.5">
            {['All Resources', 'Books', 'Handouts', 'Videos'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg font-semibold text-xs transition-colors cursor-pointer border ${
                  activeFilter === filter
                    ? 'bg-[#138601] text-white border-[#138601] shadow-sm'
                    : 'bg-[#f2fbf1] dark:bg-[#083002] text-[#083002] dark:text-green-100 border-[#138601]/20 dark:border-[#138601]/30 hover:bg-[#e2f7df]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-[#138601] dark:text-[#4bd043] font-medium hover:underline cursor-pointer"
            >
              <FiRefreshCw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-[#f8fdf7] dark:bg-[#083002] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-[#138601]/20 dark:border-[#138601]/30 flex flex-col justify-between"
              >
                <div className="h-40 bg-[#083002] flex items-center justify-center text-white border-b border-[#138601]/20 relative">
                  {resource.type === 'Book' && <FiBook className="text-4xl text-[#4bd043]" />}
                  {resource.type === 'Handout' && <FiFileText className="text-4xl text-[#4bd043]" />}
                  {resource.type === 'Video' && <FiVideo className="text-4xl text-[#4bd043]" />}

                  {/* Level & Semester Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold bg-black/60 backdrop-blur-sm text-green-300 px-2 py-0.5 rounded">
                      {resource.level}
                    </span>
                    <span className="text-[11px] font-medium bg-black/60 backdrop-blur-sm text-gray-200 px-2 py-0.5 rounded">
                      {resource.semester === 'First Semester' ? '1st Sem' : '2nd Sem'}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-xs font-bold text-[#138601] dark:text-[#4bd043] bg-white dark:bg-[#041801] px-2.5 py-0.5 rounded border border-[#138601]/20">
                        {resource.code}
                      </span>
                      <span className="text-xs text-[#083002]/70 dark:text-green-200/70 font-medium">
                        {resource.type}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#083002] dark:text-white leading-snug">
                      {resource.title}
                    </h3>
                    <p className="text-xs text-[#083002]/70 dark:text-green-100/70 mt-1.5">
                      Instructor: {resource.author}
                    </p>
                    {resource.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                        {resource.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#138601]/15 dark:border-white/10">
                    <a
                      href={import.meta.env.VITE_PORTAL_URL ? `${import.meta.env.VITE_PORTAL_URL}/courses` : (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? "http://localhost:5174/courses" : "/portal/courses")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-7 py-2.5 bg-[#138601] hover:bg-[#0f6c01] text-white font-semibold rounded-lg text-sm transition-colors shadow-sm min-h-[42px]"
                    >
                      <span>Access on Portal</span>
                      <FiExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-[#f8fdf7] dark:bg-[#083002] rounded-xl border border-dashed border-[#138601]/30">
            <FiSearch className="mx-auto text-4xl text-gray-400 dark:text-gray-500 mb-3" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">No resources found</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-md mx-auto">
              We couldn't find any resources matching your search and filter criteria. Try adjusting your level, semester, or search keywords.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-5 px-5 py-2.5 bg-[#138601] hover:bg-[#0f6c01] text-white font-semibold rounded-lg text-sm transition-colors shadow-sm cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Resources;
