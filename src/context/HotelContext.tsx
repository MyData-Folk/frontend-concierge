/* ============================================================
   HotelContext.tsx — Contexte global de l'hôtel
   Charge les données réelles depuis l'API, avec fallback mock
   ============================================================ */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  onboardHotel,
  getHotelData,
  getCachedHotelData,
  setCachedHotelData,
  type OnboardingResult,
  type POI,
} from "../services/api";
import { hotel as mockHotel, lieux as mockLieux } from "../data/mockData";

/* ── Types ── */

export interface HotelInfo {
  nom: string;
  adresse: string;
  telephone: string;
  wifi: string;
  wifiPassword: string;
  checkOut: string;
  roomService: string;
}

export interface HotelContextValue {
  hotel: HotelInfo;
  coords: { lat: number; lng: number; suburb: string; district: string } | null;
  pois: POI[];
  wiki: { title: string; summary: string; url: string } | null;
  isLoading: boolean;
  isOnline: boolean;
  reload: () => void;
}

/* ── Defaults (mock fallback) ── */

const defaultHotelInfo: HotelInfo = {
  nom: mockHotel.nom,
  adresse: mockHotel.adresse,
  telephone: mockHotel.telephone,
  wifi: mockHotel.wifi,
  wifiPassword: mockHotel.wifiPassword,
  checkOut: mockHotel.checkOut,
  roomService: mockHotel.roomService,
};

const defaultContext: HotelContextValue = {
  hotel: defaultHotelInfo,
  coords: null,
  pois: [],
  wiki: null,
  isLoading: false,
  isOnline: false,
  reload: () => {},
};

/* ── Context ── */

const HotelContext = createContext<HotelContextValue>(defaultContext);

/* ── Provider ── */

interface Props {
  children: ReactNode;
  /** Nom de l'hôtel à charger (URL param ou hardcodé) */
  hotelName?: string;
  hotelAddress?: string;
}

export function HotelProvider({
  children,
  hotelName = mockHotel.nom,
  hotelAddress = mockHotel.adresse,
}: Props) {
  const [data, setData] = useState<OnboardingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const load = useCallback(async () => {
    /* 1. Essai cache local (navigateur) */
    const cached = getCachedHotelData();
    if (cached) {
      setData(cached);
      setIsOnline(true);
      return;
    }

    setIsLoading(true);
    try {
      /* 2. Essai récupération BDD (Supabase via Backend) */
      const existing = await getHotelData(hotelName);
      if (existing) {
        setCachedHotelData(existing);
        setData(existing);
        setIsOnline(true);
        return;
      }

      /* 3. Pipeline complet (Geocoding + OSM + Wiki) */
      const result = await onboardHotel(hotelName, hotelAddress);
      setCachedHotelData(result);
      setData(result);
      setIsOnline(true);
    } catch (err) {
      console.warn("[HotelContext] API indisponible, mode mock activé.", err);
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  }, [hotelName, hotelAddress]);

  useEffect(() => {
    load();
  }, [load]);

  /* Fusionner données API + fallback mock */
  const hotel: HotelInfo = data
    ? {
        nom: data.hotel_name,
        adresse: data.coords.address ?? hotelAddress,
        telephone: mockHotel.telephone,
        wifi: mockHotel.wifi,
        wifiPassword: mockHotel.wifiPassword,
        checkOut: mockHotel.checkOut,
        roomService: mockHotel.roomService,
      }
    : defaultHotelInfo;

  const coords = data?.coords
    ? {
        lat: data.coords.lat,
        lng: data.coords.lng,
        suburb: data.coords.suburb,
        district: data.coords.district,
      }
    : null;

  /* Convertir les POIs OSM vers un format similaire aux lieux mock */
  const pois: POI[] = data?.pois ?? [];

  return (
    <HotelContext.Provider
      value={{
        hotel,
        coords,
        pois,
        wiki: data?.wiki ?? null,
        isLoading,
        isOnline,
        reload: load,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
}

/* ── Hook ── */

export function useHotel(): HotelContextValue {
  return useContext(HotelContext);
}
