import { FaBook, FaChartLine, FaHome, FaUsers } from "react-icons/fa";
import Navbar from "../Nav/Navbar"
import ScrollToTopLink from "../ScrollToTopLink";

const NoAccessStaff = () => {

   const features = [
       {
         icon: <FaHome className="feature-icon" />,
         title: "Home Page",
         description: "Looking for something? Starting afresh from our home page is a good idea to find your way.",
         link: "/"
       },
       {
         icon: <FaBook className="feature-icon" />,
         title: "History",
         description: "Learn more about the the history of Computer Science department in FUTO.",
         link: "/about"
       },
       {
         icon: <FaUsers className="feature-icon" />,
         title: "Student Portal",
         description: "View your academic records and access personalized academic resources all in one place.",
         link: "/dashboard"
       },
       {
         icon: <FaChartLine className="feature-icon" />,
         title: "Academic Analytics",
         description: "Get insights into your academic performance with visual charts and progress tracking tools.",
         link: "/academic-analytics"
       }
     ];

   return (
    <>
     <Navbar /> 
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      
       <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
          NO <span className="text-green-600">ACCESS!</span>
        </h2>

        <p className="text-xl font-bold text-center mb-6 text-gray-900 dark:text-white">You Cannot Access this page because you are not a Staff</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="text-green-500 mb-4 text-4xl flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-center text-gray-800 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {feature.description}
                </p>
                <div className="text-center">
                  <ScrollToTopLink
                    to={feature.link}
                    className="inline-block px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  >
                    Learn More
                  </ScrollToTopLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    </div>
   
   </>
   )
}

export default NoAccessStaff;