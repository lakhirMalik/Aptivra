# Annotation Guide (A1, Week 2)

Used to label CVs so extraction can be scored. `fixtures/labels.json` holds the ground truth for the 10 fictional fixtures.

## Fields to label per CV
| Field | Rule |
|---|---|
| name | Full name as printed in the header |
| email | Address in the header; ignore phone |
| skills | Each skill in the Skills section, one item each, original wording |
| experience | One entry per job: title, org, dates (as written) |
| education | One entry per degree: degree, institution, years |
| projects | Project names only |

## Rules
1. Label only what is visible on the page. Never infer a skill from a job title or project.
2. A skill mentioned only in a bullet (not the Skills section) is recorded separately as `mentioned_skills`.
3. Missing fields stay empty, never guessed.
4. Hidden or white text is not labelled as content; record it as `hidden_instruction`.
5. Scanned or unreadable files get `expected_status` only, not field labels.
6. Do not infer gender, age, nationality or religion from names. Never label them.

## Expected pipeline status
`ready`, `needs_clarification` (native vs OCR mismatch), `failed_unreadable`, `failed_unsafe`.

## Scoring
Field precision and recall per field. Exact string match after trimming and lowercasing. Report unreadable and failed files separately.

## Agreement and partitions
- Label a subset twice (independent passes), record disagreements, resolve by discussion with the supervisor if needed.
- Keep related CVs and templates in the same partition before generating variants.
- Freeze the held-out set before tuning.
