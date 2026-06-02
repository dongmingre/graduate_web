import { inflateSync } from 'node:zlib';
import { readFileSync } from 'node:fs';

const ROOT = new URL('../', import.meta.url);

function readText(path) {
  return readFileSync(new URL(path, ROOT), 'utf8');
}

function readPng(path) {
  const buffer = readFileSync(new URL(path, ROOT));
  if (buffer.toString('hex', 0, 8) !== '89504e470d0a1a0a') {
    throw new Error(`${path} is not a PNG`);
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let colorType = -1;
  const chunks = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    const data = buffer.subarray(dataStart, dataEnd);

    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      colorType = data[9];
      const bitDepth = data[8];
      if (bitDepth !== 8 || colorType !== 6) {
        throw new Error(`${path} must be an 8-bit RGBA PNG`);
      }
    }
    if (type === 'IDAT') chunks.push(data);
    if (type === 'IEND') break;
    offset = dataEnd + 4;
  }

  const bytesPerPixel = 4;
  const stride = width * bytesPerPixel;
  const inflated = inflateSync(Buffer.concat(chunks));
  const pixels = [];
  let source = 0;
  let previous = new Uint8Array(stride);

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[source];
    source += 1;
    const row = new Uint8Array(stride);

    for (let x = 0; x < stride; x += 1) {
      const raw = inflated[source + x];
      const left = x >= bytesPerPixel ? row[x - bytesPerPixel] : 0;
      const up = previous[x];
      const upLeft = x >= bytesPerPixel ? previous[x - bytesPerPixel] : 0;

      if (filter === 0) row[x] = raw;
      else if (filter === 1) row[x] = (raw + left) & 255;
      else if (filter === 2) row[x] = (raw + up) & 255;
      else if (filter === 3) row[x] = (raw + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upLeft);
        const predictor = pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft;
        row[x] = (raw + predictor) & 255;
      } else {
        throw new Error(`${path} uses unsupported PNG filter ${filter}`);
      }
    }

    for (let x = 0; x < width; x += 1) {
      const index = x * bytesPerPixel;
      const alpha = row[index + 3];
      if (alpha > 16) {
        pixels.push({
          x,
          y,
          r: row[index],
          g: row[index + 1],
          b: row[index + 2],
          a: alpha,
        });
      }
    }

    source += stride;
    previous = row;
  }

  if (colorType !== 6 || pixels.length === 0) {
    throw new Error(`${path} has no visible RGBA pixels`);
  }

  return { width, height, pixels };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function measureCursor(path) {
  const image = readPng(path);
  const weighted = image.pixels.filter((pixel) => pixel.a > 120);
  const totalWeight = weighted.reduce((sum, pixel) => sum + pixel.a, 0);
  const average = weighted.reduce(
    (sum, pixel) => ({
      r: sum.r + pixel.r * pixel.a,
      g: sum.g + pixel.g * pixel.a,
      b: sum.b + pixel.b * pixel.a,
    }),
    { r: 0, g: 0, b: 0 },
  );

  const meanX = weighted.reduce((sum, pixel) => sum + pixel.x * pixel.a, 0) / totalWeight;
  const meanY = weighted.reduce((sum, pixel) => sum + pixel.y * pixel.a, 0) / totalWeight;
  let xx = 0;
  let xy = 0;
  let yy = 0;
  for (const pixel of weighted) {
    const dx = pixel.x - meanX;
    const dy = pixel.y - meanY;
    xx += pixel.a * dx * dx;
    xy += pixel.a * dx * dy;
    yy += pixel.a * dy * dy;
  }
  const angleRadians = 0.5 * Math.atan2(2 * xy, xx - yy);
  const angleDegrees = (angleRadians * 180) / Math.PI;

  return {
    width: image.width,
    height: image.height,
    average: {
      r: average.r / totalWeight,
      g: average.g / totalWeight,
      b: average.b / totalWeight,
    },
    angleDegrees,
  };
}

function assertCursor(path) {
  const cursor = measureCursor(path);
  assert(cursor.width === 64 && cursor.height === 64, `${path} must stay 64x64`);
  assert(cursor.average.r >= 232, `${path} red channel is not chalk-white enough`);
  assert(cursor.average.g >= 230, `${path} green channel is not chalk-white enough`);
  assert(cursor.average.b >= 218, `${path} blue channel is not chalk-white enough`);
  assert(
    cursor.angleDegrees >= -38 && cursor.angleDegrees <= -27,
    `${path} should sit at a natural shallow chalk angle, got ${cursor.angleDegrees.toFixed(1)}deg`,
  );
}

assertCursor('src/assets/cursors/chalk.png');
assertCursor('src/assets/cursors/chalk-press.png');

const styles = readText('src/styles.css');
assert(
  styles.includes('--cursor-chalk: url("./assets/cursors/chalk.png") 10 50;'),
  'default chalk cursor hotspot should match the natural chalk tip',
);
assert(
  styles.includes('--cursor-chalk-press: url("./assets/cursors/chalk-press.png") 10 50;'),
  'pressed chalk cursor hotspot should match the natural chalk tip',
);
assert(
  styles.includes('background: rgba(247, 247, 239, var(--dust-alpha));'),
  'chalk dust particles should use a white chalk tone',
);

const cursorComponent = readText('src/components/ChalkDustCursor.tsx');
assert(cursorComponent.includes('const MAX_PARTICLES = 56;'), 'cursor should allow a light dust trail');
assert(cursorComponent.includes('const MIN_DISTANCE = 9;'), 'cursor should shed dust on smaller movements');
assert(cursorComponent.includes('const MIN_INTERVAL_MS = 30;'), 'cursor dust should respond without becoming dense');
assert(cursorComponent.includes('const pointerLagX = -12;'), 'dust should originate near the chalk tip');
assert(cursorComponent.includes('const pointerLagY = 10;'), 'dust should originate near the chalk tip');

console.log('chalk cursor checks passed');
