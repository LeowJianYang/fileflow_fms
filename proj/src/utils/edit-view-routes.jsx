import { useNavigate } from 'react-router-dom';

/**
 * Hook for handling file navigation
 * Must be used inside a React component
 *  
 * @returns {Function} handleFileEdit - Function to navigate to file editor/viewer
 * 
 * @example
 * function MyComponent() {
 *   const handleFileEdit = useHandleFileEdit();
 *   
 *   return <button onClick={() => handleFileEdit(file)}>Open File</button>
 * }
 */

export default function useHandleFileEdit() {
    const navigate = useNavigate();

    /**
     * Handle file editing/navigation based on file type
     * @param {object} file - File Object (Include Metadata) 
     * @returns {function} - Function to navigate to file editor/viewer
     */
    const handleFileEdit = (file) => {
        if (!file || !file.filetype) {
            console.error('Invalid file object:', file);
            return;
        }

        // Text-based files go to editor
        if (file.filetype.startsWith('text/') || 
            file.filetype === 'application/javascript' || 
            file.filetype === 'application/json' || 
            file.filetype === 'text/html' || 
            file.filetype === 'text/css') {
            navigate(`/view/editor/${encodeURIComponent(file.FileId)}/${encodeURIComponent(file.filename)}`);
        } 
        // Media and other files go to viewer
        else {
            navigate(`/view/viewer/${encodeURIComponent(file.FileId)}/${encodeURIComponent(file.filename)}`);
        }
    };

    return handleFileEdit;
}