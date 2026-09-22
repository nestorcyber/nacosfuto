import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  BookOpen,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Layers,
  GraduationCap,
  Sparkles,
  Clock,
  User,
  Award,
  ChevronRight,
  Info,
  X
} from 'lucide-react';
import PortalLayout from '../components/PortalLayout';
import { getAppUrls } from '@nacos/config/urls';
import { fetchCourses } from '@nacos/supabase';

// Comprehensive NACOS FUTO Departmental Registered Curriculum Data
const REGISTERED_COURSES_DATA = [
  // 100 Level - 1st Semester
  { 
    code: 'CSC 101', 
    title: 'Introduction to Computing Systems & Informatics', 
    units: 3, 
    level: 100, 
    semester: 'First Semester', 
    type: 'Core / Compulsory',
    lecturer: 'Dr. C. C. Nwokorie',
    office: 'Computer Science Dept Block B, Rm 104',
    prerequisites: 'None',
    description: 'Foundations of digital computing, number systems, computer architecture, algorithms, flowcharting, and introductory programming in C.',
    syllabus: [
      'History & Evolution of Electronic Computing Machines',
      'Binary Arithmetic, Logic Gates, and Boolean Algebra',
      'System Software vs Application Software Architectures',
      'Problem Formulation, Pseudocode, and Flowchart Modeling',
      'Basic C Syntax, Data Types, Control Structures, and Standard I/O'
    ]
  },
  { 
    code: 'MTH 101', 
    title: 'Elementary Mathematics I (Algebra & Trigonometry)', 
    units: 3, 
    level: 100, 
    semester: 'First Semester', 
    type: 'General / Faculty',
    lecturer: 'Dr. E. O. Opara',
    office: 'Mathematics Dept Block A, Rm 202',
    prerequisites: 'O-Level Mathematics',
    description: 'Set theory, quadratic equations, polynomial functions, mathematical induction, binomial theorem, trigonometric functions and complex numbers.',
    syllabus: [
      'Sets, Relations, Functions, and Binary Operations',
      'Surds, Indices, and Logarithms in Scientific Computation',
      'Quadratic Equations and Theory of Polynomial Roots',
      'De Moivre\'s Theorem and Complex Number Operations',
      'Circular Trigonometric Identities and Coordinate Geometry'
    ]
  },
  { 
    code: 'PHY 101', 
    title: 'General Physics I (Mechanics & Properties of Matter)', 
    units: 3, 
    level: 100, 
    semester: 'First Semester', 
    type: 'General / Faculty',
    lecturer: 'Prof. B. C. Eze',
    office: 'Physics Dept Lab Complex',
    prerequisites: 'O-Level Physics',
    description: 'Vectors, kinematics, Newton\'s laws of motion, rotational mechanics, gravitation, elasticity, fluid statics, and thermodynamics.',
    syllabus: [
      'Scalars, Vectors, and Dimensional Analysis',
      'Translational & Circular Motion Kinematics',
      'Work, Energy, Impulse, and Linear Momentum Conservation',
      'Elastic Properties of Solids and Fluid Dynamics',
      'Temperature Scales and Thermal Expansion Principles'
    ]
  },

  // 100 Level - 2nd Semester
  { 
    code: 'CSC 102', 
    title: 'Introduction to Problem Solving & Structured Programming', 
    units: 3, 
    level: 100, 
    semester: 'Second Semester', 
    type: 'Core / Compulsory',
    lecturer: 'Prof. G. A. Chukwudebe',
    office: 'Computer Science Dept Block B, Rm 108',
    prerequisites: 'CSC 101',
    description: 'Structured programming principles, functions, recursion, one-dimensional and multi-dimensional arrays, strings, and file handling in C.',
    syllabus: [
      'Modular Programming Paradigms and Function Signatures',
      'Recursion Principles and Call Stack Execution',
      'Single & Multi-dimensional Array Manipulation',
      'Pointers, Memory Allocation, and Dynamic Referencing',
      'File Input/Output Streams and Persistent Storage'
    ]
  },
  { 
    code: 'MTH 102', 
    title: 'Elementary Mathematics II (Calculus & Coordinate Geometry)', 
    units: 3, 
    level: 100, 
    semester: 'Second Semester', 
    type: 'General / Faculty',
    lecturer: 'Dr. E. O. Opara',
    office: 'Mathematics Dept Block A, Rm 202',
    prerequisites: 'MTH 101',
    description: 'Differential calculus, limits, continuity, derivative applications, definite and indefinite integrals, and conic sections.',
    syllabus: [
      'Limits, Continuity, and Derivative First Principles',
      'Product, Quotient, and Chain Rule Differentiation',
      'Curve Sketching, Optimization, Maxima and Minima',
      'Integration by Parts and Partial Fraction Substitutions',
      'Conic Sections: Parabola, Ellipse, and Hyperbola Equations'
    ]
  },

  // 200 Level - 1st Semester
  { 
    code: 'CSC 201', 
    title: 'Computer Programming I (Object-Oriented C++)', 
    units: 3, 
    level: 200, 
    semester: 'First Semester', 
    type: 'Core / Compulsory',
    lecturer: 'Dr. G. A. Chukwudebe',
    office: 'Computer Science Dept Block B, Rm 108',
    prerequisites: 'CSC 102',
    description: 'Object-oriented programming using C++, classes, object instantiation, constructor/destructor lifecycle, operator overloading, and memory management.',
    syllabus: [
      'C++ Classes, Encapsulation, and Access Specifiers',
      'Constructors, Destructors, and Deep Copy Semantics',
      'Operator Overloading and Friend Functions',
      'Single and Multiple Inheritance Hierarchies',
      'Virtual Functions, Runtime Polymorphism, and Dynamic Binding'
    ]
  },
  { 
    code: 'CSC 203', 
    title: 'Discrete Structures & Computational Logic', 
    units: 3, 
    level: 200, 
    semester: 'First Semester', 
    type: 'Core / Compulsory',
    lecturer: 'Prof. F. E. Onuodu',
    office: 'Computer Science Dept Block A, Rm 302',
    prerequisites: 'MTH 101',
    description: 'Propositional and predicate logic, set theory, mathematical induction, combinatorics, recurrence relations, and graph theory fundamentals.',
    syllabus: [
      'Propositional Logic, Truth Tables, and Equivalence',
      'Predicate Calculus and Quantifier Formulations',
      'Mathematical Induction and Well-Ordering Principle',
      'Permutations, Combinations, and Pigeonhole Principle',
      'Graph Theory: Trees, Eulerian Circuits, and Planarity'
    ]
  },

  // 200 Level - 2nd Semester
  { 
    code: 'CSC 202', 
    title: 'Computer Programming II (Enterprise Java & JVM)', 
    units: 3, 
    level: 200, 
    semester: 'Second Semester', 
    type: 'Core / Compulsory',
    lecturer: 'Dr. O. C. Aguboshim',
    office: 'Computer Science Dept Block B, Rm 112',
    prerequisites: 'CSC 201',
    description: 'Java programming language, JVM architecture, abstract classes, interfaces, generic collections, exception handling, and multithreading basics.',
    syllabus: [
      'Java Virtual Machine (JVM) and Memory Management Model',
      'Abstract Classes, Interfaces, and Multiple Inheritance Models',
      'Java Collections Framework (List, Map, Set, Queue)',
      'Checked vs Unchecked Exception Handling',
      'Java Concurrency, Thread Lifecycle, and Synchronization'
    ]
  },
  { 
    code: 'CSC 204', 
    title: 'Computer Organization & Assembly Language Programming', 
    units: 3, 
    level: 200, 
    semester: 'Second Semester', 
    type: 'Core / Compulsory',
    lecturer: 'Dr. M. I. Ezeh',
    office: 'Computer Science Dept Block B, Rm 105',
    prerequisites: 'CSC 101',
    description: 'Von Neumann computer architecture, CPU registers, ALU operations, instruction fetch-execute cycle, and assembly language programming.',
    syllabus: [
      'Von Neumann Architecture and Bus Interconnects',
      'Instruction Set Architecture (ISA) & Addressing Modes',
      'Assembly Language Programming on x86/ARM',
      'Interrupt Handling and Direct Memory Access (DMA)',
      'Memory Hierarchy, Cache Mapping, and Virtual Memory'
    ]
  },

  // 300 Level - 1st Semester
  { 
    code: 'CSC 301', 
    title: 'Structured System Programming & Linux Internals', 
    units: 3, 
    level: 300, 
    semester: 'First Semester', 
    type: 'Core / Compulsory',
    lecturer: 'Dr. C. C. Nwokorie',
    office: 'Computer Science Dept Block B, Rm 104',
    prerequisites: 'CSC 201',
    description: 'System calls, POSIX API, process spawning with fork/exec, inter-process communication (pipes, sockets, shared memory), and file system internals.',
    syllabus: [
      'POSIX Standards and Kernel Space vs User Space Transitions',
      'Process Control, Spawning, and Daemon Processes',
      'Signals, Pipes, FIFO, and Shared Memory Inter-Process Comms',
      'Socket Programming and TCP/UDP Client-Server Daemons',
      'Memory Paging, Page Faults, and Linux VFS Drivers'
    ]
  },
  { 
    code: 'CSC 303', 
    title: 'Data Structures, Algorithms & Computational Complexity', 
    units: 3, 
    level: 300, 
    semester: 'First Semester', 
    type: 'Core / Compulsory',
    lecturer: 'Prof. F. E. Onuodu',
    office: 'Computer Science Dept Block A, Rm 302',
    prerequisites: 'CSC 201, CSC 203',
    description: 'Advanced data structures (AVL trees, Red-Black trees, Heaps, Hash Tables, Graphs), sorting algorithms, dynamic programming, and Big-O asymptotic analysis.',
    syllabus: [
      'Asymptotic Notation (Big-O, Omega, Theta) & Complexity Classes',
      'Self-Balancing Binary Search Trees (AVL & Red-Black Trees)',
      'Heap Data Structures and Priority Queue Applications',
      'Graph Search Algorithms (BFS, DFS, Dijkstra, Bellman-Ford)',
      'Dynamic Programming, Memoization, and Greedy Heuristics'
    ]
  },
  { 
    code: 'CSC 305', 
    title: 'Operating Systems Principles & Concurrency Control', 
    units: 3, 
    level: 300, 
    semester: 'First Semester', 
    type: 'Core / Compulsory',
    lecturer: 'Dr. M. I. Ezeh',
    office: 'Computer Science Dept Block B, Rm 105',
    prerequisites: 'CSC 204',
    description: 'CPU scheduling algorithms, critical section synchronization, semaphores, mutex locks, deadlock avoidance (Banker\'s algorithm), and virtual memory paging.',
    syllabus: [
      'OS Kernel Architectures (Monolithic, Microkernel, Hybrid)',
      'Preemptive and Non-Preemptive CPU Scheduling Algorithms',
      'Synchronization Primitives: Mutex, Semaphores, Monitors',
      'Deadlock Conditions, Prevention, and Banker\'s Algorithm',
      'Demand Paging, Page Replacement (LRU, FIFO, Clock), and Thrashing'
    ]
  },

  // 300 Level - 2nd Semester
  { 
    code: 'CSC 302', 
    title: 'Database Management Systems & Relational Theory', 
    units: 3, 
    level: 300, 
    semester: 'Second Semester', 
    type: 'Core / Compulsory',
    lecturer: 'Dr. (Mrs) C. U. Osuagwu',
    office: 'Computer Science Dept Block B, Rm 110',
    prerequisites: 'CSC 201',
    description: 'Relational model algebra, entity-relationship modeling, database normalization (1NF through BCNF), SQL queries, indexing, and transaction management.',
    syllabus: [
      'Relational Data Model, Tuple Relational Calculus, and Algebra',
      'Enhanced Entity-Relationship (EER) Schema Modeling',
      'Functional Dependencies and Normal Forms (1NF, 2NF, 3NF, BCNF)',
      'Complex SQL Joins, Aggregations, Views, and Triggers',
      'ACID Properties, Concurrency Schedules, and 2-Phase Locking'
    ]
  },
  { 
    code: 'CSC 308', 
    title: 'Web Technologies & Internet Programming', 
    units: 3, 
    level: 300, 
    semester: 'Second Semester', 
    type: 'Departmental Elective',
    lecturer: 'Tech Director (NACOS)',
    office: 'NACOS Innovation Secretariat',
    prerequisites: 'CSC 202',
    description: 'Full-stack web application development, HTTP/HTTPS protocols, RESTful API architecture, modern React components, authentication, and state management.',
    syllabus: [
      'HTTP/2 Protocol Lifecycles, Headers, and CORS Policies',
      'Modern Component-Driven UI Engineering with React',
      'REST API Design, JSON Payloads, and Middleware Handlers',
      'JWT Authentication, Session Storage, and Security Best Practices',
      'Cloud Deployment, CI/CD, and Serverless Edge Functions'
    ]
  },

  // 400 Level - 1st Semester
  { 
    code: 'CSC 401', 
    title: 'Software Engineering Methodologies & Project Management', 
    units: 3, 
    level: 400, 
    semester: 'First Semester', 
    type: 'Core / Compulsory',
    lecturer: 'Engr. Dr. K. C. Nwachukwu',
    office: 'Computer Science Dept Block A, Rm 204',
    prerequisites: 'CSC 301',
    description: 'Software development life cycle (SDLC), Agile Scrum, UML system modeling, requirement specification, automated testing, design patterns, and CI/CD.',
    syllabus: [
      'SDLC Methodologies (Waterfall, Spiral, Agile Scrum, Kanban)',
      'Software Requirements Specification (SRS) & User Stories',
      'UML Class, Sequence, Activity, and State Machine Diagrams',
      'Software Testing Strategies (Unit, Integration, E2E, TDD)',
      'Continuous Integration, Deployment Pipelines, and Git Workflows'
    ]
  },
  { 
    code: 'CSC 403', 
    title: 'Computer Networks, Cryptography & Network Security', 
    units: 3, 
    level: 400, 
    semester: 'First Semester', 
    type: 'Core / Compulsory',
    lecturer: 'Prof. H. C. Inyiama',
    office: 'Computer Science Dept Block A, Rm 305',
    prerequisites: 'CSC 301',
    description: 'OSI and TCP/IP protocol stacks, packet routing algorithms, IPv4/IPv6 subnetting, symmetric/asymmetric cryptography, TLS handshakes, and firewalls.',
    syllabus: [
      'OSI 7-Layer and TCP/IP Protocol Architectures',
      'IP Subnetting, CIDR, and Routing Algorithms (OSPF, BGP)',
      'Transport Layer Protocols: TCP Congestion Control and UDP',
      'Symmetric (AES) and Asymmetric (RSA, ECC) Cryptosystems',
      'TLS 1.3 Handshakes, Digital Certificates, and Firewalls'
    ]
  },
  { 
    code: 'CSC 407', 
    title: 'Computer Graphics & Interactive Visualization', 
    units: 3, 
    level: 400, 
    semester: 'First Semester', 
    type: 'Elective',
    lecturer: 'Dr. C. C. Nwokorie',
    office: 'Computer Science Dept Block B, Rm 104',
    prerequisites: 'CSC 201, MTH 102',
    description: '2D/3D affine transformations, rasterization algorithms (Bresenham), rendering pipelines, shading models (Phong, Blinn-Phong), and OpenGL programming.',
    syllabus: [
      'Scan Conversion and Bresenham Line/Circle Rasterization',
      '2D/3D Homogeneous Coordinate Transformation Matrices',
      'Viewing Transformations, Projections (Orthographic & Perspective)',
      'Illumination Models, Phong Shading, and Texture Mapping',
      'Graphics Pipeline Programming with Modern WebGL / OpenGL'
    ]
  },

  // 500 Level - 1st Semester
  { 
    code: 'CSC 501', 
    title: 'Artificial Intelligence & Intelligent Agents', 
    units: 3, 
    level: 500, 
    semester: 'First Semester', 
    type: 'Core / Compulsory',
    lecturer: 'Dr. (Mrs) N. C. Daniel',
    office: 'Computer Science Dept Block A, Rm 301',
    prerequisites: 'CSC 303',
    description: 'Intelligent agent architectures, uninformed and heuristic search (A*, Minimax, Alpha-Beta pruning), knowledge representation, and expert inference engines.',
    syllabus: [
      'Intelligent Agents: PEAS Descriptions and Environments',
      'Informed Search Strategies: Greedy Best-First and A* Search',
      'Adversarial Search: Minimax Algorithm and Alpha-Beta Pruning',
      'Knowledge Engineering, Ontology, and First-Order Inference',
      'Introduction to Machine Learning, Decision Trees, and Perceptrons'
    ]
  },
  { 
    code: 'CSC 505', 
    title: 'Cryptography, Cyber Defense & Information Security', 
    units: 3, 
    level: 500, 
    semester: 'First Semester', 
    type: 'Core / Compulsory',
    lecturer: 'Prof. F. E. Onuodu',
    office: 'Computer Science Dept Block A, Rm 302',
    prerequisites: 'CSC 403',
    description: 'Cryptographic hash functions (SHA-256), public-key infrastructures, digital signatures, vulnerability assessment, ethical hacking, and defense audits.',
    syllabus: [
      'Cryptographic Hash Functions and Message Authentication Codes (MAC)',
      'Elliptic Curve Cryptography (ECC) and Zero-Knowledge Proofs',
      'Vulnerability Scanning, Penetration Testing, and OWASP Top 10',
      'Network Intrusion Detection Systems (NIDS) and Honeypots',
      'Security Policy Governance, Compliance, and Disaster Recovery'
    ]
  },

  // 500 Level - 2nd Semester
  { 
    code: 'CSC 502', 
    title: 'Distributed Systems, Cloud Architecture & Microservices', 
    units: 3, 
    level: 500, 
    semester: 'Second Semester', 
    type: 'Core / Compulsory',
    lecturer: 'NACOS Alumni Guest Lecturer',
    office: 'Visiting Faculty Suite',
    prerequisites: 'CSC 301, CSC 403',
    description: 'Distributed system architectures, RPC/gRPC, consensus algorithms (Raft, Paxos), CAP theorem, containerization (Docker, Kubernetes), and cloud deployments.',
    syllabus: [
      'Distributed Architectures, Clock Synchronization, and Logical Clocks',
      'Consensus Algorithms: Paxos and Raft State Machine Replication',
      'CAP Theorem, Eventual Consistency, and Distributed Transactions',
      'Containerization with Docker and Kubernetes Orchestration',
      'Serverless Microservices and Multi-Region Cloud Deployment'
    ]
  },
  { 
    code: 'CSC 509', 
    title: 'Machine Learning, Neural Networks & Deep Learning', 
    units: 3, 
    level: 500, 
    semester: 'Second Semester', 
    type: 'Core / Compulsory',
    lecturer: 'Dr. C. C. Nwokorie',
    office: 'Computer Science Dept Block B, Rm 104',
    prerequisites: 'CSC 501',
    description: 'Supervised and unsupervised learning, gradient descent optimization, deep neural networks, CNNs for computer vision, Transformers, and LLMs.',
    syllabus: [
      'Linear & Logistic Regression, Cost Functions, and Gradient Descent',
      'Support Vector Machines (SVM) and Kernel Methods',
      'Deep Feedforward Neural Networks and Backpropagation Calculus',
      'Convolutional Neural Networks (CNN) for Image Processing',
      'Transformer Architectures, Self-Attention, and LLM Engineering'
    ]
  }
];

const Courses = () => {
  // User Authentication / State
  const [user] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('nacos_user');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {}
      }
    }
    return {};
  });

  // Calculate Student Current Level
  const currentStudentLevel = useMemo(() => {
    const levelStr = (user.level || '').toString();
    const match = levelStr.match(/(\d{3})/);
    if (match) return parseInt(match[1], 10);
    if (user.admission_year) {
      const num = 2026 - parseInt(user.admission_year, 10) + 1;
      if (num >= 5) return 500;
      if (num <= 1) return 100;
      return num * 100;
    }
    return 300;
  }, [user]);

  // Courses Dynamic State (from database or default curriculum)
  const [coursesList, setCoursesList] = useState(REGISTERED_COURSES_DATA);

  useEffect(() => {
    let isMounted = true;
    const loadCourses = async () => {
      try {
        const res = await fetchCourses();
        if (isMounted && res && res.data && res.data.length > 0) {
          setCoursesList(res.data);
        }
      } catch (err) {
        console.warn('Error loading dynamic courses:', err);
      }
    };
    loadCourses();

    const handleStorageChange = () => loadCourses();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('nacos_courses_updated', handleStorageChange);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('nacos_courses_updated', handleStorageChange);
    };
  }, []);

  // Filters State
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Course Details Modal State
  const [activeCourseModal, setActiveCourseModal] = useState(null);

  // Filtered registered courses
  const filteredCourses = useMemo(() => {
    return coursesList.filter((course) => {
      // Level filter
      if (selectedLevel !== 'all' && course.level.toString() !== selectedLevel) {
        return false;
      }
      // Semester filter
      if (selectedSemester !== 'all' && course.semester !== selectedSemester) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchCode = course.code.toLowerCase().includes(q);
        const matchTitle = course.title.toLowerCase().includes(q);
        const matchLecturer = (course.lecturer || '').toLowerCase().includes(q);
        const matchDesc = (course.description || '').toLowerCase().includes(q);
        if (!matchCode && !matchTitle && !matchLecturer && !matchDesc) {
          return false;
        }
      }
      return true;
    });
  }, [selectedLevel, selectedSemester, searchTerm]);

  // Total Credit Units for currently displayed curriculum
  const totalUnits = useMemo(() => {
    return filteredCourses.reduce((acc, c) => acc + (c.units || 0), 0);
  }, [filteredCourses]);

  const handleResetFilters = () => {
    setSelectedLevel('all');
    setSelectedSemester('all');
    setSearchTerm('');
  };

  const hasActiveFilters = selectedLevel !== 'all' || selectedSemester !== 'all' || searchTerm.trim() !== '';

  const websiteUrl = getAppUrls().website;
  const resourceHubUrl = `${websiteUrl}/resources`;

  return (
    <PortalLayout>
      <div className="space-y-6 font-sans">
        
        {/* ─── PROMINENT RESOURCE HUB BANNER ─── */}
        <div className="p-6 rounded bg-gradient-to-r from-[#083002] via-[#0b4203] to-[#083002] text-white border border-[#138601]/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#138601]/20 blur-2xl pointer-events-none"></div>

          <div className="space-y-1.5 z-10">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded bg-[#138601]/40 text-[#4bd043] border border-[#138601]/50">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Looking for Academic Notes, Past Questions & Tutorials?
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-green-100/80 max-w-2xl leading-relaxed">
              Official lecture handouts, textbook compendiums, past exam solutions, and video archives are hosted in the <strong>NACOS FUTO Resource Hub</strong> on the main website.
            </p>
          </div>

          <div className="z-10 shrink-0">
            <a
              href={resourceHubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded text-xs font-bold text-[#083002] bg-[#4bd043] hover:bg-[#3ebe36] transition-all shadow-md cursor-pointer hover:shadow-lg transform active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>Access Student Resource Hub</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
            </a>
          </div>
        </div>

        {/* ─── Page Title Header & Quick Summary ─── */}
        <div className="p-6 rounded bg-white dark:bg-[#083002] border border-gray-200/80 dark:border-[#138601]/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded bg-green-500/10 text-[#138601] dark:text-[#4bd043] border border-[#138601]/20">
                <Layers className="w-4 h-4" />
              </span>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                Registered Courses & Academic Curriculum
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-green-200/80">
              Departmental curriculum modules, course units, lecturer contacts, and syllabus outlines for Computer Science undergraduates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded bg-[#f8fafc] dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/30 text-xs">
              <span className="text-gray-500 dark:text-green-200/70">Your Level: </span>
              <strong className="text-gray-900 dark:text-white font-bold">{currentStudentLevel}L</strong>
            </div>
            <div className="px-3 py-1.5 rounded bg-green-50 dark:bg-[#041801] border border-[#138601]/30 text-xs">
              <span className="text-gray-500 dark:text-green-200/70">Total Units: </span>
              <strong className="text-[#138601] dark:text-[#4bd043] font-bold">{totalUnits} Units</strong>
            </div>
          </div>
        </div>

        {/* ─── Filter & Search Bar ─── */}
        <div className="p-4 rounded bg-white dark:bg-[#083002] border border-gray-200/80 dark:border-[#138601]/30 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Level Filter */}
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-semibold text-gray-600 dark:text-green-200">Level:</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-1.5 text-xs rounded bg-[#f8fafc] dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#138601] cursor-pointer"
              >
                <option value="all">All Levels (100L – 500L)</option>
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
                <option value="500">500 Level</option>
              </select>
            </div>

            {/* Semester Filter */}
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-semibold text-gray-600 dark:text-green-200">Semester:</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="px-3 py-1.5 text-xs rounded bg-[#f8fafc] dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#138601] cursor-pointer"
              >
                <option value="all">All Semesters (1st & 2nd)</option>
                <option value="First Semester">First Semester</option>
                <option value="Second Semester">Second Semester</option>
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 text-gray-400 dark:text-green-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search course code, title or lecturer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded bg-[#f8fafc] dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-green-200/50 focus:outline-none focus:ring-1 focus:ring-[#138601]"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs text-[#138601] dark:text-[#4bd043] font-semibold hover:underline cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* ─── Courses Directory Grid ─── */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course, idx) => {
              const isStudentLevel = course.level === currentStudentLevel;

              return (
                <div
                  key={course.code + idx}
                  className="p-5 rounded bg-white dark:bg-[#083002] border border-gray-200/80 dark:border-[#138601]/30 hover:border-[#138601] dark:hover:border-[#138601] transition-all flex flex-col justify-between space-y-4 shadow-xs group"
                >
                  {/* Top Bar: Code, Level, Units */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#138601] dark:group-hover:text-[#4bd043] transition-colors">
                          {course.code}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-[#041801] text-gray-700 dark:text-green-200">
                          {course.level}L • {course.semester === 'First Semester' ? '1st Sem' : '2nd Sem'}
                        </span>
                      </div>

                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-50 dark:bg-[#041801] text-[#138601] dark:text-[#4bd043] border border-[#138601]/30">
                        {course.units} Units
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-green-200/80 mt-1">
                        <User className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                        <span className="truncate">Lecturer: {course.lecturer}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-green-100/80 line-clamp-2 leading-relaxed font-normal">
                      {course.description}
                    </p>
                  </div>

                  {/* Syllabus / Module Keypoints */}
                  <div className="pt-3 border-t border-gray-100 dark:border-[#138601]/20 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-green-200/70">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{course.type}</span>
                      {isStudentLevel && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#138601] dark:text-[#4bd043]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Registered Level</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveCourseModal(course)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded text-xs font-semibold bg-gray-100 dark:bg-[#041801] hover:bg-gray-200 dark:hover:bg-[#138601]/20 text-gray-700 dark:text-green-200 border border-gray-200 dark:border-[#138601]/30 transition-colors cursor-pointer"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Syllabus Info</span>
                      </button>

                      <a
                        href={`${resourceHubUrl}?search=${encodeURIComponent(course.code)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] shadow-xs transition-colors cursor-pointer"
                      >
                        <span>Resources</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded bg-white dark:bg-[#083002] border border-gray-200/80 dark:border-[#138601]/30 space-y-3 shadow-xs">
            <BookOpen className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">No registered courses found</h3>
            <p className="text-xs text-gray-500 dark:text-green-200/70 max-w-sm mx-auto">
              We couldn't find any courses matching your selected level, semester, or search query.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          </div>
        )}

        {/* ─── COURSE SYLLABUS & DETAILS MODAL ─── */}
        {activeCourseModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/40 rounded w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              
              {/* Modal Header */}
              <div className="p-5 border-b border-gray-100 dark:border-[#138601]/25 flex items-center justify-between gap-3 shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-50 dark:bg-[#041801] text-[#138601] dark:text-[#4bd043] border border-[#138601]/30">
                      {activeCourseModal.code}
                    </span>
                    <span className="text-xs font-medium text-gray-500 dark:text-green-200/70">
                      {activeCourseModal.level}L • {activeCourseModal.semester}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1">
                    {activeCourseModal.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveCourseModal(null)}
                  className="p-1.5 rounded text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#041801] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
                
                {/* Key Course Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded bg-[#f8fafc] dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/30">
                    <span className="text-[10px] text-gray-400 dark:text-green-200/60 uppercase font-bold block">Units</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{activeCourseModal.units} Credit Units</span>
                  </div>
                  <div className="p-3 rounded bg-[#f8fafc] dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/30">
                    <span className="text-[10px] text-gray-400 dark:text-green-200/60 uppercase font-bold block">Classification</span>
                    <span className="text-xs font-bold text-[#138601] dark:text-[#4bd043] truncate block">{activeCourseModal.type}</span>
                  </div>
                  <div className="p-3 rounded bg-[#f8fafc] dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/30 col-span-2">
                    <span className="text-[10px] text-gray-400 dark:text-green-200/60 uppercase font-bold block">Prerequisites</span>
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{activeCourseModal.prerequisites}</span>
                  </div>
                </div>

                {/* Course Overview */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">Course Overview</h4>
                  <p className="text-gray-600 dark:text-green-100/80 leading-relaxed font-normal">
                    {activeCourseModal.description}
                  </p>
                </div>

                {/* Course Lecturer / Coordinator */}
                <div className="p-3.5 rounded bg-green-50/60 dark:bg-[#138601]/10 border border-[#138601]/25 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-[#138601] text-white flex items-center justify-center font-bold">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-900 dark:text-white">{activeCourseModal.lecturer}</h5>
                      <p className="text-[11px] text-gray-500 dark:text-green-200/70">{activeCourseModal.office}</p>
                    </div>
                  </div>
                </div>

                {/* Syllabus Modules Breakdown */}
                {activeCourseModal.syllabus && activeCourseModal.syllabus.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">Syllabus Topic Modules</h4>
                    <div className="space-y-1.5">
                      {activeCourseModal.syllabus.map((topic, i) => (
                        <div key={i} className="p-2.5 rounded bg-[#f8fafc] dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/30 flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded bg-[#138601]/20 text-[#138601] dark:text-[#4bd043] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-gray-700 dark:text-gray-200 font-medium leading-relaxed">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-gray-100 dark:border-[#138601]/25 flex items-center justify-between gap-3 bg-gray-50 dark:bg-[#041801]">
                <button
                  type="button"
                  onClick={() => setActiveCourseModal(null)}
                  className="px-4 py-2 rounded text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#083002] transition-colors cursor-pointer"
                >
                  Close
                </button>

                <a
                  href={`${resourceHubUrl}?search=${encodeURIComponent(activeCourseModal.code)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] shadow-xs transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Access Notes & Past Questions</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </PortalLayout>
  );
};

export default Courses;
