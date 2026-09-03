import React from 'react';
import Navbar from '../components/Nav/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { FiUser, FiMail } from 'react-icons/fi';
import hodStanleyImg from '../assets/executives/hod_stanley.jpg';
import staffAdviserImg from '../assets/executives/staff_adviser_nwokorie.jpg';

const deriveEmail = (name) => {
    const clean = name.replace(/^(Dr\.?|Mr\.?|Mrs\.?|DR\.?|MR\.?)\s*/i, '').trim();
    const parts = clean.toLowerCase().split(/\s+/);
    if (parts.length >= 2) {
        return `${parts[0]}.${parts[parts.length - 1]}@futo.edu.ng`;
    }
    return `${parts[0] || 'staff'}@futo.edu.ng`;
};

const Administration = () => {
    const { theme } = useTheme();

    const staff = [
        {
            role: "Head of Department (CSC)",
            name: "Dr. Stanley Adiele Okolie",
            bio: "Committed to curriculum development, research excellence, and fostering the next generation of computing professionals.",
            email: "hod.csc@futo.edu.ng",
            image: hodStanleyImg
        },
        {
            role: "Staff Adviser / Course Adviser",
            name: "Dr. (Mrs) E.C. Nwokorie",
            bio: "Providing academic guidance and mentorship to students. Ensuring academic success and personal growth.",
            email: "staff.adviser@futo.edu.ng",
            image: staffAdviserImg
        },
        { sn: 1, name: "Dr. Juliet Nnenna Odii", rank: "Reader", bio: "Advancing academic excellence through cutting-edge research and scholarly contributions to the field of computing.", email: deriveEmail("Dr. Juliet Nnenna Odii") },
        { sn: 2, name: "Dr. Jacinta Chioma Odirichukwu", rank: "Senior Lecturer", bio: "Dedicated to fostering innovation in computing education and mentoring students toward academic success.", email: deriveEmail("Dr. Jacinta Chioma Odirichukwu") },
        { sn: 3, name: "Dr. Uchenna Chinyere Onyemauche", rank: "Senior Lecturer", bio: "Passionate about software engineering research and equipping students with industry-relevant skills.", email: deriveEmail("Dr. Uchenna Chinyere Onyemauche") },
        { sn: 4, name: "Dr Chidimma Lilan Okpalla", rank: "Senior Lecturer", bio: "Committed to impactful research and delivering quality computing education for national development.", email: deriveEmail("Dr Chidimma Lilan Okpalla") },
        { sn: 5, name: "DR. CHINWE GILEAN ONUKWUGHA", rank: "Senior Lecturer", bio: "Driving excellence in teaching and research in information technology and computer science.", email: deriveEmail("DR. CHINWE GILEAN ONUKWUGHA") },
        { sn: 6, name: "Dr Euphemia Chioma Nwokorie", rank: "Senior Lecturer", bio: "Focused on academic mentorship, curriculum innovation, and advancing computing knowledge.", email: deriveEmail("Dr Euphemia Chioma Nwokorie") },

        { sn: 8, name: "Mr Douglas Allswell Kelechi", rank: "Lecturer II", bio: "Enthusiastic educator dedicated to practical computing education and student development.", email: deriveEmail("Mr Douglas Allswell Kelechi") },
        { sn: 9, name: "Dr Chidi Ukamaka Betrand", rank: "Lecturer II", bio: "Contributing to academic excellence through teaching, research, and community engagement.", email: deriveEmail("Dr Chidi Ukamaka Betrand") },
        { sn: 10, name: "Mr. Peter Kelechukwu Joseph", rank: "Assistant Lecturer", bio: "Building foundational knowledge in students and supporting departmental academic programs.", email: deriveEmail("Mr. Peter Kelechukwu Joseph") },
        { sn: 11, name: "Mr. Vitalis Chibuike Iwuchukwu", rank: "Assistant Lecturer", bio: "Dedicated to nurturing the next generation of computing professionals through quality instruction.", email: deriveEmail("Mr. Vitalis Chibuike Iwuchukwu") },
        { sn: 12, name: "Mr Christopher Ifeanyi Ofoegbu", rank: "Graduate Assistant", bio: "Supporting teaching and research activities while developing academic expertise in computing.", email: deriveEmail("Mr Christopher Ifeanyi Ofoegbu") },
        { sn: 13, name: "Mrs Juliet Nwanneka Amoke", rank: "Technologist II", bio: "Ensuring seamless laboratory operations and providing technical support for practical sessions.", email: deriveEmail("Mrs Juliet Nwanneka Amoke") },
        { sn: 14, name: "Dr Chukwuma Dandy Anyiam", rank: "Lecturer I", bio: "Engaged in transformative teaching and research that bridges theory and industry practice.", email: deriveEmail("Dr Chukwuma Dandy Anyiam") },
        { sn: 15, name: "DR. MERCY EBERECHI BENSON-EMENIKE", rank: "Senior Lecturer", bio: "Passionate about research-driven teaching and empowering students with computational skills.", email: deriveEmail("DR. MERCY EBERECHI BENSON-EMENIKE") },
        { sn: 16, name: "Mr Chigozie C Dimoji", rank: "Assistant Lecturer", bio: "Committed to delivering engaging lectures and fostering academic growth in students.", email: deriveEmail("Mr Chigozie C Dimoji") },
        { sn: 17, name: "Mr Ikechukwu Kingsley Onyeanu", rank: "Senior Computer Technologist", bio: "Overseeing computing infrastructure and providing advanced technical support to the department.", email: deriveEmail("Mr Ikechukwu Kingsley Onyeanu") },
        { sn: 18, name: "Mrs Ngozi Amarachi Duru", rank: "Assistant Lecturer", bio: "Focused on effective curriculum delivery and supporting student learning outcomes.", email: deriveEmail("Mrs Ngozi Amarachi Duru") },
        { sn: 19, name: "Mr Idris Ahmed Idris", rank: "Graduate Assistant (GA)", bio: "Assisting in academic research and instruction while pursuing higher academic goals.", email: deriveEmail("Mr Idris Ahmed Idris") },
        { sn: 20, name: "MR ANTHONY CHUKWUNONSO UGHAELUMBA", rank: "System Programmer/Analyst II", bio: "Managing departmental IT systems and developing software solutions for operational efficiency.", email: deriveEmail("MR ANTHONY CHUKWUNONSO UGHAELUMBA") },
        { sn: 21, name: "Mr. Harry Chidozie Ogbonna", rank: "Technologist II", bio: "Providing technical expertise and maintaining laboratory equipment for practical training.", email: deriveEmail("Mr. Harry Chidozie Ogbonna") },
        { sn: 22, name: "Mrs. Edith Chidimma Otuonye", rank: "Secretary I", bio: "Ensuring efficient administrative operations and supporting departmental coordination.", email: deriveEmail("Mrs. Edith Chidimma Otuonye") },
        { sn: 23, name: "Dr. Francisca Onyinyechi Nwokoma", rank: "Lecturer I", bio: "Dedicated to academic excellence through innovative teaching methods and scholarly research.", email: deriveEmail("Dr. Francisca Onyinyechi Nwokoma") },
        { sn: 24, name: "Dr. Donatus Onyedikachi Njoku", rank: "Lecturer II", bio: "Contributing to knowledge advancement and student development in computer science.", email: deriveEmail("Dr. Donatus Onyedikachi Njoku") },
    ];

    return (
        <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#041801] text-white' : 'bg-white text-[#083002]'} transition-colors duration-300`}>
            <Navbar />
            <div className="flex-grow max-w-7xl mx-auto px-6 py-16 w-full">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                        Departmental <span className="text-[#138601] dark:text-[#4bd043]">Administration</span>
                    </h1>
                    <p className="text-base sm:text-lg opacity-80 max-w-2xl mx-auto leading-relaxed">
                        Meet the dedicated leaders shaping the future of computer science education at FUTO.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {staff.map((person, index) => (
                        <div key={index} className={`rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1.5 flex flex-col group border ${theme === 'dark' ? 'bg-[#083002] border-[#138601]/30' : 'bg-white border-gray-200'}`}>
                            <div className="h-72 overflow-hidden relative">
                                {person.image ? (
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                                        <img src={person.image} alt={person.name} className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700" />
                                    </>
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10"></div>
                                        <FiUser size={80} className="text-white/30" />
                                    </div>
                                )}
                                <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end">
                                    <span className="inline-block px-3 py-1 rounded-full bg-green-500/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg border border-white/20">
                                        {person.role || person.rank}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8 flex-grow flex flex-col">
                                <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{person.name}</h3>
                                {person.bio && (
                                    <p className={`opacity-80 mb-6 leading-relaxed text-sm flex-grow ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {person.bio}
                                    </p>
                                )}
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700/50">
                                    <a href={`mailto:${person.email}`} className="flex items-center text-sm font-semibold hover:text-green-500 transition-colors group/mail">
                                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 group-hover/mail:bg-green-500 group-hover/mail:text-white transition-colors">
                                            <FiMail />
                                        </div>
                                        {person.email}
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Administration;
