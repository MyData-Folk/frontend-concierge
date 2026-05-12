/* ============================================================
   Chat.tsx — Interface de conversation avec Léon
   Design : bulles de chat élégantes, avatar animé, suggestions rapides
   IA : appel à /api/chat (backend Gemini) avec fallback simulé
   ============================================================ */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LeonAvatar from "../components/LeonAvatar";
import { chatWithLeon, type ChatMessage } from "../services/api";
import { useHotel } from "../context/HotelContext";

/* ── Suggestions rapides ── */
const SUGGESTIONS = [
  "Où dîner ce soir ?",
  "Comment rejoindre le Louvre ?",
  "Code Wi-Fi ?",
  "Activités pour demain matin",
  "Les marchés du quartier",
  "Taxi ou Uber ?",
];

/* ── Message de bienvenue ── */
const WELCOME: ChatMessage = {
  role: "leon",
  content:
    "Bonjour ! Je suis Léon, votre concierge personnel. Que puis-je faire pour rendre votre séjour inoubliable ?",
};

/* ── Réponses simulées (fallback si API indisponible) ── */
const FALLBACK_REPLIES: Record<string, string> = {
  wifi: `Le réseau Wi-Fi est **HotelMarais_Guest** et le mot de passe est **Marais2024!** — connectez-vous sans hésiter !`,
  restaurant: `Je vous recommande chaleureusement **Chez Janou** (4 min à pied) pour un bistro provençal authentique. Réservez 48h à l'avance — ça part vite ! 🍷`,
  taxi: `Pour un taxi, appelez le **+33 1 45 85 85 85** (G7) ou utilisez l'application **Uber** ou **Bolt**. Je peux aussi appeler pour vous depuis la réception !`,
  metro: `La station **Saint-Paul** (Ligne 1) est à 7 min à pied. Elle vous mène directement au Louvre, Châtelet et les Champs-Élysées.`,
  checkout: `Le check-out est à **11h00**. Si vous avez besoin de garder vos bagages, la réception assure la bagagerie 24h/24 — aucun problème !`,
  default: `Excellente question ! Laissez-moi réfléchir… Pour tout ce qui concerne le Marais, n'hésitez pas à sonner à la réception — nous sommes à votre service de 8h à 21h. 😊`,
};

function getFallbackReply(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("wifi") || m.includes("wi-fi") || m.includes("internet") || m.includes("code"))
    return FALLBACK_REPLIES.wifi;
  if (m.includes("restaurant") || m.includes("dîner") || m.includes("manger") || m.includes("resto"))
    return FALLBACK_REPLIES.restaurant;
  if (m.includes("taxi") || m.includes("uber") || m.includes("voiture"))
    return FALLBACK_REPLIES.taxi;
  if (m.includes("métro") || m.includes("metro") || m.includes("transport") || m.includes("louvre"))
    return FALLBACK_REPLIES.metro;
  if (m.includes("checkout") || m.includes("check-out") || m.includes("bagage") || m.includes("partir"))
    return FALLBACK_REPLIES.checkout;
  return FALLBACK_REPLIES.default;
}

/* ── Composant bulle de message ── */
function MessageBubble({ msg, isLast }: { msg: ChatMessage; isLast: boolean }) {
  const isLeon = msg.role === "leon";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`flex items-end gap-2 ${isLeon ? "justify-start" : "justify-end"}`}
    >
      {/* Avatar Léon */}
      {isLeon && (
        <div className="flex-shrink-0 self-end mb-0.5">
          <LeonAvatar etat={isLast ? "recommandation" : "accueil"} taille={32} />
        </div>
      )}

      {/* Bulle */}
      <div
        className="max-w-[78%] rounded-2xl px-4 py-2.5 shadow-paris"
        style={{
          backgroundColor: isLeon ? "white" : "var(--paris-noir)",
          border: isLeon ? "1px solid var(--paris-bordure)" : "none",
          borderBottomLeftRadius: isLeon ? "4px" : undefined,
          borderBottomRightRadius: !isLeon ? "4px" : undefined,
        }}
      >
        {isLeon && (
          <p
            className="text-[9px] font-bold uppercase tracking-widest mb-1"
            style={{ color: "var(--paris-dore)" }}
          >
            Léon · Concierge
          </p>
        )}
        <p
          className="text-xs leading-relaxed"
          style={{
            color: isLeon ? "var(--paris-sepia)" : "rgba(255,255,255,0.92)",
            fontStyle: isLeon ? "italic" : "normal",
          }}
        >
          {msg.content}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Indicateur de saisie ── */
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex items-end gap-2"
    >
      <div className="flex-shrink-0 self-end mb-0.5">
        <LeonAvatar etat="recherche" taille={32} />
      </div>
      <div
        className="rounded-2xl rounded-bl-sm px-4 py-3 shadow-paris"
        style={{
          backgroundColor: "white",
          border: "1px solid var(--paris-bordure)",
        }}
      >
        <div className="flex gap-1.5 items-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "var(--paris-dore)" }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{
                duration: 1.2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Vue principale Chat ── */
export default function Chat() {
  const { hotel, coords, pois, wiki, isOnline } = useHotel();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Scroll automatique vers le bas */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMsg: ChatMessage = { role: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setShowSuggestions(false);
      setIsTyping(true);

      /* Délai minimum pour l'effet "Léon pense" */
      const minDelay = new Promise((r) => setTimeout(r, 1200));

      try {
        let reply: string;

        if (isOnline) {
          const hotelContext = {
            hotel_name: hotel.nom,
            coords,
            pois,
            wiki,
          };
          const history = messages.slice(-6); // 6 derniers messages pour le contexte
          const [res] = await Promise.all([
            chatWithLeon(text, history, hotelContext),
            minDelay,
          ]);
          reply = res.reply;
        } else {
          await minDelay;
          reply = getFallbackReply(text);
        }

        setMessages((prev) => [...prev, { role: "leon", content: reply }]);
      } catch {
        await minDelay;
        setMessages((prev) => [
          ...prev,
          {
            role: "leon",
            content:
              "Toutes mes excuses, je rencontre un petit souci technique. Contactez la réception directement — nous sommes là pour vous !",
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [isTyping, isOnline, hotel, coords, pois, wiki, messages]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div
      className="flex flex-col min-h-dvh"
      style={{ backgroundColor: "var(--paris-creme)" }}
    >
      {/* ── En-tête ── */}
      <div
        className="px-4 pt-5 pb-4 relative flex-shrink-0"
        style={{
          background: "linear-gradient(160deg, var(--paris-pierre) 0%, var(--paris-creme) 100%)",
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: "linear-gradient(90deg, transparent, var(--paris-dore), transparent)",
          }}
          aria-hidden="true"
        />

        <div className="flex items-center gap-3">
          <div className="relative">
            <LeonAvatar etat="accueil" taille={48} />
            {/* Indicateur en ligne */}
            <div
              className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
              style={{
                backgroundColor: isOnline ? "var(--paris-vert)" : "var(--paris-sepia)",
                borderColor: "var(--paris-creme)",
              }}
              title={isOnline ? "Connecté à l'API" : "Mode hors-ligne"}
            />
          </div>
          <div>
            <h1
              className="font-serif text-lg leading-tight"
              style={{ fontFamily: "'Playfair Display', serif", color: "var(--paris-noir)" }}
            >
              Léon
            </h1>
            <p className="text-[11px]" style={{ color: "var(--paris-sepia)" }}>
              Votre concierge personnel · {hotel.nom}
            </p>
          </div>

          {/* Badge mode */}
          <div className="ml-auto">
            <span
              className="px-2 py-0.5 rounded-full text-[9px] font-semibold"
              style={{
                backgroundColor: "rgba(212,168,83,0.12)",
                color: "var(--paris-dore)",
                border: "1px solid rgba(212,168,83,0.25)",
              }}
            >
              ✦ Léon IA
            </span>
          </div>
        </div>

        <div className="mt-3 paris-gold-line" aria-hidden="true" />
      </div>

      {/* ── Zone de messages ── */}
      <div
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
        style={{ paddingBottom: "5.5rem" }}
        role="log"
        aria-label="Conversation avec Léon"
        aria-live="polite"
      >
        {/* Suggestions rapides */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="pb-2"
            >
              <p
                className="text-[10px] uppercase tracking-widest mb-2 font-semibold"
                style={{ color: "var(--paris-sepia)" }}
              >
                Questions fréquentes
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="px-3 py-1.5 rounded-xl text-[11px] font-medium btn-press shadow-paris transition-all"
                    style={{
                      backgroundColor: "white",
                      border: "1px solid var(--paris-bordure)",
                      color: "var(--paris-sepia)",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            msg={msg}
            isLast={i === messages.length - 1 && msg.role === "leon"}
          />
        ))}

        {/* Indicateur de saisie */}
        <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* ── Zone de saisie ── */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-30 px-4 pb-safe-bottom"
        style={{
          paddingBottom: "max(4.5rem, calc(env(safe-area-inset-bottom) + 4.5rem))",
          background: "linear-gradient(to top, var(--paris-creme) 80%, transparent)",
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 rounded-2xl p-1.5 shadow-paris-md"
          style={{
            backgroundColor: "white",
            border: "1.5px solid var(--paris-dore)",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question à Léon…"
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
            style={{
              color: "var(--paris-noir)",
              fontFamily: "'DM Sans', sans-serif",
            }}
            aria-label="Message à Léon"
            disabled={isTyping}
          />
          <motion.button
            type="submit"
            disabled={!input.trim() || isTyping}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
            style={{
              background:
                input.trim() && !isTyping
                  ? "linear-gradient(135deg, var(--paris-dore), #e8b84b)"
                  : "var(--paris-pierre)",
              border: "1px solid var(--paris-bordure)",
            }}
            aria-label="Envoyer"
          >
            <span className="text-sm">{isTyping ? "⏳" : "➤"}</span>
          </motion.button>
        </form>

        {/* Note de confidentialité */}
        <p
          className="text-center text-[9px] mt-1.5"
          style={{ color: "rgba(107,94,83,0.5)" }}
        >
          Conciergerie ParisLocal · Votre séjour, notre priorité
        </p>
      </div>
    </div>
  );
}
