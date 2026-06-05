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
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7f6d9c]">
            Agenda baru
          </p>
          <h2 className="font-display mt-3 text-[2rem] font-semibold text-[#26302b]">
            Tambah kegiatan manual
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nama kegiatan"
              className="rounded-[1.35rem] border border-[rgba(128,112,94,0.16)] bg-white px-4 py-3 text-sm text-[#434943] outline-none placeholder:text-[#aaa49b] focus:border-[rgba(127,109,156,0.28)]"
            />

            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="rounded-[1.35rem] border border-[rgba(128,112,94,0.16)] bg-white px-4 py-3 text-sm text-[#434943] outline-none focus:border-[rgba(127,109,156,0.28)]"
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
              className="rounded-[1.35rem] border border-[rgba(128,112,94,0.16)] bg-white px-4 py-3 text-sm text-[#434943] outline-none focus:border-[rgba(127,109,156,0.28)]"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (opsional)"
              className="rounded-[1.35rem] border border-[rgba(128,112,94,0.16)] bg-white px-4 py-3 text-sm text-[#434943] outline-none placeholder:text-[#aaa49b] focus:border-[rgba(127,109,156,0.28)]"
            />
          </div>

          <button
            onClick={handleSave}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2f3835] px-6 py-3 text-sm font-semibold text-[#f8f1ea] shadow-[0_10px_30px_rgba(47,56,53,0.18)] hover:-translate-y-0.5 hover:bg-[#25302c]"
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
              <div className="rounded-[1.4rem] bg-[rgba(127,109,156,0.08)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#7f6d9c]">
                  Total agenda
                </p>
                <p className="font-display mt-3 text-4xl font-semibold text-[#26302b]">
                  {scheduleList.length}
                </p>
              </div>
              <div className="rounded-[1.4rem] bg-[rgba(111,143,118,0.08)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#6f8f76]">
                  Dengan email
                </p>
                <p className="font-display mt-3 text-4xl font-semibold text-[#26302b]">
                  {scheduleList.filter((item) => item.email).length}
                </p>
              </div>
              <div className="rounded-[1.4rem] bg-[rgba(209,138,97,0.08)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#c56d54]">
                  Tanpa email
                </p>
                <p className="font-display mt-3 text-4xl font-semibold text-[#26302b]">
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
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7f6d9c]">
              Agenda tersimpan
            </p>
            <h3 className="font-display mt-2 text-[2rem] font-semibold text-[#26302b]">
              Jadwal Saya
            </h3>
          </div>
        </div>

        {scheduleList.length === 0 ? (
          <div className="mt-6 rounded-[1.75rem] border border-dashed border-[rgba(128,112,94,0.18)] bg-[rgba(255,255,255,0.56)] px-6 py-10 text-center text-[var(--muted)]">
            Belum ada jadwal.
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {scheduleList.map((item) => (
              <div
                key={item.id}
                className="rounded-[1.6rem] border border-[rgba(128,112,94,0.12)] bg-white/68 p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-display text-[1.8rem] font-semibold text-[#26302b]">
                      {item.title}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-sm">
                      <span className="rounded-full bg-[rgba(127,109,156,0.08)] px-3 py-2 text-[#6a5d81]">
                        {item.day}
                      </span>
                      <span className="rounded-full bg-[rgba(111,143,118,0.08)] px-3 py-2 text-[#54685a]">
                        {item.time}
                      </span>
                    </div>
                  </div>

                  {item.email && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(209,138,97,0.08)] px-4 py-2 text-sm text-[#8b543f]">
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
