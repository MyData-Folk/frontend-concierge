/* ============================================================
   InfoHotel.tsx — Informations pratiques de l'hôtel (mis à jour)
   Utilise le HotelContext pour les données réelles
   Affiche la note Wikipedia du quartier si disponible
   ============================================================ */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHotel } from "../context/HotelContext";

export default function InfoHotel() {
  const { hotel, wiki, coords, isOnline } = useHotel();
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("pratique");

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  /* Sections dynamiques basées sur les données réelles */
  const sections = [
    {
      id: "pratique",
      titre: "Informations pratiques",
      emoji: "📋",
      items: [
        { label: "Check-out",    value: hotel.checkOut },
        { label: "Room service", value: hotel.roomService },
        { label: "Téléphone",    value: hotel.telephone, copiable: true },
        { label: "Adresse",      value: hotel.adresse },
        ...(coords ? [
          { label: "Quartier",   value: `${coords.suburb} · ${coords.district}` },
          { label: "GPS",        value: `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`, copiable: true },
        ] : []),
      ],
    },
    {
      id: "wifi",
      titre: "Connexion Wi-Fi",
      emoji: "📶",
      items: [
        { label: "Réseau",       value: hotel.wifi },
        { label: "Mot de passe", value: hotel.wifiPassword, copiable: true },
      ],
    },
    {
      id: "services",
      titre: "Services inclus",
      emoji: "✨",
      items: [
        { label: "Petit-déjeuner", value: "7h00 – 10h30 · Salle du rez-de-chaussée" },
        { label: "Bagagerie",      value: "Disponible à la réception 24h/24" },
        { label: "Conciergerie",   value: "Léon à votre service · 8h – 21h" },
        { label: "Spa & Bien-être", value: "Partenaire : Institut Cinq Mondes (sur réservation)" },
      ],
    },
    {
      id: "urgences",
      titre: "Numéros utiles",
      emoji: "🆘",
      items: [
        { label: "SAMU",     value: "15", copiable: true },
        { label: "Police",   value: "17", copiable: true },
        { label: "Pompiers", value: "18", copiable: true },
        { label: "Pharmacie de garde", value: "3237" },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-dvh" style={{ backgroundColor: "var(--paris-creme)" }}>
      {/* ── En-tête ── */}
      <div
        className="px-4 pt-5 pb-4 relative"
        style={{ background: "linear-gradient(160deg, var(--paris-pierre) 0%, var(--paris-creme) 100%)" }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent, var(--paris-dore), transparent)" }}
          aria-hidden="true"
        />

        {/* Cartouche hôtel */}
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-paris flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, var(--paris-dore), #e8b84b)",
              border: "1.5px solid rgba(212,168,83,0.4)",
            }}
            aria-hidden="true"
          >
            <span
              className="text-lg font-bold"
              style={{ fontFamily: "'Playfair Display', serif", color: "var(--paris-noir)" }}
            >
              {hotel.nom.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h1
              className="font-serif text-xl leading-tight"
              style={{ fontFamily: "'Playfair Display', serif", color: "var(--paris-noir)" }}
            >
              {hotel.nom}
            </h1>
            <p className="text-xs mt-0.5 truncate" style={{ color: "var(--paris-sepia)" }}>
              {hotel.adresse}
            </p>
          </div>
          <span
            className="px-2 py-0.5 rounded-full text-[9px] font-semibold flex-shrink-0"
            style={{
              backgroundColor: "rgba(212,168,83,0.1)",
              color: "var(--paris-dore)",
              border: "1px solid rgba(212,168,83,0.2)",
            }}
          >
            Officiel
          </span>
        </div>

        <div className="mt-4 paris-gold-line" aria-hidden="true" />
      </div>

      {/* ── Note Wikipedia du quartier (si disponible) ── */}
      <AnimatePresence>
        {wiki && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-4 mt-4 rounded-2xl p-4"
            style={{
              background: "linear-gradient(135deg, var(--paris-noir) 0%, #1a1a24 100%)",
              border: "1px solid rgba(212,168,83,0.3)",
            }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0" aria-hidden="true">🏙️</span>
              <div className="min-w-0">
                <p
                  className="text-[10px] font-bold uppercase tracking-widest mb-1"
                  style={{ color: "var(--paris-dore)" }}
                >
                  {wiki.title}
                </p>
                <p className="text-xs leading-relaxed italic text-white opacity-90 line-clamp-3">
                  "{wiki.summary}"
                </p>
                <a
                  href={wiki.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] mt-1.5 inline-block"
                  style={{ color: "rgba(212,168,83,0.8)" }}
                >
                  Lire sur Wikipedia →
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Message de bienvenue de Léon (si pas de Wiki) ── */}
      {!wiki && (
        <div
          className="mx-4 mt-4 rounded-2xl p-4"
          style={{
            background: "linear-gradient(135deg, var(--paris-noir) 0%, #1a1a24 100%)",
            border: "1px solid rgba(212,168,83,0.3)",
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0" aria-hidden="true">🏨</span>
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-widest mb-1"
                style={{ color: "var(--paris-dore)" }}
              >
                Léon vous accueille
              </p>
              <p className="text-xs leading-relaxed italic text-white opacity-90">
                "Toutes les informations qu'il vous faut pour un séjour parfait.
                N'hésitez pas à sonner à la réception — le service est notre
                vocation !"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Sections accordion ── */}
      <div className="px-4 mt-4 space-y-2 pb-28">
        {sections.map((section, si) => {
          const isOpen = expandedSection === section.id;

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.1 }}
              className="rounded-2xl overflow-hidden shadow-paris"
              style={{
                backgroundColor: "white",
                border: `1.5px solid ${isOpen ? "var(--paris-dore)" : "var(--paris-bordure)"}`,
              }}
            >
              {/* En-tête de section */}
              <button
                className="w-full flex items-center justify-between p-4 text-left"
                onClick={() => setExpandedSection(isOpen ? null : section.id)}
                aria-expanded={isOpen}
                aria-controls={`section-${section.id}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg" aria-hidden="true">{section.emoji}</span>
                  <span
                    className="font-semibold text-sm"
                    style={{ fontFamily: "'Playfair Display', serif", color: "var(--paris-noir)" }}
                  >
                    {section.titre}
                  </span>
                </div>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-sm"
                  style={{ color: "var(--paris-sepia)" }}
                  aria-hidden="true"
                >
                  ▾
                </motion.span>
              </button>

              {/* Contenu dépliable */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`section-${section.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      className="px-4 pb-4 pt-0 space-y-2"
                      style={{ borderTop: "1px solid var(--paris-bordure)" }}
                    >
                      {section.items.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between py-2.5 gap-3"
                          style={{ borderBottom: "1px solid var(--paris-pierre)" }}
                        >
                          <p
                            className="text-[11px] font-semibold uppercase tracking-wider flex-shrink-0"
                            style={{ color: "var(--paris-sepia)" }}
                          >
                            {item.label}
                          </p>
                          <div className="flex items-center gap-2 min-w-0">
                            <p
                              className="text-xs text-right"
                              style={{ color: "var(--paris-noir)" }}
                            >
                              {item.value}
                            </p>
                            {item.copiable && (
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => handleCopy(item.value, item.label)}
                                className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center btn-press"
                                style={{
                                  backgroundColor: copied === item.label ? "var(--paris-vert)" : "var(--paris-pierre)",
                                  border: "1px solid var(--paris-bordure)",
                                }}
                                aria-label={`Copier ${item.label}`}
                              >
                                <span className="text-[11px]">
                                  {copied === item.label ? "✓" : "⎘"}
                                </span>
                              </motion.button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* ── Bouton appel réception ── */}
        <motion.a
          href={`tel:${hotel.telephone}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-3 p-4 rounded-2xl mt-2 btn-press shadow-paris-md"
          style={{
            background: "linear-gradient(135deg, var(--paris-dore), #e8b84b)",
            border: "1px solid rgba(212,168,83,0.4)",
          }}
          aria-label={`Appeler la réception au ${hotel.telephone}`}
        >
          <span className="text-xl" aria-hidden="true">📞</span>
          <div className="text-center">
            <p className="font-semibold text-sm" style={{ color: "var(--paris-noir)" }}>
              Appeler la réception
            </p>
            <p className="text-[11px]" style={{ color: "rgba(28,28,28,0.65)" }}>
              {hotel.telephone}
            </p>
          </div>
        </motion.a>

        {/* Satisfaction / Avis */}
        <div
          className="rounded-2xl p-4 text-center"
          style={{
            backgroundColor: "var(--paris-pierre)",
            border: "1px solid var(--paris-bordure)",
          }}
        >
          <p className="text-2xl mb-2">⭐</p>
          <p
            className="font-serif text-sm mb-1"
            style={{ fontFamily: "'Playfair Display', serif", color: "var(--paris-noir)" }}
          >
            Votre avis nous importe
          </p>
          <p className="text-[11px] mb-3" style={{ color: "var(--paris-sepia)" }}>
            Aidez-nous à nous améliorer en laissant un avis
          </p>
          <button
            className="px-5 py-2 rounded-xl text-xs font-semibold btn-press shadow-paris"
            style={{
              backgroundColor: "var(--paris-noir)",
              color: "white",
              border: "1px solid transparent",
            }}
          >
            Laisser un avis →
          </button>
        </div>
      </div>
    </div>
  );
}
