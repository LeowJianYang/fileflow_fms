import { useState, useEffect } from "react";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

export default function ImageViewer({ fileUrl, fileName }) {
    const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {

        
        if (!fileUrl) {
            console.log("No fileUrl provided");
            return;
        }
    
        setIsLoading(true);
    
        let isCancelled = false;

        const loadImage = async () => {
            try {
         
                const response = await fetch(fileUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch photo blob');
                }

                if (isCancelled) return;
                
               
                setIsLoading(false);
            } catch (error) {
                console.error("Error loading photo/Images:", error);
                setIsLoading(false);
            }
        };

        loadImage();

        return () => {
            isCancelled = true;
        };
    }, [fileUrl]);


    return (
        <>
            {isLoading ? (
                <div className="text-center mt-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">Loading Images/Media...</p>
                </div>
            ):(
                 <PhotoProvider>
                    <div className="flex flex-col items-center justify-center h-full">
                        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">Click To <strong>Enlarge</strong> Photo/Media</p>
                        <PhotoView src={fileUrl}>
                            <img src={fileUrl} alt={fileName} className="max-w-full max-h-full" />
                        </PhotoView>
                    </div>
                </PhotoProvider>
            )}
        </>
               
    );
}

    

