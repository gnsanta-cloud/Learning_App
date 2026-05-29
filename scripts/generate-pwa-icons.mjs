import { writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const sourcePath = join(publicDir, "icons", "icon-source.png");

if (!existsSync(sourcePath)) {
  console.error("Missing public/icons/icon-source.png");
  process.exit(1);
}

for (const size of [192, 512]) {
  const outPath = join(publicDir, `pwa-${size}.png`);
  await sharp(sourcePath)
    .resize(size, size, { fit: "cover" })
    .png()
    .toFile(outPath);
  console.log(`Wrote pwa-${size}.png`);
}
