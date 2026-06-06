import type { PaketResult } from "@wisata-gen/shared";
import { formatRupiah } from "@wisata-gen/shared";

interface Props {
  paket: PaketResult;
  rank:  number;
}

export default function PackageCard({ paket, rank }: Props) {
  const harga = formatRupiah(paket.harga * 1000);

  const ratingPct = ((paket.rating - 3) / 2) * 100;

  return (
    <div className="rounded-xl p-5 flex gap-5" style={{ background: "#ffffff", border: "1px solid #c9c9bf" }}>
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mt-0.5"
        style={{ background: "#e8e7e1", color: "#6b6b63" }}>
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold leading-tight" style={{ color: "#1c1c14" }}>{paket.nama}</h3>
            <p className="font-bold text-sm mt-0.5" style={{ color: "#3d3d22" }}>{harga}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-lg font-bold leading-none" style={{ color: "#1c1c14" }}>{paket.rating}</p>
            <p className="text-xs" style={{ color: "#9b9b94" }}>/ 5.0</p>
          </div>
        </div>
        <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: "#e8e7e1" }}>
          <div className="h-full rounded-full" style={{ width: `${ratingPct}%`, background: "#3d3d22" }} />
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
    <span className="text-xs rounded-md px-2 py-0.5" style={{ background: "#e8e7e1", color: "#6b6b63", border: "1px solid #c9c9bf" }}>
      {label}
    </span>
  );
}
