import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

export interface StoredAuthUser {
  id: string
  name: string
  email: string
  avatarUrl: string
}

const AUTH_USER_STORAGE_KEY = "learnial_auth_user"

function isBrowser() {
  return typeof window !== "undefined"
}

function getUserDisplayName(user: User) {
  return (
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Mahasiswa"
  )
}

function mapUserToStoredAuthUser(user: User): StoredAuthUser {
  return {
    id: user.id,
    name: getUserDisplayName(user),
    email: user.email || "",
    avatarUrl: user.user_metadata?.avatar_url || "",
  }
}

export function getStoredAuthUser() {
  if (!isBrowser()) {
    return null
  }

  const rawValue = window.localStorage.getItem(AUTH_USER_STORAGE_KEY)

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as StoredAuthUser
  } catch {
    return null
  }
}

export function persistStoredAuthUser(user: StoredAuthUser) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user))
  window.localStorage.setItem("user_name", user.name)
  window.localStorage.setItem("learnial_name", user.name)
}

export function clearStoredAuthUser() {
  if (!isBrowser()) {
    return
  }

  window.localStorage.removeItem(AUTH_USER_STORAGE_KEY)
  window.localStorage.removeItem("user_name")
  window.localStorage.removeItem("learnial_name")
}

export async function syncStoredAuthUserFromSession() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    clearStoredAuthUser()
    return null
  }

  const storedUser = mapUserToStoredAuthUser(user)
  persistStoredAuthUser(storedUser)

  return storedUser
}

export async function signInWithGoogle() {
  const redirectTo = `${window.location.origin}/dashboard`

  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  })
}

export async function signOutUser() {
  await supabase.auth.signOut()
  clearStoredAuthUser()
}
