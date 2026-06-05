"use client"

import { useEffect, useState } from "react"
import {
  BookText,
  CalendarClock,
  History,
  Mail,
  NotebookPen,
  Plus,
} from "lucide-react"
import AppWorkspaceShell from "@/components/AppWorkspaceShell"
import {
  getCurrentUserName,
  getStoredSchedules,
  saveHistoryEntry,
  saveScheduleItem,
  ScheduleItem,
} from "@/lib/history"

const navigation = [
  { href: "/study", icon: BookText, label: "Study" },
  { href: "/flashcard", icon: NotebookPen, label: "Flashcard" },
  { href: "/schedule", icon: CalendarClock, label: "Schedule" },
  { href: "/history", icon: History, label: "History" },
]

export default function SchedulePage() {
  const [title, setTitle] = useState("")
  const [day, setDay] = useState("")
  const [time, setTime] = useState("")
  const [email, setEmail] = useState("")
  const [scheduleList, setScheduleList] = useState<ScheduleItem[]>([])

  useEffect(() => {
    const syncSchedules = () => {
      setScheduleList(getStoredSchedules())
    }

    queueMicrotask(syncSchedules)
    window.addEventListener("focus", syncSchedules)

    return () => {
      window.removeEventListener("focus", syncSchedules)
    }
  }, [])

  const handleSave = () => {
    if (!title || !day || !time) {
      alert("Lengkapi data dulu")
      return
    }

    const nextSchedules = saveScheduleItem({
      title,
      day,
      time,
      email,
    })

    saveHistoryEntry({
      feature: "schedule",
      title,
      userName: getCurrentUserName(),
      inputText: `${title} pada ${day} pukul ${time}`,
      resultText: email
        ? `Jadwal tersimpan dengan email pengingat ke ${email}`
        : "Jadwal tersimpan tanpa email pengingat",
      detail: {
        day,
        time,
        email,
      },
    })

    setScheduleList(nextSchedules)
    setTitle("")
    setDay("")
    setTime("")
    setEmail("")
  }

  return (
    <AppWorkspaceShell
      eyebrow="Planner workspace"
      title="Smart Schedule Planner"
      subtitle="Kelola agenda belajar dan kegiatan kuliah dalam panel yang lebih terstruktur, hangat, dan cepat dipindai."
      icon={CalendarClock}
      currentPath="/schedule"
      navigation={navigation}
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-panel-strong rounded-[2rem] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-plum-text)]">
            Agenda baru
          </p>
          <h2 className="font-display mt-3 text-[2rem] font-semibold text-[var(--foreground)]">
            Tambah kegiatan manual
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nama kegiatan"
              className="rounded-[1.35rem] border border-[rgba(196,165,157,0.18)] bg-white px-4 py-3 text-sm text-[#434943] outline-none placeholder:text-[#aaa49b] focus:border-[rgba(216,142,165,0.28)]"
            />

            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="rounded-[1.35rem] border border-[rgba(196,165,157,0.18)] bg-white px-4 py-3 text-sm text-[#434943] outline-none focus:border-[rgba(216,142,165,0.28)]"
            >
              <option value="">Hari</option>
              <option>Senin</option>
              <option>Selasa</option>
              <option>Rabu</option>
              <option>Kamis</option>
              <option>Jumat</option>
              <option>Sabtu</option>
            </select>

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="rounded-[1.35rem] border border-[rgba(196,165,157,0.18)] bg-white px-4 py-3 text-sm text-[#434943] outline-none focus:border-[rgba(216,142,165,0.28)]"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (opsional)"
              className="rounded-[1.35rem] border border-[rgba(196,165,157,0.18)] bg-white px-4 py-3 text-sm text-[#434943] outline-none placeholder:text-[#aaa49b] focus:border-[rgba(216,142,165,0.28)]"
            />
          </div>

          <button
            onClick={handleSave}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--accent-ink)] px-6 py-3 text-sm font-semibold text-[#fff8f4] shadow-[0_10px_30px_rgba(94,73,81,0.22)] hover:-translate-y-0.5 hover:bg-[var(--accent-ink-hover)]"
          >
            <Plus className="h-4 w-4" />
            Simpan Jadwal
          </button>
        </div>

        <div className="grid gap-4">
          <div className="surface-panel rounded-[1.75rem] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8c877e]">
              Ritme agenda
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-[1.4rem] bg-[rgba(190,161,201,0.16)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent-plum-text)]">
                  Total agenda
                </p>
                <p className="font-display mt-3 text-4xl font-semibold text-[var(--foreground)]">
                  {scheduleList.length}
                </p>
              </div>
              <div className="rounded-[1.4rem] bg-[rgba(216,142,165,0.09)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent-text)]">
                  Dengan email
                </p>
                <p className="font-display mt-3 text-4xl font-semibold text-[var(--foreground)]">
                  {scheduleList.filter((item) => item.email).length}
                </p>
              </div>
              <div className="rounded-[1.4rem] bg-[rgba(241,220,146,0.16)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent-warm-text)]">
                  Tanpa email
                </p>
                <p className="font-display mt-3 text-4xl font-semibold text-[var(--foreground)]">
                  {scheduleList.filter((item) => !item.email).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="surface-panel mt-6 rounded-[2rem] p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-plum-text)]">
              Agenda tersimpan
            </p>
            <h3 className="font-display mt-2 text-[2rem] font-semibold text-[var(--foreground)]">
              Jadwal Saya
            </h3>
          </div>
        </div>

        {scheduleList.length === 0 ? (
          <div className="mt-6 rounded-[1.75rem] border border-dashed border-[rgba(210,176,184,0.22)] bg-[var(--surface-soft)] px-6 py-10 text-center text-[var(--muted)]">
            Belum ada jadwal.
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {scheduleList.map((item) => (
              <div
                key={item.id}
                className="rounded-[1.6rem] border border-[rgba(210,176,184,0.18)] bg-[var(--surface-soft-strong)] p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-display text-[1.8rem] font-semibold text-[var(--foreground)]">
                      {item.title}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-sm">
                      <span className="rounded-full bg-[rgba(190,161,201,0.16)] px-3 py-2 text-[var(--accent-plum-text)]">
                        {item.day}
                      </span>
                      <span className="rounded-full bg-[rgba(216,142,165,0.1)] px-3 py-2 text-[var(--accent-text)]">
                        {item.time}
                      </span>
                    </div>
                  </div>

                  {item.email && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(241,220,146,0.18)] px-4 py-2 text-sm text-[var(--accent-warm-text)]">
                      <Mail className="h-4 w-4" />
                      {item.email}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppWorkspaceShell>
  )
}
