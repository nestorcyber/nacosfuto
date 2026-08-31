/**
 * FUTO Computer Science Course Data
 * Contains all course information separated by level
 * Structure: { code, title, level, semester, credits, isElective }
 */

export const courses = [
    // 100 Level (First Year)
    // First Semester
    { code: 'CHM 101', title: 'General Chemistry I', level: 100, semester: 1, units: 2, isElective: false },
    { code: 'CHM 107', title: 'General Chemistry Practical I', level: 100, semester: 1, units: 1, isElective: false },
    { code: 'COS 101', title: 'Introduction to Computing Sciences', level: 100, semester: 1, units: 3, isElective: false },
    { code: 'GST 103', title: 'Humanities', level: 100, semester: 1, units: 1, isElective: false },
    { code: 'GST 111', title: 'Communication in English', level: 100, semester: 1, units: 2, isElective: false },
    { code: 'MTH 101', title: 'Elementary Mathematics I', level: 100, semester: 1, units: 2, isElective: false },
    { code: 'PHY 101', title: 'General Physics I', level: 100, semester: 1, units: 2, isElective: false },
    { code: 'PHY 107', title: 'General Physics Practical I', level: 100, semester: 1, units: 1, isElective: false },
    { code: 'STA 111', title: 'Descriptive Statistics', level: 100, semester: 1, units: 3, isElective: false },
    // Electives
    { code: 'FUTO-IGB 101', title: 'Introduction to Igbo', level: 100, semester: 1, units: 1, isElective: true },
    { code: 'FUTO-FRN 101', title: 'Communication in French I', level: 100, semester: 1, units: 1, isElective: true },

    // Second Semester
    { code: 'CHM 102', title: 'General Chemistry II', level: 100, semester: 2, units: 2, isElective: false },
    { code: 'CHM 108', title: 'General Chemistry Practical II', level: 100, semester: 2, units: 1, isElective: false },
    { code: 'COS 102', title: 'Problem Solving', level: 100, semester: 2, units: 3, isElective: false },
    { code: 'GET 102', title: 'Engineering Graphics and Solid Modelling I', level: 100, semester: 2, units: 2, isElective: false },
    { code: 'GST 112', title: 'Nigerian Peoples and Culture', level: 100, semester: 2, units: 2, isElective: false },
    { code: 'MTH 102', title: 'Elementary Mathematics II', level: 100, semester: 2, units: 2, isElective: false },
    { code: 'PHY 102', title: 'General Physics II', level: 100, semester: 2, units: 2, isElective: false },
    { code: 'PHY 108', title: 'General Practical Physics II', level: 100, semester: 2, units: 1, isElective: false },
    { code: 'STA 112', title: 'Probability', level: 100, semester: 2, units: 2, isElective: false },
    { code: 'FUTO-GST 102', title: 'Communication in English', level: 100, semester: 2, units: 2, isElective: false },
    // Electives
    { code: 'FUTO-IGB 102', title: 'Communication in Igbo Language', level: 100, semester: 2, units: 1, isElective: true },
    { code: 'FUTO-FRN 102', title: 'Communication in French II', level: 100, semester: 2, units: 1, isElective: true },


    // 200 Level Courses (Second Year)
    // First Semester
    { code: 'ENT 211', title: 'Enterpreneurship and Innovation', level: 200, semester: 1, units: 2, isElective: false },
    { code: 'MTH 201', title: 'Mathematical Methods I', level: 200, semester: 1, units: 2, isElective: false },
    { code: 'COS 201', title: 'Computer Programming I', level: 200, semester: 1, units: 3, isElective: false },
    { code: 'CSC 203', title: 'Discrete Structures', level: 200, semester: 1, units: 2, isElective: false },
    { code: 'IFT 211', title: 'Digital Logic Design', level: 200, semester: 1, units: 2, isElective: true },
    { code: 'SEN 201', title: 'Introduction to Software Engineering', level: 200, semester: 1, units: 2, isElective: false },
    { code: 'STA 211', title: 'Probabilty II', level: 200, semester: 1, units: 2, isElective: false },
    { code: 'CSC 201', title: 'Computer and Application I', level: 200, semester: 1, units: 3, isElective: false },
  
     // Second Semester
     { code: 'GST 212', title: 'Philosophy, Logic and Human Existence', level: 200, semester: 2, units: 2, isElective: false },
     { code: 'MTH 202', title: 'Elementary Differential Equations', level: 200, semester: 2, units: 2, isElective: false },
     { code: 'COS 202', title: 'Computer Programming II', level: 200, semester: 2, units: 3, isElective: false },
     { code: 'IFT 212', title: 'Computer Architecture and Organization', level: 200, semester: 2, units: 2, isElective: false },
     { code: 'GET 204', title: 'Students Workshop Practice', level: 200, semester: 2, units: 2, isElective: true },
     { code: 'CSC 202', title: 'Computer and Applications II', level: 200, semester: 2, units: 2, isElective: false },
     { code: 'CSC 206', title: 'Linear Algebra for Machine Learning', level: 200, semester: 2, units: 2, isElective: false },
     { code: 'CSC 208', title: 'Introduction to Graph Theory', level: 200, semester: 2, units: 2, isElective: false },
     { code: 'CSC 210', title: 'Occupational Health and Safety in Computer Science', level: 200, semester: 2, units: 1, isElective: false },
  
    
      // 300 Level Courses (Second Year)
    // First Semester
    { code: 'CSC 301', title: 'Data Structures', level: 300, semester: 1, units: 3, isElective: false },
    { code: 'CSC 309', title: 'Artificial Intelligence', level: 300, semester: 1, units: 2, isElective: false },
    { code: 'CYB 201', title: 'Introduction to Cyber Security and Strategy', level: 300, semester: 1, units: 2, isElective: false },
    { code: 'ICT 305', title: 'Data Communication System and Network', level: 300, semester: 1, units: 3, isElective: false },
    { code: 'CSC 303', title: 'Compiler Construction I', level: 300, semester: 1, units: 2, isElective: true },
    { code: 'CSC 311', title: 'Advanced Programming Techniques using Python', level: 300, semester: 1, units: 3, isElective: false },
    { code: 'CSC 313', title: 'Distributed Systems', level: 300, semester: 1, units: 3, isElective: false },
    // Electives
    { code: 'CSC 315', title: 'Advanced Programming Techniques using C++', level: 300, semester: 1, units: 3, isElective: true },
    { code: 'CSC 317', title: 'Assembly Language Programming', level: 300, semester: 1, units: 2, isElective: true },
  
     // Second Semester
     { code: 'GST 312', title: 'Peace and Conflict Resolution', level: 300, semester: 2, units: 2, isElective: false },
     { code: 'ENT 312', title: 'Venture Creation', level: 300, semester: 2, units: 2, isElective: false },
     { code: 'COS 308', title: 'Operating Systems', level: 300, semester: 2, units: 3, isElective: false },
     { code: 'CSC 322', title: 'Computer Science Innovation and New Technologies', level: 300, semester: 2, units: 2, isElective: false },
     { code: 'DTS 304', title: 'Data Management I', level: 300, semester: 2, units: 3, isElective: true },
     { code: 'CSC 304', title: 'System Analysis and Design', level: 300, semester: 2, units: 2, isElective: false },
     { code: 'COS 306', title: 'Web Design and Programming', level: 300, semester: 2, units: 3, isElective: false },
     { code: 'CSC 314', title: 'Advanced Programming Techniques using Java', level: 300, semester: 2, units: 3, isElective: false },
     // Electives
     { code: 'CSC 302', title: 'Embedded Systems', level: 300, semester: 2, units: 2, isElective: true },
     { code: 'CSC 306', title: 'Programming for Data Science using R', level: 300, semester: 2, units: 2, isElective: true },
     { code: 'CSC 310', title: 'Principles of Cluster and Grid Computing', level: 300, semester: 2, units: 1, isElective: true },
     { code: 'CSC 316', title: 'Assembly Language Programming', level: 300, semester: 2, units: 2, isElective: true },

     
    // 400 Level Courses (Fourth Year)
    // First Semester
    { code: 'COS 409', title: 'Research Methodology and Technical Report Writing', level: 400, semester: 1, units: 3, isElective: false },
    { code: 'CSC 401', title: 'Algorithm and Complexity Analysis', level: 400, semester: 1, units: 2, isElective: false },
    { code: 'CSC 402', title: 'Ethics and Legal Issues in Computer Science', level: 400, semester: 1, units: 2, isElective: false },
    { code: 'INS 401', title: 'Project Management', level: 400, semester: 1, units: 2, isElective: false },
    { code: 'CSC 403', title: 'General Programming Laboratory', level: 400, semester: 1, units: 2, isElective: false },
    { code: 'CSC 405', title: 'Unix Operating Systems', level: 400, semester: 1, units: 2, isElective: false },
    { code: 'CSC 407', title: 'Database Systems Concepts', level: 400, semester: 1, units: 2, isElective: false },
    { code: 'COS 411', title: 'Human Computer Interaction', level: 400, semester: 1, units: 1, isElective: false },
    { code: 'CSC 413', title: 'Fundamentals of Machine Learning', level: 400, semester: 1, units: 2, isElective:  false },
    // Electives
    { code: 'CSC 415', title: 'Compiler Construction II', level: 400, semester: 1, units: 2, isElective: true },
    { code: 'CSC 417', title: 'Concurrent System Programming', level: 400, semester: 1, units: 2, isElective: true },
    { code: 'STA 311', title: 'Statistical Inference III', level: 400, semester: 1, units: 1, isElective: true },
    { code: 'CSC 419', title: 'Formal Models of Computation', level: 400, semester: 1, units: 2, isElective: true },
    { code: 'CSC 421', title: 'Startup Engineering', level: 400, semester: 1, units: 2, isElective: true },
    { code: 'CSC 423', title: 'Edge Computing', level: 400, semester: 1, units: 2, isElective: true },
    
    // Second Semester
    { code: 'COS 299', title: 'SIWES I', level: 400, semester: 2, units: 3, isElective: false },
    { code: 'CSC 399', title: 'SIWES II', level: 400, semester: 2, units: 3, isElective: false },
    { code: 'CSC 499', title: 'SIWES III', level: 400, semester: 2, units: 6, isElective: false },
   
    // 500 Level Courses (Final Year)
    // First Semester
    { code: 'COS 501', title: 'Data Analytics for Business Intelligence', level: 500, semester: 1, units: 2, isElective: false },
    { code: 'CSC 503', title: 'Computer Networks and Communications', level: 500, semester: 1, units: 2, isElective: false },
    { code: 'CSC 505', title: 'System Performance Evaluation', level: 500, semester: 1, units: 2, isElective: false },
    { code: 'CSC 507', title: 'Principles of Modeling and Simulation', level: 500, semester: 1, units: 2, isElective: false },
    { code: 'CSC 509', title: 'Introduction to Deep Learning', level: 500, semester: 1, units: 2, isElective: false },
    { code: 'CSC 511', title: 'Software Engineering', level: 500, semester: 1, units: 2, isElective: false },
    { code: 'CSC 513', title: 'Seminar', level: 500, semester: 1, units: 1, isElective: false },
    { code: 'COS 515', title: 'Computer Graphics and Visualization', level: 500, semester: 1, credits: 2, isElective: false },
    { code: 'CSC 597', title: 'Final Year Project I', level: 500, semester: 1, units: 3, isElective: false },
    // Electives
    { code: 'CSC 517', title: 'Application Development for Mobile Systems', level: 500, semester: 1, units: 2, isElective: true },
    { code: 'CSC 519', title: 'Principles and Application of Blockchain', level: 500, semester: 1, units: 2, isElective: true },
    { code: 'CSC 521', title: 'Virtual and Augmented Reality Systems', level: 500, semester: 1, units: 2, isElective: true },
    { code: 'COS 523', title: 'Evolutionary Computation', level: 500, semester: 1, units: 2, isElective: true },
    { code: 'CSC 525', title: 'Parallel Programing', level: 500, semester: 1, units: 2, isElective: true },
    { code: 'CSC 527', title: 'Optimization Techniques in Computer Science', level: 500, semester: 1, units: 2, isElective: true },
    
    // Second Semester
    { code: 'COS 502', title: 'Professional Practice in Computer Science', level: 500, semester: 2, units: 1, isElective: false },
    { code: 'CSC 504', title: 'Information Retrieval Systems and Applications', level: 500, semester: 2, units: 2, isElective: false },
    { code: 'CSC 506', title: 'Internet of Things', level: 500, semester: 2, units: 3, isElective: false },
    { code: 'CSC 508', title: 'Natural Language Procesing', level: 500, semester: 2, units: 2, isElective: false },
    { code: 'CSC 510', title: 'Computer Vision Techniques', level: 500, semester: 2, units: 2, isElective: false },
    { code: 'CSC 512', title: 'Robotics Systems', level: 500, semester: 2, units: 2, isElective: false },
    { code: 'CSC 514', title: 'Cloud Computing', level: 500, semester: 2, units: 2, isElective: false },
    { code: 'COS 516', title: 'Principles and Application of Blockchain', level: 500, semester: 2, units: 2, isElective: false },
    { code: 'CSC 598', title: 'Final Year Project II', level: 500, semester: 2, units: 3, isElective: false },
    // Electives
    { code: 'CSC 518', title: 'Statistical Pattern Recognition', level: 500, semester: 2, units: 3, isElective: true },
    { code: 'CSC 520', title: 'Reasoning Under Uncertainty', level: 500, semester: 2, units: 3, isElective: true },
    { code: 'CSC 522', title: 'Principles and Techniques of Data Visualization', level: 500, semester: 2, units: 3, isElective: true },
    { code: 'COS 524', title: 'Foundations of Constraint Programming', level: 500, semester: 2, units: 3, isElective: true },
    { code: 'CSC 526', title: 'Metaheuristic Algorithms', level: 500, semester: 2, units: 3, isElective: true },
    { code: 'CSC 528', title: 'Bioinformatics', level: 500, semester: 2, units: 3, isElective: true },
    { code: 'CSC 530', title: 'Biometrics Systems', level: 500, semester: 2, units: 3, isElective: true },
 
   ];