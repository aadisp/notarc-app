"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { Drone, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm the Notarc assistant. Ask me about our drones, robotics kits, or courses.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [imageFailed, setImageFailed] = useState(false);

  // Entrance path: the widget starts off-screen past the bottom-left
  // corner, then travels along the screen edges — up to top-left, across
  // to top-right, then down to its resting spot at bottom-right — driven
  // by the chat-corner-path keyframes below.
  const [skipEntranceAnimation] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  });

  // The WhatsApp/Instagram icons should only appear once the widget has
  // finished its corner-path entrance animation and settled into its
  // resting spot — not fly in alongside it. If the entrance animation is
  // skipped (reduced motion), treat it as already landed.
  const [hasLanded, setHasLanded] = useState(skipEntranceAnimation);

  function handleContainerAnimationEnd(
    event: React.AnimationEvent<HTMLDivElement>
  ) {
    if (event.animationName === "chat-corner-path") {
      setHasLanded(true);
    }
  }

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isOpen]);

  async function handleSend() {

    const trimmed = input.trim();

    if (!trimmed || isLoading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.reply },
      ]);

    } catch {

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "Sorry, I ran into an issue. Please try again in a moment.",
        },
      ]);

    } finally {
      setIsLoading(false);
    }

  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (

    <div
      onAnimationEnd={handleContainerAnimationEnd}
      className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 ${
        skipEntranceAnimation ? "" : "animate-chat-corner-path"
      }`}
    >

      {isOpen && (

        <div className="flex h-[480px] w-[340px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d10]/95 shadow-2xl backdrop-blur-md sm:w-[380px]">

          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">

            <div className="flex items-center gap-2">

              <div className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-sm font-semibold text-white">
                Notarc Assistant
              </span>

            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>

          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >

            {messages.map((message, index) => (

              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-white text-black"
                      : "bg-white/[0.06] text-white/90"
                  }`}
                >
                  {message.content}
                </div>

              </div>

            ))}

            {isLoading && (

              <div className="flex justify-start">

                <div className="rounded-2xl bg-white/[0.06] px-3.5 py-2.5">

                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50" />
                  </div>

                </div>

              </div>

            )}

          </div>

          <div className="flex items-center gap-2 border-t border-white/10 p-3">

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something..."
              className="h-10 flex-1 rounded-full border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/30"
            />

            <Button
              size="icon"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="h-10 w-10 shrink-0 rounded-full bg-white text-black hover:bg-white/90 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </Button>

          </div>

        </div>

      )}

      <div className="group relative">

        {!isOpen && hasLanded && (
          <div
            className="
              absolute
              bottom-full
              right-1
              mb-3
              flex
              flex-col
              items-center
              gap-2.5
            "
          >

            <a
              href="https://instagram.com/notarc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Notarc on Instagram"
              className="
                h-10
                w-10
                animate-social-icon-in
                rounded-full
                p-[2px]
                shadow-lg
                transition-transform
                duration-300
                hover:scale-110
              "
              style={{
                background:
                  "linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)",
              }}
            >
              <span className="flex h-full w-full items-center justify-center rounded-full text-white ">
                <svg viewBox="0 0 24 24" className="h-5 w-5">
                  <path
                    fill="currentColor"
                    d="M12 0C8.74 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.986 8.74 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.058-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.014 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.68a6.16 6.16 0 100 12.318 6.16 6.16 0 000-12.318zm0 10.163a4 4 0 110-8.002 4 4 0 010 8.002zm7.846-10.406a1.44 1.44 0 11-2.881.001 1.44 1.44 0 012.881-.001z"
                  />
                </svg>
              </span>
            </a>

            <a
              href="https://wa.me/917975782830"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with Notarc on WhatsApp"
              className="
                h-10
                w-10
                animate-social-icon-in
                rounded-full
                bg-[#25D366]
                p-[2px]
                shadow-lg
                transition-transform
                duration-300
                hover:scale-110
              "
              style={{ animationDelay: "80ms" }}
            >
              <span className="flex h-full w-full items-center justify-center rounded-full text-white">
                <svg viewBox="0 0 24 24" className="h-5 w-5">
                  <path
                    fill="currentColor"
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.87 11.87 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"
                  />
                </svg>
              </span>
            </a>

          </div>
        )}

        {!isOpen && (
          <div
            className="
              pointer-events-none
              absolute
              right-full
              top-1/2
              mr-3
              -translate-y-1/2
              translate-x-2
              whitespace-nowrap
              rounded-xl
              border
              border-white/10
              bg-[#0b0d10]/95
              px-4
              py-2
              text-sm
              font-medium
              text-white
              opacity-0
              shadow-xl
              backdrop-blur-md
              transition-all
              duration-300
              group-hover:translate-x-0
              group-hover:opacity-100
            "
          >
            How can I help you?
          </div>
        )}

        <button
          onClick={() => setIsOpen((open) => !open)}
          className={`relative flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 hover:scale-110 ${
            !isOpen ? "animate-chat-float" : ""
          } ${
            isOpen || imageFailed
              ? "bg-white text-black shadow-2xl"
              : ""
          }`}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : !imageFailed ? (
            <img
              src="/chatbot-icon.png"
              alt="Chat with us"
              onError={() => setImageFailed(true)}
              className="h-14 w-14 object-contain drop-shadow-[0_6px_16px_rgba(0,0,0,0.35)]"
            />
          ) : (
            <Drone className="h-6 w-6" />
          )}
        </button>

      </div>

    </div>

  );

}