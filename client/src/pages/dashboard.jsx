import { useState, useEffect } from "react"
import { useUserStore } from "../stores/userstore.js"
import {  File,CirclePlus, FileUp, X, BarChart3, FileX2Icon,ArrowRight } from "lucide-react";
import axios from "axios";
import { mimeIconMap,GetIconByFileType } from "../utils/file-icon.jsx";
import FileProcess from "../components/fileProcess.jsx";
import SearchBar from "../components/SearchBar.jsx";
import useHandleFileEdit from "../utils/edit-view-routes.jsx";

export default function Dashboard() {

    const user = useUserStore((s) => s.user);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const url = import.meta.env.VITE_API_URL;
    const [files, setFiles] = useState([]);
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [searchActive, setSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const handleFileEdit = useHandleFileEdit();

    const fetchFiles = async () => {
        try {
            const response = await axios.get(`${url}/api/files/list`, {
                params: { userId: user?.UserId },
                withCredentials: true
            });
            setFiles(response.data.files);
            setFilteredFiles(response.data.files);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [user?.UserId]);

    // Close search dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchActive && !e.target.closest('.search-container')) {
                setSearchActive(false);
                setSearchQuery("");
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [searchActive]);

    const dummyFiles = [
        { name: "ProjectProposal.docx", modified: "2024-06-10", size: "120 KB" },
        // { name: "MeetingNotes.txt", modified: "2024-06-12", size: "15 KB" },
        { name: "Budget.xlsx", modified: "2024-06-11", size: "85 KB" },
        { name: "Presentation.pptx", modified: "2024-06-09", size: "2 MB" },
    ]

    const handleAddModal = () =>{
        setAddModalOpen(true);
    }

    const handleSearchResults = (results) => {
        setFilteredFiles(results);
        setSearchActive(results.length > 0 || searchQuery.trim().length > 0);
    };

    const handleFileClick = (file) => {
        handleFileEdit(file);
        setSearchActive(false);
        setSearchQuery("");
    };

    // Sidebar Component 
    const SidebarContent = () => (
        <>
            {/* STORAGE right hand */}
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
            
            {/* STATISTICS right hand bottom */}
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

            {/* Mobile  */}
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
                {/* Header Section -NAV SEC*/}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="w-full lg:w-auto lg:pl-0 sm:pl-0">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black dark:text-white">
                            Welcome Back! {user?.Username ?? 'Guest'}
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                            Here is some summary of your recent activity
                        </p> 
                    </div>
                    
                    {/* Action Buttons-Pins File Sec */}
                    <div className="flex flex-wrap gap-2 sm:gap-3 w-full lg:w-auto relative search-container">
                        <SearchBar
                            placeholder="Search files and folders..."
                            onSearchResults={handleSearchResults}
                            data={files}
                            searchFields={['filename', 'filetype']}
                            className='w-full lg:w-[280px]'
                            onFocus={() => setSearchActive(true)}
                        />
                        
                        {/* Search Components */}
                        {searchActive && (
                            <div className="absolute top-full mt-2 left-0 right-0 lg:left-0 lg:right-auto lg:w-[400px] bg-white dark:bg-[#1a2332] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                {/* Header */}
                                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f1419]">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Search Results
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {filteredFiles.length} {filteredFiles.length === 1 ? 'file' : 'files'}
                                        </span>
                                    </div>
                                </div>

                                {/* Results */}
                                <div className="max-h-[400px] overflow-y-auto">
                                    {filteredFiles.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 px-4">
                                            <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                                <FileX2Icon size={32} className="text-gray-400 dark:text-gray-600"/>
                                            </div>
                                            <p className="text-gray-900 dark:text-white font-medium mb-1">No files found</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Try a different search term</p>
                                        </div>
                                    ) : (
                                        <ul className="py-2">
                                            {filteredFiles.slice(0, 8).map((file, _index) => {
                                                
                                                const fileSize = (file.filesize / 1024).toFixed(2);
                                                const fileExt = file.filename.split('.').pop().toUpperCase();
                                                
                                                return (
                                                    <li 
                                                        key={file.FileId}
                                                        onClick={() => handleFileClick(file)}
                                                        className="group px-4 py-3 hover:bg-blue-50 dark:hover:bg-[#1e2a3a] cursor-pointer transition-all duration-150 border-b border-gray-100 dark:border-gray-800 last:border-0"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {/* File Icon */}
                                                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                                <GetIconByFileType filetype={file.filetype} size={24} />
                                                            </div>
                                                            
                                                            {/* File Info */}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                                                    {file.filename}
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                        {fileSize} KB
                                                                    </span>
                                                                    <span className="text-xs text-gray-400 dark:text-gray-600">•</span>
                                                                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
                                                                        {fileExt}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Arrow Icon */}
                                                            <div className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all">
                    
                                                                <ArrowRight size={20} />
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>

                                {/* Footer - Show more if results > 8 */}
                                {filteredFiles.length > 8 && (
                                    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0f1419]">
                                        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                                            Showing 8 of {filteredFiles.length} results
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                        <button className="bg-[#3f8cee] rounded-lg text-white font-semibold px-4 py-2 sm:px-6 sm:py-2.5 hover:opacity-80 transition-all duration-150 ease-in-out cursor-pointer text-sm whitespace-nowrap" onClick={()=>{ setUploadModalOpen(true);}}>
                            Upload File
                        </button>
                        <button className="bg-[#233648] rounded-lg text-white font-semibold px-4 py-2 sm:px-6 sm:py-2.5 hover:opacity-80 transition-all duration-150 ease-in-out cursor-pointer text-sm whitespace-nowrap" onClick={()=>{handleAddModal()}}>
                            Create File
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

            {/* Main Content  */}
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
                                            {mimeIconMap[file.name.split('.').pop()] || <File color="#9ca3af" size={40} className="sm:w-12 sm:h-12"/>}
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

                {/* Right Column - (Desktop Only) */}
                <div className="hidden xl:block xl:w-80 2xl:w-96 space-y-4 sm:space-y-6">
                    <SidebarContent />
                </div>
            </div>

            {/* Modals */}
            <FileProcess
                user={user}
                addModalOpen={addModalOpen}
                setAddModalOpen={setAddModalOpen}
                uploadModalOpen={uploadModalOpen}
                setUploadModalOpen={setUploadModalOpen}
            />

            </div>
        </div>  
    )
}