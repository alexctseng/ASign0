'use client'

import { useRef, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Point {
  x: number
  y: number
  pressure: number
}

interface SignaturePadProps {
  onSave: (signature: string) => void
  onClose: () => void
}

export function SignaturePad({ onSave, onClose }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const isDrawing = useRef(false)
  const [isConverting, setIsConverting] = useState(false)
  const pathsRef = useRef<Point[][]>([])
  const currentPath = useRef<Point[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size with higher resolution
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2

    const context = canvas.getContext('2d')
    if (!context) return

    context.scale(2, 2) // Scale for high DPI
    context.strokeStyle = 'black'
    context.lineWidth = 2
    context.lineCap = 'round'
    context.lineJoin = 'round'
    contextRef.current = context
  }, [])

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    currentPath.current = [{ x, y, pressure: 1 }]
    contextRef.current?.beginPath()
    contextRef.current?.moveTo(x, y)
    isDrawing.current = true
  }

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing.current || !contextRef.current) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    currentPath.current.push({ x, y, pressure: 1 })
    
    // Clear and redraw the current path
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height)
    drawPaths(contextRef.current, [...pathsRef.current, currentPath.current])
  }

  const drawPaths = (ctx: CanvasRenderingContext2D, paths: Point[][]) => {
    ctx.beginPath()
    paths.forEach(path => {
      if (path.length < 2) return

      ctx.moveTo(path[0].x, path[0].y)
      
      // Use quadratic curves for smoother lines
      for (let i = 1; i < path.length - 1; i++) {
        const xc = (path[i].x + path[i + 1].x) / 2
        const yc = (path[i].y + path[i + 1].y) / 2
        ctx.quadraticCurveTo(path[i].x, path[i].y, xc, yc)
      }
      
      // Connect to the last point
      const last = path[path.length - 1]
      ctx.lineTo(last.x, last.y)
    })
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (!isDrawing.current) return
    
    if (currentPath.current.length > 1) {
      pathsRef.current.push([...currentPath.current])
    }
    currentPath.current = []
    isDrawing.current = false
  }

  const handleSave = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    setIsConverting(true)

    // Add a small delay to show the animation
    await new Promise(resolve => setTimeout(resolve, 100))

    // Generate SVG path data from the drawn paths
    const paths = pathsRef.current.map(path => {
      if (path.length < 2) return ''

      let d = `M ${path[0].x} ${path[0].y}`
      for (let i = 1; i < path.length - 1; i++) {
        const xc = (path[i].x + path[i + 1].x) / 2
        const yc = (path[i].y + path[i + 1].y) / 2
        d += ` Q ${path[i].x} ${path[i].y} ${xc} ${yc}`
      }
      const last = path[path.length - 1]
      d += ` L ${last.x} ${last.y}`
      return d
    }).filter(Boolean)

    // Create SVG string
    const svgString = `
      <svg viewBox="0 0 ${canvas.width/2} ${canvas.height/2}" xmlns="http://www.w3.org/2000/svg">
        ${paths.map(d => `<path d="${d}" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}
      </svg>
    `

    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 800))
    setIsConverting(false)
    
    onSave(`data:image/svg+xml;base64,${btoa(svgString)}`)
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-background rounded-lg shadow-lg p-6 w-[550px]">
        <h3 className="text-lg font-medium mb-4">Draw Your Signature</h3>
        <div className="border rounded-lg p-2 mb-4 relative">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="w-full h-[200px] border rounded cursor-crosshair bg-white"
            style={{ touchAction: 'none' }}
          />
          
          <AnimatePresence>
            {isConverting && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white"
              >
                <svg className="w-full h-full">
                  {pathsRef.current.map((path, index) => (
                    <motion.path
                      key={index}
                      d={generatePathD(path)}
                      fill="none"
                      stroke="black"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  ))}
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
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

function generatePathD(path: Point[]): string {
  if (path.length < 2) return ''
  
  let d = `M ${path[0].x} ${path[0].y}`
  
  for (let i = 1; i < path.length - 1; i++) {
    const xc = (path[i].x + path[i + 1].x) / 2
    const yc = (path[i].y + path[i + 1].y) / 2
    d += ` Q ${path[i].x} ${path[i].y} ${xc} ${yc}`
  }
  
  const last = path[path.length - 1]
  d += ` L ${last.x} ${last.y}`
  
  return d
}
