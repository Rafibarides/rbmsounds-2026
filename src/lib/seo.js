import { freeKit, getProduct } from "../data/products.js";

export const SITE = "https://rbmsounds.com";
export const BRAND_IMAGE = "/share/rbm-sounds.png";
export const DEFAULT_DESCRIPTION =
  "Sample packs for producers. Disco, indie, Spanish, rap, pop, and vintage kits from Rafi Barides Media.";

function abs(path) {
  if (!path) return `${SITE}${BRAND_IMAGE}`;
  if (path.startsWith("http")) return path;
  return `${SITE}${path}`;
}

export function seoForPath(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/") {
    return {
      title: "RBM Sounds",
      description: DEFAULT_DESCRIPTION,
      image: BRAND_IMAGE,
      url: "/",
    };
  }

  if (path === "/bundle") {
    const product = getProduct("bundle");
    return {
      title: `${product.name} · RBM Sounds`,
      description: product.description,
      image: product.square || product.art,
      url: "/bundle",
    };
  }

  if (path === "/free") {
    return {
      title: `${freeKit.name} · RBM Sounds`,
      description: freeKit.description,
      image: freeKit.art,
      url: "/free",
    };
  }

  if (path === "/account") {
    return {
      title: "Library · RBM Sounds",
      description: "Downloads from packs you already own.",
      image: BRAND_IMAGE,
      url: "/account",
    };
  }

  if (path === "/thanks") {
    return {
      title: "Thank you · RBM Sounds",
      description: "Your download is ready.",
      image: BRAND_IMAGE,
      url: "/thanks",
    };
  }

  if (path.startsWith("/sign-in")) {
    return {
      title: "Sign in · RBM Sounds",
      description: DEFAULT_DESCRIPTION,
      image: BRAND_IMAGE,
      url: "/sign-in",
    };
  }

  if (path.startsWith("/sign-up")) {
    return {
      title: "Create account · RBM Sounds",
      description: DEFAULT_DESCRIPTION,
      image: BRAND_IMAGE,
      url: "/sign-up",
    };
  }

  if (path.startsWith("/checkout/")) {
    const product = getProduct(path.slice("/checkout/".length));
    if (product) {
      return {
        title: `Checkout · ${product.name} · RBM Sounds`,
        description: product.description,
        image: product.square || product.art,
        url: `/checkout/${product.slug}`,
      };
    }
  }

  const product = getProduct(path.slice(1));
  if (product) {
    return {
      title: `${product.name} · RBM Sounds`,
      description: product.description,
      image: product.square || product.art,
      url: `/${product.slug}`,
    };
  }

  return {
    title: "RBM Sounds",
    description: DEFAULT_DESCRIPTION,
    image: BRAND_IMAGE,
    url: path,
  };
}

export function sharePages() {
  const paths = [
    "/",
    "/bundle",
    "/free",
    "/account",
    "/thanks",
    "/sign-in",
    "/sign-up",
    "/disco-funk-toolkit",
    "/spanish-essentials",
    "/indie-anthems",
    "/radio-pop-tools",
    "/vintage-dreams",
    "/rap-grooves",
    "/checkout/bundle",
    "/checkout/disco-funk-toolkit",
    "/checkout/spanish-essentials",
    "/checkout/indie-anthems",
    "/checkout/radio-pop-tools",
    "/checkout/vintage-dreams",
    "/checkout/rap-grooves",
  ];
  return paths.map((path) => seoForPath(path));
}

function upsert(selector, tag, attrs) {
  let node = document.head.querySelector(selector);
  if (!node) {
    node = document.createElement(tag);
    document.head.appendChild(node);
  }
  Object.entries(attrs).forEach(([key, value]) => {
    node.setAttribute(key, value);
  });
  return node;
}

export function applySeo({ title, description, image, url }) {
  const imageUrl = abs(image);
  const pageUrl = `${SITE}${url === "/" ? "/" : url}`;

  document.title = title;
  upsert('meta[name="description"]', "meta", {
    name: "description",
    content: description,
  });
  upsert('meta[property="og:type"]', "meta", {
    property: "og:type",
    content: "website",
  });
  upsert('meta[property="og:site_name"]', "meta", {
    property: "og:site_name",
    content: "RBM Sounds",
  });
  upsert('meta[property="og:title"]', "meta", {
    property: "og:title",
    content: title,
  });
  upsert('meta[property="og:description"]', "meta", {
    property: "og:description",
    content: description,
  });
  upsert('meta[property="og:image"]', "meta", {
    property: "og:image",
    content: imageUrl,
  });
  upsert('meta[property="og:url"]', "meta", {
    property: "og:url",
    content: pageUrl,
  });
  upsert('meta[name="twitter:card"]', "meta", {
    name: "twitter:card",
    content: "summary_large_image",
  });
  upsert('meta[name="twitter:title"]', "meta", {
    name: "twitter:title",
    content: title,
  });
  upsert('meta[name="twitter:description"]', "meta", {
    name: "twitter:description",
    content: description,
  });
  upsert('meta[name="twitter:image"]', "meta", {
    name: "twitter:image",
    content: imageUrl,
  });
  upsert('link[rel="apple-touch-icon"]', "link", {
    rel: "apple-touch-icon",
    href: BRAND_IMAGE,
  });
}
