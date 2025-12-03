import React, { createContext, useContext, useState, useCallback } from "react";
//import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {X, LucideInfo, } from 'lucide-react'
import { IoWarningOutline,IoCheckmarkDoneCircle  } from "react-icons/io5";
import { VscError } from "react-icons/vsc";

const ToastContext = createContext(null);

// six supported positions
const POSITIONS = {
  "top-right": "top-4 right-4 items-end",
  "top-left": "top-4 left-4 items-start",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
};

const TYPE_ICONS = {
  success: <IoCheckmarkDoneCircle size={30}  />,
  error: <VscError size={30} color="#f72b2a" />,
  info: <LucideInfo size={30} color="#00a5f7" />,
  warning: <IoWarningOutline size={30} color="#e2ce01" />,
};


const TYPE_STYLES = {
  success: "dark:text-white text-black dark:bg-green-600 bg-[#f5f5f7]",
  error: "dark:text-white text-black dark:bg-red-600 bg-[#f5f5f7]",
  info: "dark:text-white text-black dark:bg-blue-600 bg-[#f5f5f7]",
  warning: "dark:text-black dark:bg-yellow-500 dark:text-black bg-[#f5f5f7]",
};

/**
 * ToastProvider component to provide toast notifications
 * @param {React.PropsWithChildren} children - for the React children prop
 * @example 
 * function App() {
 *   // MUST BE WRAPPED INSIDE ToastProvider
 *   <ToastProvider>
 *     <YourAppComponents />
 *   </ToastProvider>
 * }
 * 
 *@description 
 * This hook also provides some predefined types for convenience: success, error, info, warning, and also able to create custom toasts.
 * @example 
 * top-right, top-left, top-center, bottom-right, bottom-left, bottom-center
 * Different positions can be specified for the toast notifications.
 * @see useAppToast
 * @returns {JSX.Element}
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((toast) => toast.id !== id));

  const addToast = useCallback((content, type, options = {}) => {
    const id = Date.now();

    const newToast = {
      id,
      content,
      type,
      duration: options.duration ?? 3000,
      position: options.position || "top-right",
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss
    setTimeout(() => removeToast(id), newToast.duration);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* render by position */}
      {Object.keys(POSITIONS).map((posKey) => (
        <div
          key={posKey}
          className={`fixed z-50 flex flex-col gap-4 w-80 max-w-[95vw] pointer-events-none ${POSITIONS[posKey]}`}
        >
          <AnimatePresence>
            {toasts
              .filter((t) => t.position === posKey)
              .map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className={`
                    pointer-events-auto relative px-4 py-3 rounded-sm shadow-lg border border-gray-500 flex gap-3
                    backdrop-blur-md
                    ${TYPE_STYLES[t.type] ?? TYPE_STYLES.info}
                  `}
                >
                  <div className="flex flex-row gap-2 items-center justify-between">
                    {TYPE_ICONS[t.type]} 
                    <div className="flex-1">{t.content}</div>
                  </div>
                  

                  {/* close button */}
                  <button
                    onClick={() => removeToast(t.id)}
                    className="p-1 hover:opacity-70 transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      ))}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
