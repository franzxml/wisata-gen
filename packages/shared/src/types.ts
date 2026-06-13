// ─── API Wrapper ─────────────────────────────────────────────────────────────

export type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

// ─── GA Optimize ─────────────────────────────────────────────────────────────

export type OptimizeRequest = {
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
};

export type PaketResult = {
  nama: string;
  /** Harga dalam ribuan rupiah */
  harga: number;
  rating: number;
  durasi: number;
  destinasi: number;
};

export type OptimizeResult = {
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
};
