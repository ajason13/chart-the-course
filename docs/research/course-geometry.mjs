// Synthetic #46 evidence, with #47 scope-first association expectations.
// Run with Node 24: node docs/research/course-geometry.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeGolfCourse } from '../../src/normalize.ts';

const source = {
  query: 'synthetic research only', endpoint: 'https://example.invalid',
  completedAt: '2026-10-29T00:00:00Z', bbox: '35,-80,35.01,-79.99',
  copyrightUrl: 'https://www.openstreetmap.org/copyright',
};
const fixture = JSON.parse(readFileSync(new URL('../../fixtures/overpass/synthetic-golf-course-ctc006.json', import.meta.url)));
const normalize = (elements) => normalizeGolfCourse({ elements }, source, 'way/9000060001');
const associated = (result) => result.holes.reduce((sum, hole) => sum + hole.features.length, 0);
const baseline = normalize(fixture.elements);
assert.equal(associated(baseline), 8);
const missingRefs = structuredClone(fixture.elements);
for (const element of missingRefs) if (element.tags?.golf !== 'hole') delete element.tags?.ref;
assert.equal(associated(normalize(missingRefs)), 0);

// Invented neighboring facility, with the SAME hole number and a source-ref tee.
const adjacent = structuredClone(fixture.elements);
const offset = (geometry) => geometry.map(({ lat, lon }) => ({ lat, lon: lon + 0.02 }));
const course = adjacent.find((element) => element.tags?.leisure === 'golf_course');
const hole = adjacent.find((element) => element.tags?.golf === 'hole');
const tee = adjacent.find((element) => element.tags?.golf === 'tee');
adjacent.push({ ...structuredClone(course), id: 9900000001, geometry: offset(course.geometry) });
adjacent.push({ ...structuredClone(hole), id: 9900000002, geometry: offset(hole.geometry) });
adjacent.push({ ...structuredClone(tee), id: 9900000003, geometry: offset(tee.geometry) });
const duplicate = normalize(adjacent);
assert.equal(associated(duplicate), 8);
// Removing the neighbor's route must not leak its tee into the selected hole.
const incompleteNeighbor = normalize(adjacent.filter((element) => element.id !== 9900000002));
assert(!incompleteNeighbor.holes[0].features.some((feature) => feature.source.sourceKey === 'way/9900000003'));
assert.deepEqual(normalize([...adjacent].reverse()), duplicate);

const point = (x, y) => ({ lon: x / 100000, lat: y / 100000 });
const rectangle = (x0, y0, x1, y1) => [[x0,y0],[x1,y0],[x1,y1],[x0,y1],[x0,y0]];
const outer = rectangle(0, 0, 10, 10);
const inner = rectangle(3, 3, 7, 7);
const second = rectangle(20, 0, 22, 2);
const relation = {
  type: 'relation', id: 9900000100, tags: { type: 'multipolygon', golf: 'water_hazard', ref: '1' },
  members: [outer, inner, second].map((ring, index) => ({
    type: 'way', ref: 9900000110 + index, role: index === 1 ? 'inner' : 'outer',
    geometry: ring.map(([x, y]) => point(x, y)),
  })),
};
const relationResult = normalize([...fixture.elements, relation]);
const normalizedRelation = relationResult.unassociatedFeatures.find((feature) => feature.source.sourceKey === 'relation/9900000100');
assert.equal(normalizedRelation.geometry, null);
assert.deepEqual(normalizedRelation.source.rawMembers, relation.members);
assert(relationResult.warnings.some((warning) => warning.code === 'UNSUPPORTED_RELATION'));
const missingMember = structuredClone(relation);
delete missingMember.members[1].geometry;
assert.equal(normalize([missingMember]).unassociatedFeatures[0].geometry, null);

// Analytic, local-unit counterexamples; these do not execute a new GIS policy.
const area = (ring) => Math.abs(ring.slice(1).reduce((sum, end, index) => {
  const start = ring[index];
  return sum + start[0] * end[1] - end[0] * start[1];
}, 0)) / 2;
assert.equal(area(outer) - area(inner) + area(second), 88);
// Cross-section at y=5: occupied x intervals [0,3] and [7,10].
// A route station at x=5 is in the hole; flattening to outer invents width 10.
assert.equal((3 - 0) + (10 - 7), 6);
// Schematic shared fairway: both explicit vertical route segments lie strictly
// inside the rectangle and have positive length. This is analytic evidence,
// not a run of the proposed candidate algorithm.
const sharedFairway = rectangle(0, 0, 10, 10);
const sharedRoutes = [[[4, 1], [4, 9]], [[6, 1], [6, 9]]];
for (const [start, end] of sharedRoutes) {
  assert.equal(start[0], end[0]);
  assert(start[0] > sharedFairway[0][0] && start[0] < sharedFairway[1][0]);
  assert(start[1] > sharedFairway[0][1] && end[1] < sharedFairway[2][1]);
  assert(end[1] > start[1]); // convex rectangle contains the entire segment
}

console.log(JSON.stringify({
  baselineAssociated: associated(baseline), missingRefsAssociated: associated(normalize(missingRefs)),
  duplicateNumberAssociated: associated(duplicate),
  neighborTeeLeaksWithoutNeighborRoute: false,
  reversedElementsInvariant: true, relationGeometry: normalizedRelation.geometry,
  relationMembersPreserved: true, missingMemberGeometry: null,
  analyticArea: { outerOnly: area(outer), withHoleAndSecondPart: 88 },
  crossSection: { occupiedLength: 6, stationInHole: true, outerOnlyInventedWidth: 10 },
  schematicSharedFairwayIntersectingRoutes: sharedRoutes.length,
}, null, 2));
