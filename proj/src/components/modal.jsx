/**
 * Modal Component - For FileFlow APP 
 * @author leowjy | NICE
 * @version 1.0.0-fflow
 * 
 */

import React from "react";
import {useState, useEffect} from "react";
import "../style/modal.css"
import axios from "axios";
import { Edit2Icon } from "lucide-react";


/**
 * Modal Button Component- Reusable Button for Modal Footer (Or Others)
 * @link https://npmjs.org/package/@leowjy/modal_js (Original Repo)
 * @param {string} param.type - Button type (primary, secondary, danger, dashed)
 * @param {function} param.onClick - onClick handler
 * @param {React.ReactNode} param.children - Button content
 * @param {boolean} param.disabled - Whether the button is disabled
 * @returns {React.ReactElement} Modal Button Component 
 */
export const ModalButton = ({type= "primary",onClick, children, disabled=false})=>{

    return (
        <button className={`btn ${type} dark:text-white text-black`} onClick={onClick} disabled={disabled}> 
            {children}
        </button>
    )
}


/**
 * An Modified Modal Component (Reusable) for FileFlow APP
 * @link https://npmjs.org/package/@leowjy/modal_js (Original Repo)
 * 
 * @param {string} param.title - Title of the modal
 * @param {function} param.onOk - Function to call on OK
 * @param {function} param.onCancel - Function to call on Cancel
 * @param {React.ReactNode} param.children - Content of the modal
 * @param {React.ReactElement} param.footer - Footer content or buttons
 * @param {boolean} param.open - Whether the modal is open
 * @param {boolean} param.multi - Whether the modal has multiple pages
 * @param {boolean} param.titleEdit - Whether the title is editable
 * @param {string} param.fileId - File ID for title update
 * @returns Modal Component
 */
export const ModalForm = ({title,onOk,onCancel,children,footer, open,multi, titleEdit=false, fileId})=>{
    const [visible, setVisible] = useState(false);
    const [page, setPage] = useState(0);
    const [titleEditable, setTitleEditable] = useState(false);
    const [titleState, setTitle] = useState(title);

    useEffect(()=>{
        if (open){
            setVisible(true)
            setPage(0)
        } 
        else{
            const timer= setTimeout(()=> setVisible(false),300)
            return ()=> clearTimeout(timer)
        } 
    },[open])

    useEffect(() => {
        setTitle(title);
    }, [title]);

    const handleUpdateTitle = async() => {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/files/up`, {Newtitle: titleState, fileId:fileId}, {withCredentials:true})
        .then((res) => {
            console.log("Title updated successfully:", res.data);
        })
        .catch((error) => {
            console.error("Error updating title:", error);
        });
    }

    if (!visible) return null;
        const pages =React.Children.toArray(children);
    
    return (
            <div className={`ModalOverlay ${open? "fade-in" : "fade-out"}`} >
                <div className={`ModalForm ${open? "pop-in" : "pop-out"} dark:bg-[#080c11] bg-white`}>
                    
                    <div>

                        {titleEditable && titleEdit ? (<input type="text" value={titleState} className="border border-gray-300 p-2 rounded dark:text-white text-black font-semibold" onChange={(e) => setTitle(e.target.value)} onBlur={() => {setTitleEditable(false), handleUpdateTitle()}} />) 
                        
                        : ( 
                        <div className="flex flex-row items-center gap-4 mb-4">
                            {titleEdit && (<Edit2Icon className="cursor-pointer hover:text-blue-500 dark:text-white text-black" onClick={()=>{setTitleEditable(true)}}/>)}
                            <h1 className="text-2xl font-bold dark:text-white text-black" onDoubleClick={() => setTitleEditable(true)}>{title}</h1> 
                        
                        </div>)}
                        {titleEdit && (<p className="text-sm dark:text-gray-400 text-gray-500">Double Click to Edit Title</p>)}
                        
                        <div> {pages[page]}</div>
                    
                    
                    </div>


                    <div className="ModalFooter">
                        
                        {footer || footer ==="".trim() ?(
                       
                        React.Children.toArray(footer).map((it, idx)=>(
                            <div key={idx} className="flex flex-row gap-3 items-center">
                                <span>{it}</span>
                                {multi && (
                                    page>0 ? 
                                    <>
                                        <ModalButton onClick={()=>setPage(page-1)} type="secondary"> Previous </ModalButton>

                                    </>
                                    : page < pages.length -1 ? (
                                        <ModalButton onClick={()=>setPage(page+1)} type="secondary"> Next </ModalButton>
                                    ):null
                                )}
                            </div>
                            )) 
                        
                        ):(
                            <>
                                <ModalButton onClick={onOk} type="primary" > OK</ModalButton>
                                <ModalButton onClick={onCancel} type="secondary" > Cancel</ModalButton>
                            </>
                        )}
                    </div>
            </div>
        </div>
       
    )
}


ModalForm.Page = ({ children }) => <>{children}</>;