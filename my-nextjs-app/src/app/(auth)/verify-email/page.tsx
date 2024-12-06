'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground">
            We have sent you a verification link to your email address.
            Please check your email and click the link to verify your account.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Once verified, you can
          </p>
          <Button asChild>
            <Link href="/login">
              Sign in to your account
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 