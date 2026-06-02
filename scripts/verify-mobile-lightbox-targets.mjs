import { readFileSync } from 'node:fs';

const styles = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

function readRule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = styles.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, 'm'));
  if (!match) throw new Error(`Missing CSS rule for ${selector}`);
  return match[1];
}

function readNumericProperty(rule, property) {
  const match = rule.match(new RegExp(`${property}\\s*:\\s*(-?\\d+)\\s*;`));
  return match ? Number(match[1]) : null;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const figureRule = readRule('.lightbox-panel figure');
const navRule = readRule('.lightbox-nav');

const figureZIndex = readNumericProperty(figureRule, 'z-index');
const navZIndex = readNumericProperty(navRule, 'z-index');

assert(figureZIndex !== null, 'lightbox figure should keep an explicit stacking level');
assert(navZIndex !== null, 'lightbox nav buttons need an explicit stacking level');
assert(
  navZIndex > figureZIndex,
  `lightbox nav buttons must stack above figure/caption on mobile, got nav ${navZIndex} and figure ${figureZIndex}`,
);
assert(
  styles.includes('  .lightbox-nav {\n    top: auto;\n    bottom: 16px;'),
  'mobile nav buttons should remain bottom-aligned',
);

console.log('mobile lightbox target checks passed');
