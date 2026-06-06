"""
Algoritma Genetika — Binary Encoding
=====================================
PERBAIKAN dari sistem lama (integer encoding):

  Lama : kromosom = 1 integer (indeks paket)
         crossover = random.choice([induk1, induk2])  ← gen TIDAK ditukar, hanya pilih satu induk

  Baru : kromosom = list 20-bit [0,1,0,1,...] — setiap bit = apakah paket ke-i dipilih
         crossover = uniform crossover ← setiap bit diputuskan independen (cocok untuk knapsack binary)

Pergeseran masalah: dari "pilih 1 paket terbaik" → "pilih kombinasi paket terbaik"
dalam batas anggaran & durasi (knapsack-style, selaras teori di laporan).

Tambahan: repair operator memastikan setiap kromosom valid setelah crossover/mutasi.
"""

import random
from .dataset import DATASET, JUMLAH_PAKET, RATA_RATING, RATA_DESTINASI

# Type alias
Kromosom = list[int]  # panjang JUMLAH_PAKET, nilai 0 atau 1


# ─── Repair Operator ─────────────────────────────────────────────────────────

def repair(kromosom: Kromosom, anggaran_maks: int, durasi_maks: int) -> Kromosom:
    """
    Perbaiki kromosom agar memenuhi hard constraint.
    Hapus paket secara acak (bit 1 → 0) hingga total harga & durasi valid.
    Operator ini menjaga populasi tetap feasible sepanjang evolusi.
    """
    hasil = kromosom[:]
    dipilih = [i for i, bit in enumerate(hasil) if bit == 1]
    random.shuffle(dipilih)

    for idx in dipilih:
        total_h = sum(DATASET[i]["harga"]  for i, b in enumerate(hasil) if b == 1)
        total_d = sum(DATASET[i]["durasi"] for i, b in enumerate(hasil) if b == 1)
        if total_h <= anggaran_maks and total_d <= durasi_maks:
            break
        hasil[idx] = 0  # Hapus paket ini agar constraint terpenuhi

    return hasil


# ─── Inisialisasi ────────────────────────────────────────────────────────────

def inisialisasi_populasi(
    ukuran: int, anggaran_maks: int, durasi_maks: int
) -> list[Kromosom]:
    """
    Bangkitkan populasi awal secara acak (sparse binary) lalu repair.
    Bias ke 0 (25% peluang bit=1) agar tidak langsung melanggar constraint.
    """
    populasi = []
    for _ in range(ukuran):
        krom = [1 if random.random() < 0.25 else 0 for _ in range(JUMLAH_PAKET)]
        krom = repair(krom, anggaran_maks, durasi_maks)
        populasi.append(krom)
    return populasi


# ─── Fungsi Fitness ───────────────────────────────────────────────────────────

def hitung_fitness(kromosom: Kromosom, anggaran_maks: int, durasi_maks: int) -> float:
    """
    Evaluasi kualitas kromosom.

    Hard constraint (fitness = 0 jika dilanggar):
      - total harga seluruh paket terpilih > anggaran_maks
      - total durasi seluruh paket terpilih > durasi_maks

    Komponen fitness berbobot (dinormalisasi 0–1):
      - Rating rata-rata    : bobot 0.35
      - Total destinasi     : bobot 0.25  (cap 20 destinasi total)
      - Efisiensi harga     : bobot 0.25  (lebih murah = lebih tinggi)
      - Pemanfaatan durasi  : bobot 0.15  (mendekati durasi_maks = tinggi)
      - Bonus soft constraint: +0.05 per kriteria terpenuhi (maks +0.10)
    """
    selected = [DATASET[i] for i, bit in enumerate(kromosom) if bit == 1]
    if not selected:
        return 0.0

    total_harga     = sum(p["harga"]     for p in selected)
    total_durasi    = sum(p["durasi"]    for p in selected)
    total_destinasi = sum(p["destinasi"] for p in selected)
    rata_rating     = sum(p["rating"]    for p in selected) / len(selected)

    # Hard constraints — return 0 jika dilanggar (seharusnya tidak terjadi setelah repair)
    if total_harga > anggaran_maks or total_durasi > durasi_maks:
        return 0.0

    # Normalisasi setiap kriteria ke skala 0.0–1.0
    nilai_rating    = rata_rating / 5.0
    nilai_destinasi = min(total_destinasi / 20.0, 1.0)  # cap di 20 destinasi total
    nilai_harga     = 1.0 - (total_harga / anggaran_maks)   # lebih murah = lebih tinggi
    nilai_durasi    = total_durasi / durasi_maks             # manfaatkan waktu semaksimal mungkin

    # Soft constraint — bonus per kriteria terpenuhi
    bonus = 0.0
    if rata_rating >= RATA_RATING:
        bonus += 0.05
    if total_destinasi / len(selected) >= RATA_DESTINASI:
        bonus += 0.05

    fitness = (
        0.35 * nilai_rating    +
        0.25 * nilai_destinasi +
        0.25 * nilai_harga     +
        0.15 * nilai_durasi    +
        bonus
    )
    return round(min(fitness, 1.10), 4)


def evaluasi_populasi(
    populasi: list[Kromosom], anggaran_maks: int, durasi_maks: int
) -> list[float]:
    return [hitung_fitness(k, anggaran_maks, durasi_maks) for k in populasi]


# ─── Seleksi ─────────────────────────────────────────────────────────────────

def tournament_selection(
    populasi: list[Kromosom], fitness_list: list[float], k: int = 3
) -> Kromosom:
    """Pilih pemenang dari k peserta acak — efisien dan tahan super-individu."""
    peserta = random.sample(range(len(populasi)), min(k, len(populasi)))
    terbaik = max(peserta, key=lambda i: fitness_list[i])
    return populasi[terbaik][:]


def roulette_selection(
    populasi: list[Kromosom], fitness_list: list[float]
) -> Kromosom:
    """Pilih proporsional terhadap fitness — mempertahankan keberagaman."""
    total = sum(fitness_list)
    if total == 0:
        return random.choice(populasi)[:]
    r = random.random()
    kumulatif = 0.0
    for krom, fit in zip(populasi, fitness_list):
        kumulatif += fit / total
        if r <= kumulatif:
            return krom[:]
    return populasi[-1][:]


def seleksi_induk(
    populasi: list[Kromosom],
    fitness_list: list[float],
    metode: str = "tournament",
    k: int = 3,
) -> tuple[Kromosom, Kromosom]:
    if metode == "tournament":
        return (
            tournament_selection(populasi, fitness_list, k),
            tournament_selection(populasi, fitness_list, k),
        )
    return (
        roulette_selection(populasi, fitness_list),
        roulette_selection(populasi, fitness_list),
    )


# ─── Crossover ───────────────────────────────────────────────────────────────

def crossover(
    p1: Kromosom, p2: Kromosom, pc: float
) -> tuple[Kromosom, Kromosom]:
    """
    Uniform crossover pada bit array.

    Setiap bit diputuskan secara independen: peluang 50% berasal dari P1 atau P2.
    Lebih tepat dari one-point crossover untuk masalah binary knapsack karena
    setiap bit (paket) tidak memiliki hubungan posisional dengan bit tetangganya —
    tidak ada asumsi building blocks yang perlu dipertahankan.

    Contoh:
      P1 = [1, 0, 1, 0, 0, 1, 0, 1, ...]
      P2 = [0, 1, 0, 1, 1, 0, 1, 0, ...]
      mask= [P1,P2,P2,P1,P2,P1,P1,P2, ...]  ← tiap posisi diundi independen
      A1 = [1, 1, 0, 0, 1, 1, 0, 0, ...]
      A2 = [0, 0, 1, 1, 0, 0, 1, 1, ...]
    """
    if random.random() > pc:
        return p1[:], p2[:]
    anak1 = [p1[i] if random.random() < 0.5 else p2[i] for i in range(JUMLAH_PAKET)]
    anak2 = [p2[i] if random.random() < 0.5 else p1[i] for i in range(JUMLAH_PAKET)]
    return anak1, anak2


# ─── Mutasi ──────────────────────────────────────────────────────────────────

def mutasi(kromosom: Kromosom, pm: float) -> Kromosom:
    """
    Bit-flip mutation — setiap gen memiliki peluang pm untuk dibalik (0→1 atau 1→0).
    pm = probabilitas per-bit (beda dari sistem lama yang per-kromosom).
    Default pm=0.05: expected ~1 bit flip per kromosom (20 gen × 0.05).
    """
    return [1 - bit if random.random() <= pm else bit for bit in kromosom]


# ─── Helper ──────────────────────────────────────────────────────────────────

def indeks_terbaik(fitness_list: list[float]) -> int:
    return fitness_list.index(max(fitness_list))


# ─── Main Loop GA ────────────────────────────────────────────────────────────

def jalankan_ga(
    anggaran_maks: int,
    durasi_maks: int,
    ukuran_populasi: int = 50,
    max_generasi: int = 100,
    pc: float = 0.8,
    pm: float = 0.05,
    metode: str = "tournament",
) -> dict:
    """
    Loop utama Algoritma Genetika dengan elitisme + repair operator.
    Kembalikan dict berisi paket terpilih, fitness, dan riwayat konvergensi.
    """
    populasi = inisialisasi_populasi(ukuran_populasi, anggaran_maks, durasi_maks)
    riwayat_terbaik:  list[float] = []
    riwayat_rata:     list[float] = []
    riwayat_terburuk: list[float] = []
    generasi_konvergen = 1
    fitness_terbaik_global = -1.0

    for gen in range(max_generasi):
        fitness_list = evaluasi_populasi(populasi, anggaran_maks, durasi_maks)

        idx_best = indeks_terbaik(fitness_list)
        best_fit = fitness_list[idx_best]

        valid = [f for f in fitness_list if f > 0]
        avg_fit   = round(sum(valid) / len(valid), 4) if valid else 0.0
        worst_fit = round(min(valid), 4) if valid else 0.0

        riwayat_terbaik.append(best_fit)
        riwayat_rata.append(avg_fit)
        riwayat_terburuk.append(worst_fit)

        # Catat generasi terakhir ada peningkatan
        if best_fit > fitness_terbaik_global:
            fitness_terbaik_global = best_fit
            generasi_konvergen = gen + 1

        # Bentuk populasi baru
        populasi_baru: list[Kromosom] = [populasi[idx_best][:]]  # Elitisme

        while len(populasi_baru) < ukuran_populasi:
            p1, p2 = seleksi_induk(populasi, fitness_list, metode)
            a1, a2 = crossover(p1, p2, pc)
            a1 = repair(mutasi(a1, pm), anggaran_maks, durasi_maks)
            a2 = repair(mutasi(a2, pm), anggaran_maks, durasi_maks)
            populasi_baru.append(a1)
            if len(populasi_baru) < ukuran_populasi:
                populasi_baru.append(a2)

        populasi = populasi_baru

    # Evaluasi final
    fitness_list = evaluasi_populasi(populasi, anggaran_maks, durasi_maks)
    idx_best  = indeks_terbaik(fitness_list)
    best_krom = populasi[idx_best]
    best_fit  = fitness_list[idx_best]

    selected        = [DATASET[i] for i, bit in enumerate(best_krom) if bit == 1]
    total_harga     = sum(p["harga"]     for p in selected) if selected else 0
    total_durasi    = sum(p["durasi"]    for p in selected) if selected else 0
    total_destinasi = sum(p["destinasi"] for p in selected) if selected else 0
    rata_rata_rating = (
        round(sum(p["rating"] for p in selected) / len(selected), 2)
        if selected else 0.0
    )

    return {
        "paket_terpilih":     selected,
        "fitness_terbaik":    best_fit,
        "riwayat_fitness":    riwayat_terbaik,
        "riwayat_rata":       riwayat_rata,
        "riwayat_terburuk":   riwayat_terburuk,
        "total_harga":        total_harga,
        "total_durasi":       total_durasi,
        "total_destinasi":    total_destinasi,
        "rata_rata_rating":   rata_rata_rating,
        "generasi_konvergen": generasi_konvergen,
    }
