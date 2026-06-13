import type { OptimizeResult } from "@wisata-gen/shared";
import PackageCard       from "./PackageCard";
import ConvergenceChart  from "./ConvergenceChart";

type Props = {
  result: OptimizeResult;
};

export default function ResultsView({ result }: Props) {
  const { paket_terpilih, fitness_terbaik, total_harga, total_durasi, total_destinasi, rata_rata_rating, generasi_konvergen, riwayat_fitness } = result;

  const totalFmt = new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", minimumFractionDigits: 0,
  }).format(total_harga * 1000);

  return (
    <div className="w-full px-6 py-10 bg-surface">
      <div className="max-w-lg mx-auto w-full">

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-muted">Hasil Optimasi</p>
          <h1 className="font-display text-3xl font-bold text-dark">{paket_terpilih.length} Paket Terpilih</h1>
          <p className="text-sm mt-1 text-secondary">
            Konvergen di generasi {generasi_konvergen} dari {riwayat_fitness.length}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: "Total Anggaran",   value: totalFmt },
            { label: "Total Durasi",     value: `${total_durasi} hari` },
            { label: "Total Destinasi",  value: `${total_destinasi} tempat` },
            { label: "Rata-rata Rating", value: `${rata_rata_rating} / 5.0` },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl p-4 bg-white border border-dim">
              <p className="text-xs font-medium text-muted">{label}</p>
              <p className="font-bold text-base mt-1 leading-tight text-dark">{value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-5 flex items-center justify-between mb-5 bg-dark text-surface">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted">Nilai Fitness</p>
            <p className="text-xs mt-1 opacity-60">Skor akhir kombinasi optimal</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold tabular-nums">{fitness_terbaik.toFixed(4)}</p>
            <p className="text-xs mt-0.5 text-secondary">maks ~1.10</p>
          </div>
        </div>

        <div className="rounded-2xl p-5 mb-5 bg-white border border-dim">
          <p className="text-xs font-semibold uppercase tracking-wider mb-4 text-muted">Grafik Konvergensi</p>
          <ConvergenceChart
            terbaik={riwayat_fitness}
            rata={result.riwayat_rata}
            terburuk={result.riwayat_terburuk}
          />
        </div>

        <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-muted">Paket Terpilih</p>
        <div className="space-y-3 pb-10">
          {paket_terpilih.map((paket, i) => (
            <PackageCard key={paket.nama} paket={paket} rank={i + 1} />
          ))}
        </div>

      </div>
    </div>
  );
}
