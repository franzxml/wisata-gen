// ─── API Wrapper ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiError {
  detail: string;
  status_code: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// ─── Destination ─────────────────────────────────────────────────────────────

export interface Destination {
  id: string;
  name: string;
  description: string;
  location: string;
  category: DestinationCategory;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export type DestinationCategory =
  | "nature"
  | "culture"
  | "culinary"
  | "adventure"
  | "beach"
  | "mountain"
  | "urban";

// ─── Itinerary ────────────────────────────────────────────────────────────────

export interface GenerateItineraryRequest {
  destination_ids: string[];
  duration_days: number;
  preferences?: string[];
  budget?: "budget" | "mid-range" | "luxury";
}

export interface ItineraryDay {
  day: number;
  activities: Activity[];
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  destination_id?: string;
  duration_minutes: number;
}

export interface Itinerary {
  id: string;
  title: string;
  days: ItineraryDay[];
  created_at: string;
}

// ─── GA Optimize ─────────────────────────────────────────────────────────────

export interface OptimizeRequest {
  /** Budget maks dalam ribuan rupiah (contoh: 5000 = Rp 5.000.000) */
  anggaran_maks: number;
  /** Durasi maks dalam hari */
  durasi_maks: number;
  ukuran_populasi?: number;
  max_generasi?: number;
  /** Probabilitas crossover 0.0–1.0 */
  pc?: number;
  /** Probabilitas mutasi per-bit 0.0–1.0 */
  pm?: number;
  metode_seleksi?: "tournament" | "roulette";
}

export interface PaketResult {
  nama: string;
  /** Harga dalam ribuan rupiah */
  harga: number;
  rating: number;
  durasi: number;
  destinasi: number;
}

export interface OptimizeResult {
  paket_terpilih: PaketResult[];
  fitness_terbaik: number;
  /** Nilai fitness terbaik per generasi */
  riwayat_fitness:  number[];
  riwayat_rata:     number[];
  riwayat_terburuk: number[];
  /** Total harga dalam ribuan rupiah */
  total_harga: number;
  total_durasi: number;
  total_destinasi: number;
  rata_rata_rating: number;
  /** Generasi terakhir di mana fitness meningkat */
  generasi_konvergen: number;
}
