"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, ArrowRight, Sparkles } from "lucide-react"
import { signInWithGoogle, syncStoredAuthUserFromSession } from "@/lib/auth"

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M21.8 12.23c0-.82-.07-1.6-.22-2.35H12v4.45h5.48a4.68 4.68 0 0 1-2.03 3.07v2.55h3.29c1.93-1.78 3.06-4.41 3.06-7.72Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.76 0 5.08-.91 6.77-2.47l-3.29-2.55c-.91.61-2.08.97-3.48.97-2.67 0-4.93-1.8-5.73-4.23H2.88v2.63A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.27 13.72A5.98 5.98 0 0 1 5.95 12c0-.6.1-1.18.32-1.72V7.65H2.88A10 10 0 0 0 2 12c0 1.61.39 3.13 1.08 4.35l3.19-2.63Z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.05c1.5 0 2.84.51 3.9 1.52l2.92-2.92C17.08 2.99 14.76 2 12 2a10 10 0 0 0-9.12 5.65l3.39 2.63c.8-2.43 3.06-4.23 5.73-4.23Z"
        fill="#EA4335"
      />
    </svg>
  )
}

export default function GoogleSignInCard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const syncUser = async () => {
      const user = await syncStoredAuthUserFromSession()

      if (user) {
        router.replace("/dashboard")
        return
      }

      setLoading(false)
    }

    syncUser()
  }, [router])

  const handleGoogleLogin = async () => {
    setSubmitting(true)
    setError("")

    const { error: signInError } = await signInWithGoogle()

    if (signInError) {
      setError(signInError.message)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="surface-panel-strong w-full max-w-xl rounded-[2.25rem] p-10 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-[#8c877e]">
          Menyiapkan sesi
        </p>
      </div>
    )
  }

  return (
    <div className="surface-panel-strong w-full max-w-xl rounded-[2.25rem] p-8 text-center sm:p-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.6rem] bg-[var(--accent-soft)] text-[var(--accent-text)]">
        <Sparkles className="h-8 w-8" />
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-text)]">
        Learnial access
      </p>
      <h1 className="font-display mt-3 text-6xl font-semibold leading-none text-[var(--foreground)]">
        Learnial
      </h1>
      <p className="mt-4 text-base text-[var(--muted)]">
        Belajar lebih cerdas, jadwal lebih rapi.
      </p>

      <p className="mx-auto mt-6 max-w-lg text-sm leading-8 text-[var(--muted)]">
        Masuk menggunakan akun Google untuk menyimpan nama pengguna dengan lebih
        konsisten dan memakai seluruh fitur belajar di satu alur.
      </p>

      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-[1.4rem] border border-[rgba(241,220,146,0.34)] bg-[rgba(241,220,146,0.18)] px-4 py-3 text-left text-sm text-[var(--accent-warm-text)]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={handleGoogleLogin}
        disabled={submitting}
        className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full border border-[rgba(216,142,165,0.2)] bg-[rgba(255,248,245,0.96)] px-6 py-4 text-sm font-semibold text-[var(--foreground)] shadow-[0_14px_40px_rgba(115,76,89,0.1)] hover:-translate-y-0.5 hover:border-[rgba(216,142,165,0.32)] hover:bg-[rgba(255,241,246,0.96)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <GoogleIcon />
        {submitting ? "Mengalihkan ke Google..." : "Lanjutkan dengan Google"}
        <ArrowRight className="h-4 w-4" />
      </button>

      <p className="mt-4 text-xs leading-6 text-[#8f897f]">
        Google Sign-In memerlukan konfigurasi OAuth di Supabase dan Google Cloud
        Console.
      </p>
    </div>
  )
}
