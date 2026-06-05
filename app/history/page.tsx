"use client"

import { useEffect, useState } from "react"
import {
  BookText,
  CalendarClock,
  History,
  KeyRound,
  LayoutList,
  NotebookPen,
} from "lucide-react"
import AppWorkspaceShell from "@/components/AppWorkspaceShell"
import {
  FlashcardHistoryEntry,
  getStoredHistory,
  HistoryEntry,
  ScheduleHistoryEntry,
  StudyHistoryEntry,
  subscribeToLearnialStorage,
} from "@/lib/history"

const navigation = [
  { href: "/study", icon: BookText, label: "Study" },
  { href: "/flashcard", icon: NotebookPen, label: "Flashcard" },
  { href: "/schedule", icon: CalendarClock, label: "Schedule" },
  { href: "/history", icon: History, label: "History" },
]

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

function getFeatureBadgeClass(feature: HistoryEntry["feature"]) {
  switch (feature) {
    case "study":
      return "border-[rgba(111,143,118,0.18)] bg-[rgba(111,143,118,0.08)] text-[#54685a]"
    case "flashcard":
      return "border-[rgba(209,138,97,0.18)] bg-[rgba(209,138,97,0.08)] text-[#8b543f]"
    case "schedule":
      return "border-[rgba(127,109,156,0.18)] bg-[rgba(127,109,156,0.08)] text-[#6a5d81]"
    default:
      return "border-slate-200 bg-slate-100 text-slate-700"
  }
}

function renderEntryDetail(entry: HistoryEntry) {
  if (entry.feature === "study") {
    const studyEntry = entry as StudyHistoryEntry

    return (
      <div className="grid gap-5">
        <div className="rounded-[1.5rem] border border-[rgba(128,112,94,0.12)] bg-white/55 p-4">
          <div className="mb-3 flex items-center gap-2 text-[#6f8f76]">
            <BookText className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-[0.22em]">
              Ringkasan
            </p>
          </div>
          <p className="text-sm leading-7 text-[#4d524d]">
            {studyEntry.detail.summary}
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[1.5rem] border border-[rgba(128,112,94,0.12)] bg-white/55 p-4">
            <div className="mb-3 flex items-center gap-2 text-[#6f8f76]">
              <LayoutList className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.22em]">
                Poin Penting
              </p>
            </div>
            <ul className="space-y-2">
              {studyEntry.detail.keyPoints.slice(0, 4).map((point, index) => (
                <li
                  key={`${entry.id}-point-${index}`}
                  className="rounded-xl bg-[rgba(111,143,118,0.05)] px-3 py-3 text-sm leading-7 text-[#4d524d]"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.5rem] border border-[rgba(128,112,94,0.12)] bg-white/55 p-4">
            <div className="mb-3 flex items-center gap-2 text-[#6f8f76]">
              <KeyRound className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.22em]">
                Kata Kunci
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {studyEntry.detail.keywords.slice(0, 6).map((keyword, index) => (
                <span
                  key={`${entry.id}-keyword-${index}`}
                  className="rounded-full border border-[rgba(111,143,118,0.18)] bg-[rgba(111,143,118,0.08)] px-4 py-2 text-sm font-medium text-[#54685a]"
                >
                  {keyword}
                </span>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-[rgba(209,138,97,0.08)] px-4 py-3 text-sm text-[#8b543f]">
              Quiz: {studyEntry.detail.quiz.multipleChoiceCount} pilihan ganda,{" "}
              {studyEntry.detail.quiz.essayCount} essay
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (entry.feature === "flashcard") {
    const flashcardEntry = entry as FlashcardHistoryEntry

    return (
      <div className="space-y-4">
        <div className="rounded-[1.5rem] bg-[rgba(209,138,97,0.08)] px-4 py-3 text-sm text-[#8b543f]">
          Total flashcard: {flashcardEntry.detail.cardCount}
        </div>

        <div className="grid gap-3">
          {flashcardEntry.detail.flashcards.map((card, index) => (
            <div
              key={`${entry.id}-flashcard-${index}`}
              className="rounded-[1.5rem] border border-[rgba(209,138,97,0.14)] bg-white/60 p-4"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#c56d54]">
                Kartu {index + 1}
              </p>
              <p className="font-medium leading-7 text-[#26302b]">{card.q}</p>
              <p className="mt-3 text-sm leading-7 text-[#5f675f]">{card.a}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const scheduleEntry = entry as ScheduleHistoryEntry

  return (
    <div className="space-y-4">
      <p className="text-sm leading-7 text-[#4d524d]">{scheduleEntry.resultText}</p>
      <div className="rounded-[1.5rem] border border-[rgba(127,109,156,0.14)] bg-white/60 p-4 text-sm text-[#4d524d]">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-[rgba(127,109,156,0.08)] px-3 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[#7f6d9c]">Hari</p>
            <p className="mt-2 font-medium">{scheduleEntry.detail.day}</p>
          </div>
          <div className="rounded-xl bg-[rgba(111,143,118,0.08)] px-3 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[#6f8f76]">Jam</p>
            <p className="mt-2 font-medium">{scheduleEntry.detail.time}</p>
          </div>
          <div className="rounded-xl bg-[rgba(209,138,97,0.08)] px-3 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[#c56d54]">Email</p>
            <p className="mt-2 font-medium">
              {scheduleEntry.detail.email || "Tidak diisi"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([])

  useEffect(() => {
    const syncHistory = () => {
      setHistory(getStoredHistory())
    }

    queueMicrotask(syncHistory)
    return subscribeToLearnialStorage(syncHistory)
  }, [])

  return (
    <AppWorkspaceShell
      eyebrow="Saved learning records"
      title="History Belajar"
      subtitle="Semua hasil generate dari AI Study Assistant, Flashcard Generator, dan Smart Schedule & Reminder tersusun dalam tampilan yang lebih mudah dipindai."
      icon={History}
      currentPath="/history"
      navigation={navigation}
    >
      {history.length === 0 ? (
        <div className="surface-panel rounded-[2rem] p-10 text-center">
          <h2 className="font-display text-4xl font-semibold text-[#26302b]">
            Belum ada history
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            Coba generate materi, flashcard, atau simpan jadwal terlebih dulu.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {history.map((entry) => (
            <article key={entry.id} className="surface-panel rounded-[2rem] p-6 sm:p-8">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${getFeatureBadgeClass(entry.feature)}`}
                    >
                      {getFeatureLabel(entry.feature)}
                    </span>
                    <span className="text-sm text-[#9b958c]">
                      {new Date(entry.createdAt).toLocaleString("id-ID")}
                    </span>
                  </div>

                  <h2 className="break-words font-display text-[2.3rem] font-semibold leading-tight text-[#26302b]">
                    {entry.title}
                  </h2>
                  <p className="mt-2 text-sm text-[#7d776f]">
                    Disimpan oleh {entry.userName}
                  </p>
                </div>
              </div>

              <div className="mb-5 rounded-[1.6rem] border border-[rgba(128,112,94,0.12)] bg-white/55 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#8c877e]">
                  Input
                </p>
                <p className="text-sm leading-7 text-[#4d524d]">{entry.inputText}</p>
              </div>

              {renderEntryDetail(entry)}
            </article>
          ))}
        </div>
      )}
    </AppWorkspaceShell>
  )
}
