
import React from "react";
import {useState, useEffect} from "react";
import "../style/modal.css"

export const ModalButton = ({type= "primary",onClick, children, disabled=false})=>{

    return (
        <button className={`btn ${type} dark:text-white text-black`} onClick={onClick} disabled={disabled}> 
            {children}
        </button>
    )
}



export const ModalForm = ({title,onOk,onCancel,children,footer, open,multi})=>{
    const [visible, setVisible] = useState(false);
    const [page, setPage] = useState(0);

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

    if (!visible) return null;
        const pages =React.Children.toArray(children);
    
    return (
            <div className={`ModalOverlay ${open? "fade-in" : "fade-out"}`} >
                <div className={`ModalForm ${open? "pop-in" : "pop-out"} dark:bg-[#080c11] bg-white`}>
                    
                    <div>
                        <h1 className="text-2xl font-bold dark:text-white text-black">{title}</h1> 
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