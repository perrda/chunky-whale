export type Partner = {
  name: string;
  role: string;
  regions: string;
  useFor: string;
  url: string;
  status: "primary" | "backup" | "specialist";
};

export const partners: Partner[] = [
  {
    name: "Printful",
    role: "Primary apparel dropshipper",
    regions: "UK (Birmingham), US (Charlotte, Dallas), EU (Riga, Barcelona), Canada, Mexico, plus partners in Japan and Australia",
    useFor: "Tees, hoodies, hats, embroidery, branded packing. Best colour control. Connect the API we already wired.",
    url: "https://www.printful.com",
    status: "primary",
  },
  {
    name: "Gelato",
    role: "Local print network (scale)",
    regions: "130+ hubs across 32 countries — strong UK, EU, US, Japan, Australia",
    useFor: "Posters, mugs, faster local shipping when a buyer is far from a Printful factory. Add when order volume leaves the US/EU core.",
    url: "https://www.gelato.com",
    status: "backup",
  },
  {
    name: "Printify",
    role: "Marketplace of printers",
    regions: "US, UK, EU, Australia, selected Asia providers",
    useFor: "Price experiments and overflow SKUs. You pick the printer per product — quality varies, so sample first.",
    url: "https://www.printify.com",
    status: "backup",
  },
  {
    name: "Gooten",
    role: "US/EU catalog breadth",
    regions: "United States and Europe",
    useFor: "Home SKUs Printful is weak on. Sample candles and throws before you list them live.",
    url: "https://www.gooten.com",
    status: "specialist",
  },
  {
    name: "SPOD (Spreadshirt)",
    role: "EU speed specialist",
    regions: "Germany / EU, ships UK and US",
    useFor: "24-hour EU reprint when a conference restock cannot wait.",
    url: "https://www.spod.com",
    status: "specialist",
  },
];

export const regionPlan = [
  {
    region: "United Kingdom",
    printer: "Printful Birmingham for UK addresses. Gelato as backup.",
    note: "UK hub only fulfils UK deliveries. EU buyers should not route through Birmingham.",
  },
  {
    region: "United States",
    printer: "Printful Charlotte and Dallas.",
    note: "Fastest path for US conference stock and online orders.",
  },
  {
    region: "Europe",
    printer: "Printful Riga + Barcelona. Gelato for countries far from those two.",
    note: "Amsterdam and Prague booth restocks: print in EU, do not ship from the US.",
  },
  {
    region: "Asia / MENA / Australia",
    printer: "Printful Japan and Australia partners. Gelato Japan. MENA booth stock: bulk Printful EU/US then freight to hotel.",
    note: "There is no Printful factory in the UAE. Abu Dhabi is a freight job, not a click-to-ship job.",
  },
];
