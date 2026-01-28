const puppeteer = require("puppeteer");

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const waitMs = Number(process.env.WAIT_MS || 3000);

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const errors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push({
        type: "console.error",
        text: msg.text(),
        location: msg.location(),
      });
    }
  });

  page.on("pageerror", (err) => {
    errors.push({
      type: "pageerror",
      text: err.message,
      stack: err.stack,
    });
  });

  await page.goto(baseUrl, { waitUntil: "networkidle2" });
  await page.waitForTimeout(waitMs);
  await browser.close();

  if (errors.length > 0) {
    console.error("Console errors found:");
    errors.forEach((error) => {
      console.error(`- ${error.type}: ${error.text}`);
      if (error.location) {
        console.error(
          `  at ${error.location.url}:${error.location.lineNumber}:${error.location.columnNumber}`
        );
      }
      if (error.stack) {
        console.error(error.stack);
      }
    });
    process.exit(1);
  }

  console.log("✅ No console errors");
})().catch((err) => {
  console.error("❌ Console check failed");
  console.error(err);
  process.exit(1);
});
