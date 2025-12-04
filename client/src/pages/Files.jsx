import { Grid, LayoutList, FolderUp, Upload, Plus, FileX2Icon, File, Folder, MoreVertical } from "lucide-react"

import { GetIconByFileType } from "../utils/file-icon.jsx";
import { useEffect, useState } from "react";
import { useUserStore } from "../stores/userstore.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import localdate from "../utils/dateModi.js";
import FileProcess from "../components/fileProcess.jsx";
import SearchBar from "../components/SearchBar.jsx";
import * as ContextMenu from "@radix-ui/react-context-menu";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import useHandleFileEdit from "../utils/edit-view-routes.jsx";
import { useAppToast } from "../utils/use-toast.jsx";
import { IoWarning } from "react-icons/io5";

export default function Files() {
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [_files, setFiles] = useState([]);
    const [_directories, setDirectories] = useState([]);
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [isGridView, setIsGridView] = useState(true);
    const [createFolderOpen, setCreateFolderOpen] = useState(false);
    const [currentDirId, setCurrentDirId] = useState(null);
    const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: 'My Files' }]);
    const user = useUserStore((s) => s.user);
    const hydrated = useUserStore((s) => s.hydrated);
  

    const url = import.meta.env.VITE_API_URL;
    const handleFileEdit = useHandleFileEdit();

    // Handle search results from SearchBar component
    const handleSearchResults = (results) => {
        setFilteredItems(results);
    };

  const navigate = useNavigate();
  const toast = useAppToast();
  
    useEffect(() => {
         
        const checkUser = async () =>{
            if (hydrated && !user) {
                navigate("/login", {replace: true});
            }
        }

        checkUser();    

    }, [user, hydrated, navigate]);

    const handleFileDownload = async (item) => {
        try {
            const response = await axios.get(`${url}/api/files/download/${item.FileId}`, {responseType:'blob', withCredentials:true});
            const urlink = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');

            link.href = urlink;
            link.setAttribute('download', item.filename);
            document.body.appendChild(link);
            link.click();
            toast.success('Download started');
            window.URL.revokeObjectURL(urlink);
            document.body.removeChild(link);
        }
        catch (error){
            console.error("Error downloading file:", error);
            toast.error('Error downloading file');
        }
    }

    const fetchFiles = async () => {
        try {
            const response = await axios.get(`${url}/api/files/list`, {
                params: { userId: user?.UserId },
                withCredentials: true
            });
            
            const filesData = response.data.files || [];
            const dirsData = response.data.directories || [];
            
            setFiles(filesData);
            setDirectories(dirsData);
            
            // Filter items based on current directory
            const currentDirFiles = filesData.filter(file => 
                currentDirId === null ? !file.dirId : file.dirId === currentDirId
            );
            const currentDirFolders = dirsData.filter(dir => 
                currentDirId === null ? !dir.parentDirId : dir.parentDirId === currentDirId
            );
            
            // Mark items as file or directory and combine them
            const markedFiles = currentDirFiles.map(f => ({ ...f, itemType: 'file' }));
            const markedDirs = currentDirFolders.map(d => ({ ...d, itemType: 'directory' }));
            const combined = [...markedDirs, ...markedFiles];
            
            setItems(combined);
            setFilteredItems(combined);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    useEffect(() => {
        if (user?.UserId) {
            fetchFiles();
        }
    }, [user?.UserId, currentDirId]);

    const handleItemClick = (item) => {
        if (item.itemType === 'directory') {
            // Navigate into directory
            enterDirectory(item);
            
        } else {
            // Open file details
            setSelectedFile(item);
            setDetailsModalOpen(true);
        }
    };

    const enterDirectory = (dir) => {
        setCurrentDirId(dir.dirId);
        setBreadcrumbs([...breadcrumbs, { id: dir.dirId, name: dir.dirName }]);
    };

    const navigateToBreadcrumb = (index) => {
        const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
        setBreadcrumbs(newBreadcrumbs);
        setCurrentDirId(newBreadcrumbs[newBreadcrumbs.length - 1].id);
    };




    return (
        <div className="p-4  dark:bg-[#101922] h-full w-full bg-white">
            
            <nav className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-4">
                
                <SearchBar
                    data={items}
                    searchFields={['filename', 'filetype', 'dirName']}
                    onSearchResults={handleSearchResults}
                    placeholder="Search files and folders..."
                    className="sm:flex-1"
                />
               
                {/* Desktop View - Show all buttons */}
                <div className="hidden sm:flex flex-row gap-2 sm:gap-3 mt-2 sm:mt-0">
                    <button className="bg-[#3f8cee] rounded-lg text-white font-semibold px-4 py-2 sm:px-6 sm:py-2.5 hover:opacity-80 transition-all duration-150 ease-in-out cursor-pointer text-sm whitespace-nowrap flex flex-row gap-3" onClick={()=>{ setUploadModalOpen(true);}}>
                        <Upload/>Upload File
                    </button>
                    <button className="bg-[#233648] rounded-lg text-white font-semibold px-4 py-2 sm:px-6 sm:py-2.5 hover:opacity-80 transition-all duration-150 ease-in-out cursor-pointer text-sm whitespace-nowrap flex flex-row gap-3" onClick={()=>{setCreateFolderOpen(true)}}>
                        <FolderUp/>Create Folder
                    </button>
                    <button className="bg-[#28a745] rounded-lg text-white font-semibold px-4 py-2 sm:px-6 sm:py-2.5 hover:opacity-80 transition-all duration-150 ease-in-out cursor-pointer text-sm whitespace-nowrap flex flex-row gap-3" onClick={()=>{setAddModalOpen(true)}}>
                        <Plus/>New File
                    </button>
                </div>

                
                <div className="sm:hidden">
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className="bg-gray-200 dark:bg-gray-700 rounded-lg p-2.5 hover:opacity-80 transition-all duration-150 ease-in-out cursor-pointer">
                                <MoreVertical size={24} className="text-gray-900 dark:text-white" />
                            </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                className="min-w-[200px] bg-white dark:bg-[#1b1b1b] rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-1 z-50"
                                sideOffset={5}
                                align="end"
                            >
                                <DropdownMenu.Item
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded cursor-pointer outline-none"
                                    onClick={() => setUploadModalOpen(true)}
                                >
                                    <Upload size={18} className="text-blue-500" />
                                    <span className="font-medium">Upload File</span>
                                </DropdownMenu.Item>
                                
                                <DropdownMenu.Item
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer outline-none"
                                    onClick={() => setCreateFolderOpen(true)}
                                >
                                    <FolderUp size={18} className="text-gray-600 dark:text-gray-400" />
                                    <span className="font-medium">Create Folder</span>
                                </DropdownMenu.Item>
                                
                                <DropdownMenu.Item
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded cursor-pointer outline-none"
                                    onClick={() => setAddModalOpen(true)}
                                >
                                    <Plus size={18} className="text-green-600" />
                                    <span className="font-medium">New File</span>
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>
            </nav>
            <hr className="border-gray-300 dark:border-gray-700 mb-4"/>

            {/* Files Display Area */}
            <div className="mt-4 p-4">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
                    {breadcrumbs[breadcrumbs.length - 1].name}
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                        ({filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'})
                    </span>
                </h2>
                <div className="flex flex-row justify-between items-center gap-2 mb-4">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm overflow-x-auto">
                        {breadcrumbs.map((crumb, index) => (
                            <div key={index} className="flex items-center gap-1">
                                <button
                                    onClick={() => navigateToBreadcrumb(index)}
                                    className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
                                >
                                    {crumb.name}
                                </button>
                                {index < breadcrumbs.length - 1 && <span>/</span>}
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-row gap-2 justify-center items-center align-middle">
                        <button className={`rounded-lg ${isGridView && 'bg-[#233658]' } h-10 w-10 items-center align-middle justify-center flex`} onClick={() => setIsGridView(true)}><Grid size={25} className={`${isGridView ? 'text-white ' : 'text-black dark:text-white'}`}/> </button>
                        <button className={`rounded-lg ${!isGridView && 'bg-[#233658]' } h-10 w-10 items-center align-middle justify-center flex`} onClick={() => setIsGridView(false)}><LayoutList size={25} className={`${!isGridView ? 'text-white' : 'text-black dark:text-white'}`}/></button>
                    </div>
                </div>

                <div className="border-l-4 border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20 p-3 mb-6 rounded-md flex flex-col gap-2">
                    
                    <div className="flex flex-row items-center gap-4">
                        <IoWarning size={32} className="text-yellow-500 mb-2"/>
                        <p className="font-bold text-xl text-red-500">Warning</p>
                    </div>
               
                    <div>
                        
                        <p className="text-yellow-800 dark:text-yellow-200">
                            Due to the current issues, our services cannot maintain persistent storage. This project is considered for demonstration purposes only.<br/><br/>
                            <b>Please take note</b>: all data or files may be deleted or unavailable when the server or service is inactive.
                        </p>
                    </div>
                   
                </div>

                {filteredItems.length === 0 ? (
                    <div className="text-center py-12">
                        <FileX2Icon size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-600"/>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No items found</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Try adjusting your search query</p>
                    </div>
                ) : (
                <>
                {/* Grid View */}
                {isGridView ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                            {filteredItems.map((item) => {
                                const isDirectory = item.itemType === 'directory';
                                const displayName = isDirectory 
                                    ? (item.dirName.length > 10 
                                        ? item.dirName.slice(0, 10) + "..." 
                                        : item.dirName)
                                    : (item.filename.length > 10 
                                        ? item.filename.slice(0, 10) + "..." 
                                        : item.filename);

                                return (
                                    <ContextMenu.Root key={isDirectory ? `dir-${item.dirId}` : `file-${item.FileId}`}>
                                        <ContextMenu.Trigger> 
                                            <div 
                                                onClick={()=>{handleItemClick(item)}} 
                                                className={`p-3 sm:p-4 border ${isDirectory ? 'bg-blue-50 dark:bg-blue-950/20' : 'bg-gray-50 dark:bg-[#101922]'} border-gray-300 dark:border-gray-700 
                                                            rounded-lg flex flex-col justify-center gap-2 items-center 
                                                            hover:shadow-md transition-shadow cursor-pointer relative group`}
                                            >
                                                {/* Dropdown menu button */}
                                                <DropdownMenu.Root>
                                                    <DropdownMenu.Trigger asChild>
                                                        <button
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="absolute top-2 right-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
                                                        >
                                                            <MoreVertical size={18} className="text-gray-600 dark:text-gray-400" />
                                                        </button>
                                                    </DropdownMenu.Trigger>

                                                    <DropdownMenu.Portal>
                                                        <DropdownMenu.Content
                                                            className="min-w-[180px] bg-white dark:bg-[#1b1b1b] rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-1 z-50"
                                                            sideOffset={5}
                                                        >
                                                            {isDirectory ? (
                                                                <>
                                                                    <DropdownMenu.Item
                                                                        className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer outline-none"
                                                                        onClick={(e) => { e.stopPropagation(); enterDirectory(item); }}
                                                                    >
                                                                        Open Folder
                                                                    </DropdownMenu.Item>
                                                                    <DropdownMenu.Item
                                                                        className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer outline-none"
                                                                        onClick={(e) => { e.stopPropagation(); setDeleteModalOpen(true); setSelectedFile(item); }}
                                                                    >
                                                                        Delete
                                                                    </DropdownMenu.Item>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <DropdownMenu.Item
                                                                        className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer outline-none"
                                                                        onClick={(e) => { e.stopPropagation(); handleFileEdit(item); }}
                                                                    >
                                                                        Edit/View
                                                                    </DropdownMenu.Item>
                                                                    <DropdownMenu.Item
                                                                        className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer outline-none"
                                                                        onClick={(e) => { e.stopPropagation(); setDeleteModalOpen(true); setSelectedFile(item); }}
                                                                    >
                                                                        Delete
                                                                    </DropdownMenu.Item>

                                                                    <DropdownMenu.Item
                                                                        className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer outline-none"
                                                                        onClick={(e) => { e.stopPropagation(); handleFileDownload(item); }}
                                                                    >
                                                                        Download
                                                                    </DropdownMenu.Item>
                                                                </>
                                                            )}
                                                        </DropdownMenu.Content>
                                                    </DropdownMenu.Portal>
                                                </DropdownMenu.Root>

                                                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
                                                    {isDirectory ? (
                                                        <Folder color="#3b82f6" fill="#93c5fd" size={40} />
                                                    ) : (
                                                        <GetIconByFileType filetype={item.filetype} size={40}/> || <File color="#9ca3af" size={40} className="sm:w-12 sm:h-12"/>
                                                    )}
                                                </div>
                                                
                                                {/* File Name */}
                                                <h3 className="font-semibold text-black dark:text-white text-sm sm:text-base text-center break-all">
                                                    {displayName}
                                                </h3>

                                                {!isDirectory && (
                                                    <>
                                                        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm text-center">
                                                            Modified: {localdate(item.lastModified)}
                                                        </p>
                                                        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                                                            Size: {(item.filesize / 1024).toFixed(2)} KB
                                                        </p>
                                                    </>
                                                )}
                                                {isDirectory && (
                                                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                                                        Folder
                                                    </p>
                                                )}
                                            </div>
                                        </ContextMenu.Trigger>
                                        
                                        <ContextMenu.Portal>
                                            <ContextMenu.Content
                                                className="min-w-[220px] overflow-hidden rounded-md bg-white dark:bg-[#1b1b1b] p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,23,24,0.35),0px_10px_20px_-15px_rgba(22,23,24,0.2)] border border-gray-300 dark:border-white"
                                                sideOffset={5}
                                                align="end"
                                            >
                                                {isDirectory ? (
                                                    <>
                                                        <ContextMenu.Item 
                                                            className="dark:text-white text-xl text-black relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-disabled:pointer-events-none data-highlighted:bg-[#242424] data-disabled:text-mauve8 data-highlighted:text-white" 
                                                            onClick={()=>{enterDirectory(item)}}
                                                        >
                                                            Open Folder
                                                        </ContextMenu.Item>
                                                        <ContextMenu.Item 
                                                            className="text-red-500 text-xl font-semibold relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-disabled:pointer-events-none data-highlighted:bg-[#242424] data-disabled:text-mauve8 data-highlighted:text-white" 
                                                            onClick={()=>{setDeleteModalOpen(true); setSelectedFile(item)}}
                                                        >
                                                            Delete
                                                        </ContextMenu.Item>
                                                    </>
                                                ) : (
                                                    <>
                                                        <ContextMenu.Item 
                                                            className="dark:text-white text-xl text-black relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-disabled:pointer-events-none data-highlighted:bg-[#242424] data-disabled:text-mauve8 data-highlighted:text-white" 
                                                            onClick={()=>{handleFileEdit(item)}}
                                                        >
                                                            Edit/View
                                                        </ContextMenu.Item>
                                                        <ContextMenu.Item 
                                                            className="text-red-500 text-xl font-semibold relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-disabled:pointer-events-none data-highlighted:bg-[#242424] data-disabled:text-mauve8 data-highlighted:text-white" 
                                                            onClick={()=>{setDeleteModalOpen(true); setSelectedFile(item)}}
                                                        >
                                                            Delete
                                                        </ContextMenu.Item>
                                                        <ContextMenu.Item 
                                                            className="dark:text-white text-xl text-black relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-disabled:pointer-events-none data-highlighted:bg-[#242424] data-disabled:text-mauve8 data-highlighted:text-white" 
                                                            onClick={()=>{handleFileDownload(item)}}
                                                        >
                                                            Download
                                                        </ContextMenu.Item>
                                                    </>
                                                )}
                                            </ContextMenu.Content>
                                        </ContextMenu.Portal>
                                    </ContextMenu.Root>
                                );
                            })}
                        </div>
                ) : (
                    /* Table View (List View) */ 
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-300 dark:border-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">Type</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">Modified</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">Size</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredItems.map((item) => {
                                        const isDirectory = item.itemType === 'directory';
                                        const displayName = isDirectory ? item.dirName : item.filename;
                                        
                                        return (
                                            <ContextMenu.Root key={isDirectory ? `dir-${item.dirId}` : `file-${item.FileId}`}>
                                                <ContextMenu.Trigger asChild>
                                                    <tr 
                                                        onClick={() => handleItemClick(item)}
                                                        className={`${isDirectory ? 'bg-blue-50/50 dark:bg-blue-950/10' : ''} hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors`}
                                                    >
                                                        {/* Name Column */}
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="shrink-0">
                                                                    {isDirectory ? (
                                                                        <Folder color="#3b82f6" fill="#93c5fd" size={24} />
                                                                    ) : (
                                                                        <GetIconByFileType filetype={item.filetype} size={24} /> || <File color="#9ca3af" size={24} />
                                                                    )}
                                                                </div>
                                                                <span className="font-medium text-gray-900 dark:text-white truncate max-w-xs" title={displayName}>
                                                                    {displayName}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        
                                                        {/* Type Column */}
                                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">
                                                            {isDirectory ? 'Folder' : item.filetype?.split('/')[1]?.toUpperCase() || 'File'}
                                                        </td>
                                                        
                                                        {/* Modified Column */}
                                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                                                            {isDirectory ? '-' : localdate(item.lastModified)}
                                                        </td>
                                                        
                                                        {/* Size Column */}
                                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                                                            {isDirectory ? '-' : `${(item.filesize / 1024).toFixed(2)} KB`}
                                                        </td>
                                                        
                                                        {/* Actions (Dropdown) Column */}
                                                        <td className="px-4 py-3 text-right">
                                                            <DropdownMenu.Root>
                                                                <DropdownMenu.Trigger asChild>
                                                                    <button
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                                    >
                                                                        <MoreVertical size={18} className="text-gray-600 dark:text-gray-400" />
                                                                    </button>
                                                                </DropdownMenu.Trigger>
                                                                
                                                                <DropdownMenu.Portal>
                                                                    <DropdownMenu.Content
                                                                        className="min-w-[180px] bg-white dark:bg-[#1b1b1b] rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-1 z-50"
                                                                        sideOffset={5}
                                                                    >
                                                                        {isDirectory ? (
                                                                            <>
                                                                                <DropdownMenu.Item
                                                                                    className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer outline-none"
                                                                                    onClick={(e) => { e.stopPropagation(); enterDirectory(item); }}
                                                                                >
                                                                                    Open Folder
                                                                                </DropdownMenu.Item>
                                                                                <DropdownMenu.Item
                                                                                    className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer outline-none"
                                                                                    onClick={(e) => { e.stopPropagation(); setDeleteModalOpen(true); setSelectedFile(item); }}
                                                                                >
                                                                                    Delete
                                                                                </DropdownMenu.Item>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <DropdownMenu.Item
                                                                                    className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer outline-none"
                                                                                    onClick={(e) => { e.stopPropagation(); handleFileEdit(item); }}
                                                                                >
                                                                                    Edit/View
                                                                                </DropdownMenu.Item>
                                                                                <DropdownMenu.Item
                                                                                    className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer outline-none"
                                                                                    onClick={(e) => { e.stopPropagation(); setDeleteModalOpen(true); setSelectedFile(item); }}
                                                                                >
                                                                                    Delete
                                                                                </DropdownMenu.Item>
                                                                            </>
                                                                        )}
                                                                    </DropdownMenu.Content>
                                                                </DropdownMenu.Portal>
                                                            </DropdownMenu.Root>
                                                        </td>
                                                    </tr>
                                                </ContextMenu.Trigger>
                                                
                                                <ContextMenu.Portal>
                                                    <ContextMenu.Content
                                                        className="min-w-[220px] overflow-hidden rounded-md bg-white dark:bg-[#1b1b1b] p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,23,24,0.35),0px_10px_20px_-15px_rgba(22,23,24,0.2)] border border-gray-300 dark:border-white"
                                                        sideOffset={5}
                                                        align="end"
                                                    >
                                                        {isDirectory ? (
                                                            <>
                                                                <ContextMenu.Item 
                                                                    className="dark:text-white text-xl text-black relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-disabled:pointer-events-none data-highlighted:bg-[#242424] data-disabled:text-mauve8 data-highlighted:text-white" 
                                                                    onClick={() => { enterDirectory(item); }}
                                                                >
                                                                    Open Folder
                                                                </ContextMenu.Item>
                                                                <ContextMenu.Item 
                                                                    className="text-red-500 text-xl font-semibold relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-disabled:pointer-events-none data-highlighted:bg-[#242424] data-disabled:text-mauve8 data-highlighted:text-white" 
                                                                    onClick={() => { setDeleteModalOpen(true); setSelectedFile(item); }}
                                                                >
                                                                    Delete
                                                                </ContextMenu.Item>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ContextMenu.Item 
                                                                    className="dark:text-white text-xl text-black relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-disabled:pointer-events-none data-highlighted:bg-[#242424] data-disabled:text-mauve8 data-highlighted:text-white" 
                                                                    onClick={() => { handleFileEdit(item); }}
                                                                >
                                                                    Edit/View
                                                                </ContextMenu.Item>
                                                                <ContextMenu.Item 
                                                                    className="text-red-500 text-xl font-semibold relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-disabled:pointer-events-none data-highlighted:bg-[#242424] data-disabled:text-mauve8 data-highlighted:text-white" 
                                                                    onClick={() => { setDeleteModalOpen(true); setSelectedFile(item); }}
                                                                >
                                                                    Delete
                                                                </ContextMenu.Item>
                                                            </>
                                                        )}
                                                    </ContextMenu.Content>
                                                </ContextMenu.Portal>
                                            </ContextMenu.Root>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                </>
                )}

            </div>
        
            {/* Modal (upload, create, details) */}
            <FileProcess
                user={user}
                onFileChange={fetchFiles}
                selectedFile={selectedFile}
                onFileEdit={handleFileEdit}
                uploadModalOpen={uploadModalOpen}
                setUploadModalOpen={setUploadModalOpen}
                addModalOpen={addModalOpen}
                setAddModalOpen={setAddModalOpen}
                detailsModalOpen={detailsModalOpen}
                setDetailsModalOpen={setDetailsModalOpen}
                deleteModalOpen={deleteModalOpen}
                setDeleteModalOpen={setDeleteModalOpen}
                createFolderOpen={createFolderOpen}
                setCreateFolderOpen={setCreateFolderOpen}
                currentDirId={currentDirId}
                isFolder={selectedFile?.itemType === 'directory'}
            />


        </div>

    )
}