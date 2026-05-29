import { writeFileSync } from "fs";
import { deflateSync } from "zlib";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1;
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const t = Buffer.from(type);
  const crcBuf = Buffer.concat([t, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcBuf));
  return Buffer.concat([len, t, data, crc]);
}

function createPng(size, r, g, b) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  const radius = size * 0.22;
  for (let y = 0; y < size; y++) {
    const row = (size * 4 + 1) * y + 1;
    for (let x = 0; x < size; x++) {
      const i = row + x * 4;
      const inCorner =
        (x < radius && y < radius && Math.hypot(x - radius, y - radius) > radius) ||
        (x > size - radius && y < radius && Math.hypot(x - (size - radius), y - radius) > radius) ||
        (x < radius && y > size - radius && Math.hypot(x - radius, y - (size - radius)) > radius) ||
        (x > size - radius &&
          y > size - radius &&
          Math.hypot(x - (size - radius), y - (size - radius)) > radius);
      if (inCorner) {
        raw[i] = raw[i + 1] = raw[i + 2] = 0;
        raw[i + 3] = 0;
      } else {
        raw[i] = r;
        raw[i + 1] = g;
        raw[i + 2] = b;
        raw[i + 3] = 255;
      }
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

for (const size of [192, 512]) {
  const png = createPng(size, 30, 58, 95);
  writeFileSync(join(publicDir, `pwa-${size}.png`), png);
  console.log(`Wrote pwa-${size}.png`);
}
