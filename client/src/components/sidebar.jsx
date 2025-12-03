import { useState } from "react"
import { useUserStore } from "../stores/userstore"
import { LayoutDashboard, FileBox, Folder, Menu, X} from "lucide-react";
import { useTabDataStore } from "../stores/tab-data";
import { useNavigate } from "react-router-dom";
import slug from '../utils/slug';


export default function Sidebar({onTabChange}) {

    const user = useUserStore((s) => s.user);
    const logout = useUserStore((s) => s.logout);
    const { tab, setTab } = useTabDataStore();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleTabChange = (newTab) => {
        onTabChange(newTab);
        setTab(newTab);
  
        try{
            const hashed = slug(newTab) || newTab;
            window.location.hash = `-${hashed}`;
        } catch (e) {
            
            window.location.hash = `-${newTab}`;
        }
        setIsOpen(false); // Close drawer on mobile when tab is selected
    };

    // Sidebar content component 
    const SidebarContent = () => (
        <div className="flex flex-col gap-6 h-full">
            {/* Sidebar Title (User)*/}
            <div className="flex flex-row items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-lg">{(user?.Username?.[0]?.toUpperCase() ?? "G") || 'U'}</span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                    <p className="text-sm font-bold text-black dark:text-white truncate">{(user?.Username ?? "GUEST") || 'User'}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Free User</p>
                </div>
            </div>
            
            {/* Sidebar Navigation */}
            <nav className="flex flex-col gap-2 flex-1">

                <button
                    onClick={() => handleTabChange('dashboard')}
                    className={`text-sm sm:text-base font-semibold text-left px-3 py-2.5 rounded-lg flex items-center gap-3
                    ${tab === 'dashboard' 
                        ? 'bg-blue-500 text-white dark:bg-blue-600' 
                        : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}
                    transition-colors duration-200`}
                >
                    <LayoutDashboard size={20} />
                    Dashboard
                </button>

                <button
                    onClick={() => handleTabChange('my-files')}
                    className={`text-sm sm:text-base font-semibold text-left px-3 py-2.5 rounded-lg flex items-center gap-3
                    ${tab === 'my-files' 
                        ? 'bg-blue-500 text-white dark:bg-blue-600' 
                        : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}
                    transition-colors duration-200`}
                >
                    <Folder size={20} />
                    My Files
                </button>

                <button
                    onClick={() => handleTabChange('shared')}
                    className={`text-sm sm:text-base font-semibold text-left px-3 py-2.5 rounded-lg flex items-center gap-3
                    ${tab === 'shared' 
                        ? 'bg-blue-500 text-white dark:bg-blue-600' 
                        : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}
                    transition-colors duration-200`}
                >
                    <FileBox size={20} />
                    Shared Files
                </button>

                {/* <button
                    onClick={() => navigate('/converter')}
                    className={`text-sm sm:text-base font-semibold text-left px-3 py-2.5 rounded-lg flex items-center gap-3
                    ${tab === 'converter' 
                        ? 'bg-blue-500 text-white dark:bg-blue-600' 
                        : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}
                    transition-colors duration-200`}
                >
                    <ArrowLeftRight size={20} />
                    Converter
                </button> */}


                

                <div>
                    <button className="w-full mt-6 px-3 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base font-semibold rounded-lg transition-colors duration-200 cursor-pointer" onClick={()=>{logout(); navigate('/login')}}>
                        Logout
                    </button>
                </div>

            </nav>
        </div>
    );

    return(
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                aria-label="Open menu"
            >
                <Menu size={24} className="text-gray-700 dark:text-gray-300" />
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Drawer */}
            <div className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-black dark:text-white">Menu</h2>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    
                    >
                        <X size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
                    <SidebarContent />
                </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-64 h-full bg-white dark:bg-gray-900 p-6 border-r-2 border-gray-200 dark:border-gray-700">
                <SidebarContent />
            </div>
        </>
    )
}