// #53: analytic synthetic evidence, not a runtime origin implementation.
// Coordinates are local Cartesian metres; no real course or geographic projection.
import assert from 'node:assert/strict';

const yards = m => m / 0.9144;
const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const close = (a, b) => assert(distance(a, b) < 1e-9);
const rotate = (ring, n) => [...ring.slice(n), ...ring.slice(0, n)];
function centroid(ring) {
  let area2 = 0, x = 0, y = 0;
  ring.forEach((a, i) => {
    const b = ring[(i + 1) % ring.length];
    const cross = a[0] * b[1] - b[0] * a[1];
    area2 += cross; x += (a[0] + b[0]) * cross; y += (a[1] + b[1]) * cross;
  });
  return Math.abs(area2) < 1e-9 ? null : [x / (3 * area2), y / (3 * area2)];
}
function inside([x, y], ring) {
  let result = false;
  ring.forEach(([ax, ay], i) => {
    const [bx, by] = ring[(i + 1) % ring.length];
    if ((ay > y) !== (by > y) && x < ax + (y - ay) * (bx - ax) / (by - ay)) result = !result;
  });
  return result;
}
// One illustrative interior algorithm: horizontal bbox-midline, longest span,
// leftmost tie. Assumes valid simple rings with nonzero area; not general GIS.
function interior(ring) {
  if (!centroid(ring)) return null;
  const ys = ring.map(p => p[1]);
  const y = (Math.min(...ys) + Math.max(...ys)) / 2;
  const xs = [];
  ring.forEach(([ax, ay], i) => {
    const [bx, by] = ring[(i + 1) % ring.length];
    if ((ay > y) !== (by > y)) xs.push(ax + (y - ay) * (bx - ax) / (by - ay));
  });
  xs.sort((a, b) => a - b);
  const spans = [];
  for (let i = 0; i + 1 < xs.length; i += 2) spans.push([xs[i], xs[i + 1]]);
  spans.sort((a, b) => (b[1] - b[0]) - (a[1] - a[0]) || a[0] - b[0]);
  return spans.length ? [(spans[0][0] + spans[0][1]) / 2, y] : null;
}

const cases = {
  rectangle: [[0,0],[24,0],[24,12],[0,12]],
  elongated: [[0,0],[60,0],[60,10],[0,10]],
  concaveL: [[0,0],[10,0],[10,2],[2,2],[2,10],[0,10]],
  degenerate: [[0,0],[10,0],[20,0]],
};
close(centroid(cases.rectangle), [12,6]);
close(centroid(cases.elongated), [30,5]);
assert(!inside(centroid(cases.concaveL), cases.concaveL));
close(interior(cases.concaveL), [1,5]);
assert.equal(centroid(cases.degenerate), null);
assert.equal(interior(cases.degenerate), null);

const target = [100, 0];
const rows = [];
for (const [name, ring] of Object.entries(cases)) {
  const center = centroid(ring), inner = interior(ring);
  let firstVertexSpread = 0;
  for (let n = 0; n < ring.length; n++) {
    const shifted = rotate(ring, n);
    firstVertexSpread = Math.max(firstVertexSpread, distance(ring[0], shifted[0]));
    for (const reordered of [shifted, [...shifted].reverse()]) {
      if (center) close(centroid(reordered), center);
      if (inner) { close(interior(reordered), inner); assert(inside(inner, reordered)); }
    }
  }
  rows.push({
    case: name,
    centroid: center?.map(v => +v.toFixed(3)) ?? null,
    centroidInside: center ? inside(center, ring) : null,
    interior: inner,
    firstVertexSpreadYards: +yards(firstVertexSpread).toFixed(3),
    firstToCentroidYards: center ? +yards(distance(ring[0], center)).toFixed(3) : null,
    targetDistanceChangeYards: center ? +yards(distance(center, target) - distance(ring[0], target)).toFixed(3) : null,
  });
}
// Collinear densification changes the vertex mean, but not area centroid/interior.
const dense = [[0,0],[6,0],[12,0],[18,0],[24,0],[24,12],[0,12]];
close(centroid(dense), centroid(cases.rectangle));
close(interior(dense), interior(cases.rectangle));
const mean = ring => ring.reduce((a, p) => [a[0] + p[0]/ring.length, a[1] + p[1]/ring.length], [0,0]);
assert(distance(mean(dense), mean(cases.rectangle)) > 2);
// An explicit, unchanged target coordinate does not depend on boundary order.
const selected = [4,4];
for (let n = 0; n < cases.rectangle.length; n++) assert(inside(selected, rotate(cases.rectangle, n)));
// Point origins have no ring-order ambiguity; a shared point remains one coordinate.
close([4,4], selected);
console.log(JSON.stringify(rows, null, 2));
console.log('Synthetic assertions passed; geographic accuracy and real tee locations are unmeasured.');
