import type { PaketResult } from "@wisata-gen/shared";
import { formatRupiah } from "@wisata-gen/shared";

type Props = {
  paket: PaketResult;
  rank:  number;
};

export default function PackageCard({ paket, rank }: Props) {
  const harga    = formatRupiah(paket.harga * 1000);
  const ratingPct = ((paket.rating - 3) / 2) * 100;

  return (
    <div className="rounded-xl p-5 flex gap-5 bg-white border border-dim">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mt-0.5 bg-subtle text-secondary">
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold leading-tight text-dark">{paket.nama}</h3>
            <p className="font-bold text-sm mt-0.5 text-accent">{harga}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-lg font-bold leading-none text-dark">{paket.rating}</p>
            <p className="text-xs text-muted">/ 5.0</p>
          </div>
        </div>
        <div className="mt-3 h-1 rounded-full overflow-hidden bg-subtle">
          <div className="h-full rounded-full bg-accent" style={{ width: `${ratingPct}%` }} />
        </div>
        <div className="flex gap-2 mt-3">
          <Tag label={`${paket.durasi} hari`} />
          <Tag label={`${paket.destinasi} destinasi`} />
        </div>
      </div>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="text-xs rounded-md px-2 py-0.5 bg-subtle text-secondary border border-dim">
      {label}
    </span>
  );
}
