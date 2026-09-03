import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE, sharePages } from "../src/lib/seo.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

function replace(html, regex, value) {
  if (!regex.test(html)) {
    throw new Error(`Missing tag for ${regex}`);
  }
  return html.replace(regex, value);
}

function meta(attr, key, value) {
  return `<meta ${attr}="${key}" content="${value}" />`;
}

function withSeo(html, page) {
  const image = page.image.startsWith("http") ? page.image : `${SITE}${page.image}`;
  const url = `${SITE}${page.url === "/" ? "/" : page.url}`;
  let next = html;
  next = replace(next, /<title>[\s\S]*?<\/title>/, `<title>${page.title}</title>`);
  next = replace(next, /<meta\s+name="description"[\s\S]*?\/>/, meta("name", "description", page.description));
  next = replace(next, /<meta\s+property="og:title"[\s\S]*?\/>/, meta("property", "og:title", page.title));
  next = replace(next, /<meta\s+property="og:description"[\s\S]*?\/>/, meta("property", "og:description", page.description));
  next = replace(next, /<meta\s+property="og:image"[\s\S]*?\/>/, meta("property", "og:image", image));
  next = replace(next, /<meta\s+property="og:url"[\s\S]*?\/>/, meta("property", "og:url", url));
  next = replace(next, /<meta\s+name="twitter:title"[\s\S]*?\/>/, meta("name", "twitter:title", page.title));
  next = replace(next, /<meta\s+name="twitter:description"[\s\S]*?\/>/, meta("name", "twitter:description", page.description));
  next = replace(next, /<meta\s+name="twitter:image"[\s\S]*?\/>/, meta("name", "twitter:image", image));
  return next;
}

const template = await readFile(join(dist, "index.html"), "utf8");
const pages = sharePages();

for (const page of pages) {
  const html = withSeo(template, page);
  if (page.url === "/") {
    await writeFile(join(dist, "index.html"), html);
    await writeFile(join(dist, "404.html"), html);
    continue;
  }
  const file = join(dist, page.url.replace(/^\//, ""), "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}

console.log(`Wrote ${pages.length} share pages`);
