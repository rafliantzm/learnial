"use client"

import { useState } from "react"
import {
  BookText,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  History,
  NotebookPen,
  RefreshCcw,
} from "lucide-react"
import AppWorkspaceShell from "@/components/AppWorkspaceShell"
import { FlashcardItem, getCurrentUserName, saveHistoryEntry } from "@/lib/history"

const navigation = [
  { href: "/study", icon: BookText, label: "Study" },
  { href: "/flashcard", icon: NotebookPen, label: "Flashcard" },
  { href: "/schedule", icon: CalendarClock, label: "Schedule" },
  { href: "/history", icon: History, label: "History" },
]

export default function FlashcardPage() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState("")
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    if (!file && !text.trim()) {
      setError("Upload file atau isi teks dulu")
      return
    }

    setLoading(true)
    setError("")
    setFlashcards([])
    setIndex(0)
    setFlipped(false)

    try {
      const formData = new FormData()
      if (file) formData.append("file", file)
      if (text) formData.append("text", text)

      const res = await fetch("/api/flashcard", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error || "Gagal generate flashcard")
        return
      }

      const generatedFlashcards = (data.flashcards || []) as FlashcardItem[]
      setFlashcards(generatedFlashcards)

      saveHistoryEntry({
        feature: "flashcard",
        title: file?.name || "Materi flashcard",
        userName: getCurrentUserName(),
        inputText: text.trim() || `File upload: ${file?.name || "Dokumen"}`,
        resultText: `${generatedFlashcards.length} flashcard berhasil dibuat`,
        detail: {
          cardCount: generatedFlashcards.length,
          flashcards: generatedFlashcards,
        },
      })
    } catch (err) {
      setError("Gagal menghubungi server")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const next = () => {
    if (index < flashcards.length - 1) {
      setIndex(index + 1)
      setFlipped(false)
    }
  }

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1)
      setFlipped(false)
    }
  }

  return (
    <AppWorkspaceShell
      eyebrow="Recall training"
      title="AI Flashcard Generator"
      subtitle="Ubah materi menjadi kartu tanya-jawab yang terasa lebih terstruktur, lebih fokus, dan lebih nyaman dipakai untuk review cepat."
      icon={NotebookPen}
      currentPath="/flashcard"
      navigation={navigation}
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="surface-panel-strong rounded-[2rem] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c56d54]">
            Input materi
          </p>
          <h2 className="font-display mt-3 text-[2rem] font-semibold text-[#26302b]">
            Buat set flashcard dari dokumen atau teks
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Cocok untuk review cepat sebelum kelas, hafalan konsep inti, dan
            latihan recall aktif.
          </p>

          <div className="mt-8 space-y-5">
            <div className="rounded-[1.5rem] border border-[rgba(128,112,94,0.14)] bg-white/60 p-4">
              <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.22em] text-[#8c877e]">
                File pembelajaran
              </label>
              <input
                type="file"
                accept=".pdf,.docx,.pptx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full rounded-2xl border border-[rgba(128,112,94,0.18)] bg-white px-4 py-3 text-sm text-[#4d524d] file:mr-4 file:rounded-full file:border-0 file:bg-[rgba(209,138,97,0.1)] file:px-4 file:py-2 file:font-medium file:text-[#8b543f] hover:file:bg-[rgba(209,138,97,0.16)]"
              />
              {file && (
                <p className="mt-3 text-sm text-[#6b726b]">
                  File terpilih: <span className="font-medium">{file.name}</span>
                </p>
              )}
            </div>

            <div className="rounded-[1.5rem] border border-[rgba(128,112,94,0.14)] bg-white/60 p-4">
              <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.22em] text-[#8c877e]">
                Teks materi
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Tempel materi di sini untuk dipecah menjadi kartu tanya-jawab..."
                className="h-44 w-full rounded-[1.35rem] border border-[rgba(128,112,94,0.18)] bg-white px-4 py-4 text-sm leading-7 text-[#414742] outline-none placeholder:text-[#aaa49b] focus:border-[rgba(209,138,97,0.28)]"
              />
            </div>

            {error && (
              <div className="rounded-[1.4rem] border border-[rgba(209,138,97,0.24)] bg-[rgba(209,138,97,0.12)] px-4 py-3 text-sm text-[#8b543f]">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-[#2f3835] px-6 py-3 text-sm font-semibold text-[#f8f1ea] shadow-[0_10px_30px_rgba(47,56,53,0.18)] hover:-translate-y-0.5 hover:bg-[#25302c] disabled:cursor-not-allowed disabled:bg-[#bfc3bf]"
            >
              <NotebookPen className="h-4 w-4" />
              {loading ? "Menyusun flashcard..." : "Buat Flashcard"}
            </button>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="surface-panel rounded-[2rem] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8c877e]">
                  Preview
                </p>
                <h3 className="font-display mt-2 text-[2rem] font-semibold text-[#26302b]">
                  Flashcard interaktif
                </h3>
              </div>
              <div className="rounded-full border border-[rgba(209,138,97,0.18)] bg-[rgba(209,138,97,0.08)] px-4 py-2 text-sm text-[#8b543f]">
                {flashcards.length > 0 ? `${index + 1} / ${flashcards.length}` : "Belum ada kartu"}
              </div>
            </div>

            <div
              onClick={() => flashcards.length > 0 && setFlipped(!flipped)}
              className={`mt-6 min-h-[20rem] rounded-[2rem] border p-8 transition-all ${
                flashcards.length === 0
                  ? "border-dashed border-[rgba(128,112,94,0.18)] bg-[rgba(255,255,255,0.56)]"
                  : flipped
                    ? "cursor-pointer border-[rgba(209,138,97,0.18)] bg-[rgba(209,138,97,0.08)] shadow-[0_18px_50px_rgba(209,138,97,0.08)]"
                    : "cursor-pointer border-[rgba(128,112,94,0.12)] bg-white/70 shadow-[0_18px_50px_rgba(42,33,23,0.06)]"
              }`}
            >
              {flashcards.length === 0 ? (
                <div className="flex h-full min-h-[14rem] flex-col items-center justify-center text-center">
                  <p className="font-display text-4xl font-semibold text-[#26302b]">
                    Kartu akan muncul di sini
                  </p>
                  <p className="mt-4 max-w-md text-sm leading-7 text-[var(--muted)]">
                    Setelah materi diproses, kamu bisa klik kartu untuk membalik
                    pertanyaan dan jawaban.
                  </p>
                </div>
              ) : !flipped ? (
                <div className="flex min-h-[14rem] flex-col justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8c877e]">
                      Pertanyaan
                    </p>
                    <h4 className="font-display mt-5 text-4xl font-semibold leading-tight text-[#26302b]">
                      {flashcards[index].q}
                    </h4>
                  </div>
                  <p className="text-sm text-[#8a867f]">
                    Klik kartu untuk melihat jawaban.
                  </p>
                </div>
              ) : (
                <div className="flex min-h-[14rem] flex-col justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c56d54]">
                      Jawaban
                    </p>
                    <p className="mt-5 text-lg leading-9 text-[#4f5550]">
                      {flashcards[index].a}
                    </p>
                  </div>
                  <p className="text-sm text-[#8a867f]">
                    Klik lagi untuk kembali ke pertanyaan.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={prev}
                disabled={index === 0}
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(128,112,94,0.14)] bg-white/70 px-4 py-2.5 text-sm font-medium text-[#55605a] hover:border-[rgba(111,143,118,0.24)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Sebelumnya
              </button>
              <button
                onClick={() => setFlipped(!flipped)}
                disabled={flashcards.length === 0}
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(209,138,97,0.18)] bg-[rgba(209,138,97,0.08)] px-4 py-2.5 text-sm font-medium text-[#8b543f] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RefreshCcw className="h-4 w-4" />
                Balik kartu
              </button>
              <button
                onClick={next}
                disabled={index === flashcards.length - 1 || flashcards.length === 0}
                className="inline-flex items-center gap-2 rounded-full bg-[#2f3835] px-4 py-2.5 text-sm font-medium text-[#f8f1ea] hover:bg-[#25302c] disabled:cursor-not-allowed disabled:bg-[#bfc3bf]"
              >
                Berikutnya
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {flashcards.length > 0 && (
              <div className="mt-6 h-2 rounded-full bg-[rgba(128,112,94,0.1)]">
                <div
                  className="h-2 rounded-full bg-[linear-gradient(90deg,#d18a61,#6f8f76)] transition-all"
                  style={{ width: `${((index + 1) / flashcards.length) * 100}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </AppWorkspaceShell>
  )
}
