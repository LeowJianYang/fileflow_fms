
import { useEffect, useState } from "react"
import axios from "axios";
import { useUserStore } from "../stores/userstore";
import { useParams,useNavigate } from "react-router-dom";

export default function ViewSide({currentFile}) {
    
    const user = useUserStore((s) => s.user);
    const url = import.meta.env.VITE_API_URL;
    const [files, setFiles] = useState([]);
    const [tab, setTab] = useState(currentFile);
    const navigate = useNavigate();

    useEffect(()=>{

        const fetchFiles = async () => {
            try {
                const response = await axios.get(`${url}/api/files/list`, {
                    params: { userId: user?.UserId },
                    withCredentials: true
                });
                // console.log("Fetched files:", response.data.files);
                setFiles(response.data.files);
            } catch (error) {
                console.error("Error fetching files:", error);
            }
        };

        fetchFiles();
    }, [user?.UserId]);

    const handleChangeFile = (file) => {
        if (file.filetype.startsWith('text/') || file.filetype === 'application/javascript' || file.filetype === 'application/json' || file.filetype === 'text/html' || file.filetype === 'text/css'){
            navigate(`/view/editor/${encodeURIComponent(file.FileId)}`);
        } else {
            navigate(`/view/viewer/${encodeURIComponent(file.FileId)}`);
        }
    }

    return (
        <aside className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
             <h3 className="text-xl font-bold p-2 dark:text-white text-black mt-6">Files</h3>
             <hr className="border-gray-300 dark:border-gray-700" />

            <div className="p-4 flex flex-col gap-4">
               {files.map((file) => {
                    const displayName = file.filename.length > 10 
                                        ? file.filename.slice(0, 20) + "..." 
                                        : file.filename;
                     return(
                        <div key={file.FileId} className={`flex flex-row items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer p-2 
                        ${tab === file.FileId ? 'bg-blue-500 text-white dark:bg-blue-600' 
                                : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}
                            transition-colors duration-200`} onClick={() => {setTab(file.FileId), handleChangeFile(file)}}>
                            <span className="text-sm font-semibold p-2 dark:text-gray-300 text-black">{displayName}</span>
                        </div>
                    );
               })}  
            </div>

        </aside>
    )
}