'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { PDFToolbar } from '@/components/pdf/toolbar'
import { SignaturePad } from '@/components/pdf/signature-pad'
import { ResizableSignature } from '@/components/pdf/resizable-signature'

// Define types for our annotations
interface Annotation {
  id: string
  type: 'signature' | 'text' | 'drawing'
  x: number
  y: number
  content: string
  width?: number
  height?: number
}

export default function PDFViewer() {
  const searchParams = useSearchParams()
  const [pdfUrl, setPdfUrl] = useState<string>('')
  const [currentTool, setCurrentTool] = useState<string>('')
  const [showSignaturePad, setShowSignaturePad] = useState(false)
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [scale, setScale] = useState(1)
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)

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

  const handleToolSelect = (tool: string) => {
    setCurrentTool(tool)
    if (tool === 'signature') {
      setShowSignaturePad(true)
    }
  }

  const handleSignatureSave = (signatureData: string) => {
    const newId = crypto.randomUUID()
    setAnnotations(prev => [...prev, {
      id: newId,
      type: 'signature',
      x: 100,
      y: 100,
      content: signatureData,
      width: 200,
      height: 100
    }])
    setSelectedAnnotation(newId)
    setShowSignaturePad(false)
  }

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2))
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5))

  const handleDeleteAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(annotation => annotation.id !== id))
    setSelectedAnnotation(null)
  }

  const handleDuplicateAnnotation = (id: string) => {
    const annotationToDuplicate = annotations.find(a => a.id === id);
    if (annotationToDuplicate) {
      const newAnnotation = {
        ...annotationToDuplicate,
        id: crypto.randomUUID(),
        x: annotationToDuplicate.x + 20,
        y: annotationToDuplicate.y + 20
      };
      setAnnotations(prev => [...prev, newAnnotation]);
      setSelectedAnnotation(newAnnotation.id);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-light">Document Viewer</h1>
          </div>
        </div>

        <PDFToolbar
          onToolSelect={handleToolSelect}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          currentTool={currentTool}
        />

        <div 
          ref={containerRef}
          className="w-full h-[calc(100vh-180px)] relative bg-white"
          onClick={() => setSelectedAnnotation(null)}
        >
          {pdfUrl && (
            <iframe
              src={`${pdfUrl}#toolbar=0`}
              className="w-full h-full border rounded-lg pointer-events-none"
              title="PDF Viewer"
            />
          )}
          
          <div className="absolute inset-0">
            {annotations.map((annotation) => (
              <div
                key={annotation.id}
                style={{
                  position: 'absolute',
                  left: annotation.x,
                  top: annotation.y,
                  zIndex: selectedAnnotation === annotation.id ? 50 : 40,
                }}
              >
                {annotation.type === 'signature' && (
                  <ResizableSignature
                    content={annotation.content}
                    initialWidth={annotation.width}
                    initialHeight={annotation.height}
                    isSelected={selectedAnnotation === annotation.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedAnnotation(annotation.id)
                    }}
                    onResize={(width, height) => {
                      setAnnotations(prev => prev.map(a => 
                        a.id === annotation.id 
                          ? { ...a, width, height }
                          : a
                      ))
                    }}
                    onMove={(deltaX, deltaY) => {
                      setAnnotations(prev => prev.map(a => 
                        a.id === annotation.id 
                          ? { 
                              ...a, 
                              x: a.x + deltaX,
                              y: a.y + deltaY
                            }
                          : a
                      ))
                    }}
                    onDelete={() => handleDeleteAnnotation(annotation.id)}
                    onDuplicate={() => handleDuplicateAnnotation(annotation.id)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showSignaturePad && (
        <SignaturePad
          onSave={handleSignatureSave}
          onClose={() => setShowSignaturePad(false)}
        />
      )}
    </div>
  )
}