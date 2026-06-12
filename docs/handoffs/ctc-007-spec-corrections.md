# CTC-007 Claude QA-planning corrections

Date: 2026-06-12

## Disposition

Claude returned `READY WITH REQUIRED SPEC CORRECTIONS`. BF-1 through BF-8 and
Decisions 1 through 10 are accepted except for the consistency corrections
below. These corrections preserve Claude's intent and authorize development.
The rejected Gemini revision remains rejected in full.

## Consistency corrections

1. Target IDs use `/^t-[0-9a-f]{12}$/`; carry IDs use
   `/^c-[0-9a-f]{12}$/`. Both use six bytes from `crypto.getRandomValues`
   encoded as lowercase hexadecimal. Separate prefixes avoid ambiguous ID
   namespaces.
2. V1 does not detect duplicate raw JSON object keys because `JSON.parse`
   resolves them before validation. Remove `DUPLICATE_KEY` as a claimed
   post-parse check. Duplicate semantic target and carry IDs are rejected
   across the complete project.
3. The maximum returned validation-error count is 20 including the
   too-many-errors sentinel. Collect at most 19 field errors, then append one
   sentinel error.
4. Carry sampling returns exactly 65 valid coordinates: 64 bearings plus a
   closing copy of sample zero. Any invalid generated coordinate returns a
   typed carry-generation failure; samples are never silently dropped.
5. Normalize longitude to `[-180, 180)` degrees. Split rendered carry segments
   where two consecutive normalized sample longitudes differ by more than 180
   degrees. The antimeridian test uses a valid maximum 700-yard carry near the
   antimeridian, not the out-of-range 5,000-yard example.
6. Import confirmation occurs after the file-input change event but before
   file reading. Cancel clears the input value, returns focus to the import
   control, and leaves project state unchanged.
7. The success announcement receives programmatic focus through
   `tabIndex={-1}` in addition to `aria-live="polite"`. The error-summary
   heading is likewise focusable.
8. Target placement announces target-specific text; it must not reuse
   CTC-006's measurement announcement `"First point placed"`.
9. The current course source key is the first deterministic normalized course
   candidate. Import/export controls are unavailable when no course candidate
   exists. This does not mutate or replace normalized source evidence.
10. SVG target markers use `role="button"` when they are keyboard/click
    selectable. Ordinary target-list controls remain the primary edit/delete
    interface.
11. Imported dangling target-origin carry records remain structurally valid
    and produce the specified visible error state. They are not silently
    dropped or treated as trusted geometry.
12. Deterministic serialization means fixed property/collection ordering and
    formatting. `exportedAt` intentionally changes between exports and is not
    included in byte-identical repeated-export assertions.

## Accepted implementation rules

- Use Claude's exact v1 project shape, 512 KiB maximum, strict unknown-field
  rejection, dangerous-key rejection, exact schema version, all-or-nothing
  import, course/hole matching, fixed filename/MIME/final newline, and
  requestAnimationFrame object-URL cleanup, subject to the corrections above.
- Use memory-only project state, explicit `measure`, `place-target`, and
  `reposition-target` modes, free geographic targets, explicit label editing,
  immediate delete with single-level undo, and existing pointer/keyboard
  projection behavior.
- Use deterministic tee-origin eligibility, 0–5 carry records per hole,
  1–5 unique ascending integer-yard distances from 1–700, 64-bearing
  geographic rings using existing `EARTH_RADIUS_M`, fixed hole projection,
  clipped carry rendering, visible off-map/origin errors, and the accepted SVG
  layer order.
- Use no new production dependency, no Zod, no Canvas replacement, no
  pan/zoom/rotation/dragging, no notes/preferences, no automatic migration, no
  durable persistence, no CTC-019 behavior, and no logging side effects.
- Final Claude audit remains mandatory after implementation.
