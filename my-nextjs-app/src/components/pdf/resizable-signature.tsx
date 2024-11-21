'use client'

import { useState, useRef, useEffect } from 'react'
import { X, MoreVertical, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ResizableSignatureProps {
  content: string
  initialWidth?: number
  initialHeight?: number
  onResize?: (width: number, height: number) => void
  onMove?: (deltaX: number, deltaY: number) => void
  isSelected?: boolean
  onClick?: (e: React.MouseEvent) => void
  onDelete?: () => void
}

export function ResizableSignature({
  content,
  initialWidth = 200,
  initialHeight = 100,
  onResize,
  onMove,
  isSelected = false,
  onClick,
  onDelete
}: ResizableSignatureProps) {
  const [width, setWidth] = useState(initialWidth)
  const [height, setHeight] = useState(initialHeight)
  const [isResizing, setIsResizing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const startPos = useRef({ x: 0, y: 0, width: 0, height: 0 })
  const resizeCorner = useRef<string | null>(null)

  const handleCornerMouseDown = (corner: string) => (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true)
    resizeCorner.current = corner
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      width,
      height
    }
  }

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return

    const deltaX = e.clientX - startPos.current.x
    const deltaY = e.clientY - startPos.current.y
    
    let newWidth = width
    let newHeight = height

    switch (resizeCorner.current) {
      case 'se':
        newWidth = Math.max(50, startPos.current.width + deltaX)
        newHeight = Math.max(25, startPos.current.height + deltaY)
        break
      case 'sw':
        newWidth = Math.max(50, startPos.current.width - deltaX)
        newHeight = Math.max(25, startPos.current.height + deltaY)
        break
      case 'ne':
        newWidth = Math.max(50, startPos.current.width + deltaX)
        newHeight = Math.max(25, startPos.current.height - deltaY)
        break
      case 'nw':
        newWidth = Math.max(50, startPos.current.width - deltaX)
        newHeight = Math.max(25, startPos.current.height - deltaY)
        break
    }
    
    setWidth(newWidth)
    setHeight(newHeight)
    onResize?.(newWidth, newHeight)
  }

  const handleResizeEnd = () => {
    setIsResizing(false)
    resizeCorner.current = null
  }

  const handleDragStart = (e: React.MouseEvent) => {
    if (isResizing) return
    e.stopPropagation()
    setIsDragging(true)
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      width,
      height
    }
  }

  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - startPos.current.x
    const deltaY = e.clientY - startPos.current.y
    
    onMove?.(deltaX, deltaY)
    
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      width,
      height
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove)
      window.addEventListener('mouseup', handleResizeEnd)
    }
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove)
      window.addEventListener('mouseup', handleDragEnd)
    }
    return () => {
      window.removeEventListener('mousemove', handleResizeMove)
      window.removeEventListener('mouseup', handleResizeEnd)
      window.removeEventListener('mousemove', handleDragMove)
      window.removeEventListener('mouseup', handleDragEnd)
    }
  }, [isResizing, isDragging])

  return (
    <div 
      className={`relative cursor-move ${isSelected ? 'z-50' : 'z-40'}`}
      style={{ width, height }}
      onClick={onClick}
      onMouseDown={handleDragStart}
    >
      <img 
        src={content} 
        alt="Signature"
        className="w-full h-full object-contain pointer-events-none"
        draggable={false}
      />
      
      {isSelected && (
        <>
          <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none" />
          <div className="absolute top-0 right-0 transform translate-y-[-100%]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="w-6 h-6 bg-white hover:bg-gray-50 rounded-sm flex items-center justify-center shadow-sm border border-gray-200 transition-colors"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                  <MoreVertical className="w-3 h-3 text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end"
                sideOffset={5}
                alignOffset={-5}
                className="bg-white shadow-lg border border-gray-200 rounded-sm py-1 w-[100px]"
                style={{ position: 'absolute', top: '-40px' }}
              >
                <DropdownMenuItem
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    onDelete?.()
                  }}
                  className="flex items-center px-3 py-1 hover:bg-gray-50 focus:bg-gray-50 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3 text-gray-600 mr-2" />
                  <span className="text-xs text-gray-600">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {['nw', 'ne', 'se', 'sw'].map((corner) => (
            <div
              key={corner}
              className="absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-sm"
              style={{
                top: corner.includes('n') ? -4 : 'auto',
                bottom: corner.includes('s') ? -4 : 'auto',
                left: corner.includes('w') ? -4 : 'auto',
                right: corner.includes('e') ? -4 : 'auto',
                cursor: `${corner}-resize`,
                zIndex: 60
              }}
              onMouseDown={handleCornerMouseDown(corner)}
            />
          ))}
        </>
      )}
    </div>
  )
}
