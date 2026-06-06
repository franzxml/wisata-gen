from fastapi import APIRouter, HTTPException
from app.schemas import OptimizeRequest, OptimizeResult, PaketResult, ApiResponse
from app.ga import jalankan_ga

router = APIRouter()


@router.post("", response_model=ApiResponse[OptimizeResult])
def optimize(req: OptimizeRequest):
    """
    Jalankan Algoritma Genetika untuk mencari kombinasi paket wisata terbaik.
    Kromosom = binary array (binary encoding) — crossover benar-benar menukar gen.
    """
    result = jalankan_ga(
        anggaran_maks   = req.anggaran_maks,
        durasi_maks     = req.durasi_maks,
        ukuran_populasi = req.ukuran_populasi,
        max_generasi    = req.max_generasi,
        pc              = req.pc,
        pm              = req.pm,
        metode          = req.metode_seleksi,
    )

    if not result["paket_terpilih"]:
        raise HTTPException(
            status_code=422,
            detail="GA tidak menemukan paket valid. Coba naikkan anggaran atau durasi.",
        )

    paket_list = [PaketResult(**p) for p in result["paket_terpilih"]]

    return ApiResponse(
        data=OptimizeResult(
            paket_terpilih     = paket_list,
            fitness_terbaik    = result["fitness_terbaik"],
            riwayat_fitness    = result["riwayat_fitness"],
            riwayat_rata       = result["riwayat_rata"],
            riwayat_terburuk   = result["riwayat_terburuk"],
            total_harga        = result["total_harga"],
            total_durasi       = result["total_durasi"],
            total_destinasi    = result["total_destinasi"],
            rata_rata_rating   = result["rata_rata_rating"],
            generasi_konvergen = result["generasi_konvergen"],
        ),
        message="optimized",
    )
