/* ============================================================
   MenuDrawer.tsx — Tiroir coulissant mis à jour
   + Lien vers l'Audioguide (conservé dans le tiroir)
   + Indicateur de statut API
   ============================================================ */

import { motion, AnimatePresence } from "framer-motion";
import LeonAvatar from "./LeonAvatar";
import { useHotel } from "../context/HotelContext";
import type { Vue } from "../App";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (vue: Vue) => void;
}

const menuItems: Array<{ icon: string; label: string; desc: string; vue: Vue }> = [
  { icon: "🗺️", label: "Carte du quartier",  desc: "Explorer les alentours",         vue: "map" },
  { icon: "💬", label: "Chat avec Léon",      desc: "Votre concierge IA personnel",   vue: "chat" },
  { icon: "🛎️", label: "Infos hôtel",         desc: "Wi-Fi, checkout, room service",  vue: "info" },
  { icon: "🏠", label: "Accueil",             desc: "Retour à l'accueil",             vue: "home" },
];

export default function MenuDrawer({ isOpen, onClose, onNavigate }: Props) {
  const { hotel, isOnline, isLoading, reload } = useHotel();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Overlay dépoli ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50"
            style={{ backgroundColor: "rgba(28, 28, 28, 0.5)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
            aria-label="Fermer le menu"
          />

          {/* ── Tiroir principal ── */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 rounded-t-3xl overflow-visible"
            style={{
              background: "linear-gradient(180deg, var(--paris-pierre) 0%, var(--paris-creme) 100%)",
              boxShadow: "0 -8px 40px rgba(28,28,28,0.18)",
              border: "1px solid var(--paris-bordure)",
              borderBottom: "none",
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu complet ParisLocal"
          >
            {/* ── Tête de Léon qui dépasse ── */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 400, damping: 30 }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center"
              aria-hidden="true"
            >
              <LeonAvatar etat="recommandation" taille={56} />
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-1 px-3 py-1 rounded-full text-[10px] font-semibold italic shadow-paris"
                style={{
                  backgroundColor: "var(--paris-creme)",
                  color: "var(--paris-sepia)",
                  border: "1px solid var(--paris-bordure)",
                }}
              >
                Coucou ! 👋
              </motion.div>
            </motion.div>

            {/* ── Ligne dorée décorative ── */}
            <div
              className="h-[2px] rounded-t-3xl"
              style={{ background: "linear-gradient(90deg, transparent, var(--paris-dore), transparent)" }}
              aria-hidden="true"
            />

            {/* ── Poignée de fermeture ── */}
            <div className="flex justify-center pt-3 pb-1">
              <button
                onClick={onClose}
                className="w-10 h-1 rounded-full"
                style={{ backgroundColor: "var(--paris-bordure)" }}
                aria-label="Fermer le menu"
              />
            </div>

            {/* ── Titre + statut API ── */}
            <div className="px-5 pt-2 pb-3">
              <h2
                className="text-center text-lg font-semibold"
                style={{ fontFamily: "'Playfair Display', serif", color: "var(--paris-noir)" }}
              >
                Menu ParisLocal
              </h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                <p className="text-center text-xs" style={{ color: "var(--paris-sepia)" }}>
                  {hotel.nom}
                </p>
                <span
                  className="px-2 py-0.5 rounded-full text-[9px] font-semibold"
                  style={{
                    backgroundColor: isOnline ? "rgba(44,85,48,0.1)" : "rgba(107,94,83,0.1)",
                    color: isOnline ? "var(--paris-vert)" : "var(--paris-sepia)",
                  }}
                >
                  {isLoading ? "⟳ Chargement…" : isOnline ? "✓ Données réelles" : "Mode local"}
                </span>
              </div>
            </div>

            <div className="px-4 pb-6 space-y-4 overflow-y-auto max-h-[60vh]">
              {/* ── Navigation principale ── */}
              <div>
                <p
                  className="text-[10px] uppercase tracking-widest mb-2 font-semibold"
                  style={{ color: "var(--paris-sepia)" }}
                >
                  Explorer
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {menuItems.map((item, i) => (
                    <motion.button
                      key={item.vue}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                      onClick={() => { onNavigate(item.vue); onClose(); }}
                      className="flex items-center gap-2.5 p-3 rounded-xl text-left btn-press shadow-paris"
                      style={{
                        backgroundColor: "white",
                        border: "1px solid var(--paris-bordure)",
                      }}
                    >
                      <span className="text-xl" aria-hidden="true">{item.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold leading-tight" style={{ color: "var(--paris-noir)" }}>
                          {item.label}
                        </p>
                        <p className="text-[10px] leading-snug" style={{ color: "var(--paris-sepia)" }}>
                          {item.desc}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* ── Services utiles ── */}
              <div>
                <p
                  className="text-[10px] uppercase tracking-widest mb-2 font-semibold"
                  style={{ color: "var(--paris-sepia)" }}
                >
                  Services
                </p>
                <div className="space-y-1.5">
                  {[
                    { icon: "📞", label: "Appeler la réception",  action: `tel:${hotel.telephone}`, display: null },
                    { icon: "📶", label: "Code Wi-Fi",             action: null,                     display: hotel.wifiPassword },
                    { icon: "🚖", label: "Commander un taxi",       action: null,                     display: null },
                    { icon: "⭐", label: "Laisser un avis",         action: null,                     display: null },
                    { icon: "🎧", label: "Audioguide de Léon",      action: null,                     display: null },
                  ].map((item, i) => (
                    <motion.button
                      key={item.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.05 }}
                      onClick={() => item.action && window.open(item.action)}
                      className="w-full flex items-center justify-between p-3 rounded-xl btn-press"
                      style={{
                        backgroundColor: "var(--paris-pierre)",
                        border: "1px solid var(--paris-bordure)",
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg" aria-hidden="true">{item.icon}</span>
                        <span className="text-xs font-medium" style={{ color: "var(--paris-noir)" }}>
                          {item.label}
                        </span>
                      </div>
                      {item.display && (
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded-lg"
                          style={{ backgroundColor: "var(--paris-creme)", color: "var(--paris-sepia)", border: "1px solid var(--paris-bordure)" }}
                        >
                          {item.display}
                        </span>
                      )}
                      <span style={{ color: "var(--paris-sepia)" }} className="text-xs">›</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* ── Bouton rafraîchissement données ── */}
              {!isOnline && (
                <button
                  onClick={() => { reload(); onClose(); }}
                  className="w-full p-3 rounded-xl text-xs font-semibold btn-press"
                  style={{
                    backgroundColor: "rgba(212,168,83,0.1)",
                    border: "1px solid rgba(212,168,83,0.3)",
                    color: "var(--paris-dore)",
                  }}
                >
                  ↺ Recharger les données du quartier
                </button>
              )}

              {/* ── Signature Léon ── */}
              <div
                className="rounded-xl p-3 text-center"
                style={{ backgroundColor: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.25)" }}
              >
                <p className="text-[11px] italic" style={{ color: "var(--paris-sepia)" }}>
                  "Votre satisfaction est ma raison d'être.
                  <br />Bonne exploration du Marais !"
                </p>
                <p
                  className="text-[10px] font-bold mt-1"
                  style={{ color: "var(--paris-dore)" }}
                >
                  — Léon
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
