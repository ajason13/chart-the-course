# Legal and Trademark Disclaimers

Status: Drafted for CTC-003 on 2026-06-05.

This document records the public legal, trademark, and course-replica posture
for Chart the Course. It is project governance documentation, not legal advice.
Project maintainers and contributors should get advice from qualified counsel
before relying on this document for commercialization, licensing disputes,
brand-clearance decisions, or high-fidelity course recreation.

## Public Disclaimer Text

Use this baseline disclaimer in public-facing docs, app about pages, generated
exports, and release materials until counsel approves alternative wording:

```text
Chart the Course is an independent open-source project and is not affiliated
with, sponsored by, endorsed by, or approved by any golf course, golf governing
body, launch-monitor vendor, GPS app, simulator platform, map provider, or other
commercial brand unless that relationship is stated expressly.

Course layouts, yardages, hazards, and tactical recommendations may be
incomplete or inaccurate because they are generated from public/open map data
and user-authored inputs. Verify all yardages, hazards, boundaries, and local
course rules before play.

Chart the Course is not legal advice. Copyright, trademark, database-right, and
course-design rules vary by jurisdiction and may change. Do not use this project
to create or distribute prepackaged high-fidelity replicas of commercial golf
courses unless you have the rights or permissions needed for that use.
```

## Trademark and Brand Rules

Chart the Course must avoid suggesting sponsorship, affiliation, endorsement, or
approval by third-party brands.

- Do not use third-party brand names in product positioning, navigation,
  feature names, comparison copy, screenshots, examples, or generated exports
  unless the reference is nominative, necessary, and reviewed.
- Prefer generic terms such as `GPS app`, `launch monitor`, `simulator
  platform`, `course operator`, `map provider`, `tile provider`, or `governing
  body`.
- When a third-party name is necessary for attribution, compatibility, source
  identification, legal monitoring, or a provider notice, use the minimum text
  needed and avoid logos, trade dress, slogans, and marketing claims.
- In this policy, `reviewed` means a logged maintainer decision with the
  rationale, source or brand being referenced, where the reference will appear,
  and why the reference is nominative and necessary.
- Do not imply that a named course, club, tournament, governing body, equipment
  vendor, GPS app, or simulator platform approves or validates Chart the Course.
- Do not use famous course names or commercial brand names as bundled demo data,
  example fixtures, seeded screenshots, or default yardage-book content without
  explicit review.

## Course-Design and Replica Rules

Chart the Course is designed to generate user-requested planning artifacts from
open/public map data and user-authored overlays. It must not ship prepackaged
high-fidelity commercial course replicas.

- Do not bundle or market named commercial-course replicas as project assets.
- Do not copy copyrighted maps, yardage books, pin sheets, scorecard artwork,
  course photography, proprietary routing diagrams, simulator course assets, or
  commercial strategy-book layouts.
- Do not trace or reconstruct a proprietary commercial course product when OSM
  or user-authored data is unavailable.
- Demo fixtures should use synthetic courses, permissioned data, or heavily
  simplified generic examples unless a real course has been reviewed for
  permission, attribution, and jurisdiction-specific risk.
- A real-course fixture review must be logged before merge and must identify
  the data source, permission or open-data basis, required attribution, brand or
  course-name risk, jurisdiction-specific concerns, and why the fixture is
  necessary instead of a synthetic course.
- If the project later adds import, PDF, fixture, or marketplace features, those
  features must preserve this no-prepackaged-replica rule before release.

## Data Accuracy Disclaimer

Generated yardages and course geometry are planning aids only. OSM contributors
and user inputs may be incomplete, stale, approximate, or inconsistent with
course conditions. The app must keep data-quality warnings visible when geometry
is missing or ambiguous, and generated PDFs should remind users to verify
yardages and hazards before play.

Any generated PDF, print output, source export, or downloadable artifact that
contains OSM-derived course geometry must include OSM attribution near the
map-bearing page, export metadata, acknowledgements block, or source-download
notice as appropriate for the artifact, including the full URL
`https://www.openstreetmap.org/copyright` when links are not available.

## Source Monitoring

Primary sources checked on 2026-06-05:

- U.S. Congress, H.R. 7228, 118th Congress, BIRDIE Act: the bill was introduced
  on 2024-02-05 and referred to the House Judiciary Committee; Congress.gov
  listed no enacted-law status for that bill when checked.
  <https://www.congress.gov/bill/118th-congress/house-bill/7228/all-info>
- U.S. Copyright Office, Circular 33, `Works Not Protected by Copyright`:
  project policy should continue treating ideas, systems, methods, layouts,
  names, titles, slogans, and short phrases as outside ordinary copyright
  protection while recognizing that expressive materials can still be protected.
  <https://www.copyright.gov/circs/circ33.pdf>
- U.S. Copyright Office FAQ, `What Does Copyright Protect?`: copyright does not
  protect ideas, concepts, systems, or methods of doing something, and names or
  short phrases may instead raise trademark issues.
  <https://www.copyright.gov/help/faq/faq-protect.html>
- USPTO, `About Trademark Infringement`: trademark risk centers on unauthorized
  use that is likely to cause confusion, deception, or mistake about source,
  sponsorship, or services.
  <https://www.uspto.gov/page/about-trademark-infringement>
- USPTO, `Likelihood of confusion`: public branding should avoid confusingly
  similar marks and related-goods/services contexts that could imply a common
  source.
  <https://www.uspto.gov/trademarks/search/likelihood-confusion>
- OpenStreetMap copyright and license page: OSM-derived maps and printed media
  require visible attribution, with the full URL when links are not possible.
  <https://www.openstreetmap.org/copyright>

Review these sources before v1.0, before any monetization, before publishing
named real-course fixtures, before using third-party marks in marketing, and
after any material change to U.S. or international course-design law.
