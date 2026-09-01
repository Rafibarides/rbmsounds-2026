import puppeteer from "puppeteer-core";

const [, , url, out, w = "390", h = "1200"] = process.argv;

const browser = await puppeteer.launch({
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
});
const page = await browser.newPage();
await page.setViewport({ width: Number(w), height: Number(h) });
await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 }).catch(() => {});
await new Promise((resolve) => setTimeout(resolve, 800));
const metrics = await page.evaluate(() => ({
  viewport: window.innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  overflowing: [...document.querySelectorAll("*")]
    .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
    .slice(0, 8)
    .map((el) => `${el.tagName}.${[...el.classList].join(".")}`),
}));
console.log(JSON.stringify(metrics, null, 2));
await page.screenshot({ path: out, fullPage: false });
await browser.close();
