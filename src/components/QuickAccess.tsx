/* ============================================================
   QuickAccess.tsx — Grille d'accès rapides
   Design : boutons "enfoncés" au clic, style plaquette émaillée
   ============================================================ */

import { motion } from "framer-motion";
import { quickAccess } from "../data/mockData";

type Categorie = "resto" | "culture" | "service" | null;

interface Props {
  onSelect: (categorie: Categorie) => void;
  selected: Categorie;
}

/* Couleurs par catégorie */
const categorieColors: Record<string, { bg: string; border: string; text: string; active: string }> = {
  resto:   { bg: "#FEF2F2", border: "#C83C3C", text: "#C83C3C", active: "#C83C3C" },
  culture: { bg: "#FEFCE8", border: "#D4A853", text: "#92650a", active: "#D4A853" },
  service: { bg: "#F0FDF4", border: "#2C5530", text: "#2C5530", active: "#2C5530" },
};

export default function QuickAccess({ onSelect, selected }: Props) {
  return (
    <section aria-label="Accès rapides" className="px-4 py-3">
      <div className="flex items-center gap-2 mb-3">
        <h2
          className="text-xs font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--paris-sepia)" }}
        >
          Accès rapides
        </h2>
        <div className="flex-1 h-px" style={{ background: "var(--paris-bordure)" }} aria-hidden="true" />
      </div>

      <div className="grid grid-cols-4 gap-2" role="group" aria-label="Filtres par catégorie">
        {quickAccess.map((item, i) => {
          const isActive = selected === item.categorie;
          const colors = categorieColors[item.categorie] ?? categorieColors.service;

          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35, ease: "easeOut" }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onSelect(isActive ? null : item.categorie as Categorie)}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl transition-all duration-200 btn-press"
              style={{
                backgroundColor: isActive ? colors.active : colors.bg,
                border: `1.5px solid ${isActive ? colors.border : "var(--paris-bordure)"}`,
                boxShadow: isActive
                  ? `0 2px 8px ${colors.border}33, inset 0 1px 2px rgba(0,0,0,0.06)`
                  : "0 1px 4px rgba(28,28,28,0.06)",
              }}
              aria-label={item.label}
              aria-pressed={isActive}
            >
              {/* Emoji dans un cercle */}
              <span
                className="text-xl leading-none"
                style={{
                  filter: isActive ? "brightness(1.2)" : "none",
                }}
              >
                {item.emoji}
              </span>
              <span
                className="text-[10px] font-medium leading-tight text-center"
                style={{ color: isActive ? "white" : colors.text }}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
