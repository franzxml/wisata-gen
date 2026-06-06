DATASET: list[dict] = [
    {"nama": "Paket Bali Hemat",           "harga": 2500, "rating": 4.2, "durasi": 3, "destinasi": 4},
    {"nama": "Paket Lombok Premium",       "harga": 4500, "rating": 4.8, "durasi": 5, "destinasi": 6},
    {"nama": "Paket Yogyakarta Klasik",    "harga": 1800, "rating": 4.0, "durasi": 3, "destinasi": 5},
    {"nama": "Paket Raja Ampat Eksklusif", "harga": 8000, "rating": 4.9, "durasi": 7, "destinasi": 8},
    {"nama": "Paket Bromo Adventure",      "harga": 1500, "rating": 4.3, "durasi": 2, "destinasi": 3},
    {"nama": "Paket Labuan Bajo",          "harga": 6000, "rating": 4.7, "durasi": 5, "destinasi": 6},
    {"nama": "Paket Danau Toba",           "harga": 2000, "rating": 4.1, "durasi": 3, "destinasi": 4},
    {"nama": "Paket Wakatobi Diving",      "harga": 7500, "rating": 4.8, "durasi": 6, "destinasi": 5},
    {"nama": "Paket Bandung Weekend",      "harga": 1200, "rating": 3.8, "durasi": 2, "destinasi": 3},
    {"nama": "Paket Manado Bunaken",       "harga": 3500, "rating": 4.5, "durasi": 4, "destinasi": 5},
    {"nama": "Paket Flores Overland",      "harga": 5500, "rating": 4.6, "durasi": 6, "destinasi": 7},
    {"nama": "Paket Bali Honeymoon",       "harga": 5000, "rating": 4.7, "durasi": 5, "destinasi": 5},
    {"nama": "Paket Papua Ekspedisi",      "harga": 9000, "rating": 4.9, "durasi": 8, "destinasi": 9},
    {"nama": "Paket Kepulauan Seribu",     "harga":  800, "rating": 3.5, "durasi": 2, "destinasi": 3},
    {"nama": "Paket Toraja Heritage",      "harga": 3000, "rating": 4.4, "durasi": 4, "destinasi": 5},
    {"nama": "Paket Belitung Santai",      "harga": 2200, "rating": 4.2, "durasi": 3, "destinasi": 4},
    {"nama": "Paket Komodo Tour",          "harga": 4800, "rating": 4.6, "durasi": 4, "destinasi": 4},
    {"nama": "Paket Maluku Ambon",         "harga": 3800, "rating": 4.3, "durasi": 4, "destinasi": 5},
    {"nama": "Paket Derawan Kalimantan",   "harga": 4200, "rating": 4.5, "durasi": 5, "destinasi": 6},
    {"nama": "Paket Sabang Aceh",          "harga": 3200, "rating": 4.4, "durasi": 4, "destinasi": 5},
]

JUMLAH_PAKET   = len(DATASET)
HARGA_MAKS     = max(p["harga"]     for p in DATASET)   # 9000
MAX_DESTINASI  = max(p["destinasi"] for p in DATASET)   # 9
RATA_RATING    = sum(p["rating"]    for p in DATASET) / JUMLAH_PAKET  # ~4.41
RATA_DESTINASI = sum(p["destinasi"] for p in DATASET) / JUMLAH_PAKET # ~5.1
