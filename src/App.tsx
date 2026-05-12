/* ============================================================
   App.tsx — Point d'entrée de ParisLocal (mis à jour)
   + HotelContext, + vue Chat, navigation mise à jour
   ============================================================ */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HotelProvider } from "./context/HotelContext";
import BottomMenu from "./components/BottomMenu";
import MenuDrawer from "./components/MenuDrawer";
import SplashScreen from "./components/SplashScreen";
import Home from "./views/Home";
import MapView from "./views/MapView";
import Chat from "./views/Chat";
import InfoHotel from "./views/InfoHotel";

export type Vue = "home" | "map" | "chat" | "info";

/* Animation de transition "feuilletage de carnet" */
const pageVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -30 },
};

const pageTransition = {
  duration: 0.3,
  ease: "easeInOut" as const,
};

export default function App() {
  const [vue, setVue] = useState<Vue>("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  const handleNavigate = (nouvelleVue: Vue) => {
    setVue(nouvelleVue);
    setDrawerOpen(false);
  };

  /* Rendu conditionnel de la vue active */
  const renderVue = () => {
    switch (vue) {
      case "home":  return <Home />;
      case "map":   return <MapView />;
      case "chat":  return <Chat />;
      case "info":  return <InfoHotel />;
      default:      return <Home />;
    }
  };

  return (
    <HotelProvider>
      <>
        {/* ── Écran de démarrage ── */}
        {!splashDone && (
          <SplashScreen onComplete={() => setSplashDone(true)} />
        )}

        {/* ── Conteneur principal (mobile-first, max 480px) ── */}
        <div
          className="relative w-full max-w-[480px] min-h-dvh overflow-hidden"
          style={{ backgroundColor: "var(--paris-creme)" }}
          id="paris-local-app"
        >
          {/* ── Transition de page (feuilletage de carnet) ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={vue}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="will-change-transform"
            >
              {renderVue()}
            </motion.div>
          </AnimatePresence>

          {/* ── Barre de navigation fixe ── */}
          <BottomMenu
            vueActive={vue}
            onNavigate={handleNavigate}
            onDrawer={() => setDrawerOpen(true)}
          />

          {/* ── Tiroir de menu ── */}
          <MenuDrawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onNavigate={handleNavigate}
          />
        </div>

        {/* ── Style global pour le fond desktop ── */}
        <style>{`
          #root {
            display: flex;
            justify-content: center;
            background: #1a1a1a;
            min-height: 100dvh;
          }
          @media (min-width: 480px) {
            body::before {
              content: '';
              position: fixed;
              inset: 0;
              background:
                radial-gradient(ellipse at 30% 20%, rgba(212,168,83,0.06) 0%, transparent 60%),
                radial-gradient(ellipse at 70% 80%, rgba(200,60,60,0.04) 0%, transparent 60%),
                #1a1a1a;
              z-index: -1;
            }
          }
        `}</style>
      </>
    </HotelProvider>
  );
}
