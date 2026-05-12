/* ============================================================
   LeonAvatar.tsx — Avatar SVG de Léon le Concierge
   États : accueil | recherche | recommandation
   Animations : respiration, clignement, expressions
   ============================================================ */

import { motion } from "framer-motion";

type LeonEtat = "accueil" | "recherche" | "recommandation";

interface Props {
  etat?: LeonEtat;
  taille?: number;
  className?: string;
}

export default function LeonAvatar({ etat = "accueil", taille = 72, className = "" }: Props) {

  const mouthPath = etat === "recommandation"
    ? "M 28 42 Q 36 48 44 42"   // sourire large
    : etat === "recherche"
    ? "M 30 42 Q 36 44 42 42"   // sourire neutre/pensif
    : "M 29 42 Q 36 47 43 42";  // sourire bienveillant

  const rightEyeScaleY = etat === "recommandation" ? 0.05 : 1;

  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`}
      animate={{ scaleY: [1, 1.018, 1] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" as const }}
      style={{ transformOrigin: "bottom center", width: taille, height: Math.round(taille * 90 / 72), display: "inline-flex" }}
    >
      <svg
        viewBox="0 0 72 90"
        width={taille}
        height={Math.round(taille * 90 / 72)}
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`Léon le concierge — état : ${etat}`}
        role="img"
      >
        {/* ── Ombre portée sous le personnage ── */}
        <ellipse cx="36" cy="87" rx="16" ry="3" fill="rgba(28,28,28,0.10)" />

        {/* ── Corps : veste anthracite ── */}
        <path
          d="M 12 58 Q 8 62 10 80 L 62 80 Q 64 62 60 58 L 50 54 Q 42 60 36 60 Q 30 60 22 54 Z"
          fill="#3D3D3D"
        />

        {/* ── Revers de veste ── */}
        <path d="M 36 60 L 30 54 L 28 68 Z" fill="#2a2a2a" />
        <path d="M 36 60 L 42 54 L 44 68 Z" fill="#2a2a2a" />

        {/* ── Col roulé marine ── */}
        <rect x="28" y="50" width="16" height="12" rx="4" fill="#1a2a4a" />
        <rect x="30" y="50" width="12" height="6" rx="3" fill="#1e3255" />

        {/* ── Foulard rouge (signature de Léon) ── */}
        <path
          d="M 30 54 Q 36 58 42 54 Q 42 60 36 62 Q 30 60 30 54 Z"
          fill="#C83C3C"
          opacity="0.92"
        />
        {/* Nœud du foulard */}
        <ellipse cx="36" cy="55" rx="3" ry="2" fill="#a32e2e" />

        {/* ── Badge doré sur la veste ── */}
        <ellipse cx="48" cy="63" rx="4" ry="2.5" fill="#D4A853" />
        <text x="48" y="64.5" textAnchor="middle" fontSize="2.8" fill="#1C1C1C" fontWeight="bold" fontFamily="serif">L</text>

        {/* ── Cou ── */}
        <rect x="32" y="44" width="8" height="8" rx="4" fill="#D4A277" />

        {/* ── Tête ── */}
        <ellipse cx="36" cy="34" rx="16" ry="18" fill="#D4A277" />

        {/* ── Cheveux ── */}
        <path
          d="M 20 28 Q 20 16 36 16 Q 52 16 52 28 Q 48 20 36 20 Q 24 20 20 28 Z"
          fill="#2a1f14"
        />
        {/* Mèche légère */}
        <path d="M 36 16 Q 39 14 41 17" stroke="#2a1f14" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* ── Sourcils ── */}
        {etat === "recherche" ? (
          <>
            <path d="M 24 25 Q 29 23 31 25" stroke="#2a1f14" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M 41 25 Q 43 23 48 25" stroke="#2a1f14" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M 24 26 Q 29 24 31 26" stroke="#2a1f14" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 41 26 Q 43 24 48 26" stroke="#2a1f14" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </>
        )}

        {/* ── Oeil gauche ── */}
        <ellipse cx="29" cy="33" rx="3.5" ry="3.5" fill="white" />
        <motion.ellipse
          cx="29" cy="33"
          rx="2"
          ry="2"
          fill="#1C1C1C"
          animate={{ scaleY: [1, 1, 0.05, 1, 1] }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            repeatDelay: 3.5,
            ease: "easeInOut" as const,
            times: [0, 0.4, 0.5, 0.6, 1],
          }}
          style={{ originX: "29px", originY: "33px" }}
        />
        <ellipse cx="29.8" cy="32.2" rx="0.6" ry="0.6" fill="white" />

        {/* ── Oeil droit (clin d'oeil en mode recommandation) ── */}
        <ellipse cx="43" cy="33" rx="3.5" ry="3.5" fill="white" />
        <motion.ellipse
          cx="43" cy="33"
          rx="2"
          animate={{ scaleY: rightEyeScaleY }}
          transition={{ duration: 0.15 }}
          fill="#1C1C1C"
          style={{ originX: "43px", originY: "33px" }}
        />
        {rightEyeScaleY === 1 && <ellipse cx="43.8" cy="32.2" rx="0.6" ry="0.6" fill="white" />}

        {/* ── Nez ── */}
        <path d="M 36 35 Q 34 40 36 41 Q 38 40 36 35" fill="#bf8d62" />

        {/* ── Bouche dynamique ── */}
        <motion.path
          d={mouthPath}
          stroke="#8B4513"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          animate={{ d: mouthPath }}
          transition={{ duration: 0.4, ease: "easeInOut" as const }}
        />

        {/* ── Oreilles ── */}
        <ellipse cx="20" cy="34" rx="3" ry="4" fill="#D4A277" />
        <ellipse cx="52" cy="34" rx="3" ry="4" fill="#D4A277" />
        <ellipse cx="20" cy="34" rx="1.5" ry="2.5" fill="#bf8d62" />
        <ellipse cx="52" cy="34" rx="1.5" ry="2.5" fill="#bf8d62" />

        {/* ── Bras levé (main au menton) en mode recherche ── */}
        {etat === "recherche" && (
          <motion.g
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <path
              d="M 55 63 Q 58 55 50 48"
              stroke="#3D3D3D"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            <ellipse cx="50" cy="46" rx="4" ry="3.5" fill="#D4A277" />
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
}
