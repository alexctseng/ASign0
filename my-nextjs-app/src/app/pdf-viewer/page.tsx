'use client'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PDFViewer() {
  const searchParams = useSearchParams()
  const [pdfUrl, setPdfUrl] = useState<string>('')

  useEffect(() => {
    const url = searchParams.get('url')
    if (url) setPdfUrl(decodeURIComponent(url))
  }, [searchParams])

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [pdfUrl])

  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-light">Document Viewer</h1>
        </div>
        <div className="flex gap-2">
          {/* We'll add signature and edit tools here later */}
        </div>
      </div>
      <div className="w-full h-[calc(100vh-100px)]">
        {pdfUrl && (
          <iframe
            src={`${pdfUrl}#toolbar=0`}
            className="w-full h-full border rounded-lg"
            title="PDF Viewer"
          />
        )}
      </div>
    </div>
  )
}