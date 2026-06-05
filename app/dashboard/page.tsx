"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  BookOpenText,
  BrainCircuit,
  CalendarClock,
  ChartNoAxesColumn,
  ChevronRight,
  History,
  LogOut,
  NotebookPen,
  Sparkles,
} from "lucide-react"
import {
  signOutUser,
  syncStoredAuthUserFromSession,
  type StoredAuthUser,
} from "@/lib/auth"
import {
  getDashboardStats,
  getStoredHistory,
  HistoryEntry,
  subscribeToLearnialStorage,
} from "@/lib/history"

function getFeatureLabel(feature: HistoryEntry["feature"]) {
  switch (feature) {
    case "study":
      return "AI Study Assistant"
    case "flashcard":
      return "Flashcard Generator"
    case "schedule":
      return "Smart Schedule & Reminder"
    default:
      return "History"
  }
}

function getEntryAccent(feature: HistoryEntry["feature"]) {
  switch (feature) {
    case "study":
      return "text-[var(--accent-text)] bg-[rgba(216,142,165,0.12)] border-[rgba(216,142,165,0.18)]"
    case "flashcard":
      return "text-[var(--accent-warm-text)] bg-[rgba(241,220,146,0.18)] border-[rgba(241,220,146,0.28)]"
    case "schedule":
      return "text-[var(--accent-plum-text)] bg-[rgba(190,161,201,0.14)] border-[rgba(190,161,201,0.22)]"
    default:
      return "text-slate-700 bg-slate-100 border-slate-200"
  }
}

const statCards = [
  {
    key: "studyCount",
    label: "Materi Dipelajari",
    suffix: "materi",
    icon: BookOpenText,
    tone: "from-[rgba(216,142,165,0.22)] to-[rgba(216,142,165,0.05)]",
  },
  {
    key: "flashcardCount",
    label: "Flashcard Dibuat",
    suffix: "set",
    icon: NotebookPen,
    tone: "from-[rgba(241,220,146,0.22)] to-[rgba(241,220,146,0.06)]",
  },
  {
    key: "scheduleCount",
    label: "Jadwal Aktif",
    suffix: "agenda",
    icon: CalendarClock,
    tone: "from-[rgba(190,161,201,0.2)] to-[rgba(190,161,201,0.05)]",
  },
] as const

const featureCards = [
  {
    href: "/study",
    title: "AI Study Assistant",
    eyebrow: "Ringkas dan pahami materi",
    description:
      "Upload PDF, DOCX, atau PPT untuk mendapatkan ringkasan, poin penting, quiz otomatis, dan skor pemahaman.",
    cta: "Mulai belajar",
    icon: BrainCircuit,
    accent: "text-[var(--accent-text)]",
    badge: "Study flow",
  },
  {
    href: "/flashcard",
    title: "Flashcard Generator",
    eyebrow: "Belajar aktif dengan kartu",
    description:
      "Ubah materi kuliah menjadi flashcard interaktif untuk membantu proses belajar dan menghafal.",
    cta: "Buat flashcard",
    icon: NotebookPen,
    accent: "text-[var(--accent-warm-text)]",
    badge: "Recall mode",
  },
  {
    href: "/schedule",
    title: "Smart Schedule & Reminder",
    eyebrow: "Agenda kuliah lebih tertata",
    description:
      "Upload jadwal kuliah atau tambah kegiatan dan dapatkan pengingat otomatis melalui email.",
    cta: "Atur jadwal",
    icon: CalendarClock,
    accent: "text-[var(--accent-plum-text)]",
    badge: "Planner",
  },
] as const

export default function Dashboard() {
  const router = useRouter()
  const [authUser, setAuthUser] = useState<StoredAuthUser | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [stats, setStats] = useState({
    studyCount: 0,
    flashcardCount: 0,
    scheduleCount: 0,
  })
  const [recentHistory, setRecentHistory] = useState<HistoryEntry[]>([])

  useEffect(() => {
    const syncDashboard = async () => {
      const user = await syncStoredAuthUserFromSession()

      if (!user) {
        router.replace("/")
        return
      }

      setAuthUser(user)
      setStats(getDashboardStats())
      setRecentHistory(getStoredHistory().slice(0, 3))
      setCheckingAuth(false)
    }

    queueMicrotask(() => {
      void syncDashboard()
    })
    return subscribeToLearnialStorage(syncDashboard)
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
        <nav className="surface-panel rounded-[2rem] px-6 py-4 sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-text)]">
                <Sparkles className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-text)]">
                  Learnial Studio
                </p>
                <h1 className="font-display text-[2.2rem] font-semibold leading-none text-[var(--foreground)] sm:text-5xl">
                  Learnial
                </h1>
                <p className="mt-2 max-w-xl text-sm text-[var(--muted)] sm:text-base">
                  Belajar lebih cerdas, jadwal lebih rapi, dan riwayat belajar
                  tetap tersusun.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <div className="rounded-full border border-[rgba(216,142,165,0.2)] bg-[rgba(216,142,165,0.09)] px-4 py-2 text-sm text-[var(--accent-text)]">
                Selamat datang <span className="font-semibold">{authUser?.name}</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/history"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[#fff8f4] shadow-[0_10px_30px_rgba(216,142,165,0.28)] hover:-translate-y-0.5 hover:bg-[#cc7a95]"
                >
                  <History className="h-4 w-4" />
                  Buka History
                </Link>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(241,220,146,0.34)] bg-[rgba(241,220,146,0.18)] px-5 py-3 text-sm font-semibold text-[var(--accent-warm-text)] hover:bg-[rgba(241,220,146,0.24)]"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </div>
            </div>
          </div>
        </nav>

        <section className="relative mt-8 overflow-hidden rounded-[2.25rem] border border-[rgba(210,176,184,0.18)] bg-[rgba(255,244,247,0.78)] px-6 py-8 shadow-[0_16px_60px_rgba(115,76,89,0.08)] backdrop-blur-md sm:px-8 lg:px-10 lg:py-10">
          <div className="soft-orb right-[-2rem] top-[-1rem] h-32 w-32 bg-[rgba(216,142,165,0.2)]" />
          <div className="soft-orb bottom-6 right-40 h-24 w-24 bg-[rgba(241,220,146,0.18)]" />

          <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr]">
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent-text)]">
                Learnial study hub
              </p>
              <h2 className="font-display mt-4 max-w-3xl text-5xl font-semibold leading-[0.95] text-[var(--foreground)] sm:text-6xl">
                Belajar lebih terarah,
                <span className="ml-2 text-[var(--accent-text)]">jadwal lebih siap.</span>
              </h2>

              <div className="hairline mt-6" />

              <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
                Learnial membantu mahasiswa merangkum materi, membuat flashcard,
                dan mengatur agenda kuliah dalam satu alur belajar yang rapi,
                praktis, dan mudah dipakai setiap hari.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {featureCards.map((feature) => (
                  <Link
                    key={feature.href}
                    href={feature.href}
                    className="group inline-flex items-center gap-2 rounded-full border border-[rgba(210,176,184,0.18)] bg-[var(--surface-soft)] px-4 py-2.5 text-sm font-medium text-[var(--muted)] hover:border-[rgba(216,142,165,0.28)] hover:bg-[rgba(255,239,245,0.92)]"
                  >
                    <feature.icon className={`h-4 w-4 ${feature.accent}`} />
                    {feature.title}
                    <ChevronRight className="h-4 w-4 text-[#9a968e] transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative z-10 grid gap-4">
              <div className="surface-panel-strong rounded-[2rem] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-text)]">
                      Snapshot
                    </p>
                    <h3 className="mt-2 font-display text-3xl font-semibold text-[var(--foreground)]">
                      Ritme belajar minggu ini
                    </h3>
                  </div>
                  <ChartNoAxesColumn className="h-8 w-8 text-[var(--accent-text)]" />
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  {statCards.map((card) => {
                    const value = stats[card.key]

                    return (
                      <div
                        key={card.key}
                        className={`rounded-[1.5rem] border border-[rgba(255,250,246,0.7)] bg-gradient-to-br ${card.tone} p-4`}
                      >
                        <div className="flex items-center justify-between">
                          <card.icon className="h-5 w-5 text-[var(--foreground)]" />
                          <span className="text-[0.68rem] uppercase tracking-[0.24em] text-[#8c877e]">
                            {card.suffix}
                          </span>
                        </div>
                        <p className="mt-8 font-display text-5xl font-semibold leading-none text-[var(--foreground)]">
                          {value}
                        </p>
                        <p className="mt-3 text-sm text-[var(--muted)]">{card.label}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="surface-panel rounded-[1.75rem] p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#8c877e]">
                    Fokus utama
                  </p>
                  <p className="mt-3 font-display text-3xl font-semibold text-[#27302c]">
                    Belajar, mengingat, lalu menindaklanjuti.
                  </p>
                </div>

                <div className="surface-panel rounded-[1.75rem] p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#8c877e]">
                    Quick access
                  </p>
                  <div className="mt-4 space-y-3">
                    <Link
                      href="/study"
                      className="flex items-center justify-between rounded-2xl bg-[rgba(216,142,165,0.1)] px-4 py-3 text-sm font-medium text-[var(--accent-text)] hover:bg-[rgba(216,142,165,0.16)]"
                    >
                      Buka AI Study Assistant
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/history"
                      className="flex items-center justify-between rounded-2xl bg-[var(--surface-yellow)] px-4 py-3 text-sm font-medium text-[var(--accent-warm-text)] hover:bg-[var(--surface-yellow-strong)]"
                    >
                      Lihat riwayat terbaru
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-text)]">
                Feature workspace
              </p>
              <h3 className="font-display mt-2 text-4xl font-semibold text-[var(--foreground)]">
                Tiga alat utama untuk ritme belajar harian
              </h3>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {featureCards.map((feature, index) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="group surface-panel relative overflow-hidden rounded-[2rem] p-6 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(115,76,89,0.1)]"
              >
                <div className="absolute right-5 top-5 rounded-full border border-[rgba(210,176,184,0.18)] bg-[rgba(255,245,248,0.86)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#8c877e]">
                  {feature.badge}
                </div>

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[rgba(255,246,244,0.9)] ${feature.accent}`}
                >
                  <feature.icon className="h-7 w-7" />
                </div>

                <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-[#8c877e]">
                  {feature.eyebrow}
                </p>
                <h4 className="mt-3 font-display text-[2.1rem] font-semibold leading-tight text-[var(--foreground)]">
                  {feature.title}
                </h4>
                <p className="mt-4 min-h-28 text-base leading-8 text-[var(--muted)]">
                  {feature.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-[rgba(210,176,184,0.16)] pt-4">
                  <span className="text-sm font-medium text-[var(--muted)]">
                    {feature.cta}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#9a968e]">
                      0{index + 1}
                    </span>
                    <ArrowRight className="h-4 w-4 text-[#9a968e] transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="surface-panel mt-8 rounded-[2.25rem] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-text)]">
                Recent activity
              </p>
              <h3 className="font-display mt-2 text-4xl font-semibold text-[var(--foreground)]">
                Aktivitas terbaru
              </h3>
              <p className="mt-2 text-[var(--muted)]">
                Preview history terakhir dari semua fitur.
              </p>
            </div>

            <Link
              href="/history"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-text)] hover:text-[#7e5666]"
            >
              Lihat semua
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recentHistory.length === 0 ? (
            <div className="mt-6 rounded-[1.75rem] border border-dashed border-[rgba(210,176,184,0.22)] bg-[var(--surface-soft)] px-6 py-10 text-center text-[var(--muted)]">
              Belum ada history tersimpan.
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {recentHistory.map((entry) => (
                <article
                  key={entry.id}
                  className="group rounded-[1.75rem] border border-[rgba(210,176,184,0.16)] bg-[var(--surface-soft-strong)] p-5 hover:border-[rgba(216,142,165,0.24)] hover:bg-[rgba(255,244,247,0.98)]"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${getEntryAccent(entry.feature)}`}
                        >
                          {getFeatureLabel(entry.feature)}
                        </span>
                        <span className="text-xs uppercase tracking-[0.18em] text-[#a19a90]">
                          tersimpan
                        </span>
                      </div>

                      <h4 className="mt-4 break-words font-display text-[2rem] font-semibold leading-tight text-[var(--foreground)]">
                        {entry.title}
                      </h4>
                      <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--muted)] line-clamp-3">
                        {entry.resultText}
                      </p>
                    </div>

                    <div className="shrink-0 text-left md:text-right">
                      <p className="text-sm font-medium text-[#7d776f]">
                        {new Date(entry.createdAt).toLocaleDateString("id-ID")}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#aaa39a]">
                        {new Date(entry.createdAt).toLocaleTimeString("id-ID")}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
