/* ============================================================
   BottomMenu.tsx — Barre de navigation fixe (mis à jour)
   Navigation : Accueil | Carte | [Léon Chat] | Hôtel
   Le bouton central "✦" ouvre le menu complet (drawer)
   ============================================================ */

import { motion } from "framer-motion";
import type { Vue } from "../App";

interface Props {
  vueActive: Vue;
  onNavigate: (vue: Vue) => void;
  onDrawer: () => void;
}

const navItems: Array<{ id: Vue; label: string; emoji: string; ariaLabel: string }> = [
  { id: "home",  label: "Accueil",  emoji: "🏠",  ariaLabel: "Page d'accueil" },
  { id: "map",   label: "Carte",    emoji: "🗺️",  ariaLabel: "Voir la carte du quartier" },
  { id: "chat",  label: "Léon",     emoji: "💬",  ariaLabel: "Parler à Léon" },
  { id: "info",  label: "Hôtel",    emoji: "🛎️",  ariaLabel: "Informations hôtel" },
];

export default function BottomMenu({ vueActive, onNavigate, onDrawer }: Props) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40"
      aria-label="Navigation principale"
    >
      {/* Ligne dorée décorative en haut de la barre */}
      <div
        className="h-px w-full"
        style={{ background: "linear-gradient(90deg, transparent, var(--paris-dore) 30%, var(--paris-dore) 70%, transparent)" }}
        aria-hidden="true"
      />

      <div
        className="backdrop-nav px-2 pt-2 pb-safe-bottom"
        style={{
          paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
          borderTop: "1px solid var(--paris-bordure)",
        }}
      >
        <div className="flex items-center justify-around relative">
          {navItems.slice(0, 2).map((item) => (
            <NavButton
              key={item.id}
              item={item}
              isActive={vueActive === item.id}
              onClick={() => onNavigate(item.id)}
            />
          ))}

          {/* ── Bouton central "Plus" (Drawer) ── */}
          <div className="flex flex-col items-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onDrawer}
              className="w-14 h-14 rounded-full flex items-center justify-center -mt-6 shadow-paris-md animate-pulse-gold"
              style={{
                background: "linear-gradient(135deg, var(--paris-dore), #e8b84b)",
                border: "2px solid rgba(255,255,255,0.6)",
              }}
              aria-label="Ouvrir le menu complet"
              aria-haspopup="dialog"
            >
              <motion.span
                animate={{ rotate: [0, 0] }}
                className="text-2xl"
                style={{ lineHeight: 1 }}
              >
                ✦
              </motion.span>
            </motion.button>
            <span
              className="text-[9px] mt-1.5 font-medium"
              style={{ color: "var(--paris-sepia)" }}
            >
              Plus
            </span>
          </div>

          {navItems.slice(2).map((item) => (
            <NavButton
              key={item.id}
              item={item}
              isActive={vueActive === item.id}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ── Bouton de navigation individuel ── */
function NavButton({
  item,
  isActive,
  onClick,
}: {
  item: (typeof navItems)[0];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors duration-200 btn-press"
      style={{
        backgroundColor: isActive ? "rgba(212, 168, 83, 0.12)" : "transparent",
      }}
      aria-label={item.ariaLabel}
      aria-current={isActive ? "page" : undefined}
    >
      <span
        className="text-xl leading-none"
        style={{
          filter: isActive ? "none" : "grayscale(40%)",
          opacity: isActive ? 1 : 0.7,
        }}
      >
        {item.emoji}
      </span>
      <span
        className="text-[10px] font-medium"
        style={{
          color: isActive ? "var(--paris-dore)" : "var(--paris-sepia)",
          fontWeight: isActive ? 600 : 400,
        }}
      >
        {item.label}
      </span>
      {/* Indicateur actif */}
      {isActive && (
        <motion.div
          layoutId="navIndicator"
          className="w-4 h-0.5 rounded-full"
          style={{ backgroundColor: "var(--paris-dore)" }}
          aria-hidden="true"
        />
      )}
    </motion.button>
  );
}
