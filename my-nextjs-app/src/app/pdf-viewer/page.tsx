'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { PDFToolbar } from '@/components/pdf/toolbar'
import { SignaturePad } from '@/components/pdf/signature-pad'
import { ResizableSignature } from '@/components/pdf/resizable-signature'
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { scrollModePlugin } from '@react-pdf-viewer/scroll-mode';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { viewportToPageCoordinates, pageToViewportCoordinates } from '@/utils/pdf-coordinates'

// Define types for our annotations
interface Annotation {
  id: string
  type: 'signature' | 'text' | 'drawing'
  pageNumber: number
  pageX: number // percentage within the page
  pageY: number // percentage within the page
  width: number
  height: number
  content: string
}

interface PDFDimensions {
  width: number
  height: number
  totalPages: number
}

// Update the interface for the document load event
interface DocumentLoadEvent {
  doc: any; // Using any for now since the PDF.js types are complex
  file: any;
}

export default function PDFViewer() {
  const searchParams = useSearchParams()
  const [pdfUrl, setPdfUrl] = useState<string>('')
  const [currentTool, setCurrentTool] = useState<string>('')
  const [showSignaturePad, setShowSignaturePad] = useState(false)
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [scale, setScale] = useState(1)
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pdfDimensions, setPdfDimensions] = useState<PDFDimensions>({
    width: 0,
    height: 0,
    totalPages: 1
  })
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [],
  });
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const scrollModePluginInstance = scrollModePlugin();
  const zoomPluginInstance = zoomPlugin();
  const { ZoomIn, ZoomOut } = zoomPluginInstance;
  const viewerRef = useRef<Viewer>(null);

  // Add this to track PDF loading
  const [isLoaded, setIsLoaded] = useState(false)

  // First, add this state to track PDF pages
  const [pdfPages, setPdfPages] = useState<HTMLElement[]>([]);

  useEffect(() => {
    const url = searchParams.get('url')
    if (url) setPdfUrl(decodeURIComponent(url))
  }, [searchParams])

  useEffect(() => {
    return () => {
      if (pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [pdfUrl])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const handleScroll = () => {
      const contentWindow = iframe.contentWindow
      if (!contentWindow) return

      const scrollTop = contentWindow.document.documentElement.scrollTop
      const pageHeight = pdfDimensions.height
      const currentPage = Math.floor(scrollTop / pageHeight) + 1
      setCurrentPage(currentPage)
    }

    iframe.addEventListener('load', () => {
      const contentWindow = iframe.contentWindow
      if (!contentWindow) return

      setPdfDimensions(prev => ({
        ...prev,
        width: contentWindow.document.documentElement.scrollWidth,
        height: contentWindow.document.documentElement.scrollHeight
      }))

      contentWindow.addEventListener('scroll', handleScroll)
    })

    return () => {
      const contentWindow = iframe.contentWindow
      if (contentWindow) {
        contentWindow.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  useEffect(() => {
    const viewer = document.querySelector('.rpv-core__viewer') as HTMLElement
    if (!viewer) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setPdfDimensions(prev => ({
          ...prev,
          width,
          height,
          totalPages: prev.totalPages
        }))
      }
    })

    observer.observe(viewer)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const pages = Array.from(document.querySelectorAll('.rpv-core__page-layer'));
    setPdfPages(pages as HTMLElement[]);
  }, [currentPage]); // Update when page changes

  const handleToolSelect = (tool: string) => {
    setCurrentTool(tool)
    if (tool === 'signature') {
      setShowSignaturePad(true)
    }
  }

  const handleSignatureSave = (signatureData: string) => {
    const newAnnotation: Annotation = {
      id: crypto.randomUUID(),
      type: 'signature',
      pageNumber: currentPage,
      pageX: 20,
      pageY: 20,
      width: 200,
      height: 100,
      content: signatureData
    };

    setAnnotations(prev => [...prev, newAnnotation]);
    setSelectedAnnotation(newAnnotation.id);
    setShowSignaturePad(false);
  };

  const handleAnnotationMove = (annotationId: string, deltaX: number, deltaY: number) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    setAnnotations(prev => prev.map(ann => {
      if (ann.id !== annotationId) return ann;

      // Convert delta pixels to percentage
      const deltaXPercent = (deltaX / rect.width) * 100;
      const deltaYPercent = (deltaY / rect.height) * 100;

      return {
        ...ann,
        pageX: Math.max(0, Math.min(100, ann.pageX + deltaXPercent)),
        pageY: Math.max(0, Math.min(100, ann.pageY + deltaYPercent))
      };
    }));
  };

  const handleZoomIn = () => {
    if (scale < 3) {  // Max zoom of 300%
      setScale(prev => Math.min(prev + 0.2, 3));
    }
  };

  const handleZoomOut = () => {
    if (scale > 0.5) {  // Min zoom of 50%
      setScale(prev => Math.max(prev - 0.2, 0.5));
    }
  };

  const handleDeleteAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(annotation => annotation.id !== id))
    setSelectedAnnotation(null)
  }

  const handleDuplicateAnnotation = (id: string) => {
    const annotationToDuplicate = annotations.find(a => a.id === id);
    if (!annotationToDuplicate) return;

    const newAnnotation: Annotation = {
      ...annotationToDuplicate,
      id: crypto.randomUUID(),
      pageX: annotationToDuplicate.pageX + 20,
      pageY: annotationToDuplicate.pageY + 20,
      width: annotationToDuplicate.width,
      height: annotationToDuplicate.height
    };

    setAnnotations(prev => [...prev, newAnnotation]);
    setSelectedAnnotation(newAnnotation.id);
  };

  const handleDocumentLoad = (e: DocumentLoadEvent) => {
    if (!e.doc) return;
    
    // Set dimensions based on the viewer's container
    if (containerRef.current) {
      const container = containerRef.current;
      setPdfDimensions({
        width: container.clientWidth,
        height: container.clientHeight,
        totalPages: e.doc.numPages
      });
    }
    setIsLoaded(true);
  };

  const handlePageChange = (e: { currentPage: number }) => {
    setCurrentPage(e.currentPage);
  };

  return (
    <div className="flex flex-col h-screen">
      <PDFToolbar 
        onToolSelect={handleToolSelect}
        onZoomIn={() => setScale(prev => Math.min(prev + 0.1, 2))}
        onZoomOut={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
        currentTool={currentTool}
      />
      
      <div className="flex-1 bg-gray-800 relative" ref={containerRef}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <div className="h-full pdf-viewer">
            <Viewer
              fileUrl={pdfUrl}
              defaultScale={scale}
              plugins={[defaultLayoutPluginInstance]}
              onDocumentLoad={handleDocumentLoad}
              onPageChange={(e) => setCurrentPage(e.currentPage)}
            />
          </div>
        </Worker>

        <div className="absolute inset-0 pointer-events-none">
          {annotations.map((annotation) => (
            <div
              key={annotation.id}
              className="absolute pointer-events-auto"
              style={{
                left: `${annotation.pageX}%`,
                top: `${annotation.pageY}%`,
                transform: `scale(${scale})`,
                transformOrigin: 'top left'
              }}
            >
              <ResizableSignature
                content={annotation.content}
                initialWidth={annotation.width}
                initialHeight={annotation.height}
                isSelected={selectedAnnotation === annotation.id}
                onClick={() => setSelectedAnnotation(annotation.id)}
                onDelete={() => handleDeleteAnnotation(annotation.id)}
                onDuplicate={() => handleDuplicateAnnotation(annotation.id)}
                onMove={(deltaX, deltaY) => {
                  const container = containerRef.current;
                  if (!container) return;
                  
                  const rect = container.getBoundingClientRect();
                  const deltaXPercent = (deltaX / rect.width) * 100;
                  const deltaYPercent = (deltaY / rect.height) * 100;
                  
                  setAnnotations(prev => prev.map(a => {
                    if (a.id !== annotation.id) return a;
                    return {
                      ...a,
                      pageX: Math.max(0, Math.min(100, a.pageX + deltaXPercent)),
                      pageY: Math.max(0, Math.min(100, a.pageY + deltaYPercent))
                    };
                  }));
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {showSignaturePad && (
        <SignaturePad
          onSave={handleSignatureSave}
          onClose={() => setShowSignaturePad(false)}
        />
      )}
    </div>
  );
}