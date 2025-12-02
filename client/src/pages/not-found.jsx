import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";
import { Footer } from '../components/navbar'
import { FolderX } from "lucide-react";

export default function NotFound() {
    const navigate = useNavigate();
    return (
        <div>
            <Navbar/>
            <div className="flex flex-col justify-center items-center min-h-screen h-screen bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 py-8">
                <FolderX className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 dark:text-gray-400 mb-4 sm:mb-6 text-red-500" />
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4 text-center">
                    404 - Page Not Found
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-center max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl px-2">
                    Sorry, the page you're looking for might have been removed, renamed or doesn't exist. Let's get you back on track!
                </p>
                <button 
                    className="px-5 py-2.5 sm:px-6 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded hover:bg-blue-700 transition cursor-pointer active:scale-95 transform" 
                    onClick={() => {navigate(-1, { replace: true })}}
                >
                    Go Back
                </button>
            </div>
            <Footer />
        </div>

    )
}