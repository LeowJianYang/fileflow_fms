import { Grid, LayoutList, Share2, Users, File, Folder, MoreVertical, Eye, Edit } from "lucide-react";
import { GetIconByFileType } from "../utils/file-icon.jsx";
import { useEffect, useState } from "react";
import { useUserStore } from "../stores/userstore.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import useHandleFileEdit from "../utils/edit-view-routes.jsx";
import { useAppToast } from "../utils/use-toast.jsx";
import FileProcess from "../components/fileProcess.jsx";
import { IoWarning } from "react-icons/io5";

export default function SharedCenter() {
    const [sharedFiles, setSharedFiles] = useState([]);
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [isGridView, setIsGridView] = useState(true);
    const [sortBy, setSortBy] = useState("name"); // "name", "date"
    const [filterType, setFilterType] = useState("all"); // "all", "documents", "images", etc.
    const [openShareModal, setOpenShareModal] = useState(false);
    const [files, setFiles] = useState([]);
    
    const user = useUserStore((s) => s.user);
    const hydrated = useUserStore((s) => s.hydrated);
    const url = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const toast = useAppToast();

    useEffect(() => {
        const checkUser = async () => {
            if (hydrated && !user) {
                navigate("/login", { replace: true });
            }
        };
        checkUser();
    }, [user, hydrated, navigate]);

    const fetchSharedFiles = async () =>{
        try {
            // Only fetch files shared BY me (not share to me)
            const result = await axios.get(`${url}/api/sf/shared-by-me`, {
                params: {userId: user?.UserId}, 
                withCredentials:true
            });
            
          
            const mappedFiles = (result.data.files || []).map(file => ({
                ...file,
                sharedWith: file.sharedWith,
                sharedDate: file.createDate,
                permissions: 'View' 
            }));
            
            setSharedFiles(mappedFiles);
            setFilteredFiles(mappedFiles);
        }catch (error) {
            console.error("Error fetching shared files:", error);
            toast.error("Failed to load shared files: " + error.message);
        }
    }

    const fetchAllFiles = async () => {
        try {
            const response = await axios.get(`${url}/api/files/list`, {
                params: { userId: user?.UserId },
                withCredentials: true
            });

            setFiles(response.data.files);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    useEffect(() => {
        if (user?.UserId) {
            fetchSharedFiles();
            fetchAllFiles();
        }
    }, [user?.UserId]);

    const handleSort = (sortType) => {
        setSortBy(sortType);
        let sorted = [...filteredFiles];
        
        switch (sortType) {
            case "name":
                sorted.sort((a, b) => a.filename.localeCompare(b.filename));
                break;
            case "date":
                sorted.sort((a, b) => new Date(b.sharedDate) - new Date(a.sharedDate));
                break;
            default:
                break;
        }
        
        setFilteredFiles(sorted);
    };

    const handleFilterType = (type) => {
        setFilterType(type);
        
        if (type === "all") {
            setFilteredFiles(sharedFiles);
        } else {
            const filtered = sharedFiles.filter(file => {
                if (type === "folders" && file.itemType === "directory") return true;
                if (type === "documents" && file.filetype?.includes("document")) return true;
                if (type === "images" && file.filetype?.startsWith("image/")) return true;
                if (type === "spreadsheets" && file.filetype?.includes("sheet")) return true;
                return false;
            });
            setFilteredFiles(filtered);
        }
    };

    const handleFileClick = (file) => {

        
        if (file.itemType === "directory") {
            toast.warning("Folder viewing is unsupport!");
            return;
        }
        
        // For shared files, navigate to share route with permission
        const isEditable = file.filetype?.startsWith('text/') || 
            file.filetype === 'application/javascript' || 
            file.filetype === 'application/json' || 
            file.filetype === 'text/html' || 
            file.filetype === 'text/css';
        
        const viewType = isEditable ? 'editor' : 'viewer';
        
        // Map permission: 'r'=View, 'w'=Edit, 'x'=Execute
        const permissionCode = file.permission || 'r';
        
        const targetUrl = `/view/${viewType}/share/${permissionCode}/${file.FileId}/${encodeURIComponent(file.filename)}`;
        
        // Navigate to: /view/{editor|viewer}/share/{permission}/{fileId}/{filename}
      
        navigate(targetUrl, { replace: false });
        
    
    };

    const handleRemoveAccess = async (file) => {
        try {
            // Remove the share entry (public link becomes invalid)
            await axios.delete(`${url}/api/sf/share`, {
                data: {
                    fileId: file.FileId,
                    UserId: file.recipientId
                },
                withCredentials: true
            });
            
            toast.success("Share link removed successfully");
            fetchSharedFiles(); // Refresh the list
        } catch (error) {
            console.error("Error removing share:", error);
            toast.error("Failed to remove share: " + error.message);
        }
    };

    return (
        <div className="w-full h-full bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            My Shared Files
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                            Manage and share files with public links
                        </p>
                    </div>

                    
                    <button 
                        className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
                        onClick={() => setOpenShareModal(true)}
                    >
                        <Share2 size={18} />
                        <span>Share File</span>
                    </button>
                </div>
            </div>
            
            <div className="mt-4 border-l-4 border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 p-4 mb-6 flex flex-row items-center">
                <IoWarning className="inline-block mr-2 w-10 h-10 text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    The shared files are all in <strong>Public View Mode</strong> only. Please ensure you do not share <strong>sensitive information.</strong>
                </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg">
                {/* View Toggle */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsGridView(true)}
                        className={`p-2 rounded transition-colors ${
                            isGridView
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                    >
                        <Grid size={20} />
                    </button>
                    <button
                        onClick={() => setIsGridView(false)}
                        className={`p-2 rounded transition-colors ${
                            !isGridView
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                    >
                        <LayoutList size={20} />
                    </button>
                </div>
                

                {/* Sort and Filter */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Sort Dropdown */}
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 flex-1 sm:flex-initial justify-between sm:justify-start">
                                <span>Sort by {sortBy === "name" ? "Name" : sortBy === "date" ? "Date" : "Shared By"}</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content className="min-w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 z-50">
                                <DropdownMenu.Item
                                    className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer outline-none"
                                    onClick={() => handleSort("name")}
                                >
                                    Sort by Name
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                    className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer outline-none"
                                    onClick={() => handleSort("date")}
                                >
                                    Sort by Date
                                </DropdownMenu.Item>

                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>

                    {/* Filter Dropdown */}
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 flex-1 sm:flex-initial justify-between sm:justify-start">
                                <span>All file types</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content className="min-w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 z-50">
                                <DropdownMenu.Item
                                    className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer outline-none"
                                    onClick={() => handleFilterType("all")}
                                >
                                    All Types
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                    className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer outline-none"
                                    onClick={() => handleFilterType("folders")}
                                >
                                    Folders
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                    className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer outline-none"
                                    onClick={() => handleFilterType("documents")}
                                >
                                    Documents
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                    className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer outline-none"
                                    onClick={() => handleFilterType("images")}
                                >
                                    Images
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                    className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer outline-none"
                                    onClick={() => handleFilterType("spreadsheets")}
                                >
                                    Spreadsheets
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>
            </div>

        

            {/* File List */}
            {filteredFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 sm:py-24">
                    <Share2 className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No shared files yet
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center max-w-md">
                        Share files to generate public links that anyone can access
                    </p>
                </div>
            ) : (
                <>
                    {/* Grid View */}
                    {isGridView ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredFiles.map((file) => (
                                <div
                                    key={file.FileId}
                                    onClick={() => handleFileClick(file)}
                                    className="relative group p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-all cursor-pointer"
                                >
                                    {/* Dropdown Menu */}
                                    <DropdownMenu.Root>
                                        <DropdownMenu.Trigger asChild>
                                            <button
                                                onClick={(e) => e.stopPropagation()}
                                                className="absolute top-2 right-2 p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
                                            >
                                                <MoreVertical size={16} className="text-gray-600 dark:text-gray-400" />
                                            </button>
                                        </DropdownMenu.Trigger>
                                        <DropdownMenu.Portal>
                                            <DropdownMenu.Content className="min-w-[180px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 z-50">
                                                <DropdownMenu.Item
                                                    className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer outline-none"
                                                    onClick={(e) => { e.stopPropagation(); handleFileClick(file); }}
                                                >
                                                    {file.permissions === "Edit" ? <><Edit size={16} className="inline mr-2" />Edit</> : <><Eye size={16} className="inline mr-2" />View</>}
                                                </DropdownMenu.Item>
                                                <DropdownMenu.Item
                                                    className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer outline-none"
                                                    onClick={(e) => { e.stopPropagation(); handleRemoveAccess(file); }}
                                                >
                                                    Remove Access
                                                </DropdownMenu.Item>
                                            </DropdownMenu.Content>
                                        </DropdownMenu.Portal>
                                    </DropdownMenu.Root>

                                    {/* File Icon */}
                                    <div className="flex justify-center mb-3">
                                        {file.itemType === "directory" ? (
                                            <Folder className="w-12 h-12 text-blue-500" fill="#93c5fd" />
                                        ) : (
                                            <GetIconByFileType filetype={file.filetype} size={48} />
                                        )}
                                    </div>

                                    {/* File Name */}
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 truncate text-center">
                                        {file.filename}
                                    </h3>

                                    {/* Permission Badge */}
                                    <div className="flex justify-center">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            file.permissions === "Edit"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                        }`}>
                                            {file.permissions}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* List View */
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            {/* Table Header */}
                            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                                <div className="col-span-5">Name</div>
                                <div className="col-span-2 text-center">Permissions</div>
                            </div>

                            {/* Table Rows */}
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredFiles.map((file) => (
                                    <div
                                        key={file.FileId}
                                        onClick={() => handleFileClick(file)}
                                        className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 md:px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors relative"
                                    >
                                        {/* File Name with Icon */}
                                        <div className="col-span-1 md:col-span-5 flex items-center gap-3">
                                            {file.itemType === "directory" ? (
                                                <Folder className="w-8 h-8 text-blue-500 shrink-0" fill="#93c5fd" />
                                            ) : (
                                                <GetIconByFileType filetype={file.filetype} size={32} />
                                            )}
                                            <span className="font-medium text-gray-900 dark:text-white truncate">
                                                {file.filename}
                                            </span>
                                        </div>

                                        {/* Permissions */}
                                        <div className="col-span-1 md:col-span-2 flex items-center justify-start md:justify-center md:pl-0 pl-11">
                                            <span className={`px-3 py-1 text-xs rounded-full ${
                                                file.permissions === "Edit"
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                            }`}>
                                                {file.permissions}
                                            </span>
                                        </div>

                                        {/* Dropdown Menu */}
                                        <DropdownMenu.Root>
                                            <DropdownMenu.Trigger asChild>
                                                <button
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="absolute top-4 right-4 p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                >
                                                    <MoreVertical size={16} className="text-gray-600 dark:text-gray-400" />
                                                </button>
                                            </DropdownMenu.Trigger>
                                            <DropdownMenu.Portal>
                                                <DropdownMenu.Content className="min-w-[180px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 z-50">
                                                    <DropdownMenu.Item
                                                        className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer outline-none flex items-center gap-2"
                                                        onClick={(e) => { e.stopPropagation(); handleFileClick(file); }}
                                                    >
                                                        {file.permissions === "Edit" ? <><Edit size={16} />Edit</> : <><Eye size={16} />View</>}
                                                    </DropdownMenu.Item>
                                                    <DropdownMenu.Item
                                                        className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer outline-none"
                                                        onClick={(e) => { e.stopPropagation(); handleRemoveAccess(file); }}
                                                    >
                                                        Remove Access
                                                    </DropdownMenu.Item>
                                                </DropdownMenu.Content>
                                            </DropdownMenu.Portal>
                                        </DropdownMenu.Root>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            <FileProcess
                user={user}
                allFiles = {files}
                onFileChange={fetchSharedFiles}
                openShareModal={openShareModal}
                setOpenShareModal={setOpenShareModal}
            />

            

        </div>
    );
}
