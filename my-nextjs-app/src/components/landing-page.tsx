'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Moon, Sun, Upload, Calendar, Shield, CheckCircle } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { useState, useCallback, useEffect } from "react"
import { useDropzone } from 'react-dropzone'

export function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [file, setFile] = useState(null)

  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.add('dark')
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'application/pdf': ['.pdf']},
    multiple: false
  })

  return (
    <div className={`min-h-screen font-inter ${isDarkMode ? 'dark' : ''}`}>
      <div className="w-full bg-background text-foreground transition-colors duration-300">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-eebfn5UnSJoFRHHVsE1r7H3rNdcogd.png"
                  alt="ASign Logo"
                  width={32}
                  height={32}
                  className={`object-contain transition-all duration-300 ${isDarkMode ? '' : 'invert'}`}
                  priority
                />
                <span className="text-xl font-light">ASign</span>
              </div>
              
              <nav className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-8">
                  <Link className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200" href="#">Features</Link>
                  <Link className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200" href="#">Templates</Link>
                  <Link className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200" href="#">Pricing</Link>
                  <Link className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200" href="#">Help</Link>
                </div>
              </nav>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" className="text-sm font-normal" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button className="text-sm font-normal bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>
        <main>
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center text-center space-y-8">
                <div className="space-y-4 max-w-3xl">
                  <h1 className="text-4xl font-extralight tracking-tight sm:text-5xl xl:text-6xl/none">
                    Sign Documents Securely,
                    <br />
                    <span className="font-normal">Anywhere, Anytime</span>
                  </h1>
                  <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl font-light">
                    Transform your document signing experience with our secure, efficient, and user-friendly platform.
                    Upload, sign, and manage all your documents in one place.
                  </p>
                </div>
                
                <div
                  {...getRootProps()}
                  className={`w-full max-w-2xl mx-auto rounded-xl ${
                    isDragActive ? 'border-primary' : 'border-muted-foreground/25'
                  } border-2 border-dashed bg-muted/50 backdrop-blur-sm transition-all hover:border-primary`}
                >
                  <div className="p-12 text-center cursor-pointer">
                    <input {...getInputProps()} className="hidden" />
                    <div className="flex flex-col items-center justify-center space-y-4">
                      {file ? (
                        <>
                          <CheckCircle className="h-12 w-12 text-primary" />
                          <div>
                            <p className="text-lg font-light">{file.name}</p>
                            <p className="text-sm text-muted-foreground">Ready to sign</p>
                          </div>
                          <Button className="mt-4">
                            Start Signing
                          </Button>
                        </>
                      ) : (
                        <>
                          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                          <div className="space-y-2">
                            <p className="text-lg font-light">Drag & drop your PDF here</p>
                            <p className="text-sm text-muted-foreground">or click to select a file</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="flex flex-col p-8 bg-background rounded-xl shadow-lg">
                  <div className="p-4 rounded-full bg-primary/10 w-fit">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-light mt-4 mb-2">Easy Upload</h3>
                  <p className="text-muted-foreground font-light">Drag & drop your documents for instant signing capabilities.</p>
                </div>
                <div className="flex flex-col p-8 bg-background rounded-xl shadow-lg">
                  <div className="p-4 rounded-full bg-primary/10 w-fit">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-light mt-4 mb-2">Smart Processing</h3>
                  <p className="text-muted-foreground font-light">Automatic field detection and intelligent form filling.</p>
                </div>
                <div className="flex flex-col p-8 bg-background rounded-xl shadow-lg">
                  <div className="p-4 rounded-full bg-primary/10 w-fit">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-light mt-4 mb-2">Enterprise Security</h3>
                  <p className="text-muted-foreground font-light">Bank-level encryption and compliance standards.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-light tracking-tight md:text-4xl">
                    Start Signing in Minutes
                  </h2>
                  <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl font-light">
                    Experience the fastest way to sign and manage your documents. No credit card required.
                  </p>
                </div>
                <div className="w-full max-w-sm space-y-2">
                  <form className="flex space-x-2">
                    <Input
                      className="max-w-lg flex-1"
                      placeholder="Enter your email"
                      type="email"
                    />
                    <Button type="submit">Get Started</Button>
                  </form>
                  <p className="text-xs text-muted-foreground font-light">
                    Free plan includes up to 5 documents per month.{" "}
                    <Link className="underline underline-offset-2 hover:text-primary transition-colors" href="#">
                      Terms & Conditions
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer className="w-full py-6 border-t">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-2">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-eebfn5UnSJoFRHHVsE1r7H3rNdcogd.png"
                  alt="ASign Logo"
                  width={24}
                  height={24}
                  className={`object-contain transition-all duration-300 ${isDarkMode ? '' : 'invert'}`}
                  priority
                />
                <p className="text-sm text-muted-foreground font-light">© 2024 ASign. All rights reserved.</p>
              </div>
              <nav className="flex gap-4">
                <Link className="text-sm text-muted-foreground hover:text-primary transition-colors font-light" href="#">Privacy</Link>
                <Link className="text-sm text-muted-foreground hover:text-primary transition-colors font-light" href="#">Terms</Link>
                <Link className="text-sm text-muted-foreground hover:text-primary transition-colors font-light" href="#">Contact</Link>
              </nav>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}