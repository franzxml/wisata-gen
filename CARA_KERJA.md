# Cara Kerja Program

Dokumen ini menjelaskan alur logika lengkap dari input user hingga hasil optimasi ditampilkan, lengkap dengan potongan kode dan referensi file.

---

## Gambaran Umum Arsitektur

```
Browser (React)
    │
    │  POST /api/optimize  {anggaran, durasi, param GA}
    ▼
Vercel Serverless  ──→  api/index.py  ──→  apps/backend/app/
    │                                           │
    │                                    ga/engine.py  (loop GA)
    │                                    ga/dataset.py (20 paket)
    │
    │  JSON  {paket_terpilih, fitness, riwayat_konvergensi}
    ▼
Browser (render ResultsView + ConvergenceChart)
```

---

## 1. Dataset

**File:** `apps/backend/app/ga/dataset.py`

Dataset berisi 20 paket wisata Indonesia, masing-masing dengan 5 atribut. Harga dalam satuan **ribuan rupiah** (bukan rupiah penuh) untuk menyamakan skala dengan anggaran yang dikirim frontend.

```python
DATASET: list[dict] = [
    {"nama": "Paket Bali Hemat",    "harga": 2500, "rating": 4.2, "durasi": 3, "destinasi": 4},
    {"nama": "Paket Raja Ampat",    "harga": 8000, "rating": 4.9, "durasi": 7, "destinasi": 8},
    # ... 18 paket lainnya
]

JUMLAH_PAKET   = len(DATASET)          # 20 — panjang kromosom
RATA_RATING    = sum(p["rating"]    for p in DATASET) / JUMLAH_PAKET  # ~4.41
RATA_DESTINASI = sum(p["destinasi"] for p in DATASET) / JUMLAH_PAKET  # ~5.1
```

`JUMLAH_PAKET`, `RATA_RATING`, dan `RATA_DESTINASI` diimpor oleh `engine.py` sebagai konstanta fitness.

---

## 2. Representasi Kromosom

**File:** `apps/backend/app/ga/engine.py` (baris 22)

Setiap individu adalah **binary array 20-bit**. Bit ke-`i` bernilai `1` artinya paket ke-`i` dipilih, `0` artinya tidak.

```python
Kromosom = list[int]  # panjang JUMLAH_PAKET, nilai 0 atau 1

# Contoh kromosom — pilih paket 0, 2, 5, 11:
# [1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]
```

Pendekatan ini disebut **knapsack-style**: masalahnya adalah memilih *kombinasi* paket terbaik dalam batas anggaran dan durasi.

---

## 3. Inisialisasi Populasi

**File:** `apps/backend/app/ga/engine.py` — fungsi `inisialisasi_populasi()` (baris 49)

```python
def inisialisasi_populasi(ukuran, anggaran_maks, durasi_maks):
    populasi = []
    for _ in range(ukuran):
        # Sparse: peluang bit=1 hanya 25% agar tidak langsung melanggar constraint
        krom = [1 if random.random() < 0.25 else 0 for _ in range(JUMLAH_PAKET)]
        krom = repair(krom, anggaran_maks, durasi_maks)  # pastikan feasible
        populasi.append(krom)
    return populasi
```

Setiap kromosom langsung dilewatkan ke **repair operator** sebelum masuk populasi.

---

## 4. Repair Operator

**File:** `apps/backend/app/ga/engine.py` — fungsi `repair()` (baris 27)

Repair memastikan setiap kromosom **selalu valid** (tidak melanggar anggaran atau durasi). Dipanggil setelah inisialisasi, crossover, dan mutasi.

```python
def repair(kromosom, anggaran_maks, durasi_maks):
    hasil   = kromosom[:]
    dipilih = [i for i, bit in enumerate(hasil) if bit == 1]
    random.shuffle(dipilih)  # urutan penghapusan acak agar tidak bias

    for idx in dipilih:
        total_h = sum(DATASET[i]["harga"]  for i, b in enumerate(hasil) if b == 1)
        total_d = sum(DATASET[i]["durasi"] for i, b in enumerate(hasil) if b == 1)
        if total_h <= anggaran_maks and total_d <= durasi_maks:
            break          # constraint terpenuhi, berhenti
        hasil[idx] = 0     # hapus paket ini

    return hasil
```

---

## 5. Fungsi Fitness

**File:** `apps/backend/app/ga/engine.py` — fungsi `hitung_fitness()` (baris 66)

Fitness mengukur kualitas satu kromosom. Skor dinormalisasi 0–1 dengan bobot per kriteria, ditambah bonus soft constraint.

```python
def hitung_fitness(kromosom, anggaran_maks, durasi_maks):
    selected = [DATASET[i] for i, bit in enumerate(kromosom) if bit == 1]
    if not selected:
        return 0.0

    total_harga     = sum(p["harga"]     for p in selected)
    total_durasi    = sum(p["durasi"]    for p in selected)
    total_destinasi = sum(p["destinasi"] for p in selected)
    rata_rating     = sum(p["rating"]    for p in selected) / len(selected)

    # Hard constraint — return 0 jika dilanggar (seharusnya tidak terjadi setelah repair)
    if total_harga > anggaran_maks or total_durasi > durasi_maks:
        return 0.0

    nilai_rating    = rata_rating / 5.0
    nilai_destinasi = min(total_destinasi / 20.0, 1.0)
    nilai_harga     = 1.0 - (total_harga / anggaran_maks)   # lebih murah = lebih baik
    nilai_durasi    = total_durasi / durasi_maks             # manfaatkan waktu semaksimal mungkin

    # Soft constraint bonus
    bonus = 0.0
    if rata_rating     >= RATA_RATING:    bonus += 0.05
    if total_destinasi / len(selected) >= RATA_DESTINASI: bonus += 0.05

    fitness = (
        0.35 * nilai_rating    +
        0.25 * nilai_destinasi +
        0.25 * nilai_harga     +
        0.15 * nilai_durasi    +
        bonus
    )
    return round(min(fitness, 1.10), 4)  # cap 1.10 karena bonus bisa push >1.0
```

---

## 6. Seleksi

**File:** `apps/backend/app/ga/engine.py` — fungsi `seleksi_induk()` (baris 150)

Dua metode tersedia, dipilih via parameter `metode_seleksi`:

**Tournament** (default): ambil `k=3` individu acak, pilih yang fitness tertinggi.

```python
def tournament_selection(populasi, fitness_list, k=3):
    peserta = random.sample(range(len(populasi)), min(k, len(populasi)))
    terbaik = max(peserta, key=lambda i: fitness_list[i])
    return populasi[terbaik][:]
```

**Roulette Wheel**: probabilitas terpilih proporsional terhadap nilai fitness.

```python
def roulette_selection(populasi, fitness_list):
    total = sum(fitness_list)
    if total == 0:
        return random.choice(populasi)[:]
    r, kumulatif = random.random(), 0.0
    for krom, fit in zip(populasi, fitness_list):
        kumulatif += fit / total
        if r <= kumulatif:
            return krom[:]
    return populasi[-1][:]
```

---

## 7. Crossover

**File:** `apps/backend/app/ga/engine.py` — fungsi `crossover()` (baris 169)

**One-point crossover**: pilih titik potong acak, tukar ekor kedua induk.

```python
def crossover(p1, p2, pc):
    if random.random() > pc:
        return p1[:], p2[:]          # tidak terjadi crossover
    titik = random.randint(1, JUMLAH_PAKET - 1)
    anak1 = p1[:titik] + p2[titik:]
    anak2 = p2[:titik] + p1[titik:]
    return anak1, anak2
```

Contoh dengan `titik = 7`:
```
P1 = [1,0,1,0,0,1,0 | 1,0,1,0,0,0,0,0,0,0,0,0,0]
P2 = [0,1,0,1,1,0,1 | 0,1,0,1,1,0,0,0,0,0,0,0,0]
A1 = [1,0,1,0,0,1,0,  0,1,0,1,1,0,0,0,0,0,0,0,0]
A2 = [0,1,0,1,1,0,1,  1,0,1,0,0,0,0,0,0,0,0,0,0]
```

---

## 8. Mutasi

**File:** `apps/backend/app/ga/engine.py` — fungsi `mutasi()` (baris 194)

**Bit-flip mutation**: setiap bit punya peluang `pm` untuk dibalik (`0→1` atau `1→0`).

```python
def mutasi(kromosom, pm):
    return [1 - bit if random.random() <= pm else bit for bit in kromosom]
```

Default `pm=0.05` → ekspektasi ~1 bit flip per kromosom (20 gen × 0.05).

---

## 9. Main Loop GA

**File:** `apps/backend/app/ga/engine.py` — fungsi `jalankan_ga()` (baris 211)

```python
def jalankan_ga(anggaran_maks, durasi_maks, ukuran_populasi=50,
                max_generasi=100, pc=0.8, pm=0.05, metode="tournament"):

    populasi = inisialisasi_populasi(ukuran_populasi, anggaran_maks, durasi_maks)
    fitness_terbaik_global = -1.0

    for gen in range(max_generasi):
        fitness_list = evaluasi_populasi(populasi, anggaran_maks, durasi_maks)

        # Catat riwayat untuk grafik konvergensi
        riwayat_terbaik.append(max(fitness_list))
        riwayat_rata.append(rata_valid)
        riwayat_terburuk.append(min_valid)

        # Catat generasi terakhir ada peningkatan
        if best_fit > fitness_terbaik_global:
            fitness_terbaik_global = best_fit
            generasi_konvergen = gen + 1

        # Bentuk populasi baru dengan elitisme
        populasi_baru = [populasi[idx_best][:]]         # 1 elite langsung masuk

        while len(populasi_baru) < ukuran_populasi:
            p1, p2 = seleksi_induk(populasi, fitness_list, metode)
            a1, a2 = crossover(p1, p2, pc)
            a1 = repair(mutasi(a1, pm), anggaran_maks, durasi_maks)  # mutasi → repair
            a2 = repair(mutasi(a2, pm), anggaran_maks, durasi_maks)
            populasi_baru.append(a1)
            if len(populasi_baru) < ukuran_populasi:
                populasi_baru.append(a2)

        populasi = populasi_baru
```

Urutan per generasi: **evaluasi → catat riwayat → seleksi → crossover → mutasi → repair → populasi baru**.

---

## 10. API Layer

**File:** `apps/backend/app/routers/optimize.py`

Menerima `OptimizeRequest`, memanggil `jalankan_ga()`, membungkus hasil ke `ApiResponse[OptimizeResult]`.

```python
@router.post("", response_model=ApiResponse[OptimizeResult])
def optimize(req: OptimizeRequest):
    result = jalankan_ga(
        anggaran_maks   = req.anggaran_maks,
        durasi_maks     = req.durasi_maks,
        ukuran_populasi = req.ukuran_populasi,
        max_generasi    = req.max_generasi,
        pc              = req.pc,
        pm              = req.pm,
        metode          = req.metode_seleksi,
    )
    # ... bungkus ke OptimizeResult dan return ApiResponse
```

**File:** `apps/backend/app/schemas.py` — kontrak request/response:

```python
class OptimizeRequest(BaseModel):
    anggaran_maks:   int    # ribuan rupiah, contoh 8000 = Rp 8.000.000
    durasi_maks:     int    # hari
    ukuran_populasi: int    = 50
    max_generasi:    int    = 100
    pc:              float  = 0.8
    pm:              float  = 0.05
    metode_seleksi:  str    = "tournament"

class OptimizeResult(BaseModel):
    paket_terpilih:     list[PaketResult]
    fitness_terbaik:    float
    riwayat_fitness:    list[float]   # per generasi, untuk grafik
    riwayat_rata:       list[float]
    riwayat_terburuk:   list[float]
    total_harga:        int
    total_durasi:       int
    total_destinasi:    int
    rata_rata_rating:   float
    generasi_konvergen: int
```

TypeScript mirror dari kontrak ini ada di `packages/shared/src/types.ts`.

---

## 11. Entry Point Vercel

**File:** `api/index.py`

```python
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "apps" / "backend"))

from app.main import app  # FastAPI app di-expose ke Vercel serverless
```

Vercel mendeteksi file `.py` di direktori `api/` sebagai serverless function. Semua request ke `/api/*` diarahkan ke sini via `vercel.json`.

---

## 12. Alur Frontend

**File:** `apps/frontend/src/App.tsx`

`App` adalah satu-satunya pemegang state global: `appState`, `result`, `error`.

```tsx
const [appState, setAppState] = useState<"idle"|"loading"|"done"|"error">("idle");
const [result,   setResult]   = useState<OptimizeResult | null>(null);

async function handleOptimize(req: OptimizeRequest) {
    setAppState("loading");
    const res  = await fetch("/api/optimize", { method: "POST", body: JSON.stringify(req) });
    const json = await res.json();
    setResult(json.data as OptimizeResult);
    setAppState("done");
}
```

State ini diteruskan ke `LandingView` sebagai props.

---

**File:** `apps/frontend/src/components/LandingView.tsx`

Wrapper tipis — mengatur scroll antar section saat `appState` berubah, lalu merender tiga section.

```tsx
useEffect(() => {
    if (appState !== "idle") {
        document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth" });
    } else {
        document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" });
    }
}, [appState]);

return (
    <div style={{ scrollSnapType: "y mandatory" }}>
        <HeroSection />                                             {/* section 1 */}
        <FormSection  onSubmit={onSubmit} appState={appState} />   {/* section 2 */}
        {appState !== "idle" && (
            <ResultSection appState={appState} result={result} />  {/* section 3 */}
        )}
    </div>
);
```

---

**File:** `apps/frontend/src/components/FormSection.tsx`

Mengelola seluruh state form (8 state) dan IntersectionObserver untuk animasi fade-in.

```tsx
const [anggaran, setAnggaran] = useState(8000);  // ribuan rupiah
const [durasi,   setDurasi]   = useState(7);

function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ anggaran_maks: anggaran, durasi_maks: durasi,
               ukuran_populasi: populasi, max_generasi: generasi,
               pc, pm, metode_seleksi: metode });
}
```

---

**File:** `apps/frontend/src/components/ResultsView.tsx`

Menerima `OptimizeResult`, menampilkan 4 metrik ringkasan, fitness card, grafik konvergensi, dan daftar paket.

```tsx
const { paket_terpilih, fitness_terbaik, total_harga,
        generasi_konvergen, riwayat_fitness } = result;
```

---

**File:** `apps/frontend/src/components/ConvergenceChart.tsx`

Grafik konvergensi dirender sebagai **SVG murni** (tanpa library charting). Menerima tiga array float dan menggambar tiga polyline dengan tooltip hover interaktif.

```tsx
const toX = (i: number) => pad.l + (i / (n - 1)) * iw;
const toY = (v: number) => pad.t + ih - ((v - minVal) / range) * ih;

const points = (key: keyof typeof series) =>
    series[key].map((v, i) => `${toX(i)},${toY(v)}`).join(" ");

<polyline points={points("terbaik")} stroke="#3d3d22" strokeWidth={2.5} />
<polyline points={points("rata")}    stroke="#6b6b63" strokeDasharray="5 3" />
<polyline points={points("terburuk")} stroke="#9b6b5a" strokeDasharray="3 3" />
```

---

## 13. Shared Package

**File:** `packages/shared/src/types.ts` — TypeScript interface yang mencerminkan `schemas.py` backend.

**File:** `packages/shared/src/utils.ts` — utility bersama:

```ts
export function formatRupiah(value: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency", currency: "IDR", minimumFractionDigits: 0,
    }).format(value);
}
```

Dipakai oleh `PackageCard.tsx` dan `DatasetView.tsx`.

---

## Ringkasan Alur End-to-End

```
User isi form (anggaran, durasi, param GA)
    │
    ▼
FormSection.handleSubmit()
    │  OptimizeRequest
    ▼
App.handleOptimize()  →  fetch POST /api/optimize
    │
    ▼
api/index.py  →  app/routers/optimize.py
    │
    ▼
jalankan_ga()
    ├─ inisialisasi_populasi()  → repair()
    └─ for gen in range(max_generasi):
           ├─ evaluasi_populasi()      → hitung_fitness() × N
           ├─ catat riwayat_fitness
           ├─ elitisme (simpan terbaik)
           └─ while populasi belum penuh:
                  seleksi → crossover → mutasi → repair → tambah ke populasi_baru
    │
    │  OptimizeResult (JSON)
    ▼
App  →  setResult()  →  setAppState("done")
    │
    ▼
LandingView scroll ke ResultSection
    │
    ▼
ResultsView  +  ConvergenceChart
```
