function token(id) {
  const key = `PACK_TOKEN_${id.replace(/-/g, "_").toUpperCase()}`;
  return process.env[key] || "";
}

export function getPacks() {
  return {
    bundle: {
      id: "bundle",
      name: "RBM Bundle",
      price: 4999,
      file: "everything-bundle.zip",
      token: token("bundle"),
    },
    "disco-funk-toolkit": {
      id: "disco-funk-toolkit",
      name: "Disco Funk Toolkit",
      price: 1999,
      file: "disco-funk-toolkit.zip",
      token: token("disco-funk-toolkit"),
    },
    "spanish-essentials": {
      id: "spanish-essentials",
      name: "Spanish Essentials",
      price: 1999,
      file: "spanish-essentials.zip",
      token: token("spanish-essentials"),
    },
    "indie-anthems": {
      id: "indie-anthems",
      name: "Indie Anthems",
      price: 1999,
      file: "indie-anthems.zip",
      token: token("indie-anthems"),
    },
    "radio-pop-tools": {
      id: "radio-pop-tools",
      name: "Radio Pop Tools",
      price: 1999,
      file: "radio-pop-tools.zip",
      token: token("radio-pop-tools"),
    },
    "vintage-dreams": {
      id: "vintage-dreams",
      name: "Vintage Dreams",
      price: 1999,
      file: "vintage-dreams.zip",
      token: token("vintage-dreams"),
    },
    "rap-grooves": {
      id: "rap-grooves",
      name: "Rap Grooves",
      price: 2500,
      file: "rap-grooves.zip",
      token: token("rap-grooves"),
    },
  };
}

export const artUrl = {
  bundle: "https://pub-dacf0b528a6844669cc37ccbc42ff66b.r2.dev/art/everything-bundle.jpg",
  "disco-funk-toolkit":
    "https://pub-dacf0b528a6844669cc37ccbc42ff66b.r2.dev/art/disco-funk-toolkit.jpg",
  "spanish-essentials":
    "https://pub-dacf0b528a6844669cc37ccbc42ff66b.r2.dev/art/spanish-essentials.jpg",
  "indie-anthems": "https://pub-dacf0b528a6844669cc37ccbc42ff66b.r2.dev/art/indie-anthems.jpg",
  "radio-pop-tools":
    "https://pub-dacf0b528a6844669cc37ccbc42ff66b.r2.dev/art/radio-pop-tools.jpg",
  "vintage-dreams": "https://pub-dacf0b528a6844669cc37ccbc42ff66b.r2.dev/art/vintage-dreams.jpg",
  "rap-grooves": "https://pub-dacf0b528a6844669cc37ccbc42ff66b.r2.dev/art/rap-grooves.png",
};
