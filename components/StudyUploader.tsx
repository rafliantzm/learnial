'use client'

import { useState } from 'react'
import {
  BookText,
  BrainCircuit,
  FileText,
  KeyRound,
  LayoutList,
  Network,
  Sparkles,
} from 'lucide-react'
import { getCurrentUserName, saveHistoryEntry } from '@/lib/history'

interface MultipleChoiceQuestion {
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

interface EssayQuestion {
  question: string
  keyAnswer: string
  explanation: string
}

interface StudyResult {
  summary: string
  keyPoints: string[]
  keywords: string[]
  mindmap: string
  quiz: {
    multipleChoice: MultipleChoiceQuestion[]
    essay: EssayQuestion[]
  }
  metadata: {
    processingTime: string
    textLength: number
  }
}

const featureNotes = [
  {
    icon: Sparkles,
    title: 'Ringkasan cepat',
    description: 'Inti materi dipadatkan agar lebih mudah dipahami.',
  },
  {
    icon: LayoutList,
    title: 'Poin penting',
    description: 'Topik utama dan keyword ditarik menjadi struktur belajar.',
  },
  {
    icon: BrainCircuit,
    title: 'Quiz otomatis',
    description: 'Pilihan ganda dan essay untuk menguji pemahamanmu.',
  },
]

interface SummarySection {
  title: string
  body: string[]
}

function normalizeSummaryText(summary: string) {
  return summary
    .replace(/\*\*/g, '')
    .replace(/([^\n])\s+(\d+\.)\s*/g, '$1\n\n$2 ')
    .replace(/\s+\n/g, '\n')
    .trim()
}

function parseSummarySections(summary: string): SummarySection[] {
  const normalized = normalizeSummaryText(summary)
  const blocks = normalized
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)

  if (blocks.length === 0) {
    return []
  }

  const sections: SummarySection[] = []

  for (const block of blocks) {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)

    const [firstLine, ...restLines] = lines

    if (!firstLine) {
      continue
    }

    if (firstLine.endsWith(":")) {
      sections.push({
        title: firstLine.replace(/:$/, ""),
        body: restLines.length > 0 ? restLines : [""],
      })
      continue
    }

    sections.push({
      title: sections.length === 0 ? "Ringkasan Utama" : "Detail",
      body: [block],
    })
  }

  return sections
}

function SummaryContent({ summary }: { summary: string }) {
  const sections = parseSummarySections(summary)

  if (sections.length === 0) {
    return <p className="text-base leading-8 text-[var(--muted)]">{summary}</p>
  }

  return (
    <div className="space-y-5">
      {sections.map((section, index) => (
        <div
          key={`${section.title}-${index}`}
          className="rounded-[1.5rem] border border-[rgba(210,176,184,0.18)] bg-[var(--surface-soft)] p-5"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8c877e]">
            {section.title}
          </p>

          <div className="mt-3 space-y-3 text-[15px] leading-8 text-[#505750]">
            {section.body.map((line, lineIndex) => {
              if (/^\d+\.\s/.test(line)) {
                const cleanedLine = line.replace(/^(\d+)\.\s*/, "")
                const [topicTitle, ...detailParts] = cleanedLine.split(" - ")
                const detailText = detailParts.join(" - ")

                return (
                  <div
                    key={lineIndex}
                    className="rounded-[1.15rem] bg-[rgba(216,142,165,0.08)] px-4 py-3"
                  >
                    <span className="font-semibold text-[var(--foreground)]">
                      {line.match(/^\d+/)?.[0]}. {topicTitle}
                    </span>
                    {detailText ? (
                      <span className="text-[#5f655f]"> - {detailText}</span>
                    ) : null}
                  </div>
                )
              }

              return <p key={lineIndex}>{line}</p>
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function StudySection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="surface-panel rounded-[1.8rem] p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-text)]">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-display text-[1.9rem] font-semibold text-[var(--foreground)]">
          {title}
        </h3>
      </div>
      {children}
    </section>
  )
}

export default function StudyUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StudyResult | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()

      if (file) {
        formData.append('file', file)
      }
      if (text) {
        formData.append('text', text)
      }
      formData.append('user_name', getCurrentUserName())

      const response = await fetch('/api/study', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Error tidak diketahui')
        return
      }

      const studyResult: StudyResult = {
        ...data.data,
        metadata: data.metadata,
      }

      setResult(studyResult)

      saveHistoryEntry({
        feature: 'study',
        title: file?.name || 'Materi teks',
        userName: getCurrentUserName(),
        inputText: text.trim() || `File upload: ${file?.name || 'Dokumen'}`,
        resultText: studyResult.summary,
        detail: {
          summary: studyResult.summary,
          keyPoints: studyResult.keyPoints,
          keywords: studyResult.keywords,
          mindmap: studyResult.mindmap,
          quiz: {
            multipleChoiceCount: studyResult.quiz.multipleChoice.length,
            essayCount: studyResult.quiz.essay.length,
          },
        },
      })

      setFile(null)
      setText('')
    } catch (err) {
      setError('Gagal menghubungi server')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-panel-strong rounded-[2rem] p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.4rem] bg-[var(--accent-soft)] text-[var(--accent-text)]">
              <BookText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-text)]">
                Input materi
              </p>
              <h2 className="font-display text-[2rem] font-semibold text-[var(--foreground)]">
                Unggah dokumen atau tempel teks
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="rounded-[1.5rem] border border-[rgba(210,176,184,0.18)] bg-[var(--surface-soft-strong)] p-4">
              <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.22em] text-[#8c877e]">
                File pembelajaran
              </label>
              <input
                type="file"
                accept=".pdf,.docx,.pptx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full rounded-2xl border border-[rgba(196,165,157,0.18)] bg-white px-4 py-3 text-sm text-[#4d524d] file:mr-4 file:rounded-full file:border-0 file:bg-[rgba(216,142,165,0.12)] file:px-4 file:py-2 file:font-medium file:text-[var(--accent-text)] hover:file:bg-[rgba(216,142,165,0.18)]"
              />
              {file && (
                <p className="mt-3 text-sm text-[#6b726b]">
                  File terpilih: <span className="font-medium">{file.name}</span>
                </p>
              )}
            </div>

            <div className="rounded-[1.5rem] border border-[rgba(210,176,184,0.18)] bg-[var(--surface-soft-strong)] p-4">
              <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.22em] text-[#8c877e]">
                Teks materi
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Tempel materi di sini untuk diringkas, disusun, dan dijadikan quiz..."
                className="h-40 w-full rounded-[1.35rem] border border-[rgba(196,165,157,0.18)] bg-white px-4 py-4 text-sm leading-7 text-[#414742] outline-none placeholder:text-[#aaa49b] focus:border-[rgba(216,142,165,0.28)]"
              />
            </div>

            {error && (
              <div className="rounded-[1.4rem] border border-[rgba(241,220,146,0.32)] bg-[rgba(241,220,146,0.18)] px-4 py-3 text-sm text-[var(--accent-warm-text)]">
                {error}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={loading || (!file && !text)}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-ink)] px-6 py-3 text-sm font-semibold text-[#fff8f4] shadow-[0_10px_30px_rgba(94,73,81,0.22)] hover:-translate-y-0.5 hover:bg-[var(--accent-ink-hover)] disabled:cursor-not-allowed disabled:bg-[#c9c0bf]"
              >
                <Sparkles className="h-4 w-4" />
                {loading ? 'Memproses materi...' : 'Ringkas Materi'}
              </button>

              <p className="text-sm text-[#7d776f]">
                Cocok untuk PDF, DOCX, PPTX, atau teks panjang.
              </p>
            </div>
          </form>
        </div>

        <div className="grid gap-4">
          {featureNotes.map((item) => (
            <div key={item.title} className="surface-panel rounded-[1.75rem] p-5">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-[1.25rem] bg-[var(--accent-soft)] text-[var(--accent-text)]">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-[1.7rem] font-semibold text-[var(--foreground)]">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="surface-panel rounded-[1.75rem] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8c877e]">
              Output yang dihasilkan
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {['Ringkasan', 'Poin penting', 'Keyword', 'Mindmap', 'Quiz'].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[rgba(210,176,184,0.18)] bg-[var(--surface-soft)] px-4 py-3 text-sm font-medium text-[#4d524d]"
                  >
                    {item}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="grid gap-6">
          <StudySection icon={FileText} title="Ringkasan">
            <SummaryContent summary={result.summary} />
          </StudySection>

          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <StudySection icon={LayoutList} title="Poin Penting">
              <ul className="space-y-3">
                {(result.keyPoints || []).map((point, index) => (
                  <li
                    key={index}
                    className="rounded-[1.35rem] border border-[rgba(210,176,184,0.18)] bg-[var(--surface-soft)] px-4 py-3 text-sm leading-7 text-[#47504a]"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </StudySection>

            <StudySection icon={KeyRound} title="Kata Kunci">
              <div className="flex flex-wrap gap-2">
                {(result.keywords || []).map((keyword, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-[rgba(216,142,165,0.2)] bg-[rgba(216,142,165,0.1)] px-4 py-2 text-sm font-medium text-[var(--accent-text)]"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </StudySection>
          </div>

          <StudySection icon={Network} title="Mindmap">
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-[1.5rem] border border-[rgba(210,176,184,0.18)] bg-[var(--surface-soft)] p-4 font-mono text-sm leading-7 text-[#4a514a]">
              {result.mindmap}
            </pre>
          </StudySection>

          <StudySection icon={BrainCircuit} title="Quiz Belajar">
            <div className="grid gap-8 xl:grid-cols-2">
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-text)]">
                  Pilihan Ganda
                </p>
                <div className="space-y-4">
                  {(result.quiz.multipleChoice || []).map((q, index) => (
                    <div
                      key={index}
                      className="rounded-[1.5rem] border border-[rgba(210,176,184,0.18)] bg-[var(--surface-soft-strong)] p-4"
                    >
                      <p className="font-medium leading-7 text-[#2f342f]">
                        {index + 1}. {q.question}
                      </p>
                      <div className="mt-3 space-y-2">
                        {q.options.map((option, optionIndex) => (
                          <label
                            key={optionIndex}
                            className="flex items-center gap-3 rounded-xl bg-[rgba(216,142,165,0.08)] px-3 py-2 text-sm text-[#4d524d]"
                          >
                            <input type="radio" name={`mc_${index}`} />
                            {option}
                          </label>
                        ))}
                      </div>
                      <details className="mt-4 text-sm text-[#5f675f]">
                        <summary className="cursor-pointer font-semibold text-[var(--accent-text)]">
                          Lihat jawaban & penjelasan
                        </summary>
                        <div className="mt-3 rounded-xl bg-[rgba(216,142,165,0.12)] p-3 leading-7">
                          <p>
                            <strong>Jawaban:</strong> {q.correctAnswer}
                          </p>
                          <p>
                            <strong>Penjelasan:</strong> {q.explanation}
                          </p>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-warm-text)]">
                  Essay
                </p>
                <div className="space-y-4">
                  {(result.quiz.essay || []).map((q, index) => (
                    <div
                      key={index}
                      className="rounded-[1.5rem] border border-[rgba(210,176,184,0.18)] bg-[var(--surface-soft-strong)] p-4"
                    >
                      <p className="font-medium leading-7 text-[#2f342f]">
                        {index + 1}. {q.question}
                      </p>
                      <textarea
                        placeholder="Tulis jawaban Anda..."
                        className="mt-4 h-28 w-full rounded-[1.2rem] border border-[rgba(196,165,157,0.16)] bg-white px-4 py-3 text-sm text-[#444a44] outline-none placeholder:text-[#aaa49b] focus:border-[rgba(216,142,165,0.28)]"
                      />
                      <details className="mt-4 text-sm text-[#5f675f]">
                        <summary className="cursor-pointer font-semibold text-[var(--accent-warm-text)]">
                          Lihat jawaban & penjelasan
                        </summary>
                        <div className="mt-3 rounded-xl bg-[rgba(241,220,146,0.16)] p-3 leading-7">
                          <p className="font-semibold">Poin jawaban diharapkan:</p>
                          <pre className="mt-2 whitespace-pre-wrap font-mono text-xs leading-6">
                            {q.keyAnswer}
                          </pre>
                          <p className="mt-2">
                            <strong>Penjelasan:</strong> {q.explanation}
                          </p>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-[rgba(210,176,184,0.18)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[#6b726b]">
              Processing time: {result.metadata.processingTime || '-'} • Panjang
              teks: {result.metadata.textLength || 0} karakter
            </div>
          </StudySection>
        </div>
      )}
    </div>
  )
}
