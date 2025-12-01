
import {  useState } from "react"
import axios from "axios";
import { useUserStore } from "../stores/userstore";
import { useNavigate } from "react-router-dom";
import { ArrowLeft,Info,X } from "lucide-react";
import localdate from "../utils/dateModi";

export default function ViewSide({currentFile, files = [], showHeader = true}) {
    
    const [tab, setTab] = useState(currentFile);
    const navigate = useNavigate();

    const handleChangeFile = (file) => {
        if (file.filetype.startsWith('text/') || file.filetype === 'application/javascript' || file.filetype === 'application/json' || file.filetype === 'text/html' || file.filetype === 'text/css'){
            navigate(`/view/editor/${encodeURIComponent(file.FileId)}/${encodeURIComponent(file.filename)}`);
        } else {
            navigate(`/view/viewer/${encodeURIComponent(file.FileId)}/${encodeURIComponent(file.filename)}`);
        }
    }

    return (
        <aside className="w-full lg:w-64 xl:w-72 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden">
             {showHeader && (
                <div className="p-4 border-b border-gray-300 dark:border-gray-700">
                    <h3 className="text-lg sm:text-xl font-bold dark:text-white text-black">Files</h3>
                </div>
             )}

            <div className="p-3 sm:p-4 flex flex-col gap-2 overflow-y-auto flex-1">
               {files.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No files available</p>
               ) : (
                   files.map((file) => {
                        const displayName = file.filename.length > 20 
                                            ? file.filename.slice(0, 20) + "..." 
                                            : file.filename;
                         return(
                            <div 
                                key={file.FileId} 
                                className={`flex flex-row items-center gap-2 rounded-lg cursor-pointer p-3 transition-colors duration-200
                                ${tab === file.FileId 
                                    ? 'bg-blue-500 text-white dark:bg-blue-600' 
                                    : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`} 
                                onClick={() => {setTab(file.FileId); handleChangeFile(file);}}
                            >
                                <span className={`text-xs sm:text-sm font-semibold truncate ${tab === file.FileId ? 'text-white' : 'text-black dark:text-gray-300'}`}>
                                    {displayName}
                                </span>
                            </div>
                        );
                   })
               )}  
            </div>
        </aside>
    )
}


export function ViewNavBar({currentFile, FileId, newContent, fileMetadata}) {
    const navigate = useNavigate();
    const url = import.meta.env.VITE_API_URL; 
    const user = useUserStore((s) => s.user);
    const [infopanel, setInfoPanel] = useState(false);

    const openInfoPanel = () => {
        setInfoPanel(true);
    };

    const handleSaveFiles = async (fileId)=>{
       await axios.post(`${url}/api/files/save-editor`,{userId: user?.UserId, fileId: fileId, newContent: newContent}, {withCredentials:true}).then((res)=>{
            console.log("File saved successfully:", res.data);
        }).catch((err)=>{
            console.error("Error saving file:", err);
        });
    };

    

    return (
        <nav className="w-full h-auto sm:h-16 bg-gray-200 dark:bg-gray-800 flex flex-col sm:flex-row items-center justify-between px-4 py-3 sm:py-0 shadow-md gap-3 sm:gap-0">
            {/* FILE NAME*/}
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <ArrowLeft 
                    className="cursor-pointer text-black dark:text-white hover:text-blue-500 transition-all duration-150 ease-in-out shrink-0" 
                    size={24}
                    onClick={() => navigate(-1)} 
                />        
                <div className="flex flex-col gap-1 min-w-0">
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-black dark:text-white">File Viewer/Editor</h1>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate max-w-[200px] sm:max-w-none">{currentFile}</p>
                </div>
            </div>
            
            {/* BUTTONS */}
            <div className="flex flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-end items-center">
                <button 
                    className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-xl sm:rounded-xl text-center font-bold text-base sm:text-xl transition-colors" 
                    onClick={()=>{handleSaveFiles(FileId)}}
                >
                    Save
                </button>
                { fileMetadata && fileMetadata.filetype == 'text/markdown' &&
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-xl sm:rounded-xl text-center font-bold text-base sm:text-xl transition-colors
                    " onClick={()=>{ navigate(`/view/viewer/${encodeURIComponent(fileMetadata.FileId)}/${encodeURIComponent(fileMetadata.filename)}`)}}>
                        View Markdown
                    </button>}
                <div className="hidden sm:block w-px h-6 bg-gray-400 dark:bg-gray-600"></div>
                <Info 
                    className="cursor-pointer text-black dark:text-white hover:text-blue-500 transition-colors duration-150 ease-in-out shrink-0" 
                    size={24}
                    onClick={()=>{openInfoPanel()}}
                />
            </div>
            
            {/* Info Panel */}
            <>
                {/* Overlay */}
                <div 
                    className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
                        infopanel ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                    onClick={() => setInfoPanel(false)}
                />
                
                {/* Drawer */}
                <div className={`fixed top-0 right-0 w-80 sm:w-96 h-full bg-white dark:bg-gray-900 shadow-2xl p-6 overflow-y-auto z-50 border-l border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${
                    infopanel ? 'translate-x-0' : 'translate-x-full'
                }`}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-black dark:text-white">File Info</h2>
                        <X
                            className="cursor-pointer text-black dark:text-white hover:text-red-500 transition-colors duration-150 ease-in-out"
                            size={24}
                            onClick={() => setInfoPanel(false)}
                        />
                    </div>
                    <hr className="mb-6 border-gray-300 dark:border-gray-700"/>
                        
                        {fileMetadata ? (
                            <>
                                <div className="mb-6">
                                    <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-3">Properties</p>    
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-row justify-between">
                                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">File Name</p>
                                            <p className="text-base text-black dark:text-white break-all">{fileMetadata.filename}</p>
                                        </div>
                                        
                                        <div className="flex flex-row justify-between">
                                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Type</p>
                                            <p className="text-base text-black dark:text-white">{fileMetadata.filetype}</p>
                                        </div>
                                        
                                        <div className="flex flex-row justify-between">
                                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Size</p>
                                            <p className="text-base text-black dark:text-white">{fileMetadata.filesize ? `${(fileMetadata.filesize / 1024).toFixed(2)} KB` : 'N/A'}</p>
                                        </div>
                                        
                                        <div className="flex flex-row justify-between">
                                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Last Modified</p>
                                            <p className="text-base text-black dark:text-white">{localdate(fileMetadata.lastModified)}</p>
                                        </div>

                                        
                                        

                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">Loading file information...</p>
                        )}
                </div>
            </>
        </nav>

    );
}