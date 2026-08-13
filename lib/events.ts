export type EventStatus = "skip" | "optional" | "primary" | "flagship" | "clash";

export type BitcoinEvent = {
  id: string;
  name: string;
  city: string;
  region: string;
  start: string;
  end: string;
  venue?: string;
  status: EventStatus;
  note: string;
};

export const MENA_START = "2026-12-07T08:00:00+04:00";
export const MENA_END = "2026-12-08T18:00:00+04:00";

export const events: BitcoinEvent[] = [
  {
    id: "asia-2026",
    name: "Bitcoin Asia",
    city: "Hong Kong",
    region: "Asia",
    start: "2026-08-27",
    end: "2026-08-28",
    venue: "Hong Kong Convention Centre",
    status: "skip",
    note: "Too close for a booth. Attend personally only if already planned. No store launch.",
  },
  {
    id: "berlin-2026",
    name: "bitcoin++ Berlin (payments)",
    city: "Berlin",
    region: "Europe",
    start: "2026-10-01",
    end: "2026-10-03",
    status: "optional",
    note: "Capsule-drop or walk the floor. Not the first booth.",
  },
  {
    id: "tabconf-2026",
    name: "TABConf 8",
    city: "Atlanta",
    region: "US",
    start: "2026-10-12",
    end: "2026-10-15",
    status: "optional",
    note: "Technical crowd. Good for Lightning POS testing, not first booth.",
  },
  {
    id: "lugano-2026",
    name: "Plan ₿ Forum Lugano",
    city: "Lugano",
    region: "Europe",
    start: "2026-10-23",
    end: "2026-10-24",
    status: "optional",
    note: "Payments and city adoption. Samples only.",
  },
  {
    id: "amsterdam-2026",
    name: "Bitcoin Amsterdam",
    city: "Amsterdam",
    region: "Europe",
    start: "2026-11-05",
    end: "2026-11-06",
    venue: "Sugar Factory",
    status: "optional",
    note: "Dress rehearsal: walk the floor with samples. No full booth required.",
  },
  {
    id: "seoul-2026",
    name: "bitcoin++ Seoul (privacy)",
    city: "Seoul",
    region: "Asia",
    start: "2026-11-05",
    end: "2026-11-06",
    status: "clash",
    note: "Same dates as Amsterdam. Pick one. Default: Amsterdam dress rehearsal.",
  },
  {
    id: "africa-2026",
    name: "Africa Bitcoin Conference",
    city: "Blantyre",
    region: "Africa",
    start: "2026-12-02",
    end: "2026-12-05",
    status: "clash",
    note: "Clashes with MENA prep and travel. Skip.",
  },
  {
    id: "mena-2026",
    name: "Bitcoin MENA",
    city: "Abu Dhabi",
    region: "MENA",
    start: "2026-12-07",
    end: "2026-12-08",
    venue: "ADNEC",
    status: "primary",
    note: "First live STACKHOUSE booth. Card + Lightning on the table. MENA capsule drop.",
  },
  {
    id: "planb-sv-2027",
    name: "Plan ₿ Forum El Salvador",
    city: "San Salvador",
    region: "LatAm",
    start: "2027-01-29",
    end: "2027-01-30",
    status: "optional",
    note: "Optional if MENA went well and travel budget allows.",
  },
  {
    id: "prague-2027",
    name: "BTC Prague",
    city: "Prague",
    region: "Europe",
    start: "2027-05-06",
    end: "2027-05-08",
    status: "flagship",
    note: "Europe flagship booth. Book exhibitor early.",
  },
  {
    id: "nashville-2027",
    name: "Bitcoin 2027",
    city: "Nashville",
    region: "US",
    start: "2027-07-15",
    end: "2027-07-17",
    venue: "Music City Center",
    status: "flagship",
    note: "US flagship. ~30k people. Book exhibitor as soon as sales open.",
  },
];

export const menaMilestones = [
  {
    when: "13 Aug – 15 Sep 2026",
    title: "Forge the house",
    body: "Brand, site, eight SKUs, payments in test mode. Order your own samples to wear.",
  },
  {
    when: "16 Sep – 15 Oct 2026",
    title: "Go live online",
    body: "Store live. MENA capsule art locked. Apply for exhibitor pass. Wear samples in Bangkok.",
  },
  {
    when: "16 Oct – 15 Nov 2026",
    title: "Print the booth run",
    body: "Bulk tees, hats, stickers, totes. Lightning POS kit. QR cards. Amsterdam dress rehearsal 5–6 Nov if you want it.",
  },
  {
    when: "16 Nov – 6 Dec 2026",
    title: "Ship to Abu Dhabi",
    body: "Freight or hotel delivery. Booth script. Online restock. Confirm UAE import paperwork with your freight contact.",
  },
  {
    when: "7–8 Dec 2026",
    title: "Bitcoin MENA",
    body: "Sell on the floor. Scan-to-site for sizes you do not hold. Card and Lightning on the table.",
  },
];
