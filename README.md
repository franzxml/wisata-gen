## Fitur

* Optimasi kombinasi paket wisata dari 20 destinasi Indonesia menggunakan Algoritma Genetika
* Representasi kromosom binary (20-bit) — setiap bit merepresentasikan apakah paket ke-i dipilih
* Fungsi fitness multi-kriteria: rata-rata rating, total destinasi, efisiensi harga, dan pemanfaatan durasi
* Repair operator untuk menjaga feasibility constraint anggaran dan durasi sepanjang evolusi
* Seleksi tournament dan roulette wheel
* One-point crossover pada bit array — gen benar-benar ditukar antar kromosom
* Bit-flip mutation dengan probabilitas per-bit
* Elitisme 1 individu terbaik per generasi
* Grafik konvergensi fitness terbaik, rata-rata, dan terburuk per generasi (custom SVG)
* Konfigurasi parameter GA secara manual (ukuran populasi, probabilitas crossover, probabilitas mutasi, jumlah generasi, metode seleksi)
* Antarmuka web responsif berbasis React dengan scroll-snap

## Teknologi

* Python 3.8+
* FastAPI + Uvicorn
* Pydantic v2
* Bun
* React 19
* Vite
* TypeScript
* Tailwind CSS 4

## Struktur Folder

```
wisata-gen/
├── apps/
│   ├── backend/
│   │   └── app/
│   │       ├── ga/
│   │       │   ├── dataset.py      # 20 paket wisata Indonesia dan konstanta fitness
│   │       │   └── engine.py       # Logika GA: inisialisasi, seleksi, crossover, mutasi, repair
│   │       ├── routers/
│   │       │   └── optimize.py     # POST /api/optimize
│   │       ├── schemas.py          # Pydantic models request dan response
│   │       └── main.py             # FastAPI app
│   └── frontend/
│       └── src/
│           ├── components/         # HeroSection, FormSection, ResultSection, ResultsView, PackageCard, ConvergenceChart, DatasetView
│           └── App.tsx
├── packages/
│   └── shared/                     # Types dan utils bersama (TypeScript)
├── package.json                    # Bun workspaces root
└── .gitignore
```

## Cara Menjalankan Lokal

1. Pastikan komputer sudah memiliki **Python 3.8+**, **Bun**, dan **Git**.

2. Clone repositori.

   ```bash
   git clone git@github.com:franzxml/wisata-gen.git
   cd wisata-gen
   ```

   Jika menggunakan HTTPS:

   ```bash
   git clone https://github.com/franzxml/wisata-gen.git
   cd wisata-gen
   ```

3. Setup virtual environment backend.

   ```bash
   python3 -m venv apps/backend/.venv
   source apps/backend/.venv/bin/activate
   pip install -r apps/backend/requirements.txt
   ```

4. Install dependensi frontend.

   ```bash
   bun install
   ```

5. Build shared package.

   ```bash
   bun build:shared
   ```

6. Jalankan seluruh aplikasi dalam satu perintah.

   ```bash
   bun dev
   ```

7. Buka browser.

   ```
   http://localhost:5173
   ```

   API berjalan di:

   ```
   http://localhost:8000
   ```

## Script

| Script | Deskripsi |
|--------|-----------|
| `bun dev` | Jalankan backend dan frontend secara paralel |
| `bun dev:be` | Jalankan hanya backend FastAPI |
| `bun dev:fe` | Jalankan hanya frontend Vite |
| `bun build` | Build shared package dan frontend untuk produksi |
| `bun typecheck` | Type check seluruh workspace |

## API Endpoint

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/optimize` | Jalankan GA, kembalikan hasil optimasi lengkap |
| GET | `/api/health` | Cek status API |

## Parameter GA

| Parameter | Nilai Default |
|-----------|---------------|
| Ukuran Populasi | 50 |
| Jumlah Generasi Maksimum | 100 |
| Probabilitas Crossover | 0.8 |
| Probabilitas Mutasi per-bit | 0.05 |
| Metode Seleksi | Tournament (size=3) |
| Metode Crossover | One-Point |
| Metode Mutasi | Bit-flip |
| Elitisme | 1 individu terbaik |

## Constraints

| Parameter | Batas |
|-----------|-------|
| Anggaran | Configurable — default Rp 8.000.000 |
| Durasi | Configurable — default 7 hari |

Kromosom yang melanggar constraint diperbaiki oleh *repair operator* setelah crossover dan mutasi.

## Fungsi Fitness

Skor fitness dinormalisasi 0–1 dengan bobot per kriteria:

| Kriteria | Bobot |
|----------|-------|
| Rata-rata rating paket terpilih | 0.35 |
| Total destinasi (cap 20) | 0.25 |
| Efisiensi harga (lebih murah = lebih tinggi) | 0.25 |
| Pemanfaatan durasi (mendekati batas = tinggi) | 0.15 |
| Bonus soft constraint (maks +0.10) | — |

Nilai fitness maksimum ~1.10.

## Domain

* **Production:** https://wisata-gen.vercel.app

---

Dikembangkan oleh **@franzxml**