import { Grid, LayoutList, FolderUp, Upload, Plus, FileX2Icon, File } from "lucide-react"

import { GetIconByFileType } from "../utils/file-icon";
import { useEffect, useState } from "react";
import { useUserStore } from "../stores/userstore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import localdate from "../utils/dateModi.js";
import FileProcess from "../components/fileProcess";
import SearchBar from "../components/SearchBar";
import {ContextMenu} from "radix-ui";
import useHandleFileEdit from "../utils/edit-view-routes.jsx";

export default function Files() {
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [files, setFiles] = useState([]);
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [isGridView, setIsGridView] = useState(true);
    const user = useUserStore((s) => s.user);
    const url = import.meta.env.VITE_API_URL;
    const handleFileEdit = useHandleFileEdit();

    // Handle search results from SearchBar component
    const handleSearchResults = (results) => {
        setFilteredFiles(results);
    };

    const fetchFiles = async () => {
        try {
            const response = await axios.get(`${url}/api/files/list`, {
                params: { userId: user?.UserId },
                withCredentials: true
            });
            setFiles(response.data.files);
            setFilteredFiles(response.data.files); // Initialize filtered files
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [user?.UserId]);

    const handleFileClick = (file) => {
        setSelectedFile(file);
        setDetailsModalOpen(true);
    };




    return (
        <div className="p-4  dark:bg-[#101922] h-full w-full bg-white">
            
            <nav className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-4">
                
                <SearchBar
                    data={files}
                    searchFields={['filename', 'filetype']}
                    onSearchResults={handleSearchResults}
                    placeholder="Search files by name or type..."
                    className="sm:flex-1"
                />
               
                <div className="flex flex-row gap-2 sm:gap-3 mt-2 sm:mt-0">
                    <button className="bg-[#3f8cee] rounded-lg text-white font-semibold px-4 py-2 sm:px-6 sm:py-2.5 hover:opacity-80 transition-all duration-150 ease-in-out cursor-pointer text-sm whitespace-nowrap flex flex-row gap-3" onClick={()=>{ setUploadModalOpen(true);}}>
                        <Upload/>Upload File
                    </button>
                    <button className="bg-[#233648] rounded-lg text-white font-semibold px-4 py-2 sm:px-6 sm:py-2.5 hover:opacity-80 transition-all duration-150 ease-in-out cursor-pointer text-sm whitespace-nowrap flex flex-row gap-3">
                        <FolderUp/>Create Folder
                    </button>
                    <button className="bg-[#28a745] rounded-lg text-white font-semibold px-4 py-2 sm:px-6 sm:py-2.5 hover:opacity-80 transition-all duration-150 ease-in-out cursor-pointer text-sm whitespace-nowrap flex flex-row gap-3" onClick={()=>{setAddModalOpen(true)}}>
                        <Plus/>New File
                    </button>
                </div>
            </nav>
            <hr className="border-gray-300 dark:border-gray-700 mb-4"/>

            {/* Files Display Area */}
            <div className="mt-4 p-4">
                <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
                    My Files 
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                        ({filteredFiles.length} {filteredFiles.length === 1 ? 'file' : 'files'})
                    </span>
                </h2>
                <div className="flex flex-row justify-between items-center gap-2 mb-4">
                    <div className="text-gray-600 dark:text-gray-400 text-sm">MyFiles /</div>
                    <div className="flex flex-row gap-2 justify-center items-center align-middle">
                        <button className={`rounded-lg ${isGridView && 'bg-[#233658]' } h-10 w-10 items-center align-middle justify-center flex`} onClick={() => setIsGridView(true)}><Grid size={25} color="white"/> </button>
                        <button className={`rounded-lg ${!isGridView && 'bg-[#233658]' } h-10 w-10 items-center align-middle justify-center flex`} onClick={() => setIsGridView(false)}><LayoutList size={25} className="dark:text-white text-black"/></button>
                    </div>
                </div>

                {filteredFiles.length === 0 ? (
                    <div className="text-center py-12">
                        <FileX2Icon size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-600"/>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No files found</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Try adjusting your search query</p>
                    </div>
                ) : (
                <div className={`${isGridView ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4' : 'flex flex-col gap-4'}`}>
                            {filteredFiles.map((file) => {
                                const displayName = file.filename.length > (isGridView ? 10 : 20) 
                                        ? file.filename.slice(0, isGridView ? 10 : 20) + "..." 
                                        : file.filename;

                                return (
                                    <ContextMenu.Root key={file.FileId}>
                                        <ContextMenu.Trigger> 
                                            <div 
                                                onClick={()=>{handleFileClick(file)}} 
                                                className={`p-3 sm:p-4 border bg-gray-50 dark:bg-[#101922] border-gray-300 dark:border-gray-700 
                                                            rounded-lg flex ${isGridView ? 'flex-col justify-center' : 'flex-row justify-between'} gap-2 items-center 
                                                            hover:shadow-md transition-shadow cursor-pointer`}
                                            >
                                                <div className="w-12 h-12 sm:w-14 sm:h-14">
                                                    {<GetIconByFileType filetype={file.filetype} size={40}/> || <File color="#9ca3af" size={40} className="sm:w-12 sm:h-12"/>}
                                                </div>

                                                <h3 className="font-semibold text-black dark:text-white text-sm sm:text-base text-center break-all">
                                                    {displayName}
                                                </h3>

                                                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm text-center">
                                                    Modified: {localdate(file.lastModified)}
                                                </p>
                                                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                                                    Size: {(file.filesize / 1024).toFixed(2)} KB
                                                </p>
                                            </div>
                                        </ContextMenu.Trigger>
                                        
                                        <ContextMenu.Portal>
                                            <ContextMenu.Content
                                                className="min-w-[220px] overflow-hidden rounded-md bg-white dark:bg-[#1b1b1b] p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,23,24,0.35),0px_10px_20px_-15px_rgba(22,23,24,0.2)] border border-gray-300 dark:border-white"
                                                sideOffset={5}
                                                align="end"
                                            >
                                                <ContextMenu.Item 
                                                    className="dark:text-white text-xl text-black relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-disabled:pointer-events-none data-highlighted:bg-[#242424] data-disabled:text-mauve8 data-highlighted:text-white" 
                                                    onClick={()=>{handleFileEdit(file)}}
                                                >
                                                    Edit/View
                                                </ContextMenu.Item>
                                                <ContextMenu.Item 
                                                    className="text-red-500 text-xl font-semibold relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-disabled:pointer-events-none data-highlighted:bg-[#242424] data-disabled:text-mauve8 data-highlighted:text-white" 
                                                    onClick={()=>{setDeleteModalOpen(true); setSelectedFile(file)}}
                                                >
                                                    Delete
                                                </ContextMenu.Item>
                                            </ContextMenu.Content>
                                        </ContextMenu.Portal>
                                    </ContextMenu.Root>
                                );
                            })}
                        </div>
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
            />


        </div>

    )
}