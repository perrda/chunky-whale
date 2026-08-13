export type SizeRegion = "us" | "uk" | "eu" | "asia";

export const SIZE_REGIONS: { id: SizeRegion; label: string }[] = [
  { id: "us", label: "US (in)" },
  { id: "uk", label: "UK" },
  { id: "eu", label: "EU (cm)" },
  { id: "asia", label: "Asia" },
];

type Row = { size: string; chest: string; length: string; us: string; uk: string; asia: string };

const TEES: Row[] = [
  { size: "XS", chest: "86–91", length: "68", us: "34–36 in", uk: "UK 34–36", asia: "JP S / CN 165" },
  { size: "S", chest: "96–101", length: "70", us: "38–40 in", uk: "UK 38–40", asia: "JP M / CN 170" },
  { size: "M", chest: "101–106", length: "72", us: "40–42 in", uk: "UK 40–42", asia: "JP L / CN 175" },
  { size: "L", chest: "106–111", length: "74", us: "42–44 in", uk: "UK 42–44", asia: "JP XL / CN 180" },
  { size: "XL", chest: "111–116", length: "76", us: "44–46 in", uk: "UK 44–46", asia: "JP 2L / CN 185" },
  { size: "2XL", chest: "116–121", length: "78", us: "46–48 in", uk: "UK 46–48", asia: "JP 3L / CN 190" },
  { size: "3XL", chest: "121–127", length: "80", us: "48–50 in", uk: "UK 48–50", asia: "JP 4L" },
  { size: "4XL", chest: "127–132", length: "82", us: "50–52 in", uk: "UK 50–52", asia: "JP 5L" },
];

const HOODIES: Row[] = [
  { size: "XS", chest: "102–108", length: "66", us: "40–42 in", uk: "UK 36", asia: "JP M" },
  { size: "S", chest: "108–114", length: "68", us: "42–44 in", uk: "UK 38", asia: "JP L" },
  { size: "M", chest: "114–120", length: "70", us: "44–46 in", uk: "UK 40", asia: "JP XL" },
  { size: "L", chest: "120–126", length: "72", us: "46–48 in", uk: "UK 42", asia: "JP 2L" },
  { size: "XL", chest: "126–132", length: "74", us: "48–50 in", uk: "UK 44", asia: "JP 3L" },
  { size: "2XL", chest: "132–138", length: "76", us: "50–52 in", uk: "UK 46", asia: "JP 4L" },
  { size: "3XL", chest: "138–144", length: "78", us: "52–54 in", uk: "UK 48", asia: "JP 5L" },
  { size: "4XL", chest: "144–150", length: "80", us: "54–56 in", uk: "UK 50", asia: "JP 6L" },
];

export const REGION_CHARTS = {
  tees: TEES,
  hoodies: HOODIES,
};

export function chestFor(row: Row, region: SizeRegion) {
  if (region === "us") return row.us;
  if (region === "uk") return row.uk;
  if (region === "asia") return row.asia;
  return `${row.chest} cm`;
}
