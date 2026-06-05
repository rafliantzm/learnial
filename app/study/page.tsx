"use client"

import {
  BookText,
  CalendarClock,
  History,
  NotebookPen,
} from "lucide-react"
import AppWorkspaceShell from "@/components/AppWorkspaceShell"
import StudyUploader from "@/components/StudyUploader"

const navigation = [
  { href: "/study", icon: BookText, label: "Study" },
  { href: "/flashcard", icon: NotebookPen, label: "Flashcard" },
  { href: "/schedule", icon: CalendarClock, label: "Schedule" },
  { href: "/history", icon: History, label: "History" },
]

export default function StudyPage() {
  return (
    <AppWorkspaceShell
      eyebrow="Learning assistant"
      title="AI Study Assistant"
      subtitle="Ringkas materi, identifikasi poin penting, hasilkan mindmap, dan siapkan quiz belajar dalam satu alur yang lebih nyaman dibaca."
      icon={BookText}
      currentPath="/study"
      navigation={navigation}
    >
      <StudyUploader />
    </AppWorkspaceShell>
  )
}
