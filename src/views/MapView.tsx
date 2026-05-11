/* ============================================================
   MapView.tsx — Carte du quartier (mis à jour)
   Utilise les vraies coordonnées GPS via HotelContext
   POIs OSM affichés sur le plan illustré
   ============================================================ */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Lieu } from "../data/mockData";
import { lieux } from "../data/mockData";
import { useHotel } from "../context/HotelContext";
import type { POI } from "../services/api";

/* Couleurs de catégorie pour les pins mock */
const pinColors = {
  resto:   { bg: "#C83C3C", text: "white", label: "🍷" },
  culture: { bg: "#D4A853", text: "white", label: "🎨" },
  service: { bg: "#2C5530", text: "white", label: "🛎️" },
};

/* Couleurs pour les POIs OSM */
const osmPinColors: Record<string, { bg: string; label: string }> = {
  tourism:   { bg: "#D4A853", label: "🎨" },
  transport: { bg: "#2C5530", label: "🚇" },
  shop:      { bg: "#C83C3C", label: "🛍️" },
  health:    { bg: "#6366f1", label: "💊" },
};

/* Positions visuelles pour les lieux mock */
const mapPositions: Record<string, { x: number; y: number }> = {
  r1: { x: 55, y: 48 },
  r2: { x: 42, y: 35 },
  r3: { x: 62, y: 60 },
  c1: { x: 50, y: 55 },
  c2: { x: 68, y: 72 },
  s1: { x: 30, y: 68 },
  s2: { x: 45, y: 38 },
  s3: { x: 72, y: 42 },
};

/* Convertit des coordonnées GPS en position % sur le plan SVG */
function latLngToPercent(
  lat: number,
  lng: number,
  centerLat: number,
  centerLng: number
): { x: number; y: number } {
  const scale = 800; // plus = plus zoomé
  const x = 50 + (lng - centerLng) * scale;
  const y = 50 - (lat - centerLat) * scale;
  return {
    x: Math.max(5, Math.min(95, x)),
    y: Math.max(5, Math.min(95, y)),
  };
}

export default function MapView() {
  const { coords, pois, isOnline, hotel } = useHotel();
  const [selectedLieu, setSelectedLieu] = useState<Lieu | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const lieuxAffiches = filter ? lieux.filter(l => l.categorie === filter) : lieux;

  /* POIs OSM filtrés */
  const poisAffiches = pois
    .filter(p => !filter || p.category === filter)
    .slice(0, 12); // max 12 POIs pour éviter la surcharge

  const centerLat = coords?.lat ?? 48.8596;
  const centerLng = coords?.lng ?? 2.3624;

  return (
    <div
      className="flex flex-col min-h-dvh"
      style={{ backgroundColor: "var(--paris-creme)" }}
    >
      {/* ── En-tête ── */}
      <div
        className="px-4 pt-5 pb-3 relative"
        style={{ background: "linear-gradient(160deg, var(--paris-pierre) 0%, var(--paris-creme) 100%)" }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent, var(--paris-dore), transparent)" }}
          aria-hidden="true"
        />
        <div className="flex items-start justify-between">
          <div>
            <h1
              className="font-serif text-xl mb-0.5"
              style={{ fontFamily: "'Playfair Display', serif", color: "var(--paris-noir)" }}
            >
              {coords?.district ?? "Le Marais"}
            </h1>
            <p className="text-xs" style={{ color: "var(--paris-sepia)" }}>
              {coords?.suburb && `${coords.suburb} · `}
              {isOnline ? `${pois.length + lieux.length} adresses` : `${lieux.length} adresses sélectionnées par Léon`}
            </p>
          </div>
          {/* Badge coordonnées réelles */}
          {isOnline && coords && (
            <span
              className="px-2 py-0.5 rounded-full text-[9px] font-semibold mt-1"
              style={{
                backgroundColor: "rgba(44,85,48,0.1)",
                color: "var(--paris-vert)",
                border: "1px solid rgba(44,85,48,0.2)",
              }}
            >
              GPS réel ✓
            </span>
          )}
        </div>
        <div className="mt-3 paris-gold-line" aria-hidden="true" />
      </div>

      {/* ── Filtres ── */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {[
          { key: null,        label: "Tout",      emoji: "🗺️" },
          { key: "resto",     label: "Restos",    emoji: "🍷" },
          { key: "culture",   label: "Culture",   emoji: "🎨" },
          { key: "service",   label: "Services",  emoji: "🛎️" },
          ...(isOnline ? [
            { key: "tourism",   label: "Tourisme",  emoji: "🎡" },
            { key: "transport", label: "Transport", emoji: "🚇" },
            { key: "shop",      label: "Commerces", emoji: "🛍️" },
            { key: "health",    label: "Santé",     emoji: "💊" },
          ] : []),
        ].map((f) => (
          <motion.button
            key={String(f.key)}
            whileTap={{ scale: 0.93 }}
            onClick={() => setFilter(f.key)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium btn-press transition-all flex-shrink-0"
            style={{
              backgroundColor: filter === f.key ? "var(--paris-noir)" : "white",
              color: filter === f.key ? "white" : "var(--paris-sepia)",
              border: `1px solid ${filter === f.key ? "var(--paris-noir)" : "var(--paris-bordure)"}`,
            }}
            aria-pressed={filter === f.key}
          >
            <span aria-hidden="true">{f.emoji}</span>
            {f.label}
          </motion.button>
        ))}
      </div>

      {/* ── Carte stylisée ── */}
      <div className="px-4 flex-1">
        <div
          className="relative rounded-2xl overflow-hidden shadow-paris-md"
          style={{
            height: "320px",
            backgroundColor: "#EAE0D0",
            border: "1px solid var(--paris-bordure)",
          }}
          role="img"
          aria-label="Carte du quartier avec les adresses recommandées"
        >
          {/* Fond SVG plan haussmannien */}
          <svg
            viewBox="0 0 480 320"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            <rect width="480" height="320" fill="#EAE0D0" />
            {[
              [20, 10, 130, 60], [160, 10, 100, 55], [275, 10, 90, 50],
              [20, 80, 90, 70],  [120, 80, 120, 65], [255, 80, 110, 70],
              [20, 165, 110, 65],[145, 165, 95, 60], [255, 165, 120, 65],
              [20, 245, 80, 65], [115, 245, 110, 65],[240, 245, 130, 65],
              [380, 10, 90, 75], [380, 95, 90, 80],  [385, 185, 85, 70],
              [385, 265, 85, 50],
            ].map(([x, y, w, h], i) => (
              <rect key={i} x={x} y={y} width={w} height={h} rx="4"
                fill="#D8CDB8" stroke="#C8BDA8" strokeWidth="1" />
            ))}
            <rect x="0" y="72" width="480" height="10" fill="#F5EDE0" />
            <rect x="0" y="157" width="480" height="10" fill="#F5EDE0" />
            <rect x="0" y="237" width="480" height="10" fill="#F5EDE0" />
            <rect x="112" y="0" width="10" height="320" fill="#F5EDE0" />
            <rect x="247" y="0" width="10" height="320" fill="#F5EDE0" />
            <rect x="377" y="0" width="10" height="320" fill="#F5EDE0" />
            <text x="240" y="68" textAnchor="middle" fontSize="8" fill="#8B7355" fontFamily="serif">Rue de Bretagne</text>
            <text x="240" y="153" textAnchor="middle" fontSize="8" fill="#8B7355" fontFamily="serif">Rue du Temple</text>
            <text x="240" y="233" textAnchor="middle" fontSize="8" fill="#8B7355" fontFamily="serif">Rue de Rivoli</text>
            <ellipse cx="310" cy="270" rx="35" ry="25" fill="#C8D8B8" opacity="0.6" />
            <text x="310" y="274" textAnchor="middle" fontSize="9" fill="#2C5530" fontFamily="serif">Place des Vosges</text>
            <text x="240" y="310" textAnchor="middle" fontSize="7" fill="#B8AA95" fontFamily="serif">
              Plan illustratif · ParisLocal · {isOnline ? "Données OSM réelles" : "Léon vous guide"}
            </text>
          </svg>

          {/* ── Pins mock (lieux de la base) ── */}
          {lieuxAffiches.map((lieu) => {
            const pos = mapPositions[lieu.id];
            if (!pos) return null;
            const style = pinColors[lieu.categorie];
            const isSelected = selectedLieu?.id === lieu.id;
            return (
              <motion.button
                key={lieu.id}
                style={{
                  position: "absolute",
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: "translate(-50%, -100%)",
                  zIndex: isSelected ? 10 : 5,
                }}
                whileTap={{ scale: 0.9 }}
                animate={{ scale: isSelected ? 1.3 : 1 }}
                onClick={() => {
                  setSelectedLieu(selectedLieu?.id === lieu.id ? null : lieu);
                  setSelectedPoi(null);
                }}
                aria-label={`Voir ${lieu.nom} sur la carte`}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-paris-md"
                  style={{ backgroundColor: style.bg, border: "2px solid white" }}
                >
                  {style.label}
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-0 h-0"
                  style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `6px solid ${style.bg}` }}
                  aria-hidden="true"
                />
              </motion.button>
            );
          })}

          {/* ── Pins OSM réels ── */}
          {isOnline && poisAffiches.map((poi) => {
            const pos = latLngToPercent(poi.lat, poi.lng, centerLat, centerLng);
            const style = osmPinColors[poi.category] ?? { bg: "#6366f1", label: "📍" };
            const isSelected = selectedPoi?.id === poi.id;
            return (
              <motion.button
                key={poi.id}
                style={{
                  position: "absolute",
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: "translate(-50%, -100%)",
                  zIndex: isSelected ? 10 : 4,
                }}
                whileTap={{ scale: 0.9 }}
                animate={{ scale: isSelected ? 1.2 : 1 }}
                onClick={() => {
                  setSelectedPoi(selectedPoi?.id === poi.id ? null : poi);
                  setSelectedLieu(null);
                }}
                aria-label={`${poi.name} — ${poi.distance_m}m`}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] shadow-paris"
                  style={{ backgroundColor: style.bg, border: "1.5px solid white", opacity: 0.85 }}
                >
                  {style.label}
                </div>
              </motion.button>
            );
          })}

          {/* ── Pin hôtel (position centrale) ── */}
          <div
            className="absolute shadow-paris-md"
            style={{ left: "44%", top: "30%", transform: "translate(-50%, -100%)", zIndex: 6 }}
            aria-label="Votre hôtel"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm border-2 border-white shadow-paris-md"
              style={{ background: "linear-gradient(135deg, var(--paris-dore), #e8b84b)" }}
            >
              🏨
            </div>
            <div className="w-0 h-0 mx-auto"
              style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "6px solid var(--paris-dore)" }}
            />
          </div>
        </div>

        {/* ── Info card lieu sélectionné (mock) ── */}
        <AnimatePresence>
          {selectedLieu && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              className="mt-3 rounded-2xl p-4 shadow-paris"
              style={{
                backgroundColor: "white",
                border: "1px solid var(--paris-bordure)",
                borderLeft: `3px solid ${pinColors[selectedLieu.categorie].bg}`,
              }}
              role="region"
              aria-label={`Détails de ${selectedLieu.nom}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">{selectedLieu.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm" style={{ fontFamily: "'Playfair Display', serif", color: "var(--paris-noir)" }}>
                    {selectedLieu.nom}
                  </h3>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--paris-sepia)" }}>
                    {selectedLieu.distance} · {selectedLieu.horaires}
                  </p>
                  <p className="text-xs mt-1.5 italic leading-relaxed" style={{ color: "var(--paris-sepia)" }}>
                    "{selectedLieu.noteLeon}"
                  </p>
                </div>
                <button onClick={() => setSelectedLieu(null)} className="text-xs p-1" style={{ color: "var(--paris-sepia)" }} aria-label="Fermer">✕</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Info card POI OSM sélectionné ── */}
        <AnimatePresence>
          {selectedPoi && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              className="mt-3 rounded-2xl p-4 shadow-paris"
              style={{
                backgroundColor: "white",
                border: "1px solid var(--paris-bordure)",
                borderLeft: `3px solid ${osmPinColors[selectedPoi.category]?.bg ?? "#6366f1"}`,
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {osmPinColors[selectedPoi.category]?.label ?? "📍"}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm" style={{ fontFamily: "'Playfair Display', serif", color: "var(--paris-noir)" }}>
                    {selectedPoi.name}
                  </h3>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--paris-sepia)" }}>
                    {selectedPoi.distance_m}m · Recommandé
                  </p>
                  <span
                    className="inline-block mt-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium"
                    style={{ backgroundColor: "rgba(44,85,48,0.1)", color: "var(--paris-vert)" }}
                  >
                    Vérifié par Léon
                  </span>
                </div>
                <button onClick={() => setSelectedPoi(null)} className="text-xs p-1" style={{ color: "var(--paris-sepia)" }} aria-label="Fermer">✕</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Légende ── */}
        <div className="mt-3 flex gap-3 flex-wrap justify-center pb-28">
          {Object.entries(pinColors).map(([cat, style]) => (
            <div key={cat} className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px]" style={{ backgroundColor: style.bg }}>
                {style.label}
              </div>
              <span className="text-[10px]" style={{ color: "var(--paris-sepia)" }}>
                {cat === "resto" ? "Restos" : cat === "culture" ? "Culture" : "Services"}
              </span>
            </div>
          ))}
          {isOnline && Object.entries(osmPinColors).map(([cat, style]) => (
            <div key={`osm-${cat}`} className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px]" style={{ backgroundColor: style.bg, opacity: 0.85 }}>
                {style.label}
              </div>
              <span className="text-[10px]" style={{ color: "var(--paris-sepia)" }}>
                {cat === "tourism" ? "Tourisme" : cat === "transport" ? "Transport" : cat === "shop" ? "Commerces" : "Santé"}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px]" style={{ background: "var(--paris-dore)" }}>🏨</div>
            <span className="text-[10px]" style={{ color: "var(--paris-sepia)" }}>Hôtel</span>
          </div>
        </div>
      </div>
    </div>
  );
}
