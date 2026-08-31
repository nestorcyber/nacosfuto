import { useEffect } from "react";
import Navbar from "../components/Nav/Navbar"

const AI = () => {


     useEffect(() => {
        window.scrollTo(0, 0);
        document.body.style.overflow = 'auto'; // force-enable scroll
      }, []);
      
    return (
        <div className="bg-gray-900">
        <Navbar />
       <section className="flex justify-center bg-gray-900 mt-5">        
       <iframe className="max-w-[800px] w-full h-[600px]" src="https://app.fastbots.ai/embed/cmbaycxuj0d6trilw971p2mqz" frameBorder="0" allowfullscreen></iframe>
        </section>        
        </div>
    )
}

export default AI