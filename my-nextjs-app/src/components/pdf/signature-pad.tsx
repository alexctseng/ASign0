'use client'

import { useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface SignaturePadProps {
  onSave: (signature: string) => void
  onClose: () => void
}

export function SignaturePad({ onSave, onClose }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const isDrawing = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = 500
    canvas.height = 200

    const context = canvas.getContext('2d')
    if (!context) return

    context.strokeStyle = 'black'
    context.lineWidth = 2
    context.lineCap = 'round'
    contextRef.current = context
  }, [])

  const startDrawing = (e: React.MouseEvent) => {
    const { offsetX, offsetY } = e.nativeEvent
    contextRef.current?.beginPath()
    contextRef.current?.moveTo(offsetX, offsetY)
    isDrawing.current = true
  }

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing.current) return
    const { offsetX, offsetY } = e.nativeEvent
    contextRef.current?.lineTo(offsetX, offsetY)
    contextRef.current?.stroke()
  }

  const stopDrawing = () => {
    contextRef.current?.closePath()
    isDrawing.current = false
  }

  const handleSave = () => {
    const signature = canvasRef.current?.toDataURL()
    if (signature) {
      onSave(signature)
    }
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-background rounded-lg shadow-lg p-6 w-[550px]">
        <h3 className="text-lg font-medium mb-4">Draw Your Signature</h3>
        <div className="border rounded-lg p-2 mb-4">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="w-full border rounded cursor-crosshair bg-white"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Check className="h-4 w-4 mr-2" />
            Save Signature
          </Button>
        </div>
      </div>
    </div>
  )
}
