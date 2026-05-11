/* ============================================================
   SplashScreen.tsx — Écran de démarrage de ParisLocal
   Design : élégant, centré, avec animation d'entrée de Léon
   ============================================================ */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LeonAvatar from "./LeonAvatar";

interface Props {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    // Phase 1 : apparition (0.8s)
    // Phase 2 : maintien (1.8s)
    // Phase 3 : disparition (0.5s)
    const t1 = setTimeout(() => setPhase("hold"), 800);
    const t2 = setTimeout(() => setPhase("out"), 2600);
    const t3 = setTimeout(() => onComplete(), 3100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "out" ? (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{
            background: "linear-gradient(160deg, var(--paris-pierre) 0%, var(--paris-creme) 60%, #F0EAE0 100%)",
          }}
          aria-live="polite"
          aria-label="Chargement de ParisLocal"
        >
          {/* Motif de fond */}
          <div className="absolute inset-0 paris-bg-pattern opacity-50 pointer-events-none" aria-hidden="true" />

          {/* Ligne dorée en haut */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: "linear-gradient(90deg, transparent, var(--paris-dore), transparent)" }}
            aria-hidden="true"
          />

          {/* Contenu centré */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center px-8 text-center"
          >
            {/* Avatar de Léon */}
            <motion.div
              animate={{
                y: [0, -6, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <LeonAvatar etat="accueil" taille={88} />
            </motion.div>

            {/* Logo & Nom */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-4"
            >
              {/* Filet doré */}
              <div
                className="w-12 h-px mx-auto mb-3"
                style={{ background: "var(--paris-dore)" }}
                aria-hidden="true"
              />
              <h1
                className="text-3xl font-semibold tracking-tight"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "var(--paris-noir)",
                }}
              >
                Paris<span style={{ color: "var(--paris-rouge)" }}>Local</span>
              </h1>
              <p
                className="text-sm mt-1.5 tracking-widest uppercase"
                style={{ color: "var(--paris-sepia)", letterSpacing: "0.22em" }}
              >
                Hôtel du Marais
              </p>
              <div
                className="w-12 h-px mx-auto mt-3"
                style={{ background: "var(--paris-dore)" }}
                aria-hidden="true"
              />
            </motion.div>

            {/* Message de Léon */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-sm mt-5 italic max-w-[240px] leading-relaxed"
              style={{ color: "var(--paris-sepia)" }}
            >
              "Bienvenue dans le plus beau quartier de Paris…"
            </motion.p>

            {/* Indicateur de chargement */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex gap-1.5 mt-8"
              aria-hidden="true"
            >
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
            </motion.div>
          </motion.div>

          {/* Ligne dorée en bas */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ background: "linear-gradient(90deg, transparent, var(--paris-dore), transparent)" }}
            aria-hidden="true"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
