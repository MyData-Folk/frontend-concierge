/* ============================================================
   api.ts — Couche service pour l'API ParisLocal
   Cible : https://api.hotelmanager.fr
   ============================================================ */

const API_BASE = import.meta.env.VITE_API_URL ?? "https://api.hotelmanager.fr";

/* ── Types ── */

export interface POI {
  id: string;
  name: string;
  category: "tourism" | "transport" | "shop" | "health" | string;
  distance_m: number;
  lat: number;
  lng: number;
  source: "OSM" | "Mock";
}

export interface HotelCoords {
  lat: number;
  lng: number;
  address: string;
  suburb: string;
  district: string;
}

export interface OnboardingResult {
  hotel_name: string;
  coords: HotelCoords;
  pois: POI[];
  wiki: { title: string; summary: string; url: string } | null;
  status: string;
  website_url: string | null;
}

export interface HotelSearchResult {
  nom: string;
  adresse: string;
  commune: string;
  code_postal: string;
  site_internet: string | null;
  telephone: string | null;
  classement: string | null;
  coords: { lat: number; lng: number } | null;
}

export interface ChatMessage {
  role: "user" | "leon";
  content: string;
}

/* ── Helpers ── */

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/* ── API calls ── */

/** Recherche fuzzy dans la BDD hôtels Île-de-France */
export async function searchHotels(q: string): Promise<HotelSearchResult[]> {
  if (!q.trim()) return [];
  return apiFetch<HotelSearchResult[]>(`/api/hotels/search?q=${encodeURIComponent(q)}`);
}

/** Récupère les données existantes d'un hôtel */
export async function getHotelData(name: string): Promise<OnboardingResult | null> {
  try {
    return await apiFetch<OnboardingResult>(`/api/hotel-data?name=${encodeURIComponent(name)}`);
  } catch {
    return null;
  }
}

/** Lance le pipeline d'onboarding pour un hôtel donné */
export async function onboardHotel(
  hotel_name: string,
  hotel_address: string,
  website_url?: string
): Promise<OnboardingResult> {
  return apiFetch<OnboardingResult>("/api/onboard", {
    method: "POST",
    body: JSON.stringify({ hotel_name, hotel_address, website_url }),
  });
}

/** Envoie un message à Léon et reçoit une réponse IA */
export async function chatWithLeon(
  message: string,
  history: ChatMessage[],
  hotelContext: Partial<OnboardingResult> | null
): Promise<{ reply: string }> {
  return apiFetch<{ reply: string }>("/api/chat", {
    method: "POST",
    body: JSON.stringify({ message, history, hotelContext }),
  });
}

/* ── Cache localStorage ── */

const CACHE_KEY = "parislocal_hotel_cache";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h

export function getCachedHotelData(): OnboardingResult | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function setCachedHotelData(data: OnboardingResult): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    /* ignore quota errors */
  }
}

export function clearHotelCache(): void {
  localStorage.removeItem(CACHE_KEY);
}
