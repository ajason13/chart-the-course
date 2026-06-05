# Reference Project Reuse Policy

Status: Adopted for CTC-013 on 2026-06-05.

This policy records how Chart the Course may use three known golf-mapping
reference projects. It is a governance decision, not legal advice.

## Decision

| Project | Observed license status | Allowed use | Blocked use |
| --- | --- | --- | --- |
| `npilk/hacker-yardage` | No license file found in the repository root; GitHub license API returned 404 on 2026-06-05. | Product and architecture inspiration only. Public README behavior may inform problem framing, provided implementation remains original. | Dependency, fork, code copy, translation, adaptation, asset/template reuse, query text reuse, or distinctive workflow/UI reuse without written permission or a later verified license. |
| `npilk/openyardage-web` | No license file found in the repository root; GitHub license API returned 404 on 2026-06-05. | Product and architecture inspiration only. Public README behavior may inform problem framing, provided implementation remains original. | Dependency, fork, code copy, translation, adaptation, asset reuse, query text reuse, PDF/export implementation reuse, or distinctive workflow/UI reuse without written permission or a later verified license. |
| `bdlucas1/ace` | GitHub identifies `LICENSE.txt` as GNU Affero General Public License v3.0 (`AGPL-3.0`). | Architecture and prior-art reference only. High-level concepts may be studied, then independently designed and implemented. | Copying, modifying, adapting, linking, combining, incorporating, distributing, forking, or using as a dependency unless Chart the Course intentionally adopts an AGPL-compatible licensing posture and records that decision first. |

## Rationale

An absent license is not permission to reuse code. Until a license or written
permission is verified, `hacker-yardage` and `openyardage-web` are treated as
copyrighted source-available references only. Chart the Course may learn from
their public behavior and broad product ideas, but implementation must be
independently authored.

`ace` has an explicit AGPL-3.0 license. The GNU AGPL is a copyleft license
designed for software used over a network, and Section 13 requires modified
network-interactive versions to offer users Corresponding Source. Section 5 also
requires modified source versions to license the whole work under the AGPL when
the work is based on the covered program. Chart the Course is currently
Apache-2.0 and browser-delivered, so incorporating `ace` code would conflict
with the current permissive licensing plan unless the project intentionally
changes license strategy.

## Contributor Rules

- Do not copy source code, generated assets, templates, query strings, test
  fixtures, UI structure, or distinctive implementation details from any
  reference project listed here.
- If a future task proposes reuse beyond inspiration, stop and create a
  governance task to verify the exact upstream license or written permission.
- If a future task proposes AGPL-compatible reuse, record the licensing impact,
  source-availability obligations, notice requirements, and maintainer decision
  before implementation.
- Generated code must be reviewed for similarity against these references when
  the prompt or implementation was influenced by them.

## Sources Checked

Checked on 2026-06-05:

- `https://github.com/npilk/hacker-yardage`
- `https://api.github.com/repos/npilk/hacker-yardage/license`
- `https://github.com/npilk/openyardage-web`
- `https://api.github.com/repos/npilk/openyardage-web/license`
- `https://github.com/bdlucas1/ace`
- `https://api.github.com/repos/bdlucas1/ace/license`
- `https://www.gnu.org/licenses/agpl-3.0.en.html`
