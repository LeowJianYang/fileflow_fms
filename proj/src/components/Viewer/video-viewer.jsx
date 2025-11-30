import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout,DefaultAudioLayout } from '@vidstack/react/player/layouts/default';
import { useState,useEffect } from 'react';

export default function VideoViewer({ fileUrl, fileName, mimeType = 'video/mp4' ,isAudio=false}) {
    const [isLoading, setIsLoading] = useState(true);
    
    // Load video
    useEffect(() => {

        
        if (!fileUrl) {
            console.log("No fileUrl provided");
            return;
        }
    
        setIsLoading(true);
    
        let isCancelled = false;
    
        const loadVideo = async () => {
            try {
         
                const response = await fetch(fileUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch video blob');
                }

                if (isCancelled) return;
                
               
                setIsLoading(false);
            } catch (error) {
                console.error("Error loading video:", error);
                setIsLoading(false);
            }
        };

        loadVideo();

        return () => {
            isCancelled = true;
        };
    }, [fileUrl]);

    // Prepare source object with mime type
    const videoSource = {
        src: fileUrl,
        type: mimeType
    };

    return (
        <div className="w-full h-full flex justify-center items-center bg-black">
            {isLoading ? (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading video...</p>
                </div>
            ) : (
                <MediaPlayer 
                    title={fileName} 
                    src={videoSource}
                    className="w-full h-full"
                >
                    <MediaProvider>
                        <source src={fileUrl} type={mimeType} />
                    </MediaProvider>
                    {isAudio ? (
                        <DefaultAudioLayout icons={defaultLayoutIcons} />
                    ) : (
                        <DefaultVideoLayout icons={defaultLayoutIcons} />
                    )}
                </MediaPlayer>
            )}
        </div>
    );
}