import { useState } from "react"
import { useUserStore } from "../stores/userstore"
import {  File,CirclePlus, FileUp, X, BarChart3 } from "lucide-react";
import axios from "axios";
import { useEffect } from "react";
import {mimeIconMap} from "../utils/file-icon";
import fileIcons from "../utils/file-icon";

export default function Dashboard() {

    const user = useUserStore((s) => s.user);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {

    });


    const dummyFiles = [
        { name: "ProjectProposal.docx", modified: "2024-06-10", size: "120 KB" },
        // { name: "MeetingNotes.txt", modified: "2024-06-12", size: "15 KB" },
        { name: "Budget.xlsx", modified: "2024-06-11", size: "85 KB" },
        { name: "Presentation.pptx", modified: "2024-06-09", size: "2 MB" },
    ]



    // Sidebar Component (reusable for both drawer and desktop)
    const SidebarContent = () => (
        <>
            {/* STORAGE */}
            <div className="p-4 sm:p-6 bg-white dark:bg-[#111a22] rounded-lg shadow-sm border border-gray-300 dark:border-gray-700">
                <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-6">Storage</h2>
                
                <div className="flex flex-col gap-4 items-center">
                    {/* Progress Circle */}
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                        <div className="absolute inset-0 rounded-full border-8 border-gray-200 dark:border-gray-700"></div>
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: `conic-gradient(#2563eb 0% 65%, transparent 65% 100%)`,
                            }}
                        ></div>
                        <div className="absolute inset-2 bg-white dark:bg-[#111a22] rounded-full flex items-center justify-center">
                            <div className="text-center">
                                <span className="text-2xl sm:text-3xl font-bold text-black dark:text-white block">65%</span>
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Used</span>
                            </div>
                        </div>
                    </div>
                    
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center px-2">
                        You have used 65% of your storage capacity.
                    </p>
                </div>
            </div>    
            
            {/* STATISTICS */}
            <div className="p-4 sm:p-6 bg-white dark:bg-[#111a22] rounded-lg shadow-sm border border-gray-300 dark:border-gray-700">
                <h3 className="text-lg sm:text-xl font-semibold text-black dark:text-white mb-4">Statistics</h3>
                <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Total Files</span>
                        <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">100</span>
                    </div>
                    <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Total Folders</span>
                        <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">25</span>
                    </div>
                </div>
            </div>
        </>
    )

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Mobile Drawer Overlay */}
            {drawerOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 xl:hidden"
                    onClick={() => setDrawerOpen(false)}
                ></div>
            )}

            {/* Mobile Drawer */}
            <div className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-[#0f1419] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out xl:hidden ${
                drawerOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
                        <BarChart3 size={20} />
                        Overview
                    </h2>
                    <button 
                        onClick={() => setDrawerOpen(false)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
                <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-64px)]">
                    <SidebarContent />
                </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 max-w-[1920px] mx-auto">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="w-full lg:w-auto lg:pl-0 sm:pl-0">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black dark:text-white">
                            Welcome Back! {user?.Username ?? 'Guest'}
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                            Here is some summary of your recent activity
                        </p> 
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 sm:gap-3 w-full lg:w-auto">
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 sm:p-2.5 flex-1 sm:flex-none sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#233648] text-gray-900 dark:text-white font-medium text-sm" 
                        />
                        <button className="bg-[#3f8cee] rounded-lg text-white font-semibold px-4 py-2 sm:px-6 sm:py-2.5 hover:opacity-80 transition-all duration-150 ease-in-out cursor-pointer text-sm whitespace-nowrap">
                            Upload File
                        </button>
                        <button className="bg-[#233648] rounded-lg text-white font-semibold px-4 py-2 sm:px-6 sm:py-2.5 hover:opacity-80 transition-all duration-150 ease-in-out cursor-pointer text-sm whitespace-nowrap">
                            Create Folder
                        </button>
                        
                        {/* Stats Button - Mobile Only */}
                        <button 
                            onClick={() => setDrawerOpen(true)}
                            className="xl:hidden bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white font-semibold px-4 py-2 hover:opacity-80 transition-all duration-150 ease-in-out cursor-pointer text-sm flex items-center gap-2"
                        >
                            <BarChart3 size={18} />
                            Stats
                        </button>
                    </div>
                </div>

            {/* Main Content Grid */}
            <div className="flex flex-col xl:flex-row gap-4 sm:gap-6">

                {/* Left Column - Quick Access & Recent Activity */}
                <div className="flex-1 space-y-4 sm:space-y-6">
                    {/* QUICK ACCESS */}
                    <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-white dark:bg-[#111a22] rounded-lg shadow-sm border border-gray-300 dark:border-gray-700">
                        <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-4">Quick Access</h2>
                        
                        {/* File Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                            {dummyFiles.map((file) => {
                                const displayName = file.name.length > 10 
                                        ? file.name.slice(0, 10) + "..." 
                                        : file.name;

                                return (
                                    <div 
                                        key={file.name} 
                                        className="p-3 sm:p-4 border bg-gray-50 dark:bg-[#101922] border-gray-300 dark:border-gray-700 
                                                    rounded-lg flex flex-col gap-2 justify-center items-center 
                                                    hover:shadow-md transition-shadow cursor-pointer"
                                    >
                                        <div className="w-10 h-10 sm:w-12 sm:h-12">
                                            {fileIcons[file.name.split('.').pop()] || <File color="#9ca3af" size={40} className="sm:w-12 sm:h-12"/>}
                                        </div>

                                        <h3 className="font-semibold text-black dark:text-white text-sm sm:text-base text-center">
                                            {displayName}
                                        </h3>

                                        <p className="text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs text-center">
                                            Modified: {file.modified}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs">
                                            Size: {file.size}
                                        </p>
                                    </div>
                                );
                            })}
                            
                            {/* Add New Card */}
                            {dummyFiles.length <= 4 && (
                                <div className="p-3 sm:p-4 border bg-gray-50 dark:bg-[#101922] border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col gap-2 justify-center items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    <CirclePlus color="#9ca3af" size={40} className="sm:w-12 sm:h-12"/>
                                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Add new</p>
                                    <p className="text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs">file or folder</p>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* RECENT ACTIVITY */}
                    <div className="p-4 sm:p-6 bg-white dark:bg-[#111a22] rounded-lg shadow-sm border border-gray-300 dark:border-gray-700">
                        <h3 className="text-lg sm:text-xl font-bold text-black dark:text-white mb-4">Recent Activity</h3>
                        <div className="flex flex-col gap-3 sm:gap-4">
                            <div className="flex flex-row gap-3 sm:gap-4 items-center p-2 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                <div className="p-2 sm:p-3 bg-blue-100 dark:bg-[#172a56] rounded-full shrink-0">
                                    <FileUp color="#4ade80" size={20} className="sm:w-6 sm:h-6"/>
                                </div>
                                <div className="flex flex-col justify-between flex-1 min-w-0">
                                    <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm truncate">
                                        Uploaded <span className="text-blue-500 dark:text-[#2b8ce8] font-bold">"Budget.xlsx"</span>
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-500 text-[10px] sm:text-xs">2 hours ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Storage & Statistics (Desktop Only) */}
                <div className="hidden xl:block xl:w-80 2xl:w-96 space-y-4 sm:space-y-6">
                    <SidebarContent />
                </div>
            </div>
            </div>
        </div>  
    )
}