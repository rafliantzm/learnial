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
          className="rounded-[1.5rem] border border-[rgba(128,112,94,0.12)] bg-white/55 p-5"
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
                    className="rounded-[1.15rem] bg-[rgba(111,143,118,0.06)] px-4 py-3"
                  >
                    <span className="font-semibold text-[#2f3835]">
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
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(111,143,118,0.1)] text-[#6f8f76]">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-display text-[1.9rem] font-semibold text-[#26302b]">
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
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.4rem] bg-[rgba(111,143,118,0.12)] text-[#6f8f76]">
              <BookText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6f8f76]">
                Input materi
              </p>
              <h2 className="font-display text-[2rem] font-semibold text-[#26302b]">
                Unggah dokumen atau tempel teks
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="rounded-[1.5rem] border border-[rgba(128,112,94,0.14)] bg-white/60 p-4">
              <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.22em] text-[#8c877e]">
                File pembelajaran
              </label>
              <input
                type="file"
                accept=".pdf,.docx,.pptx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full rounded-2xl border border-[rgba(128,112,94,0.18)] bg-white px-4 py-3 text-sm text-[#4d524d] file:mr-4 file:rounded-full file:border-0 file:bg-[rgba(111,143,118,0.1)] file:px-4 file:py-2 file:font-medium file:text-[#506255] hover:file:bg-[rgba(111,143,118,0.16)]"
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
                placeholder="Tempel materi di sini untuk diringkas, disusun, dan dijadikan quiz..."
                className="h-40 w-full rounded-[1.35rem] border border-[rgba(128,112,94,0.18)] bg-white px-4 py-4 text-sm leading-7 text-[#414742] outline-none placeholder:text-[#aaa49b] focus:border-[rgba(111,143,118,0.28)]"
              />
            </div>

            {error && (
              <div className="rounded-[1.4rem] border border-[rgba(209,138,97,0.24)] bg-[rgba(209,138,97,0.12)] px-4 py-3 text-sm text-[#8b543f]">
                {error}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={loading || (!file && !text)}
                className="inline-flex items-center gap-2 rounded-full bg-[#2f3835] px-6 py-3 text-sm font-semibold text-[#f8f1ea] shadow-[0_10px_30px_rgba(47,56,53,0.18)] hover:-translate-y-0.5 hover:bg-[#25302c] disabled:cursor-not-allowed disabled:bg-[#bfc3bf]"
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
                <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-[1.25rem] bg-[rgba(111,143,118,0.1)] text-[#6f8f76]">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-[1.7rem] font-semibold text-[#26302b]">
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
                    className="rounded-2xl border border-[rgba(128,112,94,0.12)] bg-white/60 px-4 py-3 text-sm font-medium text-[#4d524d]"
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
                    className="rounded-[1.35rem] border border-[rgba(128,112,94,0.12)] bg-white/55 px-4 py-3 text-sm leading-7 text-[#47504a]"
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
                    className="rounded-full border border-[rgba(111,143,118,0.18)] bg-[rgba(111,143,118,0.08)] px-4 py-2 text-sm font-medium text-[#54685a]"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </StudySection>
          </div>

          <StudySection icon={Network} title="Mindmap">
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-[1.5rem] border border-[rgba(128,112,94,0.12)] bg-white/55 p-4 font-mono text-sm leading-7 text-[#4a514a]">
              {result.mindmap}
            </pre>
          </StudySection>

          <StudySection icon={BrainCircuit} title="Quiz Belajar">
            <div className="grid gap-8 xl:grid-cols-2">
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#6f8f76]">
                  Pilihan Ganda
                </p>
                <div className="space-y-4">
                  {(result.quiz.multipleChoice || []).map((q, index) => (
                    <div
                      key={index}
                      className="rounded-[1.5rem] border border-[rgba(128,112,94,0.12)] bg-white/60 p-4"
                    >
                      <p className="font-medium leading-7 text-[#2f342f]">
                        {index + 1}. {q.question}
                      </p>
                      <div className="mt-3 space-y-2">
                        {q.options.map((option, optionIndex) => (
                          <label
                            key={optionIndex}
                            className="flex items-center gap-3 rounded-xl bg-[rgba(111,143,118,0.05)] px-3 py-2 text-sm text-[#4d524d]"
                          >
                            <input type="radio" name={`mc_${index}`} />
                            {option}
                          </label>
                        ))}
                      </div>
                      <details className="mt-4 text-sm text-[#5f675f]">
                        <summary className="cursor-pointer font-semibold text-[#6f8f76]">
                          Lihat jawaban & penjelasan
                        </summary>
                        <div className="mt-3 rounded-xl bg-[rgba(111,143,118,0.08)] p-3 leading-7">
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
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#c56d54]">
                  Essay
                </p>
                <div className="space-y-4">
                  {(result.quiz.essay || []).map((q, index) => (
                    <div
                      key={index}
                      className="rounded-[1.5rem] border border-[rgba(128,112,94,0.12)] bg-white/60 p-4"
                    >
                      <p className="font-medium leading-7 text-[#2f342f]">
                        {index + 1}. {q.question}
                      </p>
                      <textarea
                        placeholder="Tulis jawaban Anda..."
                        className="mt-4 h-28 w-full rounded-[1.2rem] border border-[rgba(128,112,94,0.14)] bg-white px-4 py-3 text-sm text-[#444a44] outline-none placeholder:text-[#aaa49b] focus:border-[rgba(111,143,118,0.28)]"
                      />
                      <details className="mt-4 text-sm text-[#5f675f]">
                        <summary className="cursor-pointer font-semibold text-[#c56d54]">
                          Lihat jawaban & penjelasan
                        </summary>
                        <div className="mt-3 rounded-xl bg-[rgba(209,138,97,0.08)] p-3 leading-7">
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

            <div className="mt-6 rounded-[1.5rem] border border-[rgba(128,112,94,0.12)] bg-white/55 px-4 py-3 text-sm text-[#6b726b]">
              Processing time: {result.metadata.processingTime || '-'} • Panjang
              teks: {result.metadata.textLength || 0} karakter
            </div>
          </StudySection>
        </div>
      )}
    </div>
  )
}
