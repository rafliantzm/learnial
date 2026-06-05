"use client";

import { useState } from "react";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Halo 👋 Ada yang bisa saya bantu?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await response.json();
      const aiText = data.text ?? "Maaf, tidak ada respons.";
      setMessages((prev) => [...prev, { role: "ai", text: aiText }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "Terjadi kesalahan. Coba lagi ya!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-[var(--accent)] text-white text-3xl shadow-[0_18px_40px_rgba(216,142,165,0.34)] transition hover:bg-[#cc7a95]"
      >
        ?
      </button>

      {open && (
        <div className="surface-panel-strong fixed bottom-24 right-6 z-50 flex h-[500px] w-96 flex-col rounded-3xl shadow-2xl">

          <div className="rounded-t-3xl bg-[var(--surface-yellow)] p-4">
            <h2 className="text-lg font-bold text-[var(--foreground)]">🤖 Learnial AI</h2>
            <p className="text-sm text-[var(--accent-warm-text)]">Siap membantu belajar</p>
          </div>

          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl max-w-[80%] text-sm ${
                  msg.role === "ai"
                    ? "self-start bg-[rgba(216,142,165,0.12)] text-[var(--foreground)]"
                    : "self-end bg-[var(--accent)] text-white"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="self-start rounded-xl bg-[rgba(216,142,165,0.12)] p-3 text-sm text-[var(--muted)]">
                Sedang mengetik...
              </div>
            )}
          </div>

          <div className="flex gap-2 border-t border-[rgba(210,176,184,0.18)] p-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ketik pertanyaan..."
              className="flex-1 rounded-xl border border-[rgba(210,176,184,0.18)] bg-[rgba(255,249,246,0.94)] p-2 text-sm text-[var(--foreground)] outline-none placeholder:text-[#aaa49b] focus:border-[rgba(216,142,165,0.28)]"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="rounded-xl bg-[var(--accent)] px-4 text-white disabled:opacity-50"
            >
              Kirim
            </button>
          </div>

        </div>
      )}
    </>
  );
}
