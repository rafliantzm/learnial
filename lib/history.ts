import { getStoredAuthUser } from "@/lib/auth"

export interface FlashcardItem {
  q: string
  a: string
}

export interface QuizCounts {
  multipleChoiceCount: number
  essayCount: number
}

export interface StudyHistoryDetail {
  summary: string
  keyPoints: string[]
  keywords: string[]
  mindmap: string
  quiz: QuizCounts
}

export interface FlashcardHistoryDetail {
  cardCount: number
  flashcards: FlashcardItem[]
}

export interface ScheduleItem {
  id: string
  title: string
  day: string
  time: string
  email: string
  createdAt: string
}

export interface ScheduleHistoryDetail {
  day: string
  time: string
  email: string
}

interface BaseHistoryEntry {
  id: string
  title: string
  userName: string
  inputText: string
  resultText: string
  createdAt: string
}

export interface StudyHistoryEntry extends BaseHistoryEntry {
  feature: "study"
  detail: StudyHistoryDetail
}

export interface FlashcardHistoryEntry extends BaseHistoryEntry {
  feature: "flashcard"
  detail: FlashcardHistoryDetail
}

export interface ScheduleHistoryEntry extends BaseHistoryEntry {
  feature: "schedule"
  detail: ScheduleHistoryDetail
}

export type HistoryEntry =
  | StudyHistoryEntry
  | FlashcardHistoryEntry
  | ScheduleHistoryEntry

type HistoryEntryInput = Omit<HistoryEntry, "id" | "createdAt">
type ScheduleItemInput = Omit<ScheduleItem, "id" | "createdAt">

const HISTORY_STORAGE_KEY = "learnial_history"
const SCHEDULE_STORAGE_KEY = "learnial_schedule_list"
const STORAGE_EVENT_NAME = "learnial-storage-update"
const MAX_HISTORY_ITEMS = 50

function isBrowser() {
  return typeof window !== "undefined"
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback
  }

  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

function dispatchStorageUpdate() {
  if (!isBrowser()) {
    return
  }

  window.dispatchEvent(new Event(STORAGE_EVENT_NAME))
}

export function subscribeToLearnialStorage(callback: () => void) {
  if (!isBrowser()) {
    return () => undefined
  }

  const handler = () => callback()

  window.addEventListener(STORAGE_EVENT_NAME, handler)
  window.addEventListener("storage", handler)
  window.addEventListener("focus", handler)

  return () => {
    window.removeEventListener(STORAGE_EVENT_NAME, handler)
    window.removeEventListener("storage", handler)
    window.removeEventListener("focus", handler)
  }
}

export function getCurrentUserName() {
  if (!isBrowser()) {
    return "Mahasiswa"
  }

  const authUser = getStoredAuthUser()

  return (
    authUser?.name ||
    window.localStorage.getItem("user_name") ||
    window.localStorage.getItem("learnial_name") ||
    "Mahasiswa"
  )
}

export function getStoredHistory() {
  if (!isBrowser()) {
    return [] as HistoryEntry[]
  }

  const entries = parseJson<HistoryEntry[]>(
    window.localStorage.getItem(HISTORY_STORAGE_KEY),
    []
  )

  return entries.sort(
    (first, second) =>
      new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
  )
}

export function saveHistoryEntry(entry: HistoryEntryInput) {
  if (!isBrowser()) {
    return null
  }

  const history = getStoredHistory()
  const newEntry = {
    ...entry,
    id: createId(),
    createdAt: new Date().toISOString(),
  } as HistoryEntry

  const nextHistory = [newEntry, ...history].slice(0, MAX_HISTORY_ITEMS)

  window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(nextHistory))
  dispatchStorageUpdate()

  return newEntry
}

export function getStoredSchedules() {
  if (!isBrowser()) {
    return [] as ScheduleItem[]
  }

  return parseJson<ScheduleItem[]>(
    window.localStorage.getItem(SCHEDULE_STORAGE_KEY),
    []
  ).sort(
    (first, second) =>
      new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
  )
}

export function saveScheduleItem(item: ScheduleItemInput) {
  if (!isBrowser()) {
    return [] as ScheduleItem[]
  }

  const schedules = getStoredSchedules()
  const newItem: ScheduleItem = {
    ...item,
    id: createId(),
    createdAt: new Date().toISOString(),
  }

  const nextSchedules = [newItem, ...schedules]

  window.localStorage.setItem(
    SCHEDULE_STORAGE_KEY,
    JSON.stringify(nextSchedules)
  )
  dispatchStorageUpdate()

  return nextSchedules
}

export function getDashboardStats() {
  const history = getStoredHistory()
  const schedules = getStoredSchedules()

  return {
    studyCount: history.filter((entry) => entry.feature === "study").length,
    flashcardCount: history.filter((entry) => entry.feature === "flashcard").length,
    scheduleCount: schedules.length,
  }
}
