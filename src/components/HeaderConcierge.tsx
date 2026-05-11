/* ============================================================
   HeaderConcierge.tsx — En-tête avec Léon et sa bulle de dialogue
   Design : cartouche élégant, typographie Playfair, badge hôtel
   ============================================================ */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LeonAvatar from "./LeonAvatar";
import { leonMessages } from "../data/mockData";
import { useHotel } from "../context/HotelContext";

type LeonEtat = "accueil" | "recherche" | "recommandation";

interface Props {
  etat?: LeonEtat;
  messageOverride?: string;
}

export default function HeaderConcierge({ etat = "accueil", messageOverride }: Props) {
  const { hotel, isOnline } = useHotel();
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = leonMessages[etat];

  /* Rotation automatique des messages de Léon toutes les 6s */
  useEffect(() => {
    if (messageOverride) return;
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % messages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [messages.length, messageOverride]);

  const currentMessage = messageOverride ?? messages[messageIndex];

  return (
    <header
      className="relative px-4 pt-5 pb-4"
      style={{ background: "linear-gradient(160deg, var(--paris-pierre) 0%, var(--paris-creme) 100%)" }}
      role="banner"
    >
      {/* Motif de fond subtil */}
      <div
        className="absolute inset-0 paris-bg-pattern opacity-60 pointer-events-none"
        aria-hidden="true"
      />

      {/* Ligne dorée décorative en haut */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, transparent, var(--paris-dore), transparent)" }}
        aria-hidden="true"
      />

      <div className="relative flex items-start gap-3">
        {/* ── Avatar de Léon ── */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <LeonAvatar etat={etat} taille={64} />
          {/* Badge statut */}
          <div
            className="mt-1 px-2 py-0.5 rounded-full text-[9px] font-medium tracking-wide shadow-sm"
            style={{
              backgroundColor: isOnline ? "var(--paris-vert)" : "var(--paris-sepia)",
              color: "white",
            }}
          >
            {isOnline ? "En ligne" : "Local"}
          </div>
        </div>

        {/* ── Partie droite : logo hôtel + bulle ── */}
        <div className="flex-1 min-w-0">
          {/* Logo / Nom de l'hôtel */}
          <div className="flex items-center justify-between mb-2">
            <div className="min-w-0">
              <p
                className="text-[10px] uppercase tracking-[0.2em] font-medium mb-0.5"
                style={{ color: "var(--paris-sepia)" }}
              >
                Bienvenue au
              </p>
              <h1
                className="font-serif text-lg leading-tight truncate"
                style={{ color: "var(--paris-noir)", fontFamily: "'Playfair Display', serif" }}
              >
                {hotel.nom}
              </h1>
            </div>

            {/* Emblème doré stylisé */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shadow-paris flex-shrink-0 ml-2"
              style={{
                background: "linear-gradient(135deg, var(--paris-dore), #e8b84b)",
                border: "1.5px solid rgba(212,168,83,0.5)",
              }}
              aria-hidden="true"
            >
              <span className="text-sm" style={{ fontFamily: "'Playfair Display', serif", color: "#1C1C1C", fontWeight: 700 }}>
                {hotel.nom.charAt(0)}
              </span>
            </div>
          </div>

          {/* Bulle de dialogue de Léon */}
          <div className="relative">
            {/* Triangle de la bulle */}
            <div
              className="absolute -left-3 top-3 w-0 h-0"
              style={{
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderRight: "8px solid white",
                filter: "drop-shadow(-1px 0 1px rgba(28,28,28,0.08))",
              }}
              aria-hidden="true"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentMessage}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="rounded-2xl rounded-tl-sm px-3 py-2.5 shadow-paris"
                style={{
                  backgroundColor: "white",
                  border: "1px solid var(--paris-bordure)",
                }}
                role="status"
                aria-live="polite"
              >
                {/* Nom de Léon */}
                <p
                  className="text-[10px] font-semibold uppercase tracking-widest mb-1"
                  style={{ color: "var(--paris-dore)" }}
                >
                  Léon · Concierge
                </p>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--paris-sepia)", fontStyle: "italic" }}
                >
                  "{currentMessage}"
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Filet séparateur doré en bas */}
      <div className="mt-4 paris-gold-line" aria-hidden="true" />
    </header>
  );
}
