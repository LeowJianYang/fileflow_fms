
import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Minus, Plus } from "lucide-react";
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();


export default function PDFViewer({ fileUrl }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const renderTaskRef = useRef(null);
  const pdfDocRef = useRef(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [isLoading, setIsLoading] = useState(true);



  // Load PDF document
  useEffect(() => {
   
    
    if (!fileUrl) {
      return;
    }

    setIsLoading(true);

    let isCancelled = false;

    const loadPDF = async () => {
      try {
        
        const loadingTask = pdfjsLib.getDocument(fileUrl);
        const pdf = await loadingTask.promise;
        
        if (isCancelled) return;
        
        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages);
        setIsLoading(false);
      } catch (error) {
       
        setIsLoading(false);
      }
    };

    loadPDF();

    return () => {
      isCancelled = true;
    };
  }, [fileUrl]);

  // Render  page
  useEffect(() => {

    
    if (!pdfDocRef.current || isLoading) {
   
      return;
    }

    let isCancelled = false;

    const renderPage = async () => {
      try {
        // Cancel existing render task
        if (renderTaskRef.current) {
         
          renderTaskRef.current.cancel();
          renderTaskRef.current = null;
        }

        const page = await pdfDocRef.current.getPage(currentPage);
      
        
        if (isCancelled) return;
        
        const canvas = canvasRef.current;
        const container = containerRef.current;
        
        if (!canvas || !container) {
          return;
        }

      
        const containerWidth = container.clientWidth - 40; // 40px padding
        const viewport = page.getViewport({ scale: 1 });
        const responsiveScale = containerWidth / viewport.width;
        const finalScale = Math.min(responsiveScale * scale, scale * 2);
        
        const scaledViewport = page.getViewport({ scale: finalScale });
        const ctx = canvas.getContext("2d");
        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;
        

        const renderTask = page.render({ 
          canvasContext: ctx, 
          viewport: scaledViewport 
        });
        renderTaskRef.current = renderTask;
        
        await renderTask.promise;
    
        renderTaskRef.current = null;
      } catch (error) {
        if (error.name === 'RenderingCancelledException') {
          console.log('Rendering was cancelled (expected behavior)');
        } else {
          console.error("Error rendering page:", error);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
    };
  }, [currentPage, scale, isLoading]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Trigger re-render by updating a dummy state
      setScale(s => s);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const zoomIn = () => {
    setScale(s => Math.min(s + 0.2, 3));
  };

  const zoomOut = () => {
    setScale(s => Math.max(s - 0.2, 0.5));
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-100 dark:bg-gray-800">
      {/* Controls */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex-wrap">
        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage <= 1 || isLoading}
            className="px-3 py-1.5 rounded bg-blue-500 text-white disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors text-sm"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium min-w-[100px] text-center">
            {isLoading ? 'Loading...' : `Page ${currentPage} of ${totalPages}`}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage >= totalPages || isLoading}
            className="px-3 py-1.5 rounded bg-blue-500 text-white disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors text-sm"
          >
            Next
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            disabled={isLoading}
            className="px-3 py-1.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm disabled:opacity-50"
            title="Zoom Out"
          >
            <Minus size={16} />
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            disabled={isLoading}
            className="px-3 py-1.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm disabled:opacity-50"
            title="Zoom In"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* PDF Canvas */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto flex items-start justify-center p-4"
      >
        {isLoading ? (
          <div className="text-center mt-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading PDF...</p>
          </div>
        ) : (
          <canvas 
            ref={canvasRef} 
            className="shadow-lg max-w-full h-auto"
          />
        )}
      </div>
    </div>
  );
}
