
import { MonitorSmartphone,Eye,HandCoins, NotebookPen, ShieldCheck, FileOutput } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Landing() {

    const navigate = useNavigate();

    const features = [
        {
            title: "Full CRUD Operations",
            description: "Connect all your favorite apps and services effortlessly.",
            icon: <NotebookPen color="#154ab4"/>
        },
        {
            title: "Role based Access Control (RBAC)",
            description: "AI-powered sorting and tagging for easy file management.",
            icon: <ShieldCheck color="#154ab4"/>
        },
        {
            title: "Responsive Design",
            description: "End-to-end encryption ensures your files are safe and secure.",
            icon: <MonitorSmartphone color="#154ab4"/>
        },
        {
            title: "Advanced Files Viewer",
            description: "Preview and edit your files with our powerful in-app viewer.",
            icon: <Eye color="#154ab4"/>
        },
        
        {
            title: "Build In File Conversion",
            description: "Stay informed with real-time updates on your file activities.",
            icon: <FileOutput color="#154ab4"/>
        },

        {
            title: "Free For Use",
            description: "Enjoy a comprehensive file management solution at no cost.",
            icon: <HandCoins color="#154ab4"/>
        }
    ];

    return (

        <div className="w-full h-full bg-white dark:bg-[#111621] px-4 sm:px-6 lg:px-8
           bg-[linear-gradient(#d1d5db40_1px,transparent_1px),linear-gradient(90deg,#d1d5db40_1px,transparent_1px)]
            dark:bg-[linear-gradient(#a1a1aa40_1px,transparent_1px),linear-gradient(90deg,#a1a1aa40_1px,transparent_1px)]
            bg-[size:40px_40px]
            ">
            {/**HERO SECTION */}

            <div className="flex flex-col justify-center items-center py-8 sm:py-12 lg:py-16 gap-4 sm:gap-6">
                {/* <p className="mt-4 sm:mt-6 rounded-full bg-[#FAC638] px-4 py-1.5 text-center text-xs sm:text-sm md:text-[15px] items-center align-middle font-semibold whitespace-nowrap">Now In Public Beta !</p> */}
                <h1 className="   mt-10 text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                                 font-bold text-center leading-tight px-4
                                bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500
                                bg-300% animate-color-wave
                                text-transparent bg-clip-text
                            ">
                    The Future of File<br className="hidden sm:block"/>Management is Here
                </h1>
                <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-xl lg:max-w-2xl mx-auto justify-center items-center text-center px-4">
                    FileFlow offers a seamless, secure, and intelligent platform to manage your digital life. All your files, accessible from anywhere, with robust control and powerful features.
                </p>
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 w-full sm:w-auto px-4 sm:px-0">
                    <button className="px-6 py-3 bg-[#4CAF50] text-black font-semibold rounded hover:opacity-75 transition-opacity text-sm sm:text-base w-full sm:w-auto" onClick={()=>{navigate('/login')}}>Get Started</button>
                    <button className="px-6 py-3 bg-[#292d37] text-white font-semibold rounded hover:opacity-75 transition-opacity text-sm sm:text-base w-full sm:w-auto">Learn More</button>
                </div>
            </div>

            <hr className="my-6 sm:my-8 lg:my-10 border-gray-300 dark:border-gray-700"/>

            {/**FEATURES SECTION */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black dark:text-white text-center mt-6 sm:mt-8 px-4">Everything you need, All in One Place</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 text-center mt-2 sm:mt-3 px-4 max-w-3xl mx-auto">Discover the powerful features that make FileFlow the ultimate file management solution.</p>
            <div className="mt-6 sm:mt-8 lg:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-7 
                            max-w-6xl mx-auto bg-white dark:bg-[#0f172a] px-4
                        ">
                            
                {features.map((features, idx) => (
                    <div 
                        key={idx} 
                        className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6 text-center justify-center
                                border-[0.5px] border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#122436] 
                                shadow-sm dark:shadow-sm hover:shadow-md dark:hover:shadow-lg transition-shadow duration-300"
                    >
                        {/* Icon Container */}
                        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto flex justify-center items-center 
                                        dark:bg-[#0f1b2c] bg-[#e7eefa] rounded-lg">
                            {features.icon}
                        </div>

                        <h4 className="font-bold text-base sm:text-lg text-black dark:text-white">{features.title}</h4>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{features.description}</p>
                    </div>
                ))}
            </div>

            <hr className="my-6 sm:my-8 lg:my-10 border-gray-300 dark:border-gray-700"/>
            
            {/**LAST SECTION */}
            <div className="mt-6 sm:mt-8 lg:mt-10 bg-[#37309d] rounded-xl sm:rounded-2xl text-center p-6 sm:p-8 lg:p-10 max-w-5xl mx-auto">

                <h4 className="mt-2 sm:mt-4 lg:mt-6 text-xl sm:text-2xl lg:text-3xl font-bold text-white px-4">Ready to Experience the Future of File Management?</h4>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-gray-200 max-w-2xl mx-auto px-4">
                    Join FileFlow today and take control of your digital world with ease and confidence.
                </p>
                <button className="mt-5 sm:mt-6 lg:mt-7 px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-black font-semibold rounded hover:opacity-75 transition-opacity cursor-pointer text-sm sm:text-base  sm:w-auto mx-4 sm:mx-0" onClick={()=>{navigate('/signup')}}>Get Started Now</button>
            </div>
            <hr className="mt-8 sm:mt-10 lg:mt-12  border-gray-300 dark:border-gray-700"/>
        </div>

    );



}