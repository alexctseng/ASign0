'use client'

import { useState, useRef, useEffect } from 'react'
import { X, MoreVertical, Trash2, Copy, Square } from 'lucide-react'
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
  onDuplicate?: () => void
}

export function ResizableSignature({
  content,
  initialWidth = 200,
  initialHeight = 100,
  onResize,
  onMove,
  isSelected = false,
  onClick,
  onDelete,
  onDuplicate
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 transform -translate-y-[100%]">
            <div className="bg-white shadow-md rounded-lg py-1.5 px-2 flex items-center gap-2">
              <button
                className="flex items-center px-3 py-1.5 hover:bg-gray-50 rounded-md transition-colors"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onDuplicate?.();
                }}
              >
                <span className="text-gray-600 text-sm whitespace-nowrap flex items-center gap-2">
                  <Square className="w-4 h-4" />
                  Duplicate
                </span>
              </button>
              <div className="w-px h-5 bg-gray-200" />
              <button
                className="flex items-center px-3 py-1.5 hover:bg-gray-50 rounded-md transition-colors"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
              >
                <span className="text-gray-600 text-sm whitespace-nowrap flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </span>
              </button>
            </div>
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
