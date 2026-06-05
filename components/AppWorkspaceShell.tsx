"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, LogOut, LucideIcon } from "lucide-react"
import {
  signOutUser,
  syncStoredAuthUserFromSession,
  type StoredAuthUser,
} from "@/lib/auth"

interface NavigationItem {
  href: string
  icon: LucideIcon
  label: string
}

interface AppWorkspaceShellProps {
  eyebrow: string
  title: string
  subtitle: string
  icon: LucideIcon
  currentPath: string
  navigation: NavigationItem[]
  children: React.ReactNode
}

export default function AppWorkspaceShell({
  eyebrow,
  title,
  subtitle,
  icon: PageIcon,
  currentPath,
  navigation,
  children,
}: AppWorkspaceShellProps) {
  const router = useRouter()
  const [authUser, setAuthUser] = useState<StoredAuthUser | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const ensureAuth = async () => {
      const user = await syncStoredAuthUserFromSession()

      if (!user) {
        router.replace("/")
        return
      }

      setAuthUser(user)
      setCheckingAuth(false)
    }

    ensureAuth()
  }, [router])

  const handleSignOut = async () => {
    await signOutUser()
    router.replace("/")
  }

  if (checkingAuth) {
    return (
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-5 sm:px-8 lg:px-10">
        <div className="surface-panel rounded-[2rem] px-6 py-8 text-sm text-[#7d776f] sm:px-8">
          Memeriksa sesi login...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-5 sm:px-8 lg:px-10">
        <div className="surface-panel rounded-[2rem] px-6 py-4 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="mt-1 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(210,176,184,0.18)] bg-[var(--surface-soft)] text-[var(--muted)] hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[rgba(255,239,245,0.92)] hover:text-[var(--accent-text)]"
                title="Kembali ke dashboard"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-text)]">
                  {eyebrow}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-[var(--accent-soft)] text-[var(--accent-text)]">
                    <PageIcon className="h-7 w-7" />
                  </div>
                  <h1 className="font-display text-[2.5rem] font-semibold leading-none text-[var(--foreground)] sm:text-5xl">
                    {title}
                  </h1>
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                  {subtitle}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 lg:items-end">
              <div className="rounded-full border border-[rgba(216,142,165,0.2)] bg-[rgba(216,142,165,0.09)] px-4 py-2 text-sm text-[var(--accent-text)]">
                Masuk sebagai <span className="font-semibold">{authUser?.name}</span>
              </div>

              <div className="flex flex-wrap gap-2 lg:max-w-[24rem] lg:justify-end">
              {navigation.map((item) => {
                const isActive = currentPath === item.href
                const ItemIcon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium ${
                      isActive
                        ? "border-[rgba(216,142,165,0.24)] bg-[rgba(216,142,165,0.1)] text-[var(--accent-text)]"
                        : "border-[rgba(210,176,184,0.16)] bg-[var(--surface-soft)] text-[var(--muted)] hover:border-[rgba(216,142,165,0.24)] hover:bg-[rgba(255,239,245,0.92)]"
                    }`}
                  >
                    <ItemIcon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(241,220,146,0.32)] bg-[rgba(241,220,146,0.16)] px-4 py-2.5 text-sm font-medium text-[var(--accent-warm-text)] hover:bg-[rgba(241,220,146,0.24)]"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">{children}</div>
      </div>
    </div>
  )
}
