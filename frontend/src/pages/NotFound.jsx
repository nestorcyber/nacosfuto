import Navbar from "../components/Nav/Navbar"
import ScrollToTopLink from "../components/ScrollToTopLink";

const NotFound = () => {
    return (
        <>
        <div className="h-screen bg-white dark:bg-gray-900"> 
         <Navbar />
         <div className="rounded-lg shadow-lg w-auto h-80 justify-self-center box-border mt-24">
           <h2 className="text-7xl text-center text-green-500 font-medium p-14">404</h2>
           <p className="text-2xl text-center text-green-500 font-medium">Sorry! The page you requested for does not exist</p>
           <div className="m-5">
             <ScrollToTopLink to="/">
             <button className="w-full py-2.5 px-4 flex justify-center items-center bg-green-600 hover:bg-green-700 text-white font-medium rounded-md">Back to the home page</button>
             </ScrollToTopLink>
             </div>
         </div>
        </div>
        </>
    )
}

export default NotFound;