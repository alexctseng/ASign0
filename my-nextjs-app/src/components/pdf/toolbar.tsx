'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { 
  Pen, 
  Type, 
  Image as ImageIcon, 
  Signature, 
  Download, 
  Share2,
  ZoomIn,
  ZoomOut
} from "lucide-react"

interface ToolbarProps {
  onToolSelect: (tool: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  currentTool: string;
}

export function PDFToolbar({ 
  onToolSelect, 
  onZoomIn, 
  onZoomOut, 
  currentTool 
}: ToolbarProps) {
  const tools = [
    { id: 'draw', icon: Pen, label: 'Draw' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'image', icon: ImageIcon, label: 'Image' },
    { id: 'signature', icon: Signature, label: 'Sign' },
  ]

  return (
    <div className="flex items-center justify-between w-full bg-background border rounded-lg p-2">
      <div className="flex items-center gap-2">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant={currentTool === tool.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onToolSelect(tool.id)}
          >
            <tool.icon className="h-4 w-4 mr-2" />
            {tool.label}
          </Button>
        ))}
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
