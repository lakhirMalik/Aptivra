# Aptivra whole-project ERD — handoff guide

[Agent: ChatGPT] | 27 October 2026 | PostgreSQL 16 design

This is the proposed database design for the complete project, not a claim that every feature has been implemented. It follows the submitted `C:\Users\Vishesh\Desktop\FYP\Aptivra SRS.docx`: 12 capabilities, 36 use cases and the state/evidence rules in Tables 61 and 62.

## Open these files

| File | Purpose |
|---|---|
| `Aptivra_Whole_Project_ERD.pdf` | Visual deliverable: one master ERD followed by 12 capability detail views. Vector text/lines remain sharp when zoomed. |
| `aptivra_whole_project_schema.sql` | Standalone import source: 72 base tables, 158 foreign keys and 265 indexes in `aptivra_design`. |
| `ERD_AUDIT_2026-10-27.md` | Changes, normalization exceptions, complete 36-use-case mapping, table inventory, test results and remaining responsibilities. |
| `diagrams/` | Editable SVG and Mermaid sources plus PNG previews for the same 13 views. |
| `aptivra_whole_project_erd.mmd` | Complete editable Crow's Foot Mermaid source. |
| `erd_final_checks.json` | Machine-readable checks and exact source/PDF hashes. |

The corrected design passed 63 targeted PostgreSQL tests with no failures, including simultaneous requests for the last report credit and last campaign application slot. All foreign keys have a suitable leading-column index. The PDF and editable diagrams are generated from the actual imported catalogue, not a separately maintained drawing.

The number of entities follows the required data relationships, versions, retention purposes and histories. It is not a target based on classmates' diagrams or the SRS's 73 document-format tables. Thirteen ERD views are unrelated to the number of use-case diagrams in the SRS.

## Import safely in pgAdmin or DBeaver

1. Create or select a separate empty design database. Do not use the working application database or mix this with the earlier 45-table design. Do not point Laravel at this schema.
2. Open `aptivra_whole_project_schema.sql` in the database's SQL/query editor and execute the complete file. In pgAdmin use Query Tool's Open File action; a `\i` command is a psql instruction, not a Query Tool command.
3. Refresh schemas. Select **`aptivra_design`**, not `public` and not every schema in the database. Check that it contains 72 base tables. Views are additional objects, not extra base tables.
4. Generate the ERD from that schema using the client's ERD/diagram action. Layout still needs arranging; an automatic layout is not guaranteed to be presentation-ready. The supplied vector PDF is the already laid-out visual package.
5. If `aptivra_design` already exists, the import intentionally fails and rolls back. This is a fresh-install script, not a migration/reimport script. Create another empty design database or ask before removing an old schema; do not bypass the protection against an application database.

No extension, paid service or external diagram upload is required. The SQL contains domains, constraints, functions, triggers and views as well as tables; use the complete PostgreSQL SQL file rather than copying only CREATE TABLE statements.

## Reading the diagrams

- A circle means optional/zero; a bar means one; a fork means many. Parent participation follows FK nullability, and a unique child key limits the child side to one. Zero-to-many child participation does not claim that the application can publish an incomplete object; publication triggers add further rules.
- `PK`, `FK`, `NULL` and `NOT NULL` appear beside fields. Composite uniqueness, check predicates, cascading actions and workflow triggers are detailed in the SQL and audit, not compressed into a relationship line.
- Page 1 contains every table and relationship. Pages 2–13 show each capability in detail. Outside-capability parents are abbreviated key-only reference boxes, not incomplete duplicate definitions.
- The master is intentionally a large-format overview. Zoom in or use the capability views for reading; shrinking it to one A4 page will make the labels too small.

## Key design decisions

Private preparation is independent of employer applications. Application and saved-history CVs are purpose-bound copies, not references to an expiring one-off file. Raw extraction, published criteria/assessment versions and application snapshots retain provenance. Corrections append attributable history rather than replacing raw evidence.

Recruitment stage entry does not require its own completion. Final selection and employer-recorded Hired require the submitted mandatory policy to be satisfied or an approved exception. Early rejection with a reason remains permitted. Source/referral confirmation retains actor and basis; unknown is not silently classified as non-referred.

One-off retention is 24 hours after completion/failure, not universally 24 hours after upload. Saved history has two slots and a 90-day clock reset only by explicit permitted renewal. Unresolved application access ends at 90 days, with physical-cleanup eligibility at day 120; first closure/withdrawal ordinarily starts a separate 30-day clock. These database clocks do not themselves erase protected files or backups.

No mandatory per-login OTP, live payment processor, automated hiring/rejection, culture score or standalone code judge was added. Optional existing passkey authentication remains represented. Report credit consumption, campaign acceptance and review states have guarded projections backed by retained event/ledger records.

## What remains to be approved or implemented

An ERD is not end-to-end acceptance. The application must authenticate and authorize every read/write/download/export, enforce access-time expiry, run real scanner/parser/model jobs, keep assessment keys server-only, deliver notifications safely and physically purge files/backups. Tests used fictional fixtures in an isolated local PostgreSQL instance; no real user records were imported.

The submitted SRS's open policies stay open: hosting/performance, release manifest, evaluation thresholds, supporting-record/backup retention, analytics denominators/small-cohort suppression, assessment/outage/private-practice rules, monthly time-zone boundaries and reviewer-seat counting. Fixture values are not approved product defaults. In particular, the schema has seat-limit metadata but does not claim to implement a still-undecided definition of which combined roles consume seats.

The audit identifies intentional historical snapshots, JSON payloads and guarded derived projections rather than asserting a formal all-table 3NF proof. It also distinguishes database safeguards from API authorization and physical deletion. See the audit for exact coverage and limitations.

## Preservation and submission

The original SQL and guide are retained unchanged in `backup_before_chatgpt_2026-10-27/`. The working application database, earlier `aptivra_erd` database, application code and submitted SRS were not modified. Test evidence and helper scripts are local supporting material, not the intended Classroom attachment.

Review the vector PDF and obtain advisor checking as required by the assignment before submission. Submit the visual ERD and, if requested, its editable SQL/source; do not submit fixture data, server logs, backup originals or an unreviewed automatic layout. This work has not uploaded, submitted or marked the assignment done.
