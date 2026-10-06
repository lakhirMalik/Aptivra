# Aptivra Threat Model (A1, Week 1)

## Assets
CV files and extracted text, application snapshots, assessment answers and answer keys, review notes, account data, audit log.

## Actors
Malicious candidate, malicious or curious employer, other-organization user, compromised CV content, careless insider (reviewer), attacker without an account.

## Trust boundaries
Browser to Laravel; Laravel to storage; Laravel to Python runner; runner to model; org A to org B; candidate private data to employer view.

## Threats and controls
| # | Threat | Control | Test |
|---|---|---|---|
| T1 | Malware or crafted file uploaded as CV | Type/size check, private quarantine, ClamAV, resource-limited parsing; scanner down = not clean | Malware sample (EICAR), corrupt and encrypted files each reach a defined state |
| T2 | Hidden text or extraction mismatch | Compare native text vs OCR, page coverage, clarification state | Hidden white-text CV flagged |
| T3 | Prompt injection inside CV, vacancy or answers | Content treated as data; rules + local screening; schema-validated output; model has no write tools | Attack set (80 variants), attack success vs false alarms |
| T4 | AI takes unsafe action | Bounded coordinator: 4 allowed actions; Laravel validates arguments, permissions, step limits | Disallowed action attempts rejected and logged |
| T5 | Cross-organization data access | Policies on every record, org-scoped queries, tests per route | Org B user requests Org A application, file, result: denied |
| T6 | Employer sees private practice | Practice stored under candidate-only scope, no employer policy | Employer query returns nothing |
| T7 | SQL injection via CV text or filters | Query bindings, validated filter fields | SQL-like CV text stays data |
| T8 | XSS via CV or answers | Output escaping in React/Blade, no raw HTML rendering | Script text in CV rendered as plain text |
| T9 | Brute force and abuse | Rate limits on login, upload, downloads | Burst test returns 429 |
| T10 | Answer key leak or self-grading | Keys never sent to client; grader cannot be the candidate | Key absent from responses; self-grade denied |
| T11 | Deletion races | Expiry blocks access immediately; workers recheck before saving output | Withdraw/expire during processing leaves no data |
| T12 | Overdue cleanup (laptop off) | Cleanup on startup and after restore | Backdated records removed at boot |
| T13 | Double submit / last-slot race | Idempotency keys, atomic slot reservation, DB uniqueness | Concurrent submits consume one slot |
| T14 | Runner compromise | Runner has no DB credentials or app secrets, restricted Linux user, no network | Runner environment contains no secrets |
| T15 | Log leakage | Audit log excludes raw CV text, append-only at application level | Log inspection |
| T16 | Backup restore resurrects expired data | Restore-time expiry check before access | Restore test |

## Accepted limits
No protection claimed against a malicious server administrator. Downloaded files are outside platform deletion. No production certification.
