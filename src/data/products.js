const R2 = "https://pub-dacf0b528a6844669cc37ccbc42ff66b.r2.dev";

export const legal = {
  refund:
    "https://06da974e-db09-463f-87b2-ae6b5ee2db40.filesusr.com/ugd/4650d5_6a56601f94844356b15e707a4de7de8b.pdf",
  fulfillment:
    "https://06da974e-db09-463f-87b2-ae6b5ee2db40.filesusr.com/ugd/4650d5_9afd1e9b32b04fcf9fd500b981a89a95.pdf",
  privacy:
    "https://06da974e-db09-463f-87b2-ae6b5ee2db40.filesusr.com/ugd/4650d5_55f9305ca40245be84d3de2dff46992b.pdf",
  terms:
    "https://06da974e-db09-463f-87b2-ae6b5ee2db40.filesusr.com/ugd/4650d5_03cae20101434bb9a219b8065072d0bc.pdf",
};

export const studio = {
  name: "Rafi Barides Media LLC",
  city: "Brooklyn, NY, USA",
  email: "rafibaridesstudio@gmail.com",
  phone: "1 (908) 858-5125",
  phoneHref: "tel:+19088585125",
};

export const products = [
  {
    id: "bundle",
    slug: "bundle",
    name: "RBM Bundle",
    shortName: "The Everything Bundle",
    tag: "All kits",
    description:
      "All RBM kits in one download. Drums, bass, guitars, strings, keys, and the rest of the catalog.",
    price: 4999,
    compareAt: 9999,
    stemCount: 797,
    stemLabel: "797+",
    file: "everything-bundle.zip",
    art: "/art/everything-bundle.jpg",
    square: "/art/everything-bundle.jpg",
    featured: true,
    contents: [
      { label: "Drum one shots", count: 146 },
      { label: "Drum loops", count: 50 },
      { label: "Drum fills", count: 20 },
      { label: "Bass loops", count: 15 },
      { label: "Bass one shots", count: 13 },
      { label: "Acoustic guitar loops", count: 70 },
      { label: "Electric guitar loops", count: 21 },
      { label: "Nylon guitar loops", count: 17 },
      { label: "Disco string loops", count: 33 },
      { label: "Multiloops", count: 34 },
      { label: "Clarinet pack", count: 21 },
      { label: "And more", count: null },
    ],
  },
  {
    id: "disco-funk-toolkit",
    slug: "disco-funk-toolkit",
    name: "Disco Funk Toolkit",
    tag: "Disco / funk",
    description:
      "70s disco and funk: guitar, bass, piano, strings, drums, and starters. Includes a copy of RBM Drum Hits.",
    price: 1999,
    compareAt: 2499,
    stemCount: 310,
    file: "disco-funk-toolkit.zip",
    art: "/art/disco-funk-toolkit.jpg",
    square: "/art/square-disco-funk.jpg",
    youtube: "2VkMds9LKcc",
    audioDemos: [
      { title: "Sample 1", src: `${R2}/demos/disco/disco-sample-1.wav` },
      { title: "Sample 2", src: `${R2}/demos/disco/disco-sample-2.wav` },
      { title: "Sample 3", src: `${R2}/demos/disco/disco-sample-3.wav` },
    ],
    contents: [
      { label: "Drum one shots", count: 31 },
      { label: "Disco funk guitar loops", count: 25 },
      { label: "Bass loops", count: 10 },
      { label: "Bass one shots", count: 13 },
      { label: "Disco piano loops", count: 10 },
      { label: "Disco starters", count: 6 },
      { label: "Drum loops", count: 11 },
      { label: "Drum fills", count: 12 },
      { label: "Disco string loops", count: 33 },
      { label: "Notes violin pack", count: 15 },
      { label: "Tambourine loops", count: 4 },
      { label: "Includes RBM Drum Hits", count: 140 },
    ],
  },
  {
    id: "spanish-essentials",
    slug: "spanish-essentials",
    name: "Spanish Essentials",
    tag: "Latin / nylon",
    description:
      "Latin percussion, nylon and electric guitar, bass, trumpet, and drums.",
    price: 1999,
    compareAt: 2499,
    stemCount: 113,
    file: "spanish-essentials.zip",
    art: "/art/spanish-essentials.jpg",
    square: "/art/square-spanish.jpg",
    youtube: "3I3-wl2mLK4",
    audioDemos: [
      { title: "Demo 1 · 110 BPM", src: `${R2}/demos/spanish/demo-1-110bpm.wav` },
      { title: "Demo 2 · 100 BPM", src: `${R2}/demos/spanish/demo-2-100bpm.wav` },
      { title: "Demo 3 · 112 BPM", src: `${R2}/demos/spanish/demo-3-112bpm.wav` },
    ],
    contents: [
      { label: "Authentic Latin percussion hits", count: 20 },
      { label: "Bongo loops", count: 10 },
      { label: "Campana loops", count: 2 },
      { label: "Conga loops", count: 9 },
      { label: "Guiro loops", count: 4 },
      { label: "Latin percussion fills", count: 7 },
      { label: "Maracas", count: 4 },
      { label: "Latin percussion loops", count: 6 },
      { label: "Tumba loops", count: 4 },
      { label: "Shaker and woodblock loops", count: 4 },
      { label: "Electric guitar loops", count: 8 },
      { label: "Nylon guitar loops", count: 17 },
      { label: "Bass loops", count: 5 },
      { label: "Trumpet loops", count: 5 },
      { label: "Drum loops", count: 8 },
    ],
  },
  {
    id: "indie-anthems",
    slug: "indie-anthems",
    name: "Indie Anthems",
    tag: "Acoustic",
    description:
      "Acoustic guitar, banjo, dobro, ukulele, drums, and shakers.",
    price: 1999,
    compareAt: 2499,
    stemCount: 118,
    file: "indie-anthems.zip",
    art: "/art/indie-anthems.jpg",
    square: "/art/square-indie.jpg",
    youtube: "7LIByhgq6g0",
    contents: [
      { label: "Acoustic guitar loops", count: 47 },
      { label: "Banjo loops", count: 7 },
      { label: "Ukulele loops", count: 3 },
      { label: "Dobro loops", count: 11 },
      { label: "Drum loops", count: 10 },
      { label: "Drum fills", count: 8 },
      { label: "Drum one shots", count: 15 },
      { label: "Tambourine and shaker loops", count: 17 },
    ],
  },
  {
    id: "radio-pop-tools",
    slug: "radio-pop-tools",
    name: "Radio Pop Tools",
    tag: "Pop",
    description:
      "Guitars, drums, horns, keys, plucks, vocals, and transitions for pop production.",
    price: 1999,
    compareAt: 2499,
    stemCount: 227,
    file: "radio-pop-tools.zip",
    art: "/art/radio-pop-tools.jpg",
    square: "/art/square-radio-pop.jpg",
    contents: [
      { label: "Acoustic guitar loops", count: 23 },
      { label: "Slide guitar loops", count: 5 },
      { label: "Acoustic guitar fills", count: 5 },
      { label: "Drum loops", count: 21 },
      { label: "Electric guitar loops", count: 13 },
      { label: "Notes electric guitar pack", count: 15 },
      { label: "Foley loops", count: 6 },
      { label: "Horn loops", count: 10 },
      { label: "Notes clarinet pack", count: 21 },
      { label: "Misc one shots", count: 15 },
      { label: "Multiloops", count: 25 },
      { label: "Perc loops", count: 9 },
      { label: "Piano / keys loops", count: 13 },
      { label: "Plucks", count: 12 },
      { label: "Pluck loops", count: 6 },
      { label: "Risers and transitions", count: 12 },
      { label: "Voice chops", count: 16 },
    ],
  },
  {
    id: "vintage-dreams",
    slug: "vintage-dreams",
    name: "Vintage Dreams",
    tag: "Analog",
    description:
      "Analog synth loops, drones, synthwave grooves, and multiloops.",
    price: 1999,
    compareAt: 2499,
    stemCount: 29,
    file: "vintage-dreams.zip",
    art: "/art/vintage-dreams.jpg",
    square: "/art/square-vintage.jpg",
    youtube: "PqchWeSKjBY",
    contents: [
      { label: "Ambient drones", count: 8 },
      { label: "Synthwave grooves", count: 4 },
      { label: "Multiloops", count: 9 },
      { label: "Synth loops", count: 8 },
    ],
  },
  {
    id: "rap-grooves",
    slug: "rap-grooves",
    name: "Rap Grooves",
    tag: "Rap / trap",
    description:
      "808s, rap drum grooves, foley, electric guitar, hats, synths, and vocals.",
    price: 2500,
    compareAt: 3500,
    stemCount: 158,
    file: "rap-grooves.zip",
    art: "/art/rap-grooves.png",
    square: "/art/square-rap-grooves.png",
    videoDemo: `${R2}/demos/rap-grooves/demo.m4v`,
    contents: [
      { label: "808 loops", count: 5 },
      { label: "Drum fills", count: 4 },
      { label: "Rap drum grooves", count: 42 },
      { label: "Foley percs", count: 28 },
      { label: "Electric guitar loops", count: 32 },
      { label: "Hat loops", count: 5 },
      { label: "Multiloops", count: 9 },
      { label: "Synth loops", count: 22 },
      { label: "Vocal one shots", count: 11 },
    ],
  },
];

export const catalog = products.filter((p) => p.id !== "bundle");
export const bundle = products.find((p) => p.id === "bundle");

export function getProduct(slug) {
  return products.find((p) => p.slug === slug);
}

export function formatMoney(cents) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function stripeLinkEnvKey(id) {
  return `VITE_STRIPE_LINK_${id.replace(/-/g, "_").toUpperCase()}`;
}

export function stripeLinkFor(product) {
  const key = stripeLinkEnvKey(product.id);
  return import.meta.env[key] || "";
}
