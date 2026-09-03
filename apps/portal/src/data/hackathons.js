export const HACKATHONS = [
  {
    id: "BuildXNACOS",
    slug: "BuildXNACOS",
    title: "BUILDX NACOS",
    subtitle: "Turn an idea into working national impact.",
    badge: "NACOS National Hackathon",
    tagline: "Unleash Innovation. Build Next-Gen Technology for Nigeria & Beyond.",
    mode: "Virtual",
    status: "Active", // "Active", "Upcoming", "Completed"
    organizer: "NACOS National",
    coOrganizers: ["FUTO Chapter", "National Innovation Directorate"],
    startDate: "2026-09-08T09:00:00Z",
    endDate: "2026-09-28T23:59:59Z",
    applicationDeadline: "2026-09-20T23:59:59Z",
    stats: {
      eventDate: "Sep 8, 2026",
      location: "Virtual (Online)",
      prizePool: "₦1,000,000",
      applyBefore: "Sep 20, 2026",
      registeredStudents: 420,
      activeTeams: 38,
      submissionsCount: 14
    },
    prizes: [
      {
        rank: "1st Place",
        title: "Grand Champion",
        amount: "₦500,000",
        perks: ["Cloud Credits ($2,000)", "Direct Incubation Mentorship", "National Recognition Trophy", "Fast-track Internship Interviews"],
        badgeColor: "from-amber-400 to-amber-600",
        textColor: "text-amber-500",
        border: "border-amber-400/30"
      },
      {
        rank: "2nd Place",
        title: "First Runner-up",
        amount: "₦300,000",
        perks: ["Cloud Credits ($1,000)", "Mentorship Access", "Silver Plaque", "Resume Spotlight with Hiring Partners"],
        badgeColor: "from-slate-300 to-slate-500",
        textColor: "text-slate-400",
        border: "border-slate-400/30"
      },
      {
        rank: "3rd Place",
        title: "Second Runner-up",
        amount: "₦200,000",
        perks: ["Cloud Credits ($500)", "Bronze Plaque", "NACOS Swag Bag", "Certificate of Technical Excellence"],
        badgeColor: "from-amber-600 to-amber-800",
        textColor: "text-amber-700 dark:text-amber-600",
        border: "border-amber-700/30"
      }
    ],
    timeline: [
      {
        date: "September 8, 2026",
        title: "Hackathon Launch & Registration Opens",
        description: "Official kickoff, problem track releases, and team registration on the NACOS portal."
      },
      {
        date: "September 20, 2026",
        title: "Registration Closes & Team Verification",
        description: "Chapter presidents verify institutional member rosters. Teams finalized."
      },
      {
        date: "September 21, 2026",
        title: "Hacking & Mentorship Sprints",
        description: "Intensive 7-day development period with live office hours from industry mentors."
      },
      {
        date: "September 26, 2026",
        title: "Project Submission Deadline (11:59 PM)",
        description: "GitHub repository URL, demo video link (3 mins), and pitch slide deck submission."
      },
      {
        date: "September 28, 2026",
        title: "Grand Finale & Live Demo Day",
        description: "Top 10 finalist pitches in front of executive jury and prize ceremony."
      }
    ],
    tracks: [
      {
        id: "fintech",
        title: "Open Payments & FinTech",
        icon: "Wallet",
        color: "emerald",
        description: "Build frictionless financial infrastructure, student micro-payments, escrow systems, and transparent decentralized treasury solutions for institutions.",
        ideas: [
          "Campus Micro-Payments & Dues Automation",
          "Decentralized student loan & grant escrow",
          "Offline-first payment rail for remote campuses"
        ]
      },
      {
        id: "ai",
        title: "Artificial Intelligence & Automation",
        icon: "Cpu",
        color: "cyan",
        description: "Harness modern LLMs, autonomous agents, and computer vision to solve critical challenges in education, healthcare diagnostics, and agriculture in Africa.",
        ideas: [
          "Local-dialect AI STEM tutoring companion",
          "Automated exam grading & plagiarism detector",
          "Agri-tech crop disease diagnosis from phone photos"
        ]
      },
      {
        id: "digital",
        title: "Digital Innovation & Civic Tech",
        icon: "Globe",
        color: "blue",
        description: "Engineer scalable digital public goods, secure e-voting, verifiable academic credentials, and decentralized alumni trust networks.",
        ideas: [
          "Blockchain-verified degree & transcript certification",
          "Tamper-proof student union election portal",
          "Community emergency & campus safety response system"
        ]
      }
    ],
    criteria: [
      {
        title: "Innovation & Originality",
        percentage: 20,
        description: "How novel and groundbreaking is the approach compared to existing solutions?"
      },
      {
        title: "Problem Understanding & Relevance",
        percentage: 15,
        description: "Does the solution address a genuine, well-researched pain point in Nigeria / Africa?"
      },
      {
        title: "Technical Implementation & Architecture",
        percentage: 20,
        description: "Quality of code, robustness, architecture scalability, security, and use of modern tooling."
      },
      {
        title: "Impact & Feasibility",
        percentage: 20,
        description: "Market viability, business or social sustainability, and potential to scale nationally."
      },
      {
        title: "User Experience & Design",
        percentage: 10,
        description: "Intuitive UI/UX design, accessibility, responsiveness, and polished visual appeal."
      },
      {
        title: "Demo & Pitch Presentation",
        percentage: 15,
        description: "Clarity of the 3-minute video demo, effective storytelling, and live working prototype."
      }
    ],
    rules: [
      "All team members must be active, verified students of an accredited tertiary institution in Nigeria.",
      "Teams must consist of 3 to 6 members (cross-institutional collaboration is encouraged).",
      "All code submitted must be written during the hackathon. Open-source libraries and APIs are permitted, but preexisting complete codebases will lead to immediate disqualification.",
      "Projects must be hosted in a public GitHub repository with an open-source license and clear README installation instructions.",
      "Submissions must include a 3-minute Loom / YouTube walkthrough demo and working live deployment URL.",
      "Every team must submit their application before the September 20, 2026 deadline.",
      "Plagiarism, intellectual property infringement, or unethical scraping is strictly prohibited.",
      "Judges' decisions regarding shortlisting and winner selection are final and transparent."
    ],
    faqs: [
      {
        q: "Who is eligible to participate in BUILDX NACOS?",
        a: "Any undergraduate or postgraduate student registered in an accredited Nigerian higher institution (University, Polytechnic, College of Education). Members do not have to be strictly Computer Science majors—designers, product managers, and engineers are welcome!"
      },
      {
        q: "Is there any registration fee?",
        a: "No! Participation in BUILDX NACOS is 100% free of charge, sponsored by NACOS National and industry partners."
      },
      {
        q: "How will mentoring and support work?",
        a: "Mentors will be available in dedicated Discord/Slack channels throughout the hacking sprints to offer architecture reviews, pitch refinement, and technical unblocking."
      },
      {
        q: "Can solo participants enter?",
        a: "We strongly encourage team formation (minimum 3 members). If you don't have a team, join the NACOS community Discord to meet team members during the team-matching sessions."
      }
    ]
  }
];
