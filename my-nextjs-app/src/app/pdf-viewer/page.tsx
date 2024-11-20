'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PDFToolbar } from '@/components/pdf/toolbar'
import { SignaturePad } from '@/components/pdf/signature-pad'

// Define types for our annotations
interface Annotation {
  id: string
  type: 'signature' | 'text' | 'drawing'
  x: number
  y: number
  content: string
}

export default function PDFViewer() {
  const searchParams = useSearchParams()
  const [pdfUrl, setPdfUrl] = useState<string>('')
  const [currentTool, setCurrentTool] = useState<string>('')
  const [showSignaturePad, setShowSignaturePad] = useState(false)
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [scale, setScale] = useState(1)
  
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
    setAnnotations(prev => [...prev, {
      id: crypto.randomUUID(),
      type: 'signature',
      x: 0,
      y: 0,
      content: signatureData
    }])
    setShowSignaturePad(false)
  }

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2))
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5))

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
          className="w-full h-[calc(100vh-180px)] relative"
          style={{ transform: `scale(${scale})` }}
        >
          {pdfUrl && (
            <iframe
              src={`${pdfUrl}#toolbar=0`}
              className="w-full h-full border rounded-lg"
              title="PDF Viewer"
            />
          )}
          
          {/* Render annotations */}
          {annotations.map(annotation => (
            <div
              key={annotation.id}
              style={{
                position: 'absolute',
                left: annotation.x,
                top: annotation.y,
                pointerEvents: currentTool ? 'none' : 'all',
                cursor: 'move'
              }}
            >
              {annotation.type === 'signature' && (
                <img 
                  src={annotation.content} 
                  alt="Signature"
                  className="max-w-[200px]"
                />
              )}
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
  )
}