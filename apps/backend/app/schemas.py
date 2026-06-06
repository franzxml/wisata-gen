from pydantic import BaseModel, Field
from typing import Generic, TypeVar

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    data: T
    message: str
    success: bool = True


# ─── GA Optimize ─────────────────────────────────────────────────────────────

class OptimizeRequest(BaseModel):
    anggaran_maks:    int   = Field(..., gt=0, description="Budget maks dalam ribuan rupiah")
    durasi_maks:      int   = Field(..., gt=0, le=60, description="Durasi maks dalam hari")
    ukuran_populasi:  int   = Field(50,   ge=10, le=500)
    max_generasi:     int   = Field(100,  ge=10, le=1000)
    pc:               float = Field(0.8,  ge=0.0, le=1.0, description="Probabilitas crossover")
    pm:               float = Field(0.05, ge=0.0, le=1.0, description="Probabilitas mutasi per-bit")
    metode_seleksi:   str   = Field("tournament", pattern="^(tournament|roulette)$")


class PaketResult(BaseModel):
    nama:      str
    harga:     int
    rating:    float
    durasi:    int
    destinasi: int


class OptimizeResult(BaseModel):
    paket_terpilih:      list[PaketResult]
    fitness_terbaik:     float
    riwayat_fitness:     list[float]
    riwayat_rata:        list[float]
    riwayat_terburuk:    list[float]
    total_harga:         int
    total_durasi:        int
    total_destinasi:     int
    rata_rata_rating:    float
    generasi_konvergen:  int
