import { formatRupiah } from "@wisata-gen/shared";

const DATASET = [
  { no: 1,  nama: "Bali Hemat",           harga: 2500000,  rating: 4.2, durasi: 3, destinasi: 4 },
  { no: 2,  nama: "Lombok Premium",       harga: 4500000,  rating: 4.8, durasi: 5, destinasi: 6 },
  { no: 3,  nama: "Yogyakarta Klasik",    harga: 1800000,  rating: 4.0, durasi: 3, destinasi: 5 },
  { no: 4,  nama: "Raja Ampat Eksklusif", harga: 8000000,  rating: 4.9, durasi: 7, destinasi: 8 },
  { no: 5,  nama: "Bromo Adventure",      harga: 1500000,  rating: 4.3, durasi: 2, destinasi: 3 },
  { no: 6,  nama: "Labuan Bajo",          harga: 6000000,  rating: 4.7, durasi: 5, destinasi: 6 },
  { no: 7,  nama: "Danau Toba",           harga: 2000000,  rating: 4.1, durasi: 3, destinasi: 4 },
  { no: 8,  nama: "Wakatobi Diving",      harga: 7500000,  rating: 4.8, durasi: 6, destinasi: 5 },
  { no: 9,  nama: "Bandung Weekend",      harga: 1200000,  rating: 3.8, durasi: 2, destinasi: 3 },
  { no: 10, nama: "Manado Bunaken",       harga: 3500000,  rating: 4.5, durasi: 4, destinasi: 5 },
  { no: 11, nama: "Flores Overland",      harga: 5500000,  rating: 4.6, durasi: 6, destinasi: 7 },
  { no: 12, nama: "Bali Honeymoon",       harga: 5000000,  rating: 4.7, durasi: 5, destinasi: 5 },
  { no: 13, nama: "Papua Ekspedisi",      harga: 9000000,  rating: 4.9, durasi: 8, destinasi: 9 },
  { no: 14, nama: "Kepulauan Seribu",     harga: 800000,   rating: 3.5, durasi: 2, destinasi: 3 },
  { no: 15, nama: "Toraja Heritage",      harga: 3000000,  rating: 4.4, durasi: 4, destinasi: 5 },
  { no: 16, nama: "Belitung Santai",      harga: 2200000,  rating: 4.2, durasi: 3, destinasi: 4 },
  { no: 17, nama: "Komodo Tour",          harga: 4800000,  rating: 4.6, durasi: 4, destinasi: 4 },
  { no: 18, nama: "Maluku Ambon",         harga: 3800000,  rating: 4.3, durasi: 4, destinasi: 5 },
  { no: 19, nama: "Derawan Kalimantan",   harga: 4200000,  rating: 4.5, durasi: 5, destinasi: 6 },
  { no: 20, nama: "Sabang Aceh",          harga: 3200000,  rating: 4.4, durasi: 4, destinasi: 5 },
];

const tdClass = "px-[10px] py-2 text-[11px] text-dark border-b border-surface";

export default function DatasetView() {
  return (
    <table className="w-full border-collapse table-fixed">
      <colgroup>
        <col style={{ width: "32px" }} />
        <col />
        <col style={{ width: "110px" }} />
        <col style={{ width: "52px" }} />
        <col style={{ width: "48px" }} />
        <col style={{ width: "40px" }} />
      </colgroup>
      <thead>
        <tr className="bg-surface-alt">
          {["#", "Nama", "Harga", "Rating", "Hari", "Dest"].map(h => (
            <th key={h} className="px-[10px] py-2 text-left text-[10px] font-semibold uppercase tracking-[0.07em] text-muted border-b border-subtle">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {DATASET.map((p, i) => (
          <tr key={p.no} className={i % 2 === 0 ? "bg-white" : "bg-surface-alt"}>
            <td className={tdClass}><span className="text-muted">{p.no}</span></td>
            <td className={`${tdClass} overflow-hidden text-ellipsis whitespace-nowrap`} title={"Paket " + p.nama}>
              {p.nama}
            </td>
            <td className={tdClass}>{formatRupiah(p.harga)}</td>
            <td className={`${tdClass} font-semibold ${p.rating >= 4.5 ? "text-accent" : "text-dark"}`}>
              {p.rating.toFixed(1)}
            </td>
            <td className={tdClass}>{p.durasi}</td>
            <td className={tdClass}>{p.destinasi}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
