/* ============================================================
   LieuCard.tsx — Carte de lieu avec bordure colorée par catégorie
   Badge "Coup de cœur" animé, note de Léon, micro-interactions
   ============================================================ */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Lieu } from "../data/mockData";

interface Props {
  lieu: Lieu;
  index: number;
}

/* Couleurs et labels par catégorie */
const categorieStyle: Record<string, { className: string; label: string; labelColor: string; bg: string }> = {
  resto:   { className: "card-resto",   label: "Restaurant",   labelColor: "var(--paris-rouge)", bg: "#FEF2F2" },
  culture: { className: "card-culture", label: "Culture",      labelColor: "#92650a",            bg: "#FEFCE8" },
  service: { className: "card-service", label: "Service",      labelColor: "var(--paris-vert)",   bg: "#F0FDF4" },
};

/* Animation stagger : les cartes apparaissent avec un décalage */
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.45,
      ease: "easeOut" as const,
    },
  }),
};

export default function LieuCard({ lieu, index }: Props) {
  const [expanded, setExpanded] = useState(false);
  const style = categorieStyle[lieu.categorie];

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      layout
      className={`relative rounded-2xl overflow-hidden shadow-paris ${style.className}`}
      style={{
        backgroundColor: "white",
        border: "1px solid var(--paris-bordure)",
      }}
      aria-label={`${lieu.nom} — ${style.label}`}
    >
      {/* ── En-tête de la carte ── */}
      <button
        className="w-full text-left p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        style={{ "--tw-ring-color": "var(--paris-dore)" } as React.CSSProperties}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between gap-2">
          {/* Icône + infos */}
          <div className="flex items-start gap-3">
            {/* Emoji dans un cercle coloré */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
              style={{ backgroundColor: style.bg }}
              aria-hidden="true"
            >
              {lieu.emoji}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  className="font-semibold text-sm leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif", color: "var(--paris-noir)" }}
                >
                  {lieu.nom}
                </h3>
                {/* Badge "Coup de cœur" */}
                {lieu.coupDeCoeur && (
                  <span
                    className="badge-shimmer inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white"
                    role="img"
                    aria-label="Coup de cœur de Léon"
                  >
                    ★ Coup de cœur
                  </span>
                )}
              </div>
              <p
                className="text-[11px] mt-0.5"
                style={{ color: style.labelColor, fontWeight: 500 }}
              >
                {lieu.sousCategorie}
              </p>
              <p
                className="text-xs mt-1 leading-snug line-clamp-2"
                style={{ color: "var(--paris-sepia)" }}
              >
                {lieu.description}
              </p>
            </div>
          </div>

          {/* Chevron animé */}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="flex-shrink-0 text-sm mt-0.5"
            style={{ color: "var(--paris-sepia)" }}
            aria-hidden="true"
          >
            ▾
          </motion.span>
        </div>

        {/* Infos rapides */}
        <div className="flex items-center gap-3 mt-3">
          <span
            className="flex items-center gap-1 text-[11px]"
            style={{ color: "var(--paris-sepia)" }}
          >
            <span aria-hidden="true">📍</span>
            <span>{lieu.distance}</span>
          </span>
          <span
            className="w-px h-3"
            style={{ background: "var(--paris-bordure)" }}
            aria-hidden="true"
          />
          <span
            className="flex items-center gap-1 text-[11px]"
            style={{ color: "var(--paris-sepia)" }}
          >
            <span aria-hidden="true">💰</span>
            <span>{lieu.prix}</span>
          </span>
        </div>
      </button>

      {/* ── Détails expandables ── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="mx-4 mb-4 pt-3"
              style={{ borderTop: "1px solid var(--paris-bordure)" }}
            >
              {/* Horaires & adresse */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p
                    className="text-[10px] uppercase tracking-wider mb-1 font-semibold"
                    style={{ color: "var(--paris-sepia)" }}
                  >
                    Horaires
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--paris-noir)" }}>
                    {lieu.horaires}
                  </p>
                </div>
                <div>
                  <p
                    className="text-[10px] uppercase tracking-wider mb-1 font-semibold"
                    style={{ color: "var(--paris-sepia)" }}
                  >
                    Adresse
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--paris-noir)" }}>
                    {lieu.adresse}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {lieu.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-[10px]"
                    style={{
                      backgroundColor: style.bg,
                      color: style.labelColor,
                      border: `1px solid ${style.labelColor}44`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Note de Léon */}
              <div
                className="rounded-xl p-3"
                style={{ backgroundColor: "#FDFBF7", border: "1px solid var(--paris-dore)44" }}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-widest mb-1"
                  style={{ color: "var(--paris-dore)" }}
                >
                  💬 Léon vous dit…
                </p>
                <p
                  className="text-[11px] leading-relaxed italic"
                  style={{ color: "var(--paris-sepia)" }}
                >
                  "{lieu.noteLeon}"
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
