/* ============================================================
   mockData.ts — Données de test pour l'Hôtel du Marais
   Jeu de données authentique, zéro cliché touristique
   ============================================================ */

export const hotel = {
  nom: "Hôtel du Marais",
  adresse: "12 Rue de Bretagne, 75003 Paris",
  telephone: "+33 1 42 72 00 00",
  wifi: "HotelMarais_Guest",
  wifiPassword: "Marais2024!",
  checkOut: "11h00",
  roomService: "07h00 – 22h00",
};

export type Categorie = "resto" | "culture" | "service";

export interface Lieu {
  id: string;
  nom: string;
  categorie: Categorie;
  sousCategorie: string;
  description: string;
  adresse: string;
  distance: string;
  horaires: string;
  prix: string;
  noteLeon: string;
  coupDeCoeur: boolean;
  emoji: string;
  lat: number;
  lng: number;
  tags: string[];
}

export const lieux: Lieu[] = [
  /* ─── RESTAURANTS ─── */
  {
    id: "r1",
    nom: "Chez Janou",
    categorie: "resto",
    sousCategorie: "Bistro Provençal",
    description:
      "Une institution discrète du Marais. La mousse au chocolat à volonté est un crime délicieux. Tables en terrasse l'été, ambiance chaleureuse à l'année.",
    adresse: "2 Rue Roger Verlomme, 75003",
    distance: "4 min à pied",
    horaires: "12h – 23h30 (sf dimanche midi)",
    prix: "€€ — 28–40€/pers",
    noteLeon:
      "Je vous ai déniché une petite pépite… Réservez 48h à l'avance, ça part vite !",
    coupDeCoeur: true,
    emoji: "🍷",
    lat: 48.858,
    lng: 2.362,
    tags: ["terrasse", "réservation conseillée", "veggie-friendly"],
  },
  {
    id: "r2",
    nom: "Le Marché des Enfants Rouges",
    categorie: "resto",
    sousCategorie: "Marché couvert • Street Food",
    description:
      "Le plus vieux marché couvert de Paris (1615). Japonais, marocain, italien, antillais… Le vrai melting-pot parisien dans un cadre historique.",
    adresse: "39 Rue de Bretagne, 75003",
    distance: "2 min à pied",
    horaires: "Mar–Sam 8h30–20h30 • Dim 8h30–17h",
    prix: "€ — 10–20€/pers",
    noteLeon:
      "Attention : fermé le lundi ! Sinon, foncez au stand marocain, le couscous de Meriem est légendaire.",
    coupDeCoeur: false,
    emoji: "🥘",
    lat: 48.8608,
    lng: 2.3607,
    tags: ["historique", "brunch", "ouvert tôt"],
  },
  {
    id: "r3",
    nom: "Café de la Paix du Marais",
    categorie: "resto",
    sousCategorie: "Café-Brasserie",
    description:
      "La brasserie de quartier par excellence. Steak-frites irréprochable, croque-monsieur généreux. Une adresse sans prétention où les habitués se retrouvent.",
    adresse: "8 Rue du Pont aux Choux, 75003",
    distance: "6 min à pied",
    horaires: "7h – 23h (tous les jours)",
    prix: "€ – €€ — 15–28€/pers",
    noteLeon:
      "Pour un petit-déjeuner serré avant d'explorer le quartier, c'est ici. Le café est torréfié à Belleville.",
    coupDeCoeur: false,
    emoji: "☕",
    lat: 48.8598,
    lng: 2.3651,
    tags: ["petit-déjeuner", "sans réservation", "carte courte"],
  },

  /* ─── CULTURE ─── */
  {
    id: "c1",
    nom: "Musée Picasso",
    categorie: "culture",
    sousCategorie: "Musée national",
    description:
      "Dans l'Hôtel Salé (XVIIe), l'un des plus beaux hôtels particuliers du Marais. 5 000 œuvres, toute la vie de Pablo. À voir : la période bleue au 1er étage.",
    adresse: "5 Rue de Thorigny, 75003",
    distance: "8 min à pied",
    horaires: "Mar–Ven 10h30–18h • Sam–Dim 9h30–18h",
    prix: "€€ — 14€ • Gratuit –18 ans",
    noteLeon:
      "Venez tôt le matin ou en semaine. Évitez les week-ends de mai — c'est la cohue.",
    coupDeCoeur: true,
    emoji: "🎨",
    lat: 48.8596,
    lng: 2.3624,
    tags: ["art", "incontournable", "audioguide disponible"],
  },
  {
    id: "c2",
    nom: "Place des Vosges",
    categorie: "culture",
    sousCategorie: "Place historique • Promenade",
    description:
      "La plus ancienne place de Paris (1612), chef-d'œuvre de symétrie sous Henri IV. Arcades en brique rose, fontaines murmurantes, galeries d'art. Victor Hugo y vécut.",
    adresse: "Place des Vosges, 75004",
    distance: "12 min à pied",
    horaires: "Accès libre 24h/24",
    prix: "Gratuit",
    noteLeon:
      "Au coucher du soleil, la lumière sur la brique rouge est à couper le souffle. Apportez un livre et installez-vous sous les arcades.",
    coupDeCoeur: false,
    emoji: "🏛️",
    lat: 48.8556,
    lng: 2.3655,
    tags: ["gratuit", "promenade", "instagram"],
  },

  /* ─── SERVICES ─── */
  {
    id: "s1",
    nom: "Métro Saint-Paul",
    categorie: "service",
    sousCategorie: "Transport • Ligne 1",
    description:
      "Station Ligne 1 (La Défense ↔ Vincennes). Accès direct Châtelet, Louvre, Champs-Élysées. Fréquence : 2–5 min en heure de pointe.",
    adresse: "Rue de Rivoli, 75004",
    distance: "7 min à pied",
    horaires: "Lun–Sam 5h30–00h30 • Dim 6h30–00h30",
    prix: "€ — 2,15€ / ticket",
    noteLeon:
      "Achetez un carnet de 10 tickets (Carnet t+) à l'automate — c'est bien plus économique !",
    coupDeCoeur: false,
    emoji: "🚇",
    lat: 48.8551,
    lng: 2.3563,
    tags: ["transport", "ligne 1", "accessibilité PMR"],
  },
  {
    id: "s2",
    nom: "Pharmacie du Marais",
    categorie: "service",
    sousCategorie: "Santé • Pharmacie",
    description:
      "Pharmacie de garde pour le quartier. Personnel anglophone, large stock d'homéopathie et de parapharmacie. Livraison possible sur demande.",
    adresse: "26 Rue de Bretagne, 75003",
    distance: "3 min à pied",
    horaires: "Lun–Sam 9h–20h • Dim 10h–19h",
    prix: "Remboursement Sécu / Assurance voyage",
    noteLeon:
      "Mentionnez l'hôtel — ils nous connaissent et pourront vous orienter rapidement.",
    coupDeCoeur: false,
    emoji: "💊",
    lat: 48.8613,
    lng: 2.3611,
    tags: ["urgence", "anglophone", "livraison"],
  },
  {
    id: "s3",
    nom: "Laverie du Temple",
    categorie: "service",
    sousCategorie: "Laverie • Self-service",
    description:
      "Laverie automatique propre et sécurisée. Machines de 6 à 14 kg. Séchoirs rapides. Idéal pour les longs séjours ou les voyageurs légers.",
    adresse: "14 Rue du Temple, 75004",
    distance: "10 min à pied",
    horaires: "7h – 21h (tous les jours)",
    prix: "€ — 4€ à 8€ le lavage",
    noteLeon:
      "Prévoyez de la monnaie ou la carte bancaire. Comptez 1h30 lavage + séchage.",
    coupDeCoeur: false,
    emoji: "🧺",
    lat: 48.858,
    lng: 2.3522,
    tags: ["pratique", "longue durée", "CB acceptée"],
  },
];

/* ─── Accès rapides ─── */
export const quickAccess = [
  { id: "qa1", label: "Restaurants", emoji: "🍽️", categorie: "resto" as Categorie },
  { id: "qa2", label: "Culture",      emoji: "🎨", categorie: "culture" as Categorie },
  { id: "qa3", label: "Services",     emoji: "🛎️", categorie: "service" as Categorie },
  { id: "qa4", label: "Transports",   emoji: "🚇", categorie: "service" as Categorie },
];

/* ─── Messages de Léon selon l'état ─── */
export const leonMessages = {
  accueil: [
    "Bonjour ! Je suis Léon, votre guide dans le Marais. Que puis-je faire pour vous ?",
    "Bienvenue à l'Hôtel du Marais ! Comment puis-je embellir votre séjour ?",
    "Le Marais n'a plus de secrets pour moi — posez-moi vos questions !",
  ],
  recherche: [
    "Laissez-moi chercher la perle rare pour vous…",
    "Je fouille mes carnets d'adresses secrètes…",
    "Un instant, je consulte mes sources les plus fiables…",
  ],
  recommandation: [
    "Voilà exactement ce qu'il vous faut !",
    "J'en réponds personnellement — vous ne serez pas déçu.",
    "C'est le genre d'adresse qu'on ne partage qu'aux initiés…",
  ],
};
