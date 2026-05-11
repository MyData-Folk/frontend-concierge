/* ============================================================
   Home.tsx — Vue principale (mis à jour)
   Affiche les lieux mock + POIs OSM réels si disponibles
   ============================================================ */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeaderConcierge from "../components/HeaderConcierge";
import QuickAccess from "../components/QuickAccess";
import LieuCard from "../components/LieuCard";
import { lieux, leonMessages } from "../data/mockData";
import type { Categorie } from "../data/mockData";
import { useHotel } from "../context/HotelContext";

/* Mapper catégorie OSM → catégorie mock pour l'affichage */
function osmToCategorie(cat: string): Categorie | null {
  if (cat === "tourism") return "culture";
  if (cat === "shop" || cat === "health") return "service";
  if (cat === "transport") return "service";
  return null;
}

export default function Home() {
  const { pois, isOnline, isLoading, wiki } = useHotel();
  const [query, setQuery] = useState("");
  const [categorieActive, setCategorieActive] = useState<Categorie | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  /* Détermine l'état de Léon selon l'interaction */
  const leonEtat = query.length > 0
    ? "recherche"
    : categorieActive
    ? "recommandation"
    : "accueil";

  /* Message contextuel de Léon */
  const leonMessage = query.length > 0
    ? leonMessages.recherche[0]
    : categorieActive
    ? leonMessages.recommandation[2]
    : undefined;

  /* Filtrage des lieux mock */
  const lieuxFiltres = useMemo(() => {
    return lieux.filter((l) => {
      const matchCategorie = !categorieActive || l.categorie === categorieActive;
      const matchQuery = !query || (
        l.nom.toLowerCase().includes(query.toLowerCase()) ||
        l.description.toLowerCase().includes(query.toLowerCase()) ||
        l.sousCategorie.toLowerCase().includes(query.toLowerCase()) ||
        l.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      );
      return matchCategorie && matchQuery;
    });
  }, [query, categorieActive]);

  /* Lieux mis en avant (coup de cœur) */
  const coupsDeCoeur = lieux.filter((l) => l.coupDeCoeur);

  /* Convertir les POIs OSM en format affichable */
  const poisAffichables = useMemo(() => {
    if (!isOnline || !pois.length) return [];
    return pois
      .filter(p => {
        const cat = osmToCategorie(p.category);
        if (!cat) return false;
        if (categorieActive && cat !== categorieActive) return false;
        if (query) {
          return p.name.toLowerCase().includes(query.toLowerCase());
        }
        return true;
      })
      .slice(0, 5); // max 5 POIs OSM
  }, [pois, isOnline, categorieActive, query]);

  return (
    <div className="flex flex-col min-h-dvh" style={{ backgroundColor: "var(--paris-creme)" }}>
      {/* ── En-tête avec Léon ── */}
      <HeaderConcierge etat={leonEtat} messageOverride={leonMessage} />

      {/* ── Contenu scrollable ── */}
      <div className="flex-1 overflow-y-auto pb-28">

        {/* ── Barre de recherche conversationnelle ── */}
        <div className="px-4 pt-4">
          <div
            className="relative flex items-center rounded-2xl overflow-hidden transition-all duration-300"
            style={{
              backgroundColor: "white",
              border: `1.5px solid ${isFocused ? "var(--paris-dore)" : "var(--paris-bordure)"}`,
              boxShadow: isFocused
                ? "0 0 0 3px rgba(212,168,83,0.15), 0 2px 8px rgba(28,28,28,0.06)"
                : "0 2px 8px rgba(28,28,28,0.04)",
            }}
          >
            <span className="pl-3.5 text-base" aria-hidden="true">🔍</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Que cherchez-vous ? Resto, musée, taxi…"
              className="flex-1 bg-transparent px-3 py-3.5 text-sm outline-none"
              style={{
                color: "var(--paris-noir)",
                fontFamily: "'DM Sans', sans-serif",
              }}
              aria-label="Rechercher un lieu ou service"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setQuery("")}
                  className="pr-3.5 text-sm"
                  style={{ color: "var(--paris-sepia)" }}
                  aria-label="Effacer la recherche"
                >
                  ✕
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Bannière chargement API ── */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mx-4 mt-3 rounded-xl px-4 py-2.5 flex items-center gap-2"
              style={{
                backgroundColor: "rgba(212,168,83,0.08)",
                border: "1px solid rgba(212,168,83,0.25)",
              }}
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="text-sm"
              >
                ⟳
              </motion.span>
              <p className="text-[11px] italic" style={{ color: "var(--paris-sepia)" }}>
                Léon charge les données de votre quartier…
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Note Wikipedia du quartier ── */}
        <AnimatePresence>
          {wiki && !query && !categorieActive && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mx-4 mt-3 rounded-xl p-3"
              style={{
                backgroundColor: "rgba(212,168,83,0.06)",
                border: "1px solid rgba(212,168,83,0.2)",
              }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--paris-dore)" }}>
                🏙️ {wiki.title}
              </p>
              <p className="text-[11px] leading-relaxed line-clamp-2 italic" style={{ color: "var(--paris-sepia)" }}>
                {wiki.summary}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Coups de cœur de Léon (si pas de filtre actif) ── */}
        <AnimatePresence>
          {!query && !categorieActive && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="px-4 pt-5"
              aria-label="Coups de cœur de Léon"
            >
              <div className="flex items-center gap-2 mb-3">
                <h2
                  className="font-serif text-base"
                  style={{ fontFamily: "'Playfair Display', serif", color: "var(--paris-noir)" }}
                >
                  ★ Pépites du moment
                </h2>
                <div className="flex-1 h-px" style={{ background: "var(--paris-bordure)" }} aria-hidden="true" />
              </div>

              {/* Défilement horizontal des coups de cœur */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                {coupsDeCoeur.map((lieu, i) => (
                  <motion.div
                    key={lieu.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12 }}
                    className="flex-shrink-0 w-52 rounded-2xl p-3 shadow-paris"
                    style={{
                      background: "linear-gradient(135deg, white 0%, var(--paris-pierre) 100%)",
                      border: "1px solid var(--paris-bordure)",
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-2xl" aria-hidden="true">{lieu.emoji}</span>
                      <div className="min-w-0">
                        <p
                          className="font-semibold text-sm leading-tight"
                          style={{ fontFamily: "'Playfair Display', serif", color: "var(--paris-noir)" }}
                        >
                          {lieu.nom}
                        </p>
                        <p className="text-[10px] mt-0.5" style={{ color: "var(--paris-sepia)" }}>
                          {lieu.distance}
                        </p>
                      </div>
                    </div>
                    <p
                      className="text-[11px] mt-2 leading-relaxed line-clamp-2 italic"
                      style={{ color: "var(--paris-sepia)" }}
                    >
                      "{lieu.noteLeon}"
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                      <span className="badge-shimmer px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white">
                        ★ Coup de cœur
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── Accès rapides ── */}
        <div className="pt-3">
          <QuickAccess
            selected={categorieActive}
            onSelect={(cat) => setCategorieActive(cat)}
          />
        </div>

        {/* ── Liste des lieux ── */}
        <section className="px-4 pt-3 space-y-3" aria-label="Liste des lieux">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2
                className="font-serif text-base"
                style={{ fontFamily: "'Playfair Display', serif", color: "var(--paris-noir)" }}
              >
                {categorieActive
                  ? categorieActive === "resto" ? "Restaurants"
                    : categorieActive === "culture" ? "Culture & Sorties"
                    : "Services du quartier"
                  : "Le quartier en un clin d'œil"
                }
              </h2>
            </div>
            <span
              className="text-[11px] px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "var(--paris-pierre)", color: "var(--paris-sepia)" }}
            >
              {lieuxFiltres.length + poisAffichables.length} lieu{(lieuxFiltres.length + poisAffichables.length) !== 1 ? "x" : ""}
            </span>
          </div>

          {/* Cartes en stagger */}
          <AnimatePresence mode="wait">
            {lieuxFiltres.length > 0 || poisAffichables.length > 0 ? (
              <motion.div
                key={`${categorieActive}-${query}`}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {lieuxFiltres.map((lieu, i) => (
                  <LieuCard key={lieu.id} lieu={lieu} index={i} />
                ))}

                {/* POIs OSM réels */}
                {poisAffichables.map((poi, i) => (
                  <motion.div
                    key={poi.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (lieuxFiltres.length + i) * 0.08 }}
                    className="rounded-2xl p-4 shadow-paris"
                    style={{
                      backgroundColor: "white",
                      border: "1px solid var(--paris-bordure)",
                      borderLeft: "3px solid var(--paris-dore)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{ backgroundColor: "rgba(212,168,83,0.1)" }}
                      >
                        {poi.category === "tourism" ? "🎡"
                          : poi.category === "transport" ? "🚇"
                          : poi.category === "shop" ? "🛍️"
                          : "💊"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-semibold text-sm leading-tight"
                          style={{ fontFamily: "'Playfair Display', serif", color: "var(--paris-noir)" }}
                        >
                          {poi.name}
                        </p>
                        <p className="text-[11px] mt-0.5" style={{ color: "var(--paris-sepia)" }}>
                          {poi.distance_m}m · Recommandé
                        </p>
                      </div>
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: "rgba(44,85,48,0.1)",
                          color: "var(--paris-vert)",
                          border: "1px solid rgba(44,85,48,0.2)",
                        }}
                      >
                        Vérifié
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <span className="text-4xl block mb-3">🔍</span>
                <p className="font-serif text-base" style={{ color: "var(--paris-sepia)" }}>
                  Aucun résultat pour "{query}"
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--paris-sepia)", opacity: 0.7 }}>
                  Essayez "restaurant", "musée" ou "métro"
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
