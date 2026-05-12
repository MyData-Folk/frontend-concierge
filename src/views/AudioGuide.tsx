/* ============================================================
   AudioGuide.tsx — Lecteur audio minimaliste pour les podcasts de Léon
   Design : interface élégante façon vinyle/radio vintage
   ============================================================ */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LeonAvatar from "../components/LeonAvatar";

interface Episode {
  id: string;
  titre: string;
  sousTitre: string;
  duree: string;
  dureeSeconds: number;
  description: string;
  emoji: string;
  tag: string;
}

const episodes: Episode[] = [
  {
    id: "e1",
    titre: "Le Marais, mémoires d'un quartier",
    sousTitre: "Histoire & Architecture",
    duree: "12 min",
    dureeSeconds: 720,
    description:
      "De l'aristocratie du XVIIe à la révolution LGBTQ+ des années 80, je vous raconte les mues fascinantes du Marais. On passe devant l'Hôtel de Sully, et je vous chuchote ses secrets…",
    emoji: "🏛️",
    tag: "Histoire",
  },
  {
    id: "e2",
    titre: "Les Marchés secrets du 3e",
    sousTitre: "Gastronomie & Terroir",
    duree: "8 min",
    dureeSeconds: 480,
    description:
      "Le Marché des Enfants Rouges, les fromagers de la rue de Bretagne, le boulanger du coin que personne ne connaît… Je vous emmène sur mes traces gourmandes.",
    emoji: "🧀",
    tag: "Gastronomie",
  },
  {
    id: "e3",
    titre: "Galeries et ateliers d'artistes",
    sousTitre: "Art Contemporain",
    duree: "10 min",
    dureeSeconds: 600,
    description:
      "Le Marais concentre 200 galeries d'art sur quelques rues. Je vous guide de la rue de Turenne à la rue Vieille du Temple, avec les coups de cœur de la saison.",
    emoji: "🎨",
    tag: "Art",
  },
  {
    id: "e4",
    titre: "Paris à l'aube — Promenade sonore",
    sousTitre: "Ambiances & Atmosphère",
    duree: "15 min",
    dureeSeconds: 900,
    description:
      "À 6h du matin, Paris n'appartient qu'à ses habitués. Livraisons, cafés qui s'éveillent, pigeons et pavés mouillés… Une parenthèse avant l'effervescence.",
    emoji: "🌅",
    tag: "Ambiance",
  },
];

const tagColors: Record<string, string> = {
  Histoire:    "var(--paris-sepia)",
  Gastronomie: "var(--paris-rouge)",
  Art:         "#92650a",
  Ambiance:    "var(--paris-vert)",
};

export default function AudioGuide() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [currentTime, setCurrentTime] = useState<Record<string, number>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Simulation de lecture (pas de vrai audio pour le MVP) */
  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const ep = episodes.find((e) => e.id === playing);
          if (!ep) return prev;
          const next = Math.min((prev[playing] ?? 0) + 1, ep.dureeSeconds);
          setProgress((p) => ({ ...p, [playing]: (next / ep.dureeSeconds) * 100 }));
          if (next >= ep.dureeSeconds) {
            setPlaying(null);
          }
          return { ...prev, [playing]: next };
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const togglePlay = (id: string) => {
    setPlaying((prev) => (prev === id ? null : id));
  };

  const activeEp = episodes.find((e) => e.id === playing);

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
        <h1
          className="font-serif text-xl"
          style={{ fontFamily: "'Playfair Display', serif", color: "var(--paris-noir)" }}
        >
          🎧 Promenades sonores
        </h1>
        <p className="text-xs mt-0.5" style={{ color: "var(--paris-sepia)" }}>
          Les récits de Léon — enregistrés dans le Marais
        </p>
        <div className="mt-3 paris-gold-line" aria-hidden="true" />
      </div>

      <div className="flex-1 overflow-y-auto pb-28">

        {/* ── Lecteur actif (si lecture en cours) ── */}
        <AnimatePresence>
          {activeEp && (
            <motion.div
              key="player"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-4 mt-4 rounded-2xl p-4 shadow-paris-md"
              style={{
                background: "linear-gradient(135deg, var(--paris-noir) 0%, #2a2a35 100%)",
                border: "1px solid rgba(212,168,83,0.3)",
              }}
              role="region"
              aria-label="Lecteur audio actif"
              aria-live="polite"
            >
              <div className="flex items-center gap-4">
                {/* Avatar de Léon animé */}
                <div className="relative">
                  <LeonAvatar etat="accueil" taille={52} />
                  {/* Ondes sonores */}
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border"
                      style={{ borderColor: "rgba(212,168,83,0.4)" }}
                      animate={{ scale: [1, 1.5 + i * 0.3], opacity: [0.6, 0] }}
                      transition={{ duration: 1.5, delay: i * 0.4, repeat: Infinity }}
                    />
                  ))}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-semibold text-white leading-tight line-clamp-1"
                  >
                    {activeEp.titre}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: "rgba(212,168,83,0.8)" }}>
                    {activeEp.sousTitre}
                  </p>

                  {/* Barre de progression */}
                  <div
                    className="mt-2 h-1 rounded-full overflow-hidden"
                    style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                    role="progressbar"
                    aria-valuenow={Math.round(progress[activeEp.id] ?? 0)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        width: `${progress[activeEp.id] ?? 0}%`,
                        background: "linear-gradient(90deg, var(--paris-dore), #f0c878)",
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  <div className="flex justify-between mt-1">
                    <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {formatTime(currentTime[activeEp.id] ?? 0)}
                    </span>
                    <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {activeEp.duree}
                    </span>
                  </div>
                </div>

                {/* Bouton pause */}
                <button
                  onClick={() => setPlaying(null)}
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(212,168,83,0.2)", border: "1px solid rgba(212,168,83,0.4)" }}
                  aria-label="Mettre en pause"
                >
                  <span className="text-lg">⏸</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Liste des épisodes ── */}
        <section className="px-4 pt-4 space-y-3" aria-label="Épisodes disponibles">
          <div className="flex items-center gap-2 mb-1">
            <h2
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--paris-sepia)" }}
            >
              Épisodes
            </h2>
            <div className="flex-1 h-px" style={{ background: "var(--paris-bordure)" }} aria-hidden="true" />
          </div>

          {episodes.map((ep, i) => {
            const isPlaying = playing === ep.id;
            const epProgress = progress[ep.id] ?? 0;
            const epTime = currentTime[ep.id] ?? 0;

            return (
              <motion.article
                key={ep.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl overflow-hidden shadow-paris"
                style={{
                  backgroundColor: "white",
                  border: `1.5px solid ${isPlaying ? "var(--paris-dore)" : "var(--paris-bordure)"}`,
                  boxShadow: isPlaying ? "0 4px 20px rgba(212,168,83,0.2)" : undefined,
                }}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Icône épisode */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: "var(--paris-pierre)" }}
                      aria-hidden="true"
                    >
                      {ep.emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3
                            className="font-semibold text-sm leading-tight"
                            style={{ fontFamily: "'Playfair Display', serif", color: "var(--paris-noir)" }}
                          >
                            {ep.titre}
                          </h3>
                          <p className="text-[10px] mt-0.5" style={{ color: "var(--paris-sepia)" }}>
                            {ep.sousTitre} · {ep.duree}
                          </p>
                        </div>

                        {/* Bouton play/pause */}
                        <motion.button
                          whileTap={{ scale: 0.88 }}
                          onClick={() => togglePlay(ep.id)}
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-paris"
                          style={{
                            background: isPlaying
                              ? "linear-gradient(135deg, var(--paris-dore), #e8b84b)"
                              : "var(--paris-pierre)",
                            border: `1.5px solid ${isPlaying ? "var(--paris-dore)" : "var(--paris-bordure)"}`,
                          }}
                          aria-label={isPlaying ? `Mettre en pause ${ep.titre}` : `Écouter ${ep.titre}`}
                        >
                          <span className="text-lg">{isPlaying ? "⏸" : "▶️"}</span>
                        </motion.button>
                      </div>

                      <p
                        className="text-[11px] mt-2 leading-relaxed"
                        style={{ color: "var(--paris-sepia)" }}
                      >
                        {ep.description}
                      </p>

                      {/* Tag */}
                      <span
                        className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{
                          backgroundColor: `${tagColors[ep.tag]}18`,
                          color: tagColors[ep.tag],
                          border: `1px solid ${tagColors[ep.tag]}44`,
                        }}
                      >
                        {ep.tag}
                      </span>
                    </div>
                  </div>

                  {/* Barre de progression si commencé */}
                  {epTime > 0 && (
                    <div className="mt-3">
                      <div
                        className="h-1 rounded-full overflow-hidden"
                        style={{ backgroundColor: "var(--paris-bordure)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${epProgress}%`,
                            background: "linear-gradient(90deg, var(--paris-dore), #e8b84b)",
                          }}
                        />
                      </div>
                      <p className="text-[9px] mt-1" style={{ color: "var(--paris-sepia)" }}>
                        {formatTime(epTime)} / {ep.duree}
                      </p>
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </section>

        {/* ── Note de Léon ── */}
        <div
          className="mx-4 mt-4 mb-6 rounded-xl p-4 text-center"
          style={{ backgroundColor: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.25)" }}
        >
          <p className="text-[11px] italic" style={{ color: "var(--paris-sepia)" }}>
            "Écoutez-moi depuis la Place des Vosges, un café à la main.
            <br />C'est ainsi que Paris se révèle à ceux qui savent écouter."
          </p>
          <p className="text-[10px] font-bold mt-2" style={{ color: "var(--paris-dore)" }}>— Léon</p>
        </div>
      </div>
    </div>
  );
}
