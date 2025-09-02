import { useState, useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// IMPORTANT: Set the workerUrl for pdfjs-dist
import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`;

const PDFViewer = ({ fileUrl }) => {
  const [viewerKey, setViewerKey] = useState(0);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Force re-render when fileUrl changes
    setViewerKey(prevKey => prevKey + 1);
    
    if (fileUrl) {
      fetchPdfWithCredentials(fileUrl);
    }
  }, [fileUrl]);

  const fetchPdfWithCredentials = async (url) => {
    try {
      setLoading(true);
      setError(null);
      
      // Clean up previous blob URL
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
      
      const response = await fetch(url, {
        credentials: 'include', // Include session cookies
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const newBlobUrl = URL.createObjectURL(blob);
      
      setPdfBlob(blob);
      setBlobUrl(newBlobUrl);
    } catch (err) {
      console.error('Error fetching PDF:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  if (!fileUrl) {
    return (
      <div className="pdf-viewer-container d-flex align-items-center justify-content-center">
        <p>No PDF file selected</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pdf-viewer-container d-flex align-items-center justify-content-center">
        <p>Loading PDF...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pdf-viewer-container d-flex align-items-center justify-content-center">
        <p>Error loading PDF: {error}</p>
      </div>
    );
  }

  if (!blobUrl) {
    return (
      <div className="pdf-viewer-container d-flex align-items-center justify-content-center">
        <p>Preparing PDF...</p>
      </div>
    );
  }

  return (
    <div className="pdf-viewer-container" style={{ 
      height: '100%', 
      width: '100%',
      overflow: 'auto'
    }}>
      <Worker workerUrl={`//unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
        <Viewer
          key={viewerKey}
          fileUrl={blobUrl}
          plugins={[defaultLayoutPluginInstance]}
        />
      </Worker>
    </div>
  );
};

export default PDFViewer;
