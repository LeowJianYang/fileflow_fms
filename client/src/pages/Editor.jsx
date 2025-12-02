import { useParams,useNavigate } from "react-router-dom";
import ViewSide, { ViewNavBar } from "../components/ViewSide";
import EditorTypes from "../components/EditorSetup";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useUserStore } from "../stores/userstore";
import { Menu, X } from "lucide-react";
import { useAppToast } from "../utils/use-toast.jsx";


export default function FileEditor() {
  const url = import.meta.env.VITE_API_URL;
  const { filename, fileUtm } = useParams();
  const decoded = decodeURIComponent(filename);
  const decodedFileName = decodeURIComponent(fileUtm);
  const user = useUserStore((s) => s.user);
  const hydrated = useUserStore((s) => s.hydrated);

  const [fileContent, setFileContent] = useState("");
  const [mime, setMime] = useState("");
  const [files, setFiles] = useState([]);
  const [currentFileData, setCurrentFileData] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const editorRef = useRef(null);

  //Check user
  const navigate = useNavigate();
  const  toast  = useAppToast();
     useEffect(() => {
         
        const checkUser = async () =>{
            if (hydrated && !user) {
                navigate("/login", {replace: true});
            }
        }

        checkUser();    

    }, [user, hydrated, navigate]);


  // Fetch file 
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`${url}/api/files/list`, {
          params: { userId: user?.UserId },
          withCredentials: true
        });
        setFiles(response.data.files);
        
       
        const current = response.data.files.find(f => f.FileId === parseInt(decoded));
        setCurrentFileData(current);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    if (user?.UserId) {
      fetchFiles();
    }
  }, [user?.UserId, decoded]);


  useEffect(() => {
    const fetchFileContent = async () => {
      try {
        const res = await axios.get(`${url}/api/files/${decoded}`, { withCredentials: true });
        setFileContent(res.data.content);
        setMime(res.data.type);
      } catch (err) {
        console.error("Error fetching file content:", err);
      }
    };
    fetchFileContent();
  }, [decoded]);


  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  
  function handleEditorChange(value) {
    setFileContent(value);
  }


  return (
    <div className="flex flex-col h-screen w-full bg-gray-100 dark:bg-[#0b131a]">
      <ViewNavBar 
        currentFile={decodedFileName} 
        FileId={decoded} 
        newContent={fileContent} 
        fileMetadata={currentFileData}
      />

      {/* Mobile*/}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-30 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors"
        aria-label="Open files menu"
      >
        <Menu size={24} />
      </button>

      {/* Aside and Editor */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Desktop Aside */}
        <div className="hidden lg:block">
          <ViewSide 
            currentFile={decoded} 
            files={files}
          />
        </div>

        {/* Mobile*/}
        <>
          {/* Overlay */}
          <div 
            className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 lg:hidden ${
              isDrawerOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setIsDrawerOpen(false)}
          />
          
          {/* Drawer*/}
          <div className={`lg:hidden fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
            isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="p-4 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold dark:text-white text-black">Files</h3>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div className="h-[calc(100%-64px)] overflow-hidden">
              <ViewSide 
                currentFile={decoded} 
                files={files}
                showHeader={false}
              />
            </div>
          </div>
        </>

        {/* Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white truncate">
              Editing: {decodedFileName}
            </h1>
          </div>
          <div className="flex-1 overflow-auto">
            <EditorTypes
              mime={mime}
              content={fileContent}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
