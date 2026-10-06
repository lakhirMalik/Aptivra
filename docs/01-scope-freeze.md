# Aptivra Scope Freeze (A1, Week 1)

Frozen 6 Oct 2026. Changes after this need a written reason in `docs/changes.md`. Hard freeze on new features after Month 6.

## In scope: 12 capabilities
| ID | Capability | In | Out |
|---|---|---|---|
| C01 | Accounts and workspaces | Register/login, candidate and employer workspaces, org membership, owner/recruiter/reviewer roles, admin approval and suspension | SSO, external identity providers |
| C02 | Vacancies and role catalogue | Versioned vacancies, required/preferred criteria, publish/close, job browsing, 3 role families | Job scraping, other roles |
| C03 | Controlled CV processing | PDF and non-macro DOCX, quarantine, scan, extract, OCR, passage references, failure states | Other formats, macro files, images as CVs |
| C04 | Evidence comparison | Per-requirement status with source link, coverage with denominator, amendments | Hire probability, rankings, demographic inference |
| C05 | Independent preparation | Role report, private MCQ practice, downloadable guidance, no vacancy needed | Open-ended AI chat |
| C06 | Preparation history | 2 saved versions, 90-day retention, comparison | More than 2 versions |
| C07 | Applications and review | Snapshots, org-scoped directory, reviewer tasks, shortlist, decisions, withdrawal | Automated hire/reject |
| C08 | Recruitment assessments | MCQ and written tests, rubrics, invitations, timed attempts, grading, released results | Proctoring, code judge, personality tests |
| C09 | Interview coordination | Slots, time zones, external links, reschedule, cancel | Built-in video calls |
| C10 | Notifications and alerts | In-app updates, opt-in job alerts | Email/SMS delivery |
| C11 | Plans and allowances | Credits, campaign and application limits, demo upgrades | Live payments |
| C12 | Privacy and oversight | Export/delete, retention cleanup, audit log, security-review tasks, ops reports | Production security certification |

## Fixed decisions
- Roles evaluated: frontend development, backend development, data analysis.
- Language: English only.
- Stack: React + Inertia, Laravel, PostgreSQL, Laravel database queue, Python runner. No second backend, no Docker until M2.
- AI never hires, rejects, messages, or uses shell/DB/browsing tools.
- CV claims, test results and human conclusions stay separate in every screen.

## Excluded entirely
Payroll, attendance, employee management, personality classification, proctoring, code-execution judge, credential verification, job scraping, video calls, native apps, live billing, ZABDesk integration.

## Release blockers
Cross-organization access, unsafe file handling, deletion errors.
