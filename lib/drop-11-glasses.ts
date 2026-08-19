import type { Product } from "./products";

const WHISKEY = ["Rocks / whiskey glass", "Printed on demand", "Hand wash recommended"];
const SHOT = ["Shot glass", "Printed on demand", "Hand wash recommended"];

type Mark = {
  id: string;
  name: string;
  short: string;
  desc: string;
  tag?: string;
  featured?: boolean;
  trending?: boolean;
};

function whiskey(m: Mark): Product {
  return {
    slug: `${m.id}-whiskey`,
    name: `${m.name} Whiskey Glass`,
    shortName: `${m.short} Whiskey`,
    editionId: `SH-D11-${m.id.toUpperCase().replace(/-/g, "").slice(0, 6)}-W`,
    priceGbp: 20,
    category: "drinkware",
    tag: m.tag ?? "Meme",
    kind: "whiskey",
    featured: m.featured,
    trending: m.trending,
    description: m.desc,
    details: WHISKEY,
    image: `/products/${m.id}-whiskey.png`,
  };
}

function shot(m: Mark): Product {
  return {
    slug: `${m.id}-shot`,
    name: `${m.name} Shot Glass`,
    shortName: `${m.short} Shot`,
    editionId: `SH-D11-${m.id.toUpperCase().replace(/-/g, "").slice(0, 6)}-S`,
    priceGbp: 12,
    category: "drinkware",
    tag: m.tag ?? "Meme",
    kind: "shot",
    featured: m.featured,
    trending: m.trending,
    description: m.desc,
    details: SHOT,
    image: `/products/${m.id}-shot.png`,
  };
}

const WHISKEY_MARKS: Mark[] = [
  { id: "hodl", name: "I AM HODLING", short: "HODL", desc: "The typo, on rocks. After the conference.", tag: "Meme", featured: true },
  { id: "stack-sats", name: "STACK SATS", short: "Stack", desc: "Daily habit. Evening glass. Orange ₿.", tag: "Meme", trending: true },
  { id: "hard-money", name: "HARD MONEY", short: "Hard Money", desc: "Soft pour. Hard cap.", tag: "Copy" },
  { id: "21m", name: "21 MILLION", short: "21M", desc: "The cap, in crystal weight.", tag: "Meme" },
  { id: "few-understand", name: "FEW UNDERSTAND", short: "Few", desc: "And they still pour two fingers.", tag: "Meme" },
  { id: "one-btc", name: "1 BTC = 1 BTC", short: "1 BTC", desc: "The only exchange rate that matters.", tag: "Copy" },
  { id: "verify", name: "DON'T TRUST. VERIFY.", short: "Verify", desc: "Then sit down.", tag: "Meme" },
  { id: "satoshi", name: "SATOSHI WAS HERE", short: "Satoshi", desc: "He left. The glass stayed.", tag: "Copy" },
  { id: "not-your-keys", name: "NOT YOUR KEYS", short: "Keys", desc: "Not your coins. Your pour.", tag: "Meme" },
  { id: "sound-money", name: "SOUND MONEY", short: "Sound Money", desc: "Quiet glass. Loud rule.", tag: "Copy" },
  { id: "cold-storage", name: "COLD STORAGE", short: "Cold Storage", desc: "Keys offline. Ice optional.", tag: "Meme" },
  { id: "proof-of-work", name: "PROOF OF WORK", short: "PoW", desc: "Energy in. Nightcap out.", tag: "Meme" },
  { id: "dip-feature", name: "THE DIP IS THE FEATURE", short: "Dip", desc: "A chart joke you can drink.", tag: "Chart" },
  { id: "low-time", name: "LOW TIME PREFERENCE", short: "Low Time", desc: "Sip it. Don’t chase it.", tag: "Copy" },
  { id: "stay-solvent", name: "STAY SOLVENT", short: "Solvent", desc: "The other stack.", tag: "Meme" },
  { id: "peer-to-peer", name: "PEER TO PEER", short: "P2P", desc: "Electronic cash. Analog glass.", tag: "Copy" },
  { id: "genesis", name: "GENESIS 03 JAN 2009", short: "Genesis", desc: "The first block. The last pour.", tag: "Copy" },
  { id: "infinite-fiat", name: "INFINITE FIAT", short: "Infinite Fiat", desc: "Finite Bitcoin. Finite night.", tag: "Meme" },
  { id: "run-node", name: "RUN YOUR NODE", short: "Node", desc: "Verify at home. Pour at home.", tag: "Meme" },
  { id: "orange-pill", name: "ORANGE PILL", short: "Orange Pill", desc: "Not a prescription. Just the colour.", tag: "Meme" },
];

const SHOT_MARKS: Mark[] = [
  { id: "hodl", name: "HODL", short: "HODL", desc: "One ounce. Same typo.", tag: "Meme", featured: true },
  { id: "stack-sats", name: "STACK SATS", short: "Stack", desc: "Small glass. Daily habit.", tag: "Meme" },
  { id: "one-sat", name: "ONE SAT", short: "One Sat", desc: "The smallest unit. The shortest pour.", tag: "Meme", trending: true },
  { id: "verify", name: "VERIFY", short: "Verify", desc: "Don’t trust. Then shoot.", tag: "Meme" },
  { id: "21m", name: "21M", short: "21M", desc: "The cap, in a cap.", tag: "Meme" },
  { id: "hard-cap", name: "HARD CAP", short: "Hard Cap", desc: "21 million. One shot.", tag: "Copy" },
  { id: "no-second", name: "NO SECOND BEST", short: "No Second", desc: "There isn’t one. Orange ₿.", tag: "Copy" },
  { id: "keys", name: "KEYS", short: "Keys", desc: "Not your keys. Not this glass either.", tag: "Meme" },
  { id: "node", name: "NODE", short: "Node", desc: "Run it. Then this.", tag: "Meme" },
  { id: "utxo", name: "UTXO", short: "UTXO", desc: "Unspent. Until now.", tag: "Meme" },
  { id: "mempool", name: "MEMPOOL", short: "Mempool", desc: "Waiting. Then confirmed.", tag: "Meme" },
  { id: "one-more-block", name: "ONE MORE BLOCK", short: "One More", desc: "Ten minutes. One more.", tag: "Meme" },
  { id: "orange", name: "ORANGE", short: "Orange", desc: "The colour. The joke.", tag: "₿" },
  { id: "finite", name: "FINITE", short: "Finite", desc: "Unlike the other stuff.", tag: "Copy" },
  { id: "self-custody", name: "SELF CUSTODY", short: "Self Custody", desc: "Nobody else holds this one.", tag: "Meme" },
  { id: "stay-humble", name: "STAY HUMBLE", short: "Humble", desc: "Then stack. Then sit down.", tag: "Meme" },
  { id: "number-go-up", name: "NUMBER GO UP", short: "NGU", desc: "A meme. Not a forecast. Not advice.", tag: "Meme" },
  { id: "cant-print", name: "CAN'T PRINT THIS", short: "Can't Print", desc: "They can print theirs. Not this.", tag: "Meme" },
  { id: "bitcoin-fixes", name: "BITCOIN FIXES THIS", short: "Fixes This", desc: "It doesn’t fix the hangover.", tag: "Meme" },
  { id: "the-joke", name: "THAT'S THE JOKE", short: "The Joke", desc: "21 million. That’s the joke.", tag: "Meme" },
];

export const drop11Glasses: Product[] = [...WHISKEY_MARKS.map(whiskey), ...SHOT_MARKS.map(shot)];
