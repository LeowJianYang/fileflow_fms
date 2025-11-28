import { useParams } from "react-router-dom";
import ViewSide from "../components/ViewSide";
import { Editor } from "@monaco-editor/react";
import { useState,useEffect } from "react";
import axios from "axios";

export default function FileEditor() {
    const url = import.meta.env.VITE_API_URL;
    const {filename} = useParams();
    const decoded = decodeURIComponent(filename);
    const [fileContent, setFileContent] = useState("");
    const [mime, setMime] = useState("");

    useEffect(()=>{
        const fetchFileContent = async () =>{
            try{
                const res =await axios.get(`${url}/api/files/${decoded}`, {withCredentials:true});

                setFileContent(res.data.content);
                setMime(res.data.type);
            } catch (err){
                console.error("Error fetching file content:", err);
            }
        }
        fetchFileContent();
    }, [decoded]);

    
  const EditorTypes = () =>{
        // File not loaded yet
  
  if (!mime) return <div className="p-4">Loading file...</div>;

  // Text-based file editor
  
  if (mime.startsWith("text/") || mime === "application/json")
    return (
      <div className="h-[80vh]">
        <Editor
          height="88vh"
          defaultLanguage={
            mime === "application/json"
              ? "json"
              : mime.replace("text/", "") || "plaintext"
          }
            defaultValue="// Your code here"
            value={fileContent}
            onChange={(value) => setFileContent(value)}
            theme="vs-dark"
            className="rounded-lg shadow-lg border border-gray-300 dark:border-gray-700"
            options={{ fontSize: 14 }}
        />
      </div>
    );
  }


  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-[#0b131a]">
      <ViewSide currentFile={decoded} />
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Editing File: {decoded}</h1>
                {/* Editor content goes here */}
                <EditorTypes />
            </div>
        </div>
    )



}